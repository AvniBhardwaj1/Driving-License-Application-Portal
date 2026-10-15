from datetime import date
from unittest import TestCase

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.core.services.application_service import (
    ApplicationService,
    AgeEligibilityError,
    calculate_age,
)
from app.db.base import Base
from app.db.models.application import ApplicationStatus, VehicleCategory
from app.db.repositories.application import ApplicationRepository
from app.schemas.application import ApplicationCreate


class ApplicationServiceTests(TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self.session = Session(self.engine)
        self.service = ApplicationService(ApplicationRepository(self.session))

    def tearDown(self) -> None:
        self.session.close()
        self.engine.dispose()

    def test_calculate_age_respects_birthday(self) -> None:
        self.assertEqual(calculate_age(date(2008, 10, 17), on_date=date(2026, 10, 16)), 17)
        self.assertEqual(calculate_age(date(2008, 10, 16), on_date=date(2026, 10, 16)), 18)

    def test_underage_applicant_needs_gearless_category_and_consent(self) -> None:
        with self.assertRaises(AgeEligibilityError):
            self.service.create_application(
                self._application(
                    email="minor@example.com",
                    vehicle_category=VehicleCategory.MOTORCYCLE_WITH_GEAR,
                    parent_consent=False,
                ),
            )

        application = self.service.create_application(
            self._application(
                email="eligible-minor@example.com",
                vehicle_category=VehicleCategory.GEARLESS_TWO_WHEELER,
                parent_consent=True,
            ),
        )

        self.assertEqual(application.status, ApplicationStatus.PENDING)

    def test_status_update_and_filter(self) -> None:
        application = self.service.create_application(
            self._application(
                email="adult@example.com",
                date_of_birth=date(2000, 1, 1),
                vehicle_category=VehicleCategory.LIGHT_MOTOR_VEHICLE,
            ),
        )

        approved_application = self.service.update_application_status(
            application.id,
            ApplicationStatus.APPROVED,
        )

        self.assertEqual(approved_application.status, ApplicationStatus.APPROVED)
        self.assertEqual(self.service.list_applications(ApplicationStatus.APPROVED), [approved_application])

    @staticmethod
    def _application(
        *,
        email: str,
        date_of_birth: date = date(2010, 1, 1),
        vehicle_category: VehicleCategory = VehicleCategory.GEARLESS_TWO_WHEELER,
        parent_consent: bool = False,
    ) -> ApplicationCreate:
        return ApplicationCreate(
            full_name="Asha Sharma",
            email=email,
            date_of_birth=date_of_birth,
            vehicle_category=vehicle_category,
            parent_consent=parent_consent,
        )
