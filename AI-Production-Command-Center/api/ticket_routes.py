from fastapi import APIRouter

from database.ticket_repository import TicketRepository
from services.jira_service import JiraService
router = APIRouter(prefix="/tickets", tags=["Tickets"])

repo = TicketRepository()
Jira_service = JiraService()
@router.get("/{issue_key}")
def get_ticket(issue_key: str):
    return repo.get_ticket(issue_key)
@router.get("/{issue_key}/comments")
def get_comments(issue_key: str):
    return Jira_service.get_ticket_comments(issue_key)