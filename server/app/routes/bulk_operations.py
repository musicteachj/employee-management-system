"""Placeholder bulk operations routes (Phase 1 scaffolding)."""

from fastapi import APIRouter

router = APIRouter()


@router.post("/bulk/example")
async def bulk_example() -> dict:
    return {"status": "not_implemented"}


