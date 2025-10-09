"""Pydantic models for bulk operations (Phase 6B)."""

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class BulkAssignManagerRequest(BaseModel):
    """Request to assign a manager to multiple employees."""
    employee_ids: List[str] = Field(..., alias="employeeIds")
    manager_id: str = Field(..., alias="managerId")
    assignment_date: str = Field(..., alias="assignmentDate")
    notes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class BulkConvertEmploymentTypeRequest(BaseModel):
    """Request to convert employment type for multiple employees."""
    employee_ids: List[str] = Field(..., alias="employeeIds")
    new_employment_type: str = Field(..., alias="newEmploymentType")
    effective_date: str = Field(..., alias="effectiveDate")
    notes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class BulkChangeStatusRequest(BaseModel):
    """Request to change status for multiple employees."""
    employee_ids: List[str] = Field(..., alias="employeeIds")
    new_status: str = Field(..., alias="newStatus")
    effective_date: str = Field(..., alias="effectiveDate")
    reason: Optional[str] = None
    notifications: Optional[dict] = None

    model_config = ConfigDict(populate_by_name=True)


class RehireData(BaseModel):
    """Rehire details for an employee."""
    rehire_date: str = Field(..., alias="rehireDate")
    department: str
    position: str
    job_level: str = Field(..., alias="jobLevel")
    salary: float
    employment_type: str = Field(..., alias="employmentType")
    manager_id: str = Field(..., alias="managerId")
    manager_name: str = Field(..., alias="managerName")
    notes: str

    model_config = ConfigDict(populate_by_name=True)


class BulkRehireEmployeesRequest(BaseModel):
    """Request to rehire multiple terminated employees."""
    employee_ids: List[str] = Field(..., alias="employeeIds")
    rehire_data: RehireData = Field(..., alias="rehireData")

    model_config = ConfigDict(populate_by_name=True)


class TrainingData(BaseModel):
    """Training details."""
    training_program: str = Field(..., alias="trainingProgram")
    start_date: str = Field(..., alias="startDate")
    completion_date: str = Field(..., alias="completionDate")
    effective_date: str = Field(..., alias="effectiveDate")
    notes: str

    model_config = ConfigDict(populate_by_name=True)


class BulkUpdateTrainingStatusRequest(BaseModel):
    """Request to update training status for multiple employees."""
    employee_ids: List[str] = Field(..., alias="employeeIds")
    new_training_status: str = Field(..., alias="newTrainingStatus")
    training_data: TrainingData = Field(..., alias="trainingData")

    model_config = ConfigDict(populate_by_name=True)


class ReviewData(BaseModel):
    """Performance review details."""
    review_date: str = Field(..., alias="reviewDate")
    review_period_start: str = Field(..., alias="reviewPeriodStart")
    review_period_end: str = Field(..., alias="reviewPeriodEnd")
    reviewer_name: str = Field(..., alias="reviewerName")
    reviewer_email: str = Field(..., alias="reviewerEmail")
    review_type: str = Field(..., alias="reviewType")
    next_review_date: Optional[str] = Field(None, alias="nextReviewDate")
    comments: Optional[str] = None
    priority: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class BulkSchedulePerformanceReviewRequest(BaseModel):
    """Request to schedule performance reviews for multiple employees."""
    employee_ids: List[str] = Field(..., alias="employeeIds")
    review_data: ReviewData = Field(..., alias="reviewData")

    model_config = ConfigDict(populate_by_name=True)


class BulkOperationResponse(BaseModel):
    """Response for bulk operations."""
    success: bool
    updated_count: int = Field(..., alias="updatedCount")
    failed_count: int = Field(..., alias="failedCount")
    message: str
    failed_ids: Optional[List[str]] = Field(None, alias="failedIds")

    model_config = ConfigDict(populate_by_name=True)

