"""Placeholder Pydantic models for employees (Phase 1 scaffolding)."""

from pydantic import BaseModel


class Employee(BaseModel):
    """Placeholder model; full fields to be added in later phases."""
    id: str | None = None


class EmployeeCreate(BaseModel):
    pass


class EmployeeUpdate(BaseModel):
    pass


