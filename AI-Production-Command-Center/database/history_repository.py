from sqlalchemy import text
from database.connection import get_db


class HistoryRepository:

    def save_history(
        self,
        ticket_id,
        issue_key,
        field_name,
        old_value,
        new_value
    ):

        with get_db() as db:

            try:

                db.execute(
                    text("""
                        INSERT INTO TicketHistory
                        (
                            TicketID,
                            IssueKey,
                            FieldName,
                            OldValue,
                            NewValue,
                            ChangedOn
                        )

                        VALUES
                        (
                            :ticket_id,
                            :issue_key,
                            :field_name,
                            :old_value,
                            :new_value,
                            GETDATE()
                        )
                    """),
                    {
                        "ticket_id": ticket_id,
                        "issue_key": issue_key,
                        "field_name": field_name,
                        "old_value": str(old_value) if old_value else None,
                        "new_value": str(new_value) if new_value else None
                    }
                )

                db.commit()

            except:

                db.rollback()
                raise