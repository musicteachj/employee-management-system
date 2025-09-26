"""Pydantic models for employees (Phase 2)."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict, field_serializer


class ActiveStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    TERMINATED = "Terminated"


class JobLevel(str, Enum):
    ENTRY = "Entry Level"
    MID = "Mid Level"
    SENIOR = "Senior Level"
    LEAD = "Lead"
    MANAGER = "Manager"
    DIRECTOR = "Director"
    VP = "Vice President"
    C_LEVEL = "C-Level"


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

    # Dates
    hire_date: str = Field(..., alias="hireDate")
    probation_end_date: Optional[str] = Field(None, alias="probationEndDate")
    termination_date: Optional[str] = Field(None, alias="terminationDate")

    # Compensation
    salary: float
    currency: str = "USD"
    paygrade: str
    benefits_eligible: str = Field(..., alias="benefitsEligible")

    # Performance
    performance_rating: str = Field(..., alias="performanceRating")
    training_status: str = Field(..., alias="trainingStatus")
    development_notes: str = Field(..., alias="developmentNotes")
    next_review_date: Optional[str] = Field(None, alias="nextReviewDate")

    # System fields
    doc_type: str = Field(default="employee", alias="docType")
    source: str = "HR"
    created_by: Optional[str] = Field(None, alias="createdBy")
    created_on: Optional[str] = Field(None, alias="createdOn")
    updated_by: Optional[str] = Field(None, alias="updatedBy")
    updated_on: Optional[str] = Field(None, alias="updatedOn")
    updated_at: Optional[datetime] = Field(None, alias="updatedAt")

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



