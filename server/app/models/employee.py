"""Pydantic models for employees (Phase 2)."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, ConfigDict, field_serializer


class ActiveStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    ON_LEAVE = "On Leave"
    TERMINATED = "Terminated"


class JobLevel(str, Enum):
    ENTRY = "Entry"
    MID = "Mid"
    SENIOR = "Senior"
    LEAD = "Lead"
    MANAGER = "Manager"
    DIRECTOR = "Director"
    VP = "VP"
    C_LEVEL = "C-Level"
    CEO = "CEO"


class PerformanceReview(BaseModel):
    """Performance review record."""
    review_id: str = Field(..., alias="reviewId")
    review_date: str = Field(..., alias="reviewDate")
    review_period_start: str = Field(..., alias="reviewPeriodStart")
    review_period_end: str = Field(..., alias="reviewPeriodEnd")
    reviewer_name: str = Field(..., alias="reviewerName")
    reviewer_email: str = Field(..., alias="reviewerEmail")
    rating: str
    goals: Optional[List[Dict[str, Any]]] = None
    achievements: Optional[List[Dict[str, Any]]] = None
    areas_for_improvement: Optional[List[str]] = Field(None, alias="areasForImprovement")
    comments: Optional[str] = None
    next_review_date: Optional[str] = Field(None, alias="nextReviewDate")
    skill_assessments: Optional[List[Dict[str, Any]]] = Field(None, alias="skillAssessments")
    manager_feedback: Optional[str] = Field(None, alias="managerFeedback")
    self_assessment: Optional[str] = Field(None, alias="selfAssessment")
    development_plan: Optional[List[Dict[str, Any]]] = Field(None, alias="developmentPlan")

    model_config = ConfigDict(populate_by_name=True)


class PerformanceMetrics(BaseModel):
    """Performance metrics summary."""
    average_rating: float = Field(..., alias="averageRating")
    rating_trend: str = Field(..., alias="ratingTrend")
    reviews_completed: int = Field(..., alias="reviewsCompleted")
    overdue_days: Optional[int] = Field(None, alias="overdueDays")

    model_config = ConfigDict(populate_by_name=True)


class HRAssignment(BaseModel):
    """HR assignment details."""
    assigned_to: str = Field(..., alias="assignedTo")
    assigned_date: Optional[str] = Field(None, alias="assignedDate")
    manager_email: str = Field(..., alias="managerEmail")
    manager_assign_date: Optional[str] = Field(None, alias="managerAssignDate")
    review_comments: Optional[str] = Field(None, alias="reviewComments")
    revalidation_status: Optional[str] = Field(None, alias="revalidationStatus")

    model_config = ConfigDict(populate_by_name=True)


class Onboarding(BaseModel):
    """Onboarding/event tracking details."""
    author: str
    author_type: str = Field(..., alias="authorType")
    event_date: Optional[str] = Field(None, alias="eventDate")
    event_name: Optional[str] = Field(None, alias="eventName")
    event_reference_id: Optional[str] = Field(None, alias="eventReferenceId")
    onboarding_key: Optional[str] = Field(None, alias="onboardingKey")
    owner: Optional[str] = None
    record_updated: Optional[str] = Field(None, alias="recordUpdated")

    model_config = ConfigDict(populate_by_name=True)


class ProfileUpdate(BaseModel):
    """Profile update record."""
    update_id: str = Field(..., alias="updateId")
    update_date: str = Field(..., alias="updateDate")
    updated_by: str = Field(..., alias="updatedBy")
    updated_fields: List[str] = Field(..., alias="updatedFields")
    update_reason: Optional[str] = Field(None, alias="updateReason")
    previous_values: Optional[Dict[str, Any]] = Field(None, alias="previousValues")
    new_values: Optional[Dict[str, Any]] = Field(None, alias="newValues")

    model_config = ConfigDict(populate_by_name=True)


class Employee(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    status: ActiveStatus

    # Personal Information
    first_name: str = Field(..., alias="firstName")
    last_name: str = Field(..., alias="lastName")
    full_name: str = Field(..., alias="fullName")
    personal_email: str = Field(..., alias="personalEmail")
    work_email: str = Field(..., alias="workEmail")
    phone_number: str = Field(..., alias="phoneNumber")
    emergency_contact_name: str = Field(..., alias="emergencyContactName")
    emergency_contact_phone: str = Field(..., alias="emergencyContactPhone")
    address: str
    city: str
    state: str
    country: str
    date_of_birth: Optional[str] = Field(None, alias="dateOfBirth")
    social_security_number: Optional[str] = Field(None, alias="socialSecurityNumber")

    # Employment Information
    employee_id: str = Field(..., alias="employeeId")
    department: str
    position: str
    job_level: JobLevel = Field(..., alias="jobLevel")
    employment_type: str = Field(..., alias="employmentType")
    work_location: str = Field(..., alias="workLocation")
    manager_id: Optional[str] = Field(None, alias="managerId")
    manager_name: Optional[str] = Field(None, alias="managerName")
    direct_reports: Optional[List[str]] = Field(None, alias="directReports")
    organization_level: Optional[int] = Field(None, alias="organizationLevel")
    cost_center: Optional[str] = Field(None, alias="costCenter")
    business_unit: Optional[str] = Field(None, alias="businessUnit")

    # Dates
    hire_date: str = Field(..., alias="hireDate")
    probation_end_date: Optional[str] = Field(None, alias="probationEndDate")
    last_review_date: Optional[str] = Field(None, alias="lastReviewDate")
    termination_date: Optional[str] = Field(None, alias="terminationDate")

    # Compensation & Benefits
    salary: float
    currency: float
    paygrade: str
    benefits_eligible: str = Field(..., alias="benefitsEligible")

    # Performance & Development
    performance_rating: str = Field(..., alias="performanceRating")
    training_status: str = Field(..., alias="trainingStatus")
    development_notes: str = Field(..., alias="developmentNotes")
    next_review_date: Optional[str] = Field(None, alias="nextReviewDate")
    performance_history: Optional[List[PerformanceReview]] = Field(None, alias="performanceHistory")
    performance_metrics: Optional[PerformanceMetrics] = Field(None, alias="performanceMetrics")

    # Performance Review Status (computed fields)
    days_overdue: Optional[int] = Field(None, alias="daysOverdue")
    review_status: Optional[str] = Field(None, alias="reviewStatus")

    # Compliance & Verification
    background_check_status: str = Field(..., alias="backgroundCheckStatus")

    # System fields
    _attachments: Optional[List[str]] = None
    doc_type: str = Field(default="employee", alias="docType")
    source: str = "HR"
    source_id: Optional[str] = Field(None, alias="sourceId")
    created_by: Optional[str] = Field(None, alias="createdBy")
    created_on: Optional[str] = Field(None, alias="createdOn")
    updated_by: Optional[str] = Field(None, alias="updatedBy")
    updated_on: Optional[str] = Field(None, alias="updatedOn")
    updated_at: Optional[datetime] = Field(None, alias="updatedAt")
    last_profile_update: Optional[str] = Field(None, alias="lastProfileUpdate")
    profile_update_history: Optional[List[ProfileUpdate]] = Field(None, alias="profileUpdateHistory")

    # Manager/HR Assignment
    hr_assignment: HRAssignment = Field(..., alias="hrAssignment")

    # Onboarding/Event tracking
    onboarding: Optional[Onboarding] = None

    model_config = ConfigDict(populate_by_name=True)

    @field_serializer("updated_at")
    def _serialize_updated_at(self, v: Optional[datetime]) -> Optional[str]:
        return v.isoformat() if isinstance(v, datetime) else v


class EmployeeCreate(BaseModel):
    # Subset of Employee fields for creation (to be defined later)
    pass


class EmployeeUpdate(BaseModel):
    # Subset of Employee fields for updates (to be defined later)
    pass


class SearchCriteria(BaseModel):
    full_name: Optional[str] = Field(None, alias="fullName")
    department: Optional[str] = None
    position: Optional[str] = None
    status: Optional[ActiveStatus] = None
    manager_id: Optional[str] = Field(None, alias="managerId")
    employment_type: Optional[str] = Field(None, alias="employmentType")

    model_config = ConfigDict(populate_by_name=True)



