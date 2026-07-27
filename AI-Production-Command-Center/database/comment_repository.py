from sqlalchemy import text
from database.connection import get_db


class CommentRepository:

    def get_comment(self, jira_comment_id):
        with get_db() as db:
            result = db.execute(
                text("""
                    SELECT *
                    FROM TicketComments
                    WHERE JiraCommentID = :jira_comment_id
                """),
                {
                    "jira_comment_id": jira_comment_id
                }
            )

            return result.mappings().first()


    def insert_comment(self, comment):

        with get_db() as db:

            db.execute(
                text("""
                    INSERT INTO TicketComments
                    (
                        JiraCommentID,
                        TicketID,
                        IssueKey,
                        AuthorName,
                        CommentText,
                        CreatedDate,
                        UpdatedDate,
                        LastSynced,
                        IsActive
                    )

                    VALUES
                    (
                        :JiraCommentID,
                        :TicketID,
                        :IssueKey,
                        :AuthorName,
                        :CommentText,
                        :CreatedDate,
                        :UpdatedDate,
                        GETDATE(),
                        1
                    )
                """),
                comment
            )
            db.commit()


    def update_comment(self, comment):
        with get_db() as db:
            db.execute(
                text("""
                    UPDATE TicketComments
                    SET
                        CommentText = :CommentText,
                        UpdatedDate = :UpdatedDate,
                        LastSynced = GETDATE()
                    WHERE
                        JiraCommentID = :JiraCommentID
                """),
                comment
            )
            db.commit()


    def get_comments(self, issue_key):
        with get_db() as db:
            result = db.execute(
                text("""
                    SELECT *
                    FROM TicketComments
                    WHERE IssueKey = :issue_key
                """),
                {
                    "issue_key": issue_key
                }
            )
            return result.mappings().all()

    def get_comments_by_ticket(self, ticket_id):
        with get_db() as db:
            result = db.execute(
                text("""
                    SELECT *
                    FROM TicketComments
                    WHERE TicketID = :ticket_id
                """),
                {
                    "ticket_id": ticket_id
                }
            )
            return result.mappings().all()