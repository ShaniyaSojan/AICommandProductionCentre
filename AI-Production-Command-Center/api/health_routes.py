import requests
from requests.auth import HTTPBasicAuth
from fastapi import APIRouter
from sqlalchemy import text

from database.db import engine
from config import Config

router = APIRouter(tags=["Health"])


@router.get("/health")
def health():

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "Healthy"
    except Exception:
        db_status = "Error"

    try:
        base = Config.JIRA_URL.rstrip("/")
        resp = requests.get(
            f"{base}/rest/api/3/myself",
            auth=HTTPBasicAuth(Config.JIRA_EMAIL, Config.JIRA_API_TOKEN),
            headers={"Accept": "application/json"},
            timeout=4,
        )
        jira_status = "Connected" if resp.ok else "Error"
    except Exception:
        jira_status = "Unreachable"

    return {
        "Database": db_status,
        "JiraConnection": jira_status,
        "Scheduler": "Stopped",
    }
