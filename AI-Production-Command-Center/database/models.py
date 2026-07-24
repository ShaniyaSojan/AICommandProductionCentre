from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from database.db import Base


class Ticket(Base):

    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)

    issue_key = Column(String, unique=True, index=True)

    project = Column(String)

    summary = Column(String)

    status = Column(String)

    priority = Column(String)

    assignee = Column(String)

    reporter = Column(String)

    created = Column(DateTime)

    updated = Column(DateTime)

    last_synced = Column(DateTime)
    
class TicketHistory(Base):

    __tablename__ = "ticket_history"

    id = Column(Integer, primary_key=True)

    issue_key = Column(String)

    field = Column(String)

    old_value = Column(String)

    new_value = Column(String)

    changed_at = Column(DateTime)