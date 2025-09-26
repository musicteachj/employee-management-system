"""Placeholder analytics models (Phase 1 scaffolding)."""

from pydantic import BaseModel


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


