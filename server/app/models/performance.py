"""Placeholder models for performance (Phase 1 scaffolding)."""

from pydantic import BaseModel


class PerformanceReview(BaseModel):
    id: str | None = None


