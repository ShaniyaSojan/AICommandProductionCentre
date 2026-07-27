from database.ticket_repository import TicketRepository
from database.history_repository import HistoryRepository
from database.comment_repository import CommentRepository


class SyncService:

    def __init__(self):

        self.ticket_repo = TicketRepository()
        self.history_repo = HistoryRepository()
        self.comment_repo = CommentRepository()

    def compare(self, db_ticket, jira_ticket):

        fields = [
            "Summary",
            "Description",
            "Customer",
            "Severity",
            "Status",
            "Priority",
            "Assignee",
            "Reporter"
        ]

        changes = []

        for field in fields:

            if db_ticket.get(field) != jira_ticket.get(field):

                changes.append({

                    "Field": field,
                    "OldValue": db_ticket.get(field),
                    "NewValue": jira_ticket.get(field)

                })

        return changes

    def synchronize(self, jira_ticket):

        existing = self.ticket_repo.get_ticket(
            jira_ticket["IssueKey"]
        )

        inserted = False
        updated = False
        changes = []

        # ------------------------
        # NEW TICKET
        # ------------------------
        if existing is None:
            self.ticket_repo.insert_ticket(jira_ticket)
            inserted = True
            existing = self.ticket_repo.get_ticket(
                jira_ticket["IssueKey"]
            )
        else:
            changes = self.compare(
                existing,
                jira_ticket
            )
            if len(changes) > 0:
                for change in changes:
                    self.history_repo.save_history(
                        existing["TicketID"],
                        existing["IssueKey"],
                        change["Field"],
                        change["OldValue"],
                        change["NewValue"]
                    )
                self.ticket_repo.update_ticket(
                    jira_ticket
                )
                updated = True
                existing = self.ticket_repo.get_ticket(
                    jira_ticket["IssueKey"]
                )

        # ------------------------
        # SYNC COMMENTS
        # ------------------------

        comment_result = self.sync_comments(
            existing["TicketID"],
            jira_ticket["IssueKey"],
            jira_ticket.get("Comments", [])

        )

        # ------------------------
        # RESULT
        # ------------------------
        if inserted:
            action = "Inserted"
        elif updated:
            action = "Updated"
        else:
            action = "No Changes"
        return {
            "Action": action,
            "IssueKey": jira_ticket["IssueKey"],
            "Changes": changes,
            "Comments": comment_result

        }

    def sync_comments(self, ticket_id, issue_key, comments):

        inserted = 0
        updated = 0
        unchanged = 0
        for comment in comments:
            existing = self.comment_repo.get_comment(
                comment["JiraCommentID"]

            )
            data = {
                "JiraCommentID": comment["JiraCommentID"],
                "TicketID": ticket_id,
                "IssueKey": issue_key,
                "AuthorName": comment["AuthorName"],
                "CommentText": comment["CommentText"],
                "CreatedDate": comment["CreatedDate"],
                "UpdatedDate": comment["UpdatedDate"]
            }
            if existing is None:
                self.comment_repo.insert_comment(data)
                inserted += 1
            elif (
                existing["CommentText"] != data["CommentText"]
                or
                existing["UpdatedDate"] != data["UpdatedDate"]
            ):
                self.comment_repo.update_comment(data)
                updated += 1
            else:
                unchanged += 1
        return {
            "Inserted": inserted,
            "Updated": updated,
            "Unchanged": unchanged
        }