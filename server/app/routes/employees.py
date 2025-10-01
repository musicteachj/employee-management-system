"""Employees API routes (Phase 4)."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException

from app.models.employee import (
    Employee,
    EmployeeCreate,
    EmployeeUpdate,
    SearchCriteria,
)
from app.services.employee_service import EmployeeService


router = APIRouter()


@router.get("/employees", response_model=List[Employee])
async def get_employees(
    skip: int = 0,
    limit: int = 100,
    department: Optional[str] = None,
    status: Optional[str] = None,
    service: EmployeeService = Depends(),
):
    """Get employees with optional filtering."""
    return await service.get_employees(skip, limit, department, status)


@router.post("/employees", response_model=Employee)
async def create_employee(
    employee: EmployeeCreate,
    service: EmployeeService = Depends(),
):
    """Create new employee."""
    return await service.create_employee(employee)


@router.get("/employees/{employee_id}", response_model=Employee)
async def get_employee(
    employee_id: str,
    service: EmployeeService = Depends(),
):
    """Get single employee by ID."""
    employee = await service.get_employee(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put("/employees/{employee_id}", response_model=Employee)
async def update_employee(
    employee_id: str,
    updates: EmployeeUpdate,
    service: EmployeeService = Depends(),
):
    """Update employee."""
    return await service.update_employee(employee_id, updates)


@router.delete("/employees/{employee_id}")
async def delete_employee(
    employee_id: str,
    service: EmployeeService = Depends(),
):
    """Soft delete employee."""
    return await service.delete_employee(employee_id)


@router.post("/employees/search", response_model=List[Employee])
async def search_employees(
    criteria: SearchCriteria,
    service: EmployeeService = Depends(),
):
    """Advanced employee search."""
    return await service.search_employees(criteria)


@router.get("/employees/{employee_id}/reports", response_model=List[Employee])
async def get_direct_reports(
    employee_id: str,
    service: EmployeeService = Depends(),
):
    """Get employee's direct reports."""
    return await service.get_direct_reports(employee_id)


