from contextlib import asynccontextmanager
from fastapi import FastAPI


from api.project_routes import router as project_router
from api.jira_routes import router as jira_router
from api.ticket_routes import router as ticket_router
from api.sync_routes import router as sync_router
@asynccontextmanager

async def lifespan(app: FastAPI):
    print("Application Started")
    yield
    print("Application Stopped")

app = FastAPI(
    title="Enterprise AI Production Command Center",
    version="1.0",
    lifespan=lifespan
)

app.include_router(project_router)
app.include_router(jira_router)
app.include_router(ticket_router)
app.include_router(sync_router)