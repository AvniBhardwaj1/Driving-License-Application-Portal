from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.application import Application, ApplicationStatus
from app.db.repositories.base import BaseRepository


class ApplicationRepository(BaseRepository[Application]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Application)

    def get_by_email(self, email: str) -> Application | None:
        statement = select(Application).where(Application.email == email)
        return self.session.scalar(statement)

    def list_by_status(self, application_status: ApplicationStatus | None) -> list[Application]:
        statement = select(Application).order_by(Application.created_at.desc())
        if application_status is not None:
            statement = statement.where(Application.status == application_status)
        return list(self.session.scalars(statement))
