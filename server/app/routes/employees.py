"""Placeholder employees routes (Phase 1 scaffolding)."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/employees")
async def list_employees() -> list:
    return []


