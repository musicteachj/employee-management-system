"""Performance review routes (Phase 6C)."""

from typing import List, Dict
from fastapi import APIRouter, Depends

from app.models.performance import (
    PerformanceAnalyticsResponse,
    ScheduleReviewRequest,
    ConductReviewRequest,
)
from app.services.performance_service import PerformanceService

router = APIRouter()


@router.get("/performance/reviews")
async def get_performance_reviews(
    service: PerformanceService = Depends()
) -> List[Dict]:
    """Get all employees with performance review history."""
    return await service.get_performance_reviews()


@router.get("/performance/overdue")
async def get_overdue_reviews(
    service: PerformanceService = Depends()
) -> List[Dict]:
    """Get employees with overdue performance reviews."""
    return await service.get_overdue_reviews()


@router.get("/performance/analytics", response_model=PerformanceAnalyticsResponse)
async def get_performance_analytics(
    service: PerformanceService = Depends()
) -> Dict:
    """Get performance analytics including distribution and trends."""
    return await service.get_performance_analytics()


@router.post("/performance/schedule-reviews")
async def schedule_reviews(
    request: ScheduleReviewRequest,
    service: PerformanceService = Depends()
) -> Dict:
    """Schedule performance reviews for multiple employees."""
    return await service.schedule_reviews(request)


@router.post("/performance/conduct-review")
async def conduct_review(
    request: ConductReviewRequest,
    service: PerformanceService = Depends()
) -> Dict:
    """Conduct/complete a performance review for an employee."""
    return await service.conduct_review(request)

