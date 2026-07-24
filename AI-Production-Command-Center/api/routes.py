from fastapi import APIRouter
from services.jira_service import JiraService
from services.project_service import ProjectService
from database.ticket_repository import TicketRepository

repo = TicketRepository()
router = APIRouter()
project_service = ProjectService()
jira = JiraService()


@router.get("/projects")
def projects():
    return project_service.get_enabled_projects()





@router.get("/ticket/{issue_key}")
def get_ticket(issue_key: str):
    ticket = repo.get_ticket(issue_key)
    return ticket

@router.get("/projects/{project_name}/tickets")
def tickets(project_name: str):
    project = project_service.get_project(project_name)
    if not project:
        return {"error": "Project not found"}
    return jira.get_production_tickets(
        project["ProductionEpic"]
    )