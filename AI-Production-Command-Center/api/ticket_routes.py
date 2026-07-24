from fastapi import APIRouter

from database.ticket_repository import TicketRepository

router = APIRouter(prefix="/tickets", tags=["Tickets"])

repo = TicketRepository()


@router.get("/{issue_key}")
def get_ticket(issue_key: str):

    return repo.get_ticket(issue_key)