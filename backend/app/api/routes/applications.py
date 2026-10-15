from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.dependencies import get_application_service
from app.core.services.application_service import (
    ApplicationAlreadyExistsError,
    ApplicationNotFoundError,
    ApplicationService,
    AgeEligibilityError,
)
from app.db.models.application import ApplicationStatus
from app.schemas.application import ApplicationCreate, ApplicationRead, ApplicationStatusUpdate


router = APIRouter(prefix="/applications")


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    service: Annotated[ApplicationService, Depends(get_application_service)],
) -> ApplicationRead:
    try:
        return ApplicationRead.model_validate(service.create_application(payload))
    except AgeEligibilityError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(error)) from error
    except ApplicationAlreadyExistsError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error


@router.get("", response_model=list[ApplicationRead])
def list_applications(
    service: Annotated[ApplicationService, Depends(get_application_service)],
    application_status: Annotated[ApplicationStatus | None, Query(alias="status")] = None,
) -> list[ApplicationRead]:
    return [
        ApplicationRead.model_validate(application)
        for application in service.list_applications(application_status)
    ]


@router.patch("/{application_id}/status", response_model=ApplicationRead)
def update_application_status(
    application_id: UUID,
    payload: ApplicationStatusUpdate,
    service: Annotated[ApplicationService, Depends(get_application_service)],
) -> ApplicationRead:
    try:
        return ApplicationRead.model_validate(
            service.update_application_status(application_id, payload.status),
        )
    except ApplicationNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
