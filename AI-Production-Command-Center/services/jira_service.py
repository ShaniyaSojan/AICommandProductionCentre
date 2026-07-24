import requests
from requests.auth import HTTPBasicAuth
from config import Config
from utils.logger import logger
from utils.datetime_helper import parse_jira_datetime

class JiraService:

    def __init__(self):
        self.base_url = Config.JIRA_URL
        self.auth = HTTPBasicAuth(
            Config.JIRA_EMAIL,
            Config.JIRA_API_TOKEN
        )
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

    def get_production_tickets(self, epic):
        url = f"{self.base_url}/rest/api/3/search/jql"
        payload = {
            "jql": f"parent = {epic} ORDER BY Rank",
            "maxResults": 100,
            "fields": [
                "summary",
                "description",
                "issuetype",
                "status",
                "priority",
                "assignee",
                "reporter",
                "created",
                "updated",
                "resolutiondate",
                "comment"
            ]
        }
        response = requests.post(
            url,
            json=payload,
            headers=self.headers,
            auth=self.auth
        )

        response.raise_for_status()
        data = response.json()

        tickets = []
        for issue in data["issues"]:
            fields = issue["fields"]
            description = extract_text(fields.get("description"))
            ticket = {
                "JiraIssueID": issue["id"],
                "IssueKey": issue["key"],
                "Summary": fields.get("summary"),
                "Description": description,
                "IssueType": fields.get("issuetype", {}).get("name"),
                "Status": fields.get("status", {}).get("name"),
                "Priority": fields.get("priority", {}).get("name"),
                "Assignee": (
                    fields.get("assignee", {}).get("displayName")
                    if fields.get("assignee")
                    else None
                ),
                "Reporter": (
                    fields.get("reporter", {}).get("displayName")
                    if fields.get("reporter")
                    else None
                ),
                "CreatedDate": parse_jira_datetime(fields.get("created")),
                "UpdatedDate": parse_jira_datetime(fields.get("updated")),
                "ResolutionDate": parse_jira_datetime(fields.get("resolutiondate")),
                "Comments": fields.get("comment", {}).get("comments", [])
            }
            tickets.append(ticket)
        return tickets


def extract_text(node):
    if not node:
        return ""
    text = ""
    if isinstance(node, dict):
        if node.get("type") == "text":
            text += node.get("text", "")
        for child in node.get("content", []):
            text += extract_text(child)
    elif isinstance(node, list):
        for item in node:
            text += extract_text(item)
    return text
