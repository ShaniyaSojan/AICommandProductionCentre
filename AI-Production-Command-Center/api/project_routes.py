from fastapi import APIRouter

from services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])

project_service = ProjectService()


@router.get("")
def get_projects():
    return project_service.get_enabled_projects()