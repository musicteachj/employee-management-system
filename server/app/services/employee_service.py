"""Employee service with minimal read operations (Phase 4).

Write operations intentionally raise NotImplementedError to be completed in
Phase 5 (Business Logic).
"""

from typing import List, Optional

from bson import ObjectId

from app.database import get_database
from app.models.employee import Employee, SearchCriteria


class EmployeeService:
    def _normalize_employee_doc(self, doc: dict) -> dict:
        """Coerce stored MongoDB document into a shape acceptable by Employee.

        - Cast _id to str
        - Map condensed jobLevel values to full enum labels
        - Ensure currency is a string (default to "USD" if invalid)
        - Ensure docType is present
        """
        if not doc:
            return doc

        if "_id" in doc and not isinstance(doc["_id"], str):
            try:
                doc["_id"] = str(doc["_id"])
            except Exception:
                pass

        job_level_map = {
            "Entry": "Entry Level",
            "Mid": "Mid Level",
            "Senior": "Senior Level",
        }
        jl = doc.get("jobLevel")
        if isinstance(jl, str) and jl in job_level_map:
            doc["jobLevel"] = job_level_map[jl]

        curr = doc.get("currency")
        if not isinstance(curr, str) or not curr:
            doc["currency"] = "USD"

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
        if criteria.status:
            query["status"] = criteria.status.value
        if criteria.manager_id:
            query["managerId"] = criteria.manager_id

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

    async def create_employee(self, *_args, **_kwargs):
        raise NotImplementedError

    async def update_employee(self, *_args, **_kwargs):
        raise NotImplementedError

    async def delete_employee(self, *_args, **_kwargs):
        raise NotImplementedError


