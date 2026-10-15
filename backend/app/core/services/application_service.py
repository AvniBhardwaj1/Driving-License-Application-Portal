from datetime import date
from uuid import UUID

from sqlalchemy.exc import IntegrityError

from app.db.models.application import Application, ApplicationStatus, VehicleCategory
from app.db.repositories.application import ApplicationRepository
from app.schemas.application import ApplicationCreate


class AgeEligibilityError(ValueError):
    pass


class ApplicationAlreadyExistsError(ValueError):
    pass


class ApplicationNotFoundError(ValueError):
    pass


def calculate_age(date_of_birth: date, *, on_date: date | None = None) -> int:
    reference_date = on_date or date.today()
    return reference_date.year - date_of_birth.year - (
        (reference_date.month, reference_date.day) < (date_of_birth.month, date_of_birth.day)
    )


class ApplicationService:
    def __init__(self, repository: ApplicationRepository) -> None:
        self.repository = repository

    def create_application(self, payload: ApplicationCreate) -> Application:
        self._validate_age_eligibility(payload)

        if self.repository.get_by_email(str(payload.email)):
            raise ApplicationAlreadyExistsError("an application already exists for this email address")

        application = Application(
            full_name=payload.full_name,
            email=str(payload.email),
            date_of_birth=payload.date_of_birth,
            vehicle_category=payload.vehicle_category,
            parent_consent=payload.parent_consent,
        )

        try:
            return self.repository.save(application)
        except IntegrityError as error:
            self.repository.rollback()
            raise ApplicationAlreadyExistsError(
                "an application already exists for this email address",
            ) from error

    def list_applications(self, application_status: ApplicationStatus | None = None) -> list[Application]:
        return self.repository.list_by_status(application_status)

    def update_application_status(
        self,
        application_id: UUID,
        application_status: ApplicationStatus,
    ) -> Application:
        application = self.repository.get(application_id)
        if application is None:
            raise ApplicationNotFoundError("application not found")

        application.status = application_status
        return self.repository.save(application)

    @staticmethod
    def _validate_age_eligibility(payload: ApplicationCreate) -> None:
        if calculate_age(payload.date_of_birth) >= 18:
            return

        if payload.vehicle_category is not VehicleCategory.GEARLESS_TWO_WHEELER:
            raise AgeEligibilityError(
                "applicants under 18 may apply only for a gearless two-wheeler",
            )
        if not payload.parent_consent:
            raise AgeEligibilityError(
                "parent or guardian consent is required for applicants under 18",
            )
