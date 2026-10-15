from app.db import models
from app.db.base import Base
from app.db.session import engine


def initialize_database() -> None:
    # ponytail: create_all is enough for this local-only portal; use Alembic migrations before shared deployment.
    Base.metadata.create_all(bind=engine)
