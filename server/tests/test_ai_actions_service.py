import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from fastapi import HTTPException

from app.services import ai_actions_service as acts


def _user():
    return SimpleNamespace(full_name="Boss McBoss")


@pytest.mark.asyncio
async def test_schedule_reviews_builds_request_with_defaults():
    with patch.object(acts, "PerformanceService") as PS:
        PS.return_value.schedule_reviews = AsyncMock(return_value={"success": True, "updatedCount": 2})
        res = await acts.execute_confirmed_action(
            "schedule_reviews", {"employee_ids": ["e1", "e2"], "review_date": "2026-08-01"}, _user()
        )
    req = PS.return_value.schedule_reviews.call_args.args[0]
    assert req.employee_ids == ["e1", "e2"] and req.review_date == "2026-08-01"
    assert req.reviewer_name == "Boss McBoss"
    assert res["updatedCount"] == 2


@pytest.mark.asyncio
async def test_bulk_assign_manager_builds_request():
    with patch.object(acts, "BulkService") as BS:
        BS.return_value.bulk_assign_manager = AsyncMock(return_value={"success": True, "updatedCount": 3})
        await acts.execute_confirmed_action(
            "bulk_assign_manager",
            {"employee_ids": ["e1"], "manager_id": "507f1f77bcf86cd799439011"},
            _user(),
        )
    req = BS.return_value.bulk_assign_manager.call_args.args[0]
    assert req.employee_ids == ["e1"]
    assert req.manager_id == "507f1f77bcf86cd799439011" and req.assignment_date


@pytest.mark.asyncio
async def test_unknown_action_400():
    with pytest.raises(HTTPException) as ei:
        await acts.execute_confirmed_action("delete_everything", {}, _user())
    assert ei.value.status_code == 400


@pytest.mark.asyncio
async def test_missing_ids_400():
    with pytest.raises(HTTPException) as ei:
        await acts.execute_confirmed_action("schedule_reviews", {"review_date": "2026-08-01"}, _user())
    assert ei.value.status_code == 400


@pytest.mark.asyncio
async def test_invalid_manager_id_returns_400():
    # A non-ObjectId manager_id must be rejected here (400), not crash bulk_assign_manager (500).
    with pytest.raises(HTTPException) as ei:
        await acts.execute_confirmed_action(
            "bulk_assign_manager", {"employee_ids": ["e1"], "manager_id": "not-a-hex-id"}, _user()
        )
    assert ei.value.status_code == 400


@pytest.mark.asyncio
async def test_too_many_employee_ids_returns_400():
    too_many = [str(i) for i in range(acts.MAX_WRITE_IDS + 1)]
    with pytest.raises(HTTPException) as ei:
        await acts.execute_confirmed_action(
            "schedule_reviews", {"employee_ids": too_many, "review_date": "2026-08-01"}, _user()
        )
    assert ei.value.status_code == 400
