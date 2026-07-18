import json

import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from app.services import ai_tools


def make_emp(**over):
    base = dict(
        id="e1", employee_id="EMP001", full_name="Jane Doe", department="Technology",
        position="Engineer", job_level="Senior", employment_type="Full-time",
        status="Active", manager_name="Boss", hire_date="2020-01-01",
        performance_rating="Meets Expectations", next_review_date="2026-01-01",
        # PII that must NOT leak:
        social_security_number="999-99-9999", salary=123456.0,
        date_of_birth="1990-01-01", personal_email="jane@home.com",
    )
    base.update(over)
    return SimpleNamespace(**base)


def test_safe_view_keeps_expected_fields():
    v = ai_tools._safe_employee_view(make_emp())
    assert v["fullName"] == "Jane Doe"
    assert v["department"] == "Technology"
    assert v["jobLevel"] == "Senior"


def test_safe_view_excludes_pii_and_salary():
    v = ai_tools._safe_employee_view(make_emp())
    for banned in (
        "salary", "social_security_number", "socialSecurityNumber", "ssn",
        "date_of_birth", "dateOfBirth", "dob", "personal_email", "personalEmail",
    ):
        assert banned not in v


def test_tool_names_now_seven():
    names = {t["name"] for t in ai_tools.TOOLS}
    assert names == {
        "search_employees", "get_workforce_analytics", "get_overdue_reviews",
        "get_direct_reports", "get_managers", "get_employee",
        "get_performance_analytics",
    }
    for t in ai_tools.TOOLS:
        assert t["description"] and t["input_schema"]["type"] == "object"


@pytest.mark.asyncio
async def test_dispatch_search_builds_criteria_and_trims():
    with patch.object(ai_tools, "EmployeeService") as ES:
        ES.return_value.search_employees = AsyncMock(return_value=[make_emp()])
        content, is_err = await ai_tools.dispatch_tool(
            "search_employees", {"department": "Technology"}
        )
    assert is_err is False
    criteria = ES.return_value.search_employees.call_args.args[0]
    assert criteria.department == "Technology"
    data = json.loads(content)
    assert data["employees"][0]["department"] == "Technology"
    assert "salary" not in data["employees"][0]


@pytest.mark.asyncio
async def test_dispatch_direct_reports_requires_id():
    content, is_err = await ai_tools.dispatch_tool("get_direct_reports", {})
    assert is_err is True
    assert "employee_id" in content


@pytest.mark.asyncio
async def test_dispatch_unknown_tool_is_error():
    content, is_err = await ai_tools.dispatch_tool("does_not_exist", {})
    assert is_err is True


@pytest.mark.asyncio
async def test_dispatch_analytics_passthrough():
    with patch.object(ai_tools, "AnalyticsService") as AS:
        AS.return_value.get_dashboard_analytics = AsyncMock(
            return_value={"totalEmployees": 42, "averageSalary": 90000}
        )
        content, is_err = await ai_tools.dispatch_tool("get_workforce_analytics", {})
    assert is_err is False
    assert json.loads(content)["totalEmployees"] == 42


@pytest.mark.asyncio
async def test_dispatch_search_escapes_regex_metacharacters():
    import re

    with patch.object(ai_tools, "EmployeeService") as ES:
        ES.return_value.search_employees = AsyncMock(return_value=[])
        await ai_tools.dispatch_tool(
            "search_employees", {"full_name": "a.*b(c", "position": "eng+"}
        )
    criteria = ES.return_value.search_employees.call_args.args[0]
    # Regex-search fields must reach the service escaped (ReDoS mitigation);
    # department (an exact match, not a regex) is left untouched.
    assert criteria.full_name == re.escape("a.*b(c")
    assert criteria.position == re.escape("eng+")


@pytest.mark.asyncio
async def test_dispatch_exception_returns_generic_message():
    with patch.object(ai_tools, "EmployeeService") as ES:
        ES.return_value.search_employees = AsyncMock(
            side_effect=Exception("mongodb://user:secret@host internal detail")
        )
        content, is_err = await ai_tools.dispatch_tool("search_employees", {"department": "X"})
    assert is_err is True
    assert "secret" not in content and "internal detail" not in content
    assert "failed to run" in content


@pytest.mark.asyncio
async def test_dispatch_get_employee_returns_safe_view():
    with patch.object(ai_tools, "EmployeeService") as ES:
        ES.return_value.get_employee = AsyncMock(return_value=make_emp())
        content, is_err = await ai_tools.dispatch_tool("get_employee", {"employee_id": "e1"})
    assert is_err is False
    emp = json.loads(content)["employee"]
    assert emp["fullName"] == "Jane Doe" and "salary" not in emp


@pytest.mark.asyncio
async def test_dispatch_get_employee_not_found():
    with patch.object(ai_tools, "EmployeeService") as ES:
        ES.return_value.get_employee = AsyncMock(return_value=None)
        content, is_err = await ai_tools.dispatch_tool("get_employee", {"employee_id": "nope"})
    assert is_err is True


@pytest.mark.asyncio
async def test_dispatch_get_managers_trims():
    with patch.object(ai_tools, "EmployeeService") as ES:
        ES.return_value.get_managers = AsyncMock(return_value=[make_emp()])
        content, is_err = await ai_tools.dispatch_tool("get_managers", {})
    assert is_err is False
    assert json.loads(content)["managers"][0]["fullName"] == "Jane Doe"
