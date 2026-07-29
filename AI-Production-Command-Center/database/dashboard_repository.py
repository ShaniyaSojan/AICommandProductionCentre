from sqlalchemy import text
from database.db import engine
from configurations.constants import JiraStatus, JiraPriority, Dashboard


class DashboardRepository:

    def __init__(self):
        self.closed_status = "', '".join(JiraStatus.CLOSED_STATUS)
        self.active_status = "', '".join(JiraStatus.ACTIVE_STATUS)

    # =====================================================
    # Dashboard Summary
    # =====================================================

    def get_summary(self):

        with engine.begin() as conn:

            total = conn.execute(text("""
                SELECT COUNT(*)
                FROM Tickets
                WHERE IsActive = 1
            """)).scalar()

            open_tickets = conn.execute(text(f"""
                SELECT COUNT(*)
                FROM Tickets
                WHERE IsActive = 1
                AND Status  IN ('{self.active_status}')
            """)).scalar()

            resolved_today = conn.execute(text("""
                SELECT COUNT(*)
                FROM Tickets
                WHERE CAST(ResolutionDate AS DATE)=CAST(GETDATE() AS DATE)
            """)).scalar()

            critical = conn.execute(text(f"""
                SELECT COUNT(*)
                FROM Tickets
                WHERE IsActive = 1
                AND Priority = '{JiraPriority.P0}'
            """)).scalar()

            sla = conn.execute(text(f"""
                SELECT COUNT(*)
                FROM Tickets
                WHERE IsActive = 1
                AND Status  IN ('{self.active_status}')
                AND DATEDIFF(HOUR, CreatedDate, GETDATE()) >= {Dashboard.SLA_WARNING_HOURS}
            """)).scalar()

            return {
                "TotalTickets": total,
                "OpenTickets": open_tickets,
                "ResolvedToday": resolved_today,
                "P1Critical": critical,
                "SLAAtRisk": sla,
                "AIAlerts": 0
            }

    # =====================================================
    # Status Distribution
    # =====================================================

    def get_status_distribution(self):

        with engine.begin() as conn:

            rows = conn.execute(text("""
                SELECT
                    Status,
                    COUNT(*) AS Count
                FROM Tickets
                WHERE IsActive = 1
                GROUP BY Status
                ORDER BY Count DESC
            """)).mappings().all()

            return [dict(row) for row in rows]

    # =====================================================
    # Priority Distribution
    # =====================================================

    def get_priority_distribution(self):

        with engine.begin() as conn:

            rows = conn.execute(text("""
                SELECT
                    Priority,
                    COUNT(*) AS Count
                FROM Tickets
                WHERE IsActive = 1
                GROUP BY Priority
                ORDER BY Count DESC
            """)).mappings().all()

            return [dict(row) for row in rows]

    # =====================================================
    # Customer Distribution
    # =====================================================

    def get_customer_distribution(self):

        with engine.begin() as conn:

            rows = conn.execute(text("""
                SELECT
                    Customer,
                    COUNT(*) AS Count
                FROM Tickets
                WHERE IsActive = 1
                GROUP BY Customer
                ORDER BY Count DESC
            """)).mappings().all()

            return [dict(row) for row in rows]

    # =====================================================
    # Severity Distribution
    # =====================================================

    def get_severity_distribution(self):

        with engine.begin() as conn:

            rows = conn.execute(text("""
                SELECT
                    Severity,
                    COUNT(*) AS Count
                FROM Tickets
                WHERE IsActive = 1
                GROUP BY Severity
                ORDER BY Count DESC
            """)).mappings().all()

            return [dict(row) for row in rows]

    # =====================================================
    # Recent Tickets
    # =====================================================

    def get_recent_tickets(self):

        with engine.begin() as conn:

            rows = conn.execute(text(f"""
                SELECT TOP ({Dashboard.RECENT_TICKET_LIMIT})
                    IssueKey,
                    Summary,
                    Status,
                    Priority,
                    Customer,
                    Assignee,
                    UpdatedDate
                FROM Tickets
                WHERE IsActive = 1
                ORDER BY UpdatedDate DESC
            """)).mappings().all()

            return [dict(row) for row in rows]