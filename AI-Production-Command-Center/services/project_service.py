from sqlalchemy import text

from database.connection import get_db


class ProjectService:

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