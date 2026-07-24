from contextlib import contextmanager

from database.db import SessionLocal


@contextmanager
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()