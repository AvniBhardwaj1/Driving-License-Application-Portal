from collections.abc import Sequence
from typing import Any, Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.base import Base


ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, session: Session, model_type: type[ModelType]) -> None:
        self.session = session
        self.model_type = model_type

    def get(self, identifier: Any) -> ModelType | None:
        return self.session.get(self.model_type, identifier)

    def list(self, *, offset: int = 0, limit: int = 100) -> Sequence[ModelType]:
        statement = select(self.model_type).offset(offset).limit(limit)
        return self.session.scalars(statement).all()

    def add(self, entity: ModelType) -> ModelType:
        self.session.add(entity)
        self.session.flush()
        return entity

    def delete(self, entity: ModelType) -> None:
        self.session.delete(entity)
