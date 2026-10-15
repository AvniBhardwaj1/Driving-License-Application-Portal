from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.db.models.application import ApplicationStatus, VehicleCategory


class ApplicationCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    date_of_birth: date
    vehicle_category: VehicleCategory
    parent_consent: bool = False

    @field_validator("date_of_birth")
    @classmethod
    def validate_date_of_birth(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("date_of_birth cannot be in the future")
        return value


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationRead(ApplicationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    status: ApplicationStatus
