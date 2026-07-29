# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI-powered command center that syncs Jira production tickets into a SQL Server database and exposes analytics via a FastAPI REST API.

## Commands

All commands are run from inside `AI-Production-Command-Center/`:

```bash
# Install dependencies
python -m pip install -r requirements.txt
python -m pip install pyodbc   # separate install required for ODBC driver

# Run the server
python -m uvicorn app:app --reload
```

The API docs (Swagger UI) are available at `http://localhost:8000/docs` after starting the server.

## Environment Setup

Copy `.env` values and fill in your own credentials. Required variables:

```
JIRA_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=

DB_SERVER=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
DB_DRIVER=ODBC Driver 17 for SQL Server
```

## Architecture

The app entry point is `AI-Production-Command-Center/app.py`, which wires together five FastAPI routers.

**Request flow:** `api/` routes → `services/` → `database/` repositories → SQL Server

### API Layer (`api/`)

| Router file | Prefix | Purpose |
|---|---|---|
| `project_routes.py` | `/projects` | List enabled projects |
| `jira_routes.py` | `/projects/{name}/tickets` | Fetch tickets live from Jira |
| `sync_routes.py` | `/projects/{name}/sync` | Pull Jira tickets into DB |
| `ticket_routes.py` | `/tickets/{key}` | Read DB tickets and comments |
| `dashboard_routes.py` | `/dashboard` | Aggregated analytics |

### Services (`services/`)

- `JiraService` — calls Jira REST API v3, handles custom fields, parses Atlassian Document Format (ADF) into plain text via `extract_text()`
- `SyncService` — orchestrates insert/update of tickets and comments, writes field-level changes to `TicketHistory`
- `ProjectService` — queries the `Projects` table directly with raw SQL
- `DashboardService` — thin pass-through to `DashboardRepository`

### Database Layer (`database/`)

Repositories use **raw SQL via `sqlalchemy.text()`**, not the ORM. Two connection patterns exist:
- Most repos: `get_db()` context manager (`SessionLocal`) from `database/connection.py`
- `DashboardRepository`: uses `engine.begin()` directly from `database/db.py`

`database/models.py` defines SQLAlchemy ORM models (`Ticket`, `TicketHistory`) but they are not used by the repositories — the DB schema is managed externally in SQL Server.

### Constants (`configurations/constants.py`)

All magic values live here — Jira custom field IDs, status/priority enums, dashboard limits, AI model config, and SQL table names. Always extend this file rather than hardcoding values elsewhere.

Key constants:
- `JiraFields.CUSTOMER = "customfield_10348"`, `JiraFields.SEVERITY = "customfield_10049"` — Jira-instance-specific custom fields
- `JiraStatus.ACTIVE_STATUS` / `CLOSED_STATUS` — controls what counts as "open" in dashboard queries
- `Dashboard.SLA_WARNING_HOURS = 24` — threshold for SLA-at-risk count

### Config (`config.py`)

Single `Config` class reads all env vars at import time. `DB_PASSWORD` and `DB_DRIVER` are URL-encoded automatically.

## DB Schema (SQL Server)

Tables managed externally (not via migrations):
- `Projects` — `ProjectID`, `ProjectName`, `IsEnabled`
- `ProjectEpics` — `ProjectEpicID`, `ProjectID` (FK), `EpicKey`, `IsEnabled` — one row per Jira epic; a project can have multiple
- `Tickets` — full ticket data; `IsActive` flag; `LastSynced` timestamp; `EpicKey` comes from the Jira `parent` field
- `TicketComments` — synced from Jira comments; `JiraCommentID` as unique key
- `TicketHistory` — field-level change log written on each sync diff

## Jira Integration

`JiraService.get_production_tickets(epics: list)` queries `parent in (EPIC1, EPIC2, ...)` via JQL — one Jira API call covers all epics for the project. Epic keys come from `ProjectEpics` via `ProjectService.get_project_epics(project_id)`. The `EpicKey` on each ticket is resolved from Jira's `parent` field, not hardcoded. Comments are fetched inline during ticket retrieval and synced by `SyncService.sync_comments()`.
