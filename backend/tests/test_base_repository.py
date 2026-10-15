from datetime import date
from unittest import TestCase

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.models.application import Application, VehicleCategory
from app.db.repositories.base import BaseRepository


class BaseRepositoryTests(TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self.session = Session(self.engine)
        self.repository = BaseRepository(self.session, Application)

    def tearDown(self) -> None:
        self.session.close()
        self.engine.dispose()

    def test_add_get_and_list_application(self) -> None:
        application = Application(
            full_name="Asha Sharma",
            email="asha@example.com",
            date_of_birth=date(2000, 1, 1),
            vehicle_category=VehicleCategory.LIGHT_MOTOR_VEHICLE,
        )

        saved_application = self.repository.add(application)
        self.session.commit()

        self.assertEqual(self.repository.get(saved_application.id), saved_application)
        self.assertEqual(self.repository.list(), [saved_application])
