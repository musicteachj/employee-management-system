"""Bulk operations service (Phase 6B)."""

from datetime import datetime
from typing import List, Dict
from bson import ObjectId

from app.database import get_database
from app.models.bulk_operations import (
    BulkAssignManagerRequest,
    BulkConvertEmploymentTypeRequest,
    BulkChangeStatusRequest,
    BulkRehireEmployeesRequest,
    BulkUpdateTrainingStatusRequest,
)


class BulkService:
    async def bulk_assign_manager(self, request: BulkAssignManagerRequest) -> Dict:
        """Assign a manager to multiple employees."""
        db = await get_database()
        updated_count = 0
        failed_count = 0
        failed_ids = []

        # First, get the manager's name
        manager = await db.employees.find_one({"_id": ObjectId(request.manager_id)})
        if not manager:
            return {
                "success": False,
                "updatedCount": 0,
                "failedCount": len(request.employee_ids),
                "message": "Manager not found",
                "failedIds": request.employee_ids
            }

        manager_name = manager.get("fullName", "")

        for emp_id in request.employee_ids:
            try:
                _id = ObjectId(emp_id)
                result = await db.employees.update_one(
                    {"_id": _id},
                    {
                        "$set": {
                            "managerId": request.manager_id,
                            "managerName": manager_name,
                            "updatedAt": datetime.utcnow(),
                            "hrAssignment.managerEmail": manager.get("workEmail", ""),
                            "hrAssignment.managerAssignDate": request.assignment_date,
                        }
                    }
                )
                if result.matched_count > 0:
                    updated_count += 1
                else:
                    failed_count += 1
                    failed_ids.append(emp_id)
            except Exception as e:
                failed_count += 1
                failed_ids.append(emp_id)
                print(f"Error updating employee {emp_id}: {e}")

        return {
            "success": failed_count == 0,
            "updatedCount": updated_count,
            "failedCount": failed_count,
            "message": f"Successfully assigned manager to {updated_count} employee(s)",
            "failedIds": failed_ids if failed_ids else None
        }

    async def bulk_convert_employment_type(self, request: BulkConvertEmploymentTypeRequest) -> Dict:
        """Convert employment type for multiple employees."""
        db = await get_database()
        updated_count = 0
        failed_count = 0
        failed_ids = []

        for emp_id in request.employee_ids:
            try:
                _id = ObjectId(emp_id)
                result = await db.employees.update_one(
                    {"_id": _id},
                    {
                        "$set": {
                            "employmentType": request.new_employment_type,
                            "updatedAt": datetime.utcnow(),
                        }
                    }
                )
                if result.matched_count > 0:
                    updated_count += 1
                else:
                    failed_count += 1
                    failed_ids.append(emp_id)
            except Exception as e:
                failed_count += 1
                failed_ids.append(emp_id)
                print(f"Error updating employee {emp_id}: {e}")

        return {
            "success": failed_count == 0,
            "updatedCount": updated_count,
            "failedCount": failed_count,
            "message": f"Successfully converted {updated_count} employee(s) to {request.new_employment_type}",
            "failedIds": failed_ids if failed_ids else None
        }

    async def bulk_change_status(self, request: BulkChangeStatusRequest) -> Dict:
        """Change status for multiple employees."""
        db = await get_database()
        updated_count = 0
        failed_count = 0
        failed_ids = []

        for emp_id in request.employee_ids:
            try:
                _id = ObjectId(emp_id)
                update_data = {
                    "status": request.new_status,
                    "updatedAt": datetime.utcnow(),
                }

                # If terminating, set termination date
                if request.new_status == "Terminated":
                    update_data["terminationDate"] = request.effective_date

                result = await db.employees.update_one(
                    {"_id": _id},
                    {"$set": update_data}
                )
                if result.matched_count > 0:
                    updated_count += 1
                else:
                    failed_count += 1
                    failed_ids.append(emp_id)
            except Exception as e:
                failed_count += 1
                failed_ids.append(emp_id)
                print(f"Error updating employee {emp_id}: {e}")

        return {
            "success": failed_count == 0,
            "updatedCount": updated_count,
            "failedCount": failed_count,
            "message": f"Successfully changed status to {request.new_status} for {updated_count} employee(s)",
            "failedIds": failed_ids if failed_ids else None
        }

    async def bulk_rehire_employees(self, request: BulkRehireEmployeesRequest) -> Dict:
        """Rehire multiple terminated employees."""
        db = await get_database()
        updated_count = 0
        failed_count = 0
        failed_ids = []

        rehire_data = request.rehire_data

        for emp_id in request.employee_ids:
            try:
                _id = ObjectId(emp_id)
                result = await db.employees.update_one(
                    {"_id": _id},
                    {
                        "$set": {
                            "status": "Active",
                            "hireDate": rehire_data.rehire_date,
                            "department": rehire_data.department,
                            "position": rehire_data.position,
                            "jobLevel": rehire_data.job_level,
                            "salary": rehire_data.salary,
                            "employmentType": rehire_data.employment_type,
                            "managerId": rehire_data.manager_id,
                            "managerName": rehire_data.manager_name,
                            "updatedAt": datetime.utcnow(),
                        },
                        "$unset": {
                            "terminationDate": ""
                        }
                    }
                )
                if result.matched_count > 0:
                    updated_count += 1
                else:
                    failed_count += 1
                    failed_ids.append(emp_id)
            except Exception as e:
                failed_count += 1
                failed_ids.append(emp_id)
                print(f"Error rehiring employee {emp_id}: {e}")

        return {
            "success": failed_count == 0,
            "updatedCount": updated_count,
            "failedCount": failed_count,
            "message": f"Successfully rehired {updated_count} employee(s)",
            "failedIds": failed_ids if failed_ids else None
        }

    async def bulk_update_training_status(self, request: BulkUpdateTrainingStatusRequest) -> Dict:
        """Update training status for multiple employees."""
        db = await get_database()
        updated_count = 0
        failed_count = 0
        failed_ids = []

        for emp_id in request.employee_ids:
            try:
                _id = ObjectId(emp_id)
                result = await db.employees.update_one(
                    {"_id": _id},
                    {
                        "$set": {
                            "trainingStatus": request.new_training_status,
                            "developmentNotes": request.training_data.notes,
                            "updatedAt": datetime.utcnow(),
                        }
                    }
                )
                if result.matched_count > 0:
                    updated_count += 1
                else:
                    failed_count += 1
                    failed_ids.append(emp_id)
            except Exception as e:
                failed_count += 1
                failed_ids.append(emp_id)
                print(f"Error updating training status for employee {emp_id}: {e}")

        return {
            "success": failed_count == 0,
            "updatedCount": updated_count,
            "failedCount": failed_count,
            "message": f"Successfully updated training status to {request.new_training_status} for {updated_count} employee(s)",
            "failedIds": failed_ids if failed_ids else None
        }


