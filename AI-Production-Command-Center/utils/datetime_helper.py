from datetime import datetime


def parse_jira_datetime(date_string):
    if not date_string:
        return None
    try:
        return datetime.strptime(
            date_string,
            "%Y-%m-%dT%H:%M:%S.%f%z"
        )
    except Exception:
        return None