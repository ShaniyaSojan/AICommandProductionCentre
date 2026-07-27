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

    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    READY_FOR_QA = "READY FOR QA"
    UAT = "UAT"
    REOPENED = "Reopened"

    CLOSED = "Closed"
    DONE = "Done"
    RESOLVED = "Resolved"

    CLOSED_STATUS = [
        CLOSED,
        DONE,
        RESOLVED
    ]

    ACTIVE_STATUS = [
        OPEN,
        IN_PROGRESS,
        READY_FOR_QA,
        UAT,
        REOPENED
    ]


# ===========================================================
# Priority
# ===========================================================

class JiraPriority:

    P1 = "P1 - Critical"
    P2 = "P2 - Medium"
    P3 = "P3 - Low"
    P4 = "P4 - Minor"


# ===========================================================
# Severity
# ===========================================================

class JiraSeverity:

    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


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

    SLA_WARNING_HOURS = 20

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
