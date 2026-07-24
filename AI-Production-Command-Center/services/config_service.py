import json


class ProjectConfigService:

    def __init__(self):

        with open("config/projects.json") as file:
            self.projects = json.load(file)["projects"]

    def get_project(self, name):

        for project in self.projects:

            if project["name"] == name:
                return project

        return None

    def get_enabled_projects(self):

        return [
            project
            for project in self.projects
            if project["enabled"]
        ]