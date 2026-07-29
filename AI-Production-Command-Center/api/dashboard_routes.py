from fastapi import APIRouter
from services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

service = DashboardService()


@router.get("")
def dashboard():
    return service.get_summary()


@router.get("/status")
def status():
    return service.get_status_distribution()


@router.get("/priority")
def priority():
    return service.get_priority_distribution()


@router.get("/customer")
def customer():
    return service.get_customer_distribution()


@router.get("/severity")
def severity():
    return service.get_severity_distribution()


@router.get("/recent")
def recent():
    return service.get_recent_tickets()