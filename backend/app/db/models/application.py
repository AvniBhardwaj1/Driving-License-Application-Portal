from datetime import date, datetime
from enum import StrEnum
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, Enum, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class VehicleCategory(StrEnum):
    GEARLESS_TWO_WHEELER = "gearless_two_wheeler"
    MOTORCYCLE_WITH_GEAR = "motorcycle_with_gear"
    LIGHT_MOTOR_VEHICLE = "light_motor_vehicle"


class ApplicationStatus(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    date_of_birth: Mapped[date] = mapped_column(Date)
    vehicle_category: Mapped[VehicleCategory] = mapped_column(
        Enum(VehicleCategory, name="vehicle_category"),
    )
    parent_consent: Mapped[bool] = mapped_column(default=False)
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"),
        default=ApplicationStatus.PENDING,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
