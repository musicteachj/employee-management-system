"""Execution of user-confirmed AI write actions (Phase 4).

The AI loop only *proposes* writes; nothing mutates until the user confirms and
the route calls execute_confirmed_action. Inputs are validated and expanded into
the real service request models here — the action name is allow-listed and every
field is validated, so a client cannot run an arbitrary or malformed write.
"""

from datetime import date

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.models.bulk_operations import BulkAssignManagerRequest
from app.models.performance import ScheduleReviewRequest
from app.models.user import UserInDB
from app.services.bulk_service import BulkService
from app.services.performance_service import PerformanceService

# A single confirmed write may touch at most this many employees.
MAX_WRITE_IDS = 200


def _is_object_id(value: str) -> bool:
    try:
        ObjectId(value)
        return True
    except (InvalidId, TypeError):
        return False


def _employee_ids(tool_input: dict) -> list:
    ids = tool_input.get("employee_ids")
    if not isinstance(ids, list) or not ids or not all(isinstance(i, str) and i for i in ids):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="employee_ids must be a non-empty list of employee ids.",
        )
    if len(ids) > MAX_WRITE_IDS:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail=f"Too many employees for one action ({len(ids)}); the limit is {MAX_WRITE_IDS}.",
        )
    return ids


async def execute_confirmed_action(action: str, tool_input: dict, current_user: UserInDB) -> dict:
    """Validate and run a user-confirmed write. Raises HTTP 400 on bad input/action."""
    tool_input = tool_input or {}

    if action == "schedule_reviews":
        ids = _employee_ids(tool_input)
        review_date = tool_input.get("review_date")
        if not review_date:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="review_date is required.")
        req = ScheduleReviewRequest(
            employee_ids=ids,
            review_date=review_date,
            reviewer_name=current_user.full_name,
            review_period_start=review_date,
            review_period_end=review_date,
        )
        return await PerformanceService().schedule_reviews(req)

    if action == "bulk_assign_manager":
        ids = _employee_ids(tool_input)
        manager_id = tool_input.get("manager_id")
        if not manager_id or not isinstance(manager_id, str) or not _is_object_id(manager_id):
            # bulk_assign_manager calls ObjectId(manager_id) unguarded, so reject a
            # malformed id here with a clean 400 rather than letting it raise a 500.
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="A valid manager_id is required.")
        req = BulkAssignManagerRequest(
            employee_ids=ids,
            manager_id=manager_id,
            assignment_date=date.today().isoformat(),
        )
        return await BulkService().bulk_assign_manager(req)

    raise HTTPException(
        status.HTTP_400_BAD_REQUEST, detail=f"Unknown or non-confirmable action: {action}"
    )
