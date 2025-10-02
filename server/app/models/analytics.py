"""Analytics models for dashboard and reporting (Phase 6)."""

from typing import Dict, List
from pydantic import BaseModel, Field, ConfigDict


class DepartmentDistributionItem(BaseModel):
    """Individual department distribution item."""
    name: str
    count: int
    percentage: int


class StatusDistributionItem(BaseModel):
    """Individual status distribution item."""
    status: str
    count: int
    percentage: int


class SalaryByDepartmentItem(BaseModel):
    """Salary statistics by department."""
    department: str
    average_salary: int = Field(..., alias="averageSalary")
    count: int

    model_config = ConfigDict(populate_by_name=True)


class JobLevelDistributionItem(BaseModel):
    """Job level distribution item."""
    level: str
    count: int
    percentage: int


class HiringTrendItem(BaseModel):
    """Hiring trend data point."""
    month: str
    hires: int


class RecentHire(BaseModel):
    """Recent hire summary."""
    id: str
    name: str
    department: str
    hire_date: str = Field(..., alias="hireDate")

    model_config = ConfigDict(populate_by_name=True)


class TopDepartment(BaseModel):
    """Top department by size."""
    name: str
    count: int


class EmploymentType(BaseModel):
    """Employment type distribution."""
    type: str
    count: int
    percentage: int


class DashboardAnalytics(BaseModel):
    """Complete analytics dashboard data."""
    total_employees: int = Field(..., alias="totalEmployees")
    active_employees: int = Field(..., alias="activeEmployees")
    total_departments: int = Field(..., alias="totalDepartments")
    average_salary: float = Field(..., alias="averageSalary")
    department_distribution: List[DepartmentDistributionItem] = Field(..., alias="departmentDistribution")
    status_distribution: List[StatusDistributionItem] = Field(..., alias="statusDistribution")
    salary_by_department: List[SalaryByDepartmentItem] = Field(..., alias="salaryByDepartment")
    job_level_distribution: List[JobLevelDistributionItem] = Field(..., alias="jobLevelDistribution")
    hiring_trends: List[HiringTrendItem] = Field(..., alias="hiringTrends")
    recent_hires: List[RecentHire] = Field(..., alias="recentHires")
    top_departments: List[TopDepartment] = Field(..., alias="topDepartments")
    employment_types: List[EmploymentType] = Field(..., alias="employmentTypes")

    model_config = ConfigDict(populate_by_name=True)


# Legacy models for backward compatibility
class DepartmentDistribution(BaseModel):
    departments: list[str] = []
    counts: list[int] = []
    total: int = 0


class PerformanceTrends(BaseModel):
    data: dict = {}


class SalaryAnalytics(BaseModel):
    overall: dict = {}
    by_department: dict = {}
    by_job_level: dict = {}


class HiringTrends(BaseModel):
    timeline: list[dict] = []


