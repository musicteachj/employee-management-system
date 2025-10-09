"""Bulk operations routes (Phase 6B)."""

from fastapi import APIRouter, Depends

from app.models.bulk_operations import (
    BulkAssignManagerRequest,
    BulkConvertEmploymentTypeRequest,
    BulkChangeStatusRequest,
    BulkRehireEmployeesRequest,
    BulkUpdateTrainingStatusRequest,
    BulkSchedulePerformanceReviewRequest,
    BulkOperationResponse,
)
from app.services.bulk_service import BulkService

router = APIRouter()


@router.post("/bulk/assign-manager", response_model=BulkOperationResponse)
async def bulk_assign_manager(
    request: BulkAssignManagerRequest,
    service: BulkService = Depends()
) -> dict:
    """Assign a manager to multiple employees."""
    return await service.bulk_assign_manager(request)


@router.post("/bulk/convert-employment-type", response_model=BulkOperationResponse)
async def bulk_convert_employment_type(
    request: BulkConvertEmploymentTypeRequest,
    service: BulkService = Depends()
) -> dict:
    """Convert employment type for multiple employees."""
    return await service.bulk_convert_employment_type(request)


@router.post("/bulk/change-status", response_model=BulkOperationResponse)
async def bulk_change_status(
    request: BulkChangeStatusRequest,
    service: BulkService = Depends()
) -> dict:
    """Change status for multiple employees."""
    return await service.bulk_change_status(request)


@router.post("/bulk/rehire-employees", response_model=BulkOperationResponse)
async def bulk_rehire_employees(
    request: BulkRehireEmployeesRequest,
    service: BulkService = Depends()
) -> dict:
    """Rehire multiple terminated employees."""
    return await service.bulk_rehire_employees(request)


@router.post("/bulk/update-training-status", response_model=BulkOperationResponse)
async def bulk_update_training_status(
    request: BulkUpdateTrainingStatusRequest,
    service: BulkService = Depends()
) -> dict:
    """Update training status for multiple employees."""
    return await service.bulk_update_training_status(request)


@router.post("/bulk/schedule-performance-review", response_model=BulkOperationResponse)
async def bulk_schedule_performance_review(
    request: BulkSchedulePerformanceReviewRequest,
    service: BulkService = Depends()
) -> dict:
    """Schedule performance reviews for multiple employees."""
    return await service.bulk_schedule_performance_review(request)


