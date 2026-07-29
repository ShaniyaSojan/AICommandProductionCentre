from database.dashboard_repository import DashboardRepository


class DashboardService:

    def __init__(self):
        self.repo = DashboardRepository()

    def get_summary(self):
        return self.repo.get_summary()

    def get_status_distribution(self):
        return self.repo.get_status_distribution()

    def get_priority_distribution(self):
        return self.repo.get_priority_distribution()

    def get_customer_distribution(self):
        return self.repo.get_customer_distribution()

    def get_severity_distribution(self):
        return self.repo.get_severity_distribution()

    def get_recent_tickets(self):
        return self.repo.get_recent_tickets()