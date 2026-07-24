from dotenv import load_dotenv
import urllib.parse
import os

load_dotenv()


class Config:

    JIRA_URL = os.getenv("JIRA_URL")
    JIRA_EMAIL = os.getenv("JIRA_EMAIL")
    JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")

    DB_SERVER = os.getenv("DB_SERVER")
    DB_NAME = os.getenv("DB_NAME")
    DB_USERNAME = os.getenv("DB_USERNAME")
    DB_PASSWORD = urllib.parse.quote_plus(os.getenv("DB_PASSWORD"))
    DB_DRIVER = urllib.parse.quote_plus(os.getenv("DB_DRIVER"))

    DATABASE_URL = (
        f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}"
        f"@{DB_SERVER}/{DB_NAME}"
        f"?driver={DB_DRIVER}"
    )

    DEFAULT_SLA = 24
    POLL_INTERVAL = 120