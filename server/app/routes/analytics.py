"""Analytics API routes (Phase 6)."""

from fastapi import APIRouter, Depends

from app.models.analytics import (
    DashboardAnalytics,
    DepartmentDistribution,
    PerformanceTrends,
    SalaryAnalytics,
    HiringTrends,
)
from app.services.analytics_service import AnalyticsService


router = APIRouter()


@router.get("/analytics/dashboard", response_model=DashboardAnalytics)
async def get_dashboard_analytics(service: AnalyticsService = Depends()):
    """Get complete dashboard analytics in a single call."""
    return await service.get_dashboard_analytics()


# Legacy endpoints (kept for backward compatibility)
@router.get("/analytics/department-distribution", response_model=DepartmentDistribution)
async def get_department_distribution(service: AnalyticsService = Depends()):
    return await service.get_department_distribution()


@router.get("/analytics/performance-trends", response_model=PerformanceTrends)
async def get_performance_trends(timeframe: str = "12months", service: AnalyticsService = Depends()):
    return await service.get_performance_trends(timeframe)


@router.get("/analytics/salary-distribution", response_model=SalaryAnalytics)
async def get_salary_analytics(service: AnalyticsService = Depends()):
    return await service.get_salary_analytics()


@router.get("/analytics/hiring-trends", response_model=HiringTrends)
async def get_hiring_trends(service: AnalyticsService = Depends()):
    return await service.get_hiring_trends()


