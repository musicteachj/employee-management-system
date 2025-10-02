"""Employee service with full CRUD operations (Phase 5)."""

from datetime import datetime
from typing import List, Optional

from bson import ObjectId

from app.database import get_database
from app.models.employee import Employee, EmployeeCreate, EmployeeUpdate, SearchCriteria


class EmployeeService:
    def _normalize_employee_doc(self, doc: dict) -> dict:
        """Coerce stored MongoDB document into a shape acceptable by Employee.

        - Cast _id to str
        - Ensure jobLevel matches enum values (Entry, Mid, Senior, etc.)
        - Ensure currency is a number (default to 840 for USD if invalid)
        - Ensure docType is present
        """
        if not doc:
            return doc

        if "_id" in doc and not isinstance(doc["_id"], str):
            try:
                doc["_id"] = str(doc["_id"])
            except Exception:
                pass

        # Map old job level values to new enum values if needed
        job_level_map = {
            "Entry Level": "Entry",
            "Mid Level": "Mid",
            "Senior Level": "Senior",
            "Vice President": "VP",
        }
        jl = doc.get("jobLevel")
        if isinstance(jl, str) and jl in job_level_map:
            doc["jobLevel"] = job_level_map[jl]

        # Ensure currency is a number (ISO 4217 code or just store the number)
        curr = doc.get("currency")
        if not isinstance(curr, (int, float)):
            # Default to 840 (USD ISO code) or just use 0
            doc["currency"] = 840

        if not doc.get("docType"):
            doc["docType"] = "employee"

        return doc
    async def get_employees(
        self,
        skip: int = 0,
        limit: int = 100,
        department: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[Employee]:
        db = await get_database()
        query: dict = {}
        if department:
            query["department"] = department
        if status:
            query["status"] = status

        cursor = db.employees.find(query).skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)
        docs = [self._normalize_employee_doc(d) for d in docs]
        return [Employee(**d) for d in docs]

    async def get_employee(self, employee_id: str) -> Optional[Employee]:
        db = await get_database()
        try:
            _id = ObjectId(employee_id)
        except Exception:
            return None
        doc = await db.employees.find_one({"_id": _id})
        if not doc:
            return None
        doc = self._normalize_employee_doc(doc)
        return Employee(**doc)

    async def search_employees(self, criteria: SearchCriteria) -> List[Employee]:
        db = await get_database()
        query: dict = {}

        if criteria.full_name:
            query["$or"] = [
                {"firstName": {"$regex": criteria.full_name, "$options": "i"}},
                {"lastName": {"$regex": criteria.full_name, "$options": "i"}},
                {"fullName": {"$regex": criteria.full_name, "$options": "i"}},
            ]
        if criteria.department:
            query["department"] = criteria.department
        if criteria.position:
            query["position"] = {"$regex": criteria.position, "$options": "i"}
        if criteria.status:
            query["status"] = criteria.status.value
        if criteria.manager_id:
            query["managerId"] = criteria.manager_id
        if criteria.employment_type:
            query["employmentType"] = criteria.employment_type

        cursor = db.employees.find(query)
        docs = await cursor.to_list(length=None)
        docs = [self._normalize_employee_doc(d) for d in docs]
        return [Employee(**d) for d in docs]

    async def get_direct_reports(self, employee_id: str) -> List[Employee]:
        db = await get_database()
        cursor = db.employees.find({"managerId": employee_id})
        docs = await cursor.to_list(length=None)
        docs = [self._normalize_employee_doc(d) for d in docs]
        return [Employee(**d) for d in docs]

    async def create_employee(self, employee_data: EmployeeCreate) -> Employee:
        """Create new employee."""
        db = await get_database()

        # Convert to dict and add metadata
        employee_dict = employee_data.model_dump(by_alias=True, exclude_unset=True)
        employee_dict["createdAt"] = datetime.utcnow()
        employee_dict["updatedAt"] = datetime.utcnow()

        # Ensure required system fields
        if "docType" not in employee_dict:
            employee_dict["docType"] = "employee"
        if "source" not in employee_dict:
            employee_dict["source"] = "HR"

        result = await db.employees.insert_one(employee_dict)
        employee_dict["_id"] = str(result.inserted_id)

        return Employee(**self._normalize_employee_doc(employee_dict))

    async def update_employee(self, employee_id: str, updates: EmployeeUpdate) -> Employee:
        """Update employee."""
        db = await get_database()

        try:
            _id = ObjectId(employee_id)
        except Exception:
            raise ValueError("Invalid employee ID")

        # Convert updates to dict, excluding unset fields
        update_dict = updates.model_dump(by_alias=True, exclude_unset=True)
        if not update_dict:
            # No fields to update, just return current
            return await self.get_employee(employee_id)

        update_dict["updatedAt"] = datetime.utcnow()

        result = await db.employees.update_one(
            {"_id": _id},
            {"$set": update_dict}
        )

        if result.matched_count == 0:
            raise ValueError("Employee not found")

        return await self.get_employee(employee_id)

    async def delete_employee(self, employee_id: str) -> dict:
        """Soft delete employee by setting status to Terminated."""
        db = await get_database()

        try:
            _id = ObjectId(employee_id)
        except Exception:
            raise ValueError("Invalid employee ID")

        result = await db.employees.update_one(
            {"_id": _id},
            {
                "$set": {
                    "status": "Terminated",
                    "terminationDate": datetime.utcnow().isoformat(),
                    "updatedAt": datetime.utcnow()
                }
            }
        )

        if result.matched_count == 0:
            raise ValueError("Employee not found")

        return {"status": "deleted", "employee_id": employee_id}


