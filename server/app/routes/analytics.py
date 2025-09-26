"""Placeholder analytics routes (Phase 1 scaffolding)."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/analytics/department-distribution")
async def department_distribution() -> dict:
    return {"departments": [], "counts": [], "total": 0}


