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

    def _job_level_rank(self, level: Optional[str]) -> int:
        order = [
            "Entry",
            "Mid",
            "Senior",
            "Lead",
            "Manager",
            "Director",
            "VP",
            "C-Level",
            "CEO",
        ]
        try:
            return order.index(level) if level in order else -1
        except Exception:
            return -1

    async def _validate_manager_constraints(self, db, employee_payload: dict, exclude_id: Optional[ObjectId] = None) -> None:
        manager_id = employee_payload.get("managerId")
        if not manager_id:
            return
        # managerId is stored as a string of the employee _id
        manager_doc = await db.employees.find_one({"_id": ObjectId(manager_id)}) if ObjectId.is_valid(manager_id) else await db.employees.find_one({"_id": manager_id})
        if not manager_doc:
            raise ValueError("Selected manager does not exist.")
        manager_status = manager_doc.get("status")
        if manager_status not in ["Active", "On Leave"]:
            raise ValueError("Manager must be Active or On Leave.")
        manager_type = manager_doc.get("employmentType")
        if manager_type not in ["Full-time", "Part-time"]:
            raise ValueError("Manager must be a Full-time or Part-time employee.")
        manager_level = manager_doc.get("jobLevel")
        employee_level = employee_payload.get("jobLevel")
        if employee_level and self._job_level_rank(manager_level) < self._job_level_rank(employee_level):
            raise ValueError("Manager's job level must not be below the employee's level.")
        # Prevent self-management and circular reporting chains. Only relevant on
        # update (on create the employee has no id yet and can't be an ancestor).
        if exclude_id is not None:
            employee_id_str = str(exclude_id)
            manager_doc_id = str(manager_doc.get("_id"))
            if manager_id == employee_id_str or manager_doc_id == employee_id_str:
                raise ValueError("An employee cannot be their own manager.")

            # Walk up the proposed manager's chain; if we reach the employee being
            # edited, this assignment would close a loop. (Equal-level reporting is
            # allowed, so a cycle is otherwise possible without this check.)
            current = manager_doc.get("managerId")
            seen = {manager_id, manager_doc_id}
            steps = 0
            while current and current not in seen and steps < 10000:
                if current == employee_id_str:
                    raise ValueError(
                        "This assignment would create a circular reporting relationship."
                    )
                seen.add(current)
                steps += 1
                node = (
                    await db.employees.find_one(
                        {"_id": ObjectId(current)}, {"managerId": 1}
                    )
                    if ObjectId.is_valid(current)
                    else await db.employees.find_one(
                        {"_id": current}, {"managerId": 1}
                    )
                )
                current = (node or {}).get("managerId")

    async def _assert_level_outranks_reports(self, db, employee_id: ObjectId, new_level: str) -> None:
        """A level change must still outrank the employee's existing direct reports."""
        new_rank = self._job_level_rank(new_level)
        cursor = db.employees.find({"managerId": str(employee_id)}, {"jobLevel": 1})
        async for rep in cursor:
            if self._job_level_rank(rep.get("jobLevel")) > new_rank:
                raise ValueError(
                    "New job level is below an existing direct report's level. "
                    "Reassign that person's reports before changing this level."
                )

    async def _clear_reports_for_terminated(self, db, employee_id: ObjectId) -> None:
        """Re-home a terminated manager's reports to the skip-level manager.

        When a manager is terminated their reports move up to the terminated
        manager's own manager (skip-level), keeping the org tree intact. If the
        terminated person had no manager (org root), the reports are detached.
        """
        manager_id_str = str(employee_id)
        terminated = await db.employees.find_one({"_id": employee_id})
        skip_manager_id = (terminated or {}).get("managerId")

        update_fields = {"managerId": None, "managerName": None}
        if skip_manager_id and ObjectId.is_valid(skip_manager_id):
            skip_manager = await db.employees.find_one({"_id": ObjectId(skip_manager_id)})
            # Only re-home to a manager who is still active.
            if skip_manager and skip_manager.get("status") in ["Active", "On Leave"]:
                update_fields = {
                    "managerId": skip_manager_id,
                    "managerName": skip_manager.get("fullName", ""),
                }

        await db.employees.update_many(
            {"managerId": manager_id_str},
            {"$set": update_fields},
        )

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
        if criteria.job_level:
            query["jobLevel"] = criteria.job_level

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

    async def get_managers(self) -> List[Employee]:
        """Get all employees who are eligible to be managers.

        A manager is identified by either:
        1. Having at least one direct report (someone points to them via managerId), or
        2. Having a manager-level job level (Manager, Director, VP, C-Level, CEO).

        In both cases they must also be Active/On Leave and Full-time/Part-time
        (the canonical eligibility rules).
        """
        db = await get_database()

        # managerId is the single source of truth for reporting relationships, so
        # derive "has reports" from it rather than the denormalized directReports
        # array (which is not maintained on write).
        ids_with_reports = await db.employees.distinct(
            "managerId", {"managerId": {"$nin": [None, ""]}}
        )
        # Stored managerIds are strings of the manager's _id; convert to ObjectId.
        object_ids_with_reports = [
            ObjectId(mid) for mid in ids_with_reports if mid and ObjectId.is_valid(mid)
        ]

        query = {
            "$or": [
                {"_id": {"$in": object_ids_with_reports}},
                {"jobLevel": {"$in": ["Manager", "Director", "VP", "C-Level", "CEO"]}},
            ],
            "status": {"$in": ["Active", "On Leave"]},
            "employmentType": {"$in": ["Full-time", "Part-time"]},
        }

        cursor = db.employees.find(query).sort("fullName", 1)
        docs = await cursor.to_list(length=None)
        docs = [self._normalize_employee_doc(d) for d in docs]
        return [Employee(**d) for d in docs]

    async def _assert_single_ceo(self, db, exclude_id: Optional[ObjectId] = None):
        query = {"jobLevel": "CEO", "status": {"$in": ["Active", "On Leave"]}}
        if exclude_id:
            query["_id"] = {"$ne": exclude_id}
        exists = await db.employees.find_one(query)
        if exists:
            raise ValueError("A CEO already exists. Only one CEO is allowed.")

    def _apply_ceo_constraints(self, payload: dict) -> dict:
        if payload.get("jobLevel") == "CEO":
            # CEO does not require a manager
            payload["managerId"] = None
            payload["managerName"] = None
            hr = payload.get("hrAssignment") or {}
            hr["managerEmail"] = None
            payload["hrAssignment"] = hr
        return payload

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

        # Auto-generate employeeId if not provided
        if "employeeId" not in employee_dict or not employee_dict["employeeId"]:
            employee_dict["employeeId"] = await self._generate_employee_id(db)

        # CEO constraints
        if employee_dict.get("jobLevel") == "CEO":
            await self._assert_single_ceo(db)
            employee_dict = self._apply_ceo_constraints(employee_dict)

        # Manager constraints
        await self._validate_manager_constraints(db, employee_dict)

        result = await db.employees.insert_one(employee_dict)
        employee_dict["_id"] = str(result.inserted_id)

        return Employee(**self._normalize_employee_doc(employee_dict))

    async def _generate_employee_id(self, db) -> str:
        """Generate a unique employee ID in format EMP001, EMP002, etc."""
        # Find the highest existing employee ID
        cursor = db.employees.find(
            {"employeeId": {"$regex": "^EMP[0-9]+$"}},
            {"employeeId": 1}
        ).sort("employeeId", -1).limit(1)
        
        docs = await cursor.to_list(length=1)
        
        if docs and docs[0].get("employeeId"):
            # Extract number from last employee ID (e.g., "EMP023" -> 23)
            last_id = docs[0]["employeeId"]
            last_num = int(last_id.replace("EMP", ""))
            next_num = last_num + 1
        else:
            # No existing employees, start at 1
            next_num = 1
        
        # Format as EMP001, EMP002, etc.
        return f"EMP{next_num:03d}"

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

        current = await db.employees.find_one({"_id": _id})
        if not current:
            raise ValueError("Employee not found")

        # CEO constraints
        if update_dict.get("jobLevel") == "CEO":
            await self._assert_single_ceo(db, exclude_id=_id)
            update_dict = self._apply_ceo_constraints(update_dict)

        # Manager constraints — validate the *effective* manager/level by merging
        # the update over the current doc, so a partial update (e.g. level only)
        # is still checked against the existing manager.
        effective = {
            "managerId": update_dict.get("managerId", current.get("managerId")),
            "jobLevel": update_dict.get("jobLevel", current.get("jobLevel")),
        }
        await self._validate_manager_constraints(db, effective, exclude_id=_id)

        # A level change must still outrank the employee's existing direct reports.
        if "jobLevel" in update_dict:
            await self._assert_level_outranks_reports(db, _id, update_dict["jobLevel"])

        # Status transitions: keep terminationDate and reports consistent.
        new_status = update_dict.get("status")
        if new_status == "Terminated":
            if not update_dict.get("terminationDate"):
                update_dict["terminationDate"] = datetime.utcnow().isoformat()
            await self._clear_reports_for_terminated(db, _id)
        elif new_status in ("Active", "On Leave", "Inactive"):
            # Reactivating: drop any stale termination date.
            update_dict["terminationDate"] = None

        # Keep reports' denormalized managerName in sync when this person renames.
        if "fullName" in update_dict and update_dict["fullName"] != current.get("fullName"):
            await db.employees.update_many(
                {"managerId": str(_id)},
                {"$set": {"managerName": update_dict["fullName"]}},
            )

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

        # Also clear this manager from any direct reports
        await self._clear_reports_for_terminated(db, _id)

        return {"status": "deleted", "employee_id": employee_id}


