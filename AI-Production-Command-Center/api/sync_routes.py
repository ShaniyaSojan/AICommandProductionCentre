from fastapi import APIRouter

from services.project_service import ProjectService
from services.jira_service import JiraService
from services.sync_service import SyncService

router = APIRouter(
    prefix="/projects",
    tags=["Synchronization"]
)

project_service = ProjectService()
jira_service = JiraService()
sync_service = SyncService()


@router.post("/{project_name}/sync")
def synchronize_project(project_name: str):

    project = project_service.get_project(project_name)

    if project is None:
        return {
            "Success": False,
            "Message": "Project not found"
        }

    tickets = jira_service.get_production_tickets(
        project["ProductionEpic"]
    )

    inserted = 0
    updated = 0
    unchanged = 0

    results = []

    for ticket in tickets:

        ticket["ProjectID"] = project["ProjectID"]
        ticket["EpicKey"] = project["ProductionEpic"]

        result = sync_service.synchronize(ticket)

        results.append(result)

        if result["Action"] == "Inserted":
            inserted += 1

        elif result["Action"] == "Updated":
            updated += 1

        elif result["Action"] == "No Changes":
            unchanged += 1

    return {

        "Project": project_name,

        "Processed": len(tickets),

        "Inserted": inserted,

        "Updated": updated,

        "Unchanged": unchanged,

        "Results": results

    }