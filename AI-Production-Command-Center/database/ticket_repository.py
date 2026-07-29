from sqlalchemy import text

from database.connection import get_db
from configurations.constants import JiraStatus, JiraPriority, Dashboard


class TicketRepository:

    def get_ticket(self, issue_key):

        with get_db() as db:

            result = db.execute(

                text("""

                    SELECT     TicketID,
                    JiraIssueID,
                    IssueKey,
                    ProjectID,
                    EpicKey,
                    Summary,
                    Description,
                    IssueType,
                    Status,
                    Priority,
                    Assignee,
                    Reporter,
                    CreatedDate,
                    UpdatedDate,
                    ResolutionDate,
                    LastSynced,
                    IsActive,
                    Customer,
                    Severity

                    FROM Tickets

                    WHERE IssueKey=:issue_key

                """),

                {"issue_key": issue_key}

            )

            return result.mappings().first()

    def insert_ticket(self, ticket):

        with get_db() as db:

            db.execute(

                text("""

                INSERT INTO Tickets
                (
                    JiraIssueID,
                    IssueKey,
                    ProjectID,
                    EpicKey,
                    Summary,
                    Description,
                    IssueType,
                    Status,
                    Priority,
                    Assignee,
                    Reporter,
                    CreatedDate,
                    UpdatedDate,
                    ResolutionDate,
                    LastSynced,
                    IsActive,
                    Customer,
                    Severity
                )

                VALUES
                (
                    :JiraIssueID,
                    :IssueKey,
                    :ProjectID,
                    :EpicKey,
                    :Summary,
                    :Description,
                    :IssueType,
                    :Status,
                    :Priority,
                    :Assignee,
                    :Reporter,
                    :CreatedDate,
                    :UpdatedDate,
                    :ResolutionDate,
                    GETDATE(),
                     1,
                    :Customer,
                    :Severity   
                )

                """),

                ticket

            )

            db.commit()

    def update_ticket(self, ticket):
        with get_db() as db:
            try:  
                db.execute(
                    text("""
                    UPDATE Tickets
                    SET
                        Summary=:Summary,
                        Description=:Description,
                        Status=:Status,
                        Priority=:Priority,
                        Assignee=:Assignee,
                        Reporter=:Reporter,
                        UpdatedDate=:UpdatedDate,
                        ResolutionDate=:ResolutionDate,
                        LastSynced=GETDATE(),
                        Customer=:Customer,
                        Severity=:Severity          
                    WHERE
                        IssueKey=:IssueKey
                    """),
                    ticket
                )
                db.commit()
            except Exception:
                db.rollback()
                raise

    def get_all_tickets(self):
        with get_db() as db:
            result = db.execute(
                text("""
                    SELECT *
                    FROM Tickets
                    WHERE IsActive = 1
                """)
            )
            return result.mappings().all()

    def get_filtered_tickets(self, filter_type: str):
        active = "', '".join(JiraStatus.ACTIVE_STATUS)

        filters = {
            "open": f"Status IN ('{active}')",
            "p1-critical": f"Priority = '{JiraPriority.P0}' AND IsActive = 1",
            "resolved-today": "CAST(ResolutionDate AS DATE) = CAST(GETDATE() AS DATE)",
            "sla-at-risk": (
                f"Status IN ('{active}') "
                f"AND DATEDIFF(HOUR, CreatedDate, GETDATE()) >= {Dashboard.SLA_WARNING_HOURS}"
            ),
        }

        where = filters.get(filter_type, "IsActive = 1")

        with get_db() as db:
            rows = db.execute(text(f"""
                SELECT IssueKey, Summary, Status, Priority, Customer, Assignee, UpdatedDate
                FROM Tickets
                WHERE {where}
                ORDER BY UpdatedDate DESC
            """)).mappings().all()

        return [
            {**dict(row), "Color": JiraStatus.STATUS_COLORS.get(row["Status"].lower(), JiraStatus.DEFAULT_STATUS_COLOR)}
            for row in rows
        ]