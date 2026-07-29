from sqlalchemy import text

from database.connection import get_db
from configurations.constants import Tables


class ProjectService:

    def get_project_epics(self, project_id):

        with get_db() as db:

            result = db.execute(

                text(f"""

                    SELECT EpicKey

                    FROM {Tables.EPICS}

                    WHERE ProjectID = :project_id
                    AND IsEnabled = 1

                """),

                {"project_id": project_id}

            )

            return [row["EpicKey"] for row in result.mappings().all()]

    def get_enabled_projects(self):

        with get_db() as db:

            result = db.execute(text("""

                    SELECT *

                    FROM Projects

                    WHERE IsEnabled = 1

            """))

            return result.mappings().all()

    def get_project(self, name):

        with get_db() as db:

            result = db.execute(

                text("""

                SELECT *

                FROM Projects

                WHERE ProjectName=:name

                """),

                {"name": name}

            )

            return result.mappings().first()