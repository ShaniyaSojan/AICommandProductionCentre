from fastapi import APIRouter

from services.jira_service import JiraService
from services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["Jira"])

jira = JiraService()
project_service = ProjectService()


@router.get("/{project_name}/tickets")
def get_jira_tickets(project_name: str):
    project = project_service.get_project(project_name)
    if not project:
        return {"error": "Project not found"}
    epics = project_service.get_project_epics(project["ProjectID"])
    if not epics:
        return {"error": "No epics configured for this project"}
    return jira.get_production_tickets(epics)