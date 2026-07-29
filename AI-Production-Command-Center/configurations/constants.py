"""
===========================================================
Enterprise AI Production Command Center
Application Constants
===========================================================
"""


class AppConstants:
    APP_NAME = "Enterprise AI Production Command Center"
    VERSION = "1.0"


# ===========================================================
# Jira Custom Fields
# ===========================================================

class JiraFields:

    # Customer / Bank
    CUSTOMER = "customfield_10348"

    # Severity
    SEVERITY = "customfield_10049"


# ===========================================================
# Jira Status
# ===========================================================

class JiraStatus:

    CLOSED = "Closed"
    DONE = "Done"
    RESOLVED = "Resolved"
    REJECTED = "Rejected"
    DUPLICATE = "Duplicate"

    CLOSED_STATUS = [
        CLOSED,
        DONE,
        RESOLVED,
        REJECTED,
        DUPLICATE
    ]

    ACTIVE_STATUS = [
        "Open",
        "DEV - IN PROGRESS",
        "CODE REVIEW",
        "READY FOR QA",
        "IN QA TESTING",
    ]

    # Hex colors for status distribution chart (keys are lowercase for case-insensitive lookup)
    # Closed/resolved statuses → green; active/in-progress statuses → blue
    STATUS_COLORS = {
        "closed":              "#22c55e",
        "done":                "#22c55e",
        "resolved":            "#22c55e",
        "rejected":            "#22c55e",
        "duplicate":           "#22c55e",
        "open":                "#3b82f6",
        "dev - in progress":   "#3b82f6",
        "code review":         "#3b82f6",
        "ready for qa":        "#3b82f6",
        "in qa testing":       "#3b82f6",
        "sit signoff":         "#eab308",
        "uat deployed":        "#eab308",
        "uat signoff":         "#eab308",
        "in uat testing":      "#eab308",
        "released to prod":    "#eab308",
        "pending with bank":   "#eab308",
        "in sit testing":      "#eab308",
    }

    # Fallback color for any status not listed above
    DEFAULT_STATUS_COLOR = "#6b7280"


# ===========================================================
# Priority
# ===========================================================

class JiraPriority:

    P0 = "P0 - Critical"
    P1 = "P1 - High"
    P2 = "P2 - Medium"
    P3 = "P3 - Low"



# ===========================================================
# Severity
# ===========================================================

class JiraSeverity:

    Sev0 = "Critical"
    Sev1 = "High"
    Sev2 = "Medium"
    Sev3 = "Low"


# ===========================================================
# Ticket Types
# ===========================================================

class TicketType:

    BUG = "Bug"
    STORY = "Story"
    TASK = "Task"
    INCIDENT = "Incident"
    SERVICE_REQUEST = "Service Request"


# ===========================================================
# Dashboard
# ===========================================================

class Dashboard:

    SLA_WARNING_HOURS = 24

    REFRESH_INTERVAL = 60

    RECENT_TICKET_LIMIT = 10

    MAX_CHART_RECORDS = 10


# ===========================================================
# Synchronization
# ===========================================================

class Sync:

    DEFAULT_BATCH_SIZE = 100

    MAX_RESULTS = 100

    AUTO_SYNC_INTERVAL = 120

    LAST_SYNC_FIELD = "LastSynced"


# ===========================================================
# Database
# ===========================================================

class Tables:

    PROJECTS = "Projects"

    EPICS = "ProjectEpics"

    TICKETS = "Tickets"

    COMMENTS = "TicketComments"

    HISTORY = "TicketHistory"


# ===========================================================
# AI
# ===========================================================

class AI:

    MODEL = "gpt-4.1"

    MAX_TOKENS = 1500

    TEMPERATURE = 0.2

    MAX_SUMMARIZATION_TICKETS = 10


# ===========================================================
# AI Prompt Templates
# ===========================================================

class Prompts:

    INCIDENT_SUMMARY = """
Summarize the production issue in business language.
Mention:
1. Summary
2. Business Impact
3. Current Status
4. Assignee
"""

    ROOT_CAUSE = """
Identify the most likely root cause based on
ticket description, comments and history.
"""

    RECOMMENDATION = """
Suggest immediate actions and long-term preventive actions.
"""

    SIMILAR_INCIDENTS = """
Find similar historical incidents and explain
how they were resolved.
"""


# ===========================================================
# API Messages
# ===========================================================

class Messages:

    PROJECT_NOT_FOUND = "Project not found."

    TICKET_NOT_FOUND = "Ticket not found."

    SYNC_COMPLETED = "Synchronization completed successfully."

    SYNC_FAILED = "Synchronization failed."

    INVALID_REQUEST = "Invalid request."

    INTERNAL_ERROR = "Internal server error."
