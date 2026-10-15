from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.services.application_service import ApplicationService
from app.db.repositories.application import ApplicationRepository
from app.db.session import get_db


def get_application_service(
    session: Annotated[Session, Depends(get_db)],
) -> ApplicationService:
    return ApplicationService(ApplicationRepository(session))
