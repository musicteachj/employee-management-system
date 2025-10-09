"""Pydantic models for performance reviews (Phase 6C)."""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class DepartmentPerformance(BaseModel):
    """Performance metrics for a department."""
    average_rating: float = Field(..., alias="averageRating")
    total_reviews: int = Field(..., alias="totalReviews")
    employee_count: int = Field(..., alias="employeeCount")

    model_config = ConfigDict(populate_by_name=True)


class PerformanceTrend(BaseModel):
    """Performance trend data point."""
    period: str
    average_rating: float = Field(..., alias="averageRating")
    review_count: int = Field(..., alias="reviewCount")

    model_config = ConfigDict(populate_by_name=True)


class PerformanceAnalyticsResponse(BaseModel):
    """Complete performance analytics response."""
    total_reviews: int = Field(..., alias="totalReviews")
    overdue_reviews: int = Field(..., alias="overdueReviews")
    average_rating: float = Field(..., alias="averageRating")
    rating_distribution: Dict[str, int] = Field(..., alias="ratingDistribution")
    department_performance: Dict[str, DepartmentPerformance] = Field(..., alias="departmentPerformance")
    performance_trends: List[PerformanceTrend] = Field(..., alias="performanceTrends")

    model_config = ConfigDict(populate_by_name=True)


class ScheduleReviewRequest(BaseModel):
    """Request to schedule a performance review."""
    employee_ids: List[str] = Field(..., alias="employeeIds")
    review_date: str = Field(..., alias="reviewDate")
    reviewer_name: str = Field(..., alias="reviewerName")
    review_period_start: str = Field(..., alias="reviewPeriodStart")
    review_period_end: str = Field(..., alias="reviewPeriodEnd")
    notes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class ConductReviewRequest(BaseModel):
    """Request to conduct/complete a performance review."""
    employee_id: str = Field(..., alias="employeeId")
    review_date: str = Field(..., alias="reviewDate")
    review_period_start: str = Field(..., alias="reviewPeriodStart")
    review_period_end: str = Field(..., alias="reviewPeriodEnd")
    reviewer_name: str = Field(..., alias="reviewerName")
    reviewer_email: str = Field(..., alias="reviewerEmail")
    rating: str
    comments: Optional[str] = None
    next_review_date: Optional[str] = Field(None, alias="nextReviewDate")
    goals: Optional[List[Dict]] = None
    achievements: Optional[List[Dict]] = None
    areas_for_improvement: Optional[List[str]] = Field(None, alias="areasForImprovement")

    model_config = ConfigDict(populate_by_name=True)
