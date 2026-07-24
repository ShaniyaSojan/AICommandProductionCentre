from database.ticket_repository import TicketRepository
from database.history_repository import HistoryRepository


class SyncService:

    def __init__(self):
        self.ticket_repo = TicketRepository()
        self.history_repo = HistoryRepository()

    def compare(self, db_ticket, jira_ticket):

        fields = [
            "Summary",
            "Description",
            "Status",
            "Priority",
            "Assignee",
            "Reporter"
        ]

        changes = []

        for field in fields:

            db_value = db_ticket.get(field)
            jira_value = jira_ticket.get(field)

            if db_value != jira_value:

                changes.append({
                    "Field": field,
                    "OldValue": db_value,
                    "NewValue": jira_value
                })

        return changes

    def synchronize(self, jira_ticket):

        existing = self.ticket_repo.get_ticket(
            jira_ticket["IssueKey"]
        )

        # New Ticket
        if existing is None:

            self.ticket_repo.insert_ticket(jira_ticket)

            return {
                "Action": "Inserted",
                "IssueKey": jira_ticket["IssueKey"]
            }

        # Compare Existing Ticket
        changes = self.compare(
            existing,
            jira_ticket
        )

        # No Changes
        if len(changes) == 0:

            return {
                "Action": "No Changes",
                "IssueKey": jira_ticket["IssueKey"]
            }

        # Save History
        for change in changes:

            self.history_repo.save_history(
                existing["TicketID"],
                existing["IssueKey"],
                change["Field"],
                change["OldValue"],
                change["NewValue"]
            )

        # Update Ticket
        self.ticket_repo.update_ticket(
            jira_ticket
        )

        return {
            "Action": "Updated",
            "IssueKey": jira_ticket["IssueKey"],
            "Changes": changes
        }