"""Tool definitions and dispatch for the Workforce Insights Assistant (Phase 1).

Read-only tools that call the EMS's existing services. Tool results are trimmed
to a non-sensitive "safe view" — no SSNs, dates of birth, personal contact info,
or individual salaries reach the model. Aggregate salary is available only via
get_workforce_analytics.
"""

import json
import logging
import re
from typing import Any, Dict, Tuple

from app.models.employee import SearchCriteria
from app.services.analytics_service import AnalyticsService
from app.services.employee_service import EmployeeService
from app.services.performance_service import PerformanceService

logger = logging.getLogger(__name__)

# Fields the employee service interpolates directly into a MongoDB $regex; model-
# supplied values for these are regex-escaped before use to prevent ReDoS.
_REGEX_SEARCH_FIELDS = ("full_name", "position")

# Cap list-returning tools so large result sets don't blow up context/cost.
RESULT_LIMIT = 25


def _scalar(value: Any) -> Any:
    """Coerce enums/dates to plain JSON-friendly scalars."""
    if value is None:
        return None
    if hasattr(value, "value"):  # pydantic enum
        return value.value
    if hasattr(value, "isoformat"):  # date / datetime
        return value.isoformat()
    return value


def _safe_employee_view(emp: Any) -> Dict[str, Any]:
    """Project an Employee (model or dict-like) to non-sensitive fields only."""

    def g(attr: str) -> Any:
        if isinstance(emp, dict):
            return emp.get(attr)
        return getattr(emp, attr, None)

    return {
        "id": _scalar(g("id")),
        "employeeId": _scalar(g("employee_id")),
        "fullName": _scalar(g("full_name")),
        "department": _scalar(g("department")),
        "position": _scalar(g("position")),
        "jobLevel": _scalar(g("job_level")),
        "employmentType": _scalar(g("employment_type")),
        "status": _scalar(g("status")),
        "managerName": _scalar(g("manager_name")),
        "hireDate": _scalar(g("hire_date")),
        "performanceRating": _scalar(g("performance_rating")),
        "nextReviewDate": _scalar(g("next_review_date")),
    }


# Tool JSON schemas. Descriptions are prescriptive about WHEN to call each tool
# (measured language — Sonnet 4.6 follows instructions closely).
TOOLS = [
    {
        "name": "search_employees",
        "description": (
            "Find employees by any combination of name, department, position, "
            "status, manager, employment type, or job level. Call this when the "
            "user asks to list or find specific people. All filters are optional; "
            "omit a filter to leave it unconstrained."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "full_name": {"type": "string", "description": "Full or partial name."},
                "department": {"type": "string", "description": "Exact department name."},
                "position": {"type": "string", "description": "Job title (partial ok)."},
                "status": {
                    "type": "string",
                    "enum": ["Active", "Inactive", "On Leave", "Terminated"],
                },
                "manager_id": {"type": "string", "description": "Manager's employee id."},
                "employment_type": {"type": "string", "description": "e.g. Full-time."},
                "job_level": {
                    "type": "string",
                    "description": "e.g. Entry, Mid, Senior, Lead, Manager, Director.",
                },
            },
            "additionalProperties": False,
        },
    },
    {
        "name": "get_workforce_analytics",
        "description": (
            "Aggregate workforce metrics: total/active headcount, department "
            "distribution, AVERAGE salary by department, job-level distribution, "
            "hiring trends, and recent hires. Call this for counts, distributions, "
            "trends, or any salary question (only aggregates are available)."
        ),
        "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "get_overdue_reviews",
        "description": (
            "List active employees whose next performance review date has passed, "
            "each with how many days overdue. Call this when the user asks who is "
            "overdue or behind on reviews."
        ),
        "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "get_direct_reports",
        "description": (
            "List the employees who report directly to a given employee. Call this "
            "for org-structure questions like 'who reports to X'. Requires the "
            "manager's employee id (find it first with search_employees if needed)."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "employee_id": {"type": "string", "description": "The manager's employee id."}
            },
            "required": ["employee_id"],
            "additionalProperties": False,
        },
    },
]


def _ok(payload: Any) -> Tuple[str, bool]:
    return json.dumps(payload, default=str), False


def _err(message: str) -> Tuple[str, bool]:
    return json.dumps({"error": message}), True


async def dispatch_tool(name: str, tool_input: Dict[str, Any]) -> Tuple[str, bool]:
    """Execute a tool by name. Returns (json_content, is_error).

    Errors are returned (not raised) so the loop can hand them back to Claude as
    ``tool_result`` blocks with ``is_error: true`` and let it recover.
    """
    try:
        if name == "search_employees":
            fields = {k: v for k, v in (tool_input or {}).items() if v not in (None, "")}
            for f in _REGEX_SEARCH_FIELDS:  # neutralize regex metachars -> literal substring match
                if isinstance(fields.get(f), str):
                    fields[f] = re.escape(fields[f])
            criteria = SearchCriteria(**fields)
            results = await EmployeeService().search_employees(criteria)
            trimmed = [_safe_employee_view(e) for e in results[:RESULT_LIMIT]]
            payload = {"count": len(results), "returned": len(trimmed), "employees": trimmed}
            if len(results) > RESULT_LIMIT:
                payload["note"] = f"Showing the first {RESULT_LIMIT} of {len(results)} matches."
            return _ok(payload)

        if name == "get_workforce_analytics":
            return _ok(await AnalyticsService().get_dashboard_analytics())

        if name == "get_overdue_reviews":
            rows = await PerformanceService().get_overdue_reviews()
            trimmed = rows[:RESULT_LIMIT]
            payload = {"count": len(rows), "returned": len(trimmed), "reviews": trimmed}
            if len(rows) > RESULT_LIMIT:
                payload["note"] = f"Showing the first {RESULT_LIMIT} of {len(rows)}."
            return _ok(payload)

        if name == "get_direct_reports":
            emp_id = (tool_input or {}).get("employee_id")
            if not emp_id:
                return _err("employee_id is required for get_direct_reports.")
            reports = await EmployeeService().get_direct_reports(emp_id)
            trimmed = [_safe_employee_view(e) for e in reports[:RESULT_LIMIT]]
            payload = {"count": len(reports), "returned": len(trimmed), "reports": trimmed}
            if len(reports) > RESULT_LIMIT:
                payload["note"] = f"Showing the first {RESULT_LIMIT} of {len(reports)}."
            return _ok(payload)

        return _err(f"Unknown tool: {name}")
    except Exception:  # log details server-side; hand the model a generic message
        logger.exception("AI tool %r failed", name)
        return _err(f"The {name} tool failed to run. Try rephrasing the request.")
