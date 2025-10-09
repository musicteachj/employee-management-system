"""Employees API routes (Phase 4)."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException

from app.models.employee import (
    Employee,
    EmployeeCreate,
    EmployeeUpdate,
    SearchCriteria,
)
from app.models.user import UserInDB
from app.services.employee_service import EmployeeService
from app.utils.dependencies import get_current_user


router = APIRouter()


@router.get("/employees", response_model=List[Employee])
async def get_employees(
    skip: int = 0,
    limit: int = 100,
    department: Optional[str] = None,
    status: Optional[str] = None,
    service: EmployeeService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Get employees with optional filtering. Requires authentication."""
    return await service.get_employees(skip, limit, department, status)


@router.post("/employees", response_model=Employee)
async def create_employee(
    employee: EmployeeCreate,
    service: EmployeeService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Create new employee. Requires authentication."""
    return await service.create_employee(employee)


@router.get("/employees/{employee_id}", response_model=Employee)
async def get_employee(
    employee_id: str,
    service: EmployeeService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Get single employee by ID. Requires authentication."""
    employee = await service.get_employee(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put("/employees/{employee_id}", response_model=Employee)
async def update_employee(
    employee_id: str,
    updates: EmployeeUpdate,
    service: EmployeeService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Update employee. Requires authentication."""
    return await service.update_employee(employee_id, updates)


@router.delete("/employees/{employee_id}")
async def delete_employee(
    employee_id: str,
    service: EmployeeService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Soft delete employee. Requires authentication."""
    return await service.delete_employee(employee_id)


@router.post("/employees/search", response_model=List[Employee])
async def search_employees(
    criteria: SearchCriteria,
    service: EmployeeService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Advanced employee search. Requires authentication."""
    return await service.search_employees(criteria)


@router.get("/employees/{employee_id}/reports", response_model=List[Employee])
async def get_direct_reports(
    employee_id: str,
    service: EmployeeService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Get employee's direct reports. Requires authentication."""
    return await service.get_direct_reports(employee_id)


@router.get("/managers", response_model=List[Employee])
async def get_managers(
    service: EmployeeService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Get all employees who are managers (have direct reports or manager-level positions). Requires authentication."""
    return await service.get_managers()


