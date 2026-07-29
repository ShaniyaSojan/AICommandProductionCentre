from fastapi import APIRouter, Query

from database.ticket_repository import TicketRepository
from database.comment_repository import CommentRepository
from database.history_repository import HistoryRepository

router = APIRouter(prefix="/tickets", tags=["Tickets"])

repo = TicketRepository()
comment_repo = CommentRepository()
history_repo = HistoryRepository()


@router.get("")
def list_tickets(filter: str = Query(default="open")):
    return repo.get_filtered_tickets(filter)


@router.get("/{issue_key}")
def get_ticket(issue_key: str):
    return repo.get_ticket(issue_key)


@router.get("/{issue_key}/comments")
def get_comments(issue_key: str):
    return comment_repo.get_comments(issue_key)


@router.get("/{issue_key}/history")
def get_history(issue_key: str):
    return history_repo.get_history(issue_key)