"""Seed a realistic org with hire dates across the last 3 months.

Creates employees top-down through EmployeeService.create_employee so every
record passes the canonical hierarchy validation (manager seniority, eligible
status/employment type, single CEO, no cycles) and gets a generated employeeId.

Dates are coherent with the hierarchy: the CEO is hired first (window start) and
every employee is hired strictly after their manager.

Usage (run after scripts.reset_db):
  python -m scripts.seed_employees
"""

import asyncio
import random
from datetime import date, timedelta

from app.database import connect_to_mongo, close_mongo_connection, get_database
from app.models.employee import EmployeeCreate
from app.services.employee_service import EmployeeService

random.seed(7)

# Hire-date window: the last ~3 months ending today.
WINDOW_START = date(2026, 3, 10)
TODAY = date(2026, 6, 10)

# Department -> business unit.
BUSINESS_UNIT = {
    "Executive": "Executive",
    "Engineering": "Technology",
    "Product": "Technology",
    "Sales": "Revenue",
    "Marketing": "Revenue",
    "Finance": "Operations",
    "Operations": "Operations",
    "Human Resources": "Operations",
}

CITIES = [
    ("Austin", "TX"),
    ("Denver", "CO"),
    ("Seattle", "WA"),
    ("Chicago", "IL"),
    ("Boston", "MA"),
    ("Atlanta", "GA"),
]

# (key, first, last, dept, position, level, type, status, location,
#  salary, paygrade, perf, training, bg, benefits, manager_key)
PEOPLE = [
    ("ceo", "Patricia", "Vance", "Executive", "Chief Executive Officer", "CEO",
     "Full-time", "Active", "Hybrid", 450000, "E9", "Exceeds Expectations",
     "Completed", "Completed", "Yes", None),

    ("cto", "Daniel", "Okafor", "Engineering", "Chief Technology Officer", "C-Level",
     "Full-time", "Active", "Hybrid", 330000, "E8", "Exceeds Expectations",
     "Completed", "Completed", "Yes", "ceo"),
    ("cfo", "Maria", "Santos", "Finance", "Chief Financial Officer", "C-Level",
     "Full-time", "Active", "Office", 320000, "E8", "Meets Expectations",
     "Completed", "Completed", "Yes", "ceo"),
    ("coo", "James", "Whitfield", "Operations", "Chief Operating Officer", "C-Level",
     "Full-time", "Active", "Hybrid", 325000, "E8", "Exceeds Expectations",
     "Completed", "Completed", "Yes", "ceo"),

    ("vp_eng", "Aisha", "Khan", "Engineering", "VP of Engineering", "VP",
     "Full-time", "Active", "Hybrid", 245000, "E7", "Exceeds Expectations",
     "Completed", "Completed", "Yes", "cto"),
    ("vp_prod", "Robert", "Lang", "Product", "VP of Product", "VP",
     "Full-time", "Active", "Hybrid", 240000, "E7", "Meets Expectations",
     "Completed", "Completed", "Yes", "cto"),
    ("vp_sales", "Elena", "Rossi", "Sales", "VP of Sales", "VP",
     "Full-time", "Active", "Office", 238000, "E7", "Exceeds Expectations",
     "Completed", "Completed", "Yes", "coo"),
    ("vp_people", "Marcus", "Lee", "Human Resources", "VP of People", "VP",
     "Full-time", "Active", "Hybrid", 225000, "E7", "Meets Expectations",
     "Completed", "Completed", "Yes", "coo"),

    ("dir_eng", "Priya", "Nair", "Engineering", "Director of Engineering", "Director",
     "Full-time", "Active", "Hybrid", 185000, "E6", "Exceeds Expectations",
     "Completed", "Completed", "Yes", "vp_eng"),
    ("dir_prod", "Tom", "Becker", "Product", "Director of Product", "Director",
     "Full-time", "Active", "Hybrid", 178000, "E6", "Meets Expectations",
     "Completed", "Completed", "Yes", "vp_prod"),
    ("dir_sales", "Sofia", "Mendez", "Sales", "Director of Sales", "Director",
     "Full-time", "Active", "Office", 175000, "E6", "Meets Expectations",
     "In Progress", "Completed", "Yes", "vp_sales"),
    ("dir_mktg", "Kevin", "Zhang", "Marketing", "Director of Marketing", "Director",
     "Full-time", "Active", "Remote", 172000, "E6", "Meets Expectations",
     "Completed", "Completed", "Yes", "vp_sales"),

    ("mgr_eng1", "Hannah", "Cole", "Engineering", "Engineering Manager", "Manager",
     "Full-time", "Active", "Hybrid", 145000, "E5", "Exceeds Expectations",
     "Completed", "Completed", "Yes", "dir_eng"),
    ("mgr_eng2", "Omar", "Haddad", "Engineering", "Engineering Manager", "Manager",
     "Full-time", "Active", "Remote", 142000, "E5", "Meets Expectations",
     "Completed", "Completed", "Yes", "dir_eng"),
    ("mgr_prod", "Grace", "Kim", "Product", "Product Manager", "Manager",
     "Full-time", "Active", "Hybrid", 138000, "E5", "Meets Expectations",
     "In Progress", "Completed", "Yes", "dir_prod"),
    ("mgr_sales", "Lucas", "Moreau", "Sales", "Sales Manager", "Manager",
     "Full-time", "Active", "Office", 135000, "E5", "Meets Expectations",
     "Completed", "Completed", "Yes", "dir_sales"),
    ("mgr_hr", "Nina", "Patel", "Human Resources", "HR Manager", "Manager",
     "Full-time", "Active", "Hybrid", 132000, "E5", "Meets Expectations",
     "Completed", "Completed", "Yes", "vp_people"),

    ("lead_eng", "Ethan", "Brooks", "Engineering", "Lead Engineer", "Lead",
     "Full-time", "Active", "Remote", 132000, "E5", "Meets Expectations",
     "Completed", "Completed", "Yes", "mgr_eng1"),
    ("sr_eng1", "Mia", "Tanaka", "Engineering", "Senior Engineer", "Senior",
     "Full-time", "On Leave", "Remote", 122000, "E4", "Meets Expectations",
     "Completed", "Completed", "Yes", "lead_eng"),
    ("sr_eng2", "Carlos", "Vega", "Engineering", "Senior Engineer", "Senior",
     "Contract", "Active", "Remote", 118000, "E4", "Meets Expectations",
     "In Progress", "Completed", "No", "mgr_eng2"),
    ("mid_eng", "Olivia", "Frost", "Engineering", "Software Engineer", "Mid",
     "Part-time", "Active", "Hybrid", 92000, "E3", "Meets Expectations",
     "In Progress", "Completed", "Yes", "lead_eng"),
    ("entry_eng", "Noah", "Schmidt", "Engineering", "Junior Engineer", "Entry",
     "Intern", "Active", "Office", 60000, "E1", "Unrated",
     "Not Started", "In Progress", "No", "mgr_eng1"),

    ("sr_prod", "Ava", "Nguyen", "Product", "Senior Product Analyst", "Senior",
     "Full-time", "Active", "Hybrid", 115000, "E4", "Meets Expectations",
     "Completed", "Completed", "Yes", "mgr_prod"),
    ("mid_prod", "Liam", "Walsh", "Product", "Product Analyst", "Mid",
     "Full-time", "Active", "Remote", 94000, "E3", "Meets Expectations",
     "In Progress", "Completed", "Yes", "mgr_prod"),

    ("sr_sales", "Isabella", "Conti", "Sales", "Senior Account Executive", "Senior",
     "Full-time", "Active", "Office", 112000, "E4", "Exceeds Expectations",
     "Completed", "Completed", "Yes", "mgr_sales"),
    ("mid_sales", "Jack", "Murphy", "Sales", "Account Executive", "Mid",
     "Full-time", "Active", "Office", 90000, "E3", "Meets Expectations",
     "In Progress", "Completed", "Yes", "mgr_sales"),

    ("mid_mktg", "Chloe", "Dubois", "Marketing", "Marketing Specialist", "Mid",
     "Full-time", "Active", "Remote", 88000, "E3", "Meets Expectations",
     "Completed", "Completed", "Yes", "dir_mktg"),

    ("entry_hr", "Ryan", "Cooper", "Human Resources", "HR Coordinator", "Entry",
     "Full-time", "Active", "Office", 68000, "E2", "Unrated",
     "In Progress", "Completed", "Yes", "mgr_hr"),
]


def pick_hire_date(manager_date):
    if manager_date is None:
        return WINDOW_START
    d = manager_date + timedelta(days=random.randint(3, 9))
    return min(d, TODAY)


async def main() -> int:
    await connect_to_mongo()
    service = EmployeeService()
    # key -> {id, name, email, hire}
    created = {}
    try:
        for (
            key, first, last, dept, position, level, emp_type, status, location,
            salary, paygrade, perf, training, bg, benefits, mgr_key,
        ) in PEOPLE:
            mgr = created.get(mgr_key) if mgr_key else None
            hire = pick_hire_date(mgr["hire"] if mgr else None)
            hire_str = hire.isoformat()
            full = f"{first} {last}"
            slug = f"{first.lower()}.{last.lower()}"
            city, st = CITIES[len(created) % len(CITIES)]

            payload = {
                "status": status,
                "firstName": first,
                "lastName": last,
                "fullName": full,
                "personalEmail": f"{slug}@gmail.com",
                "workEmail": f"{slug}@company.com",
                "phoneNumber": f"+1-555-{random.randint(200, 999)}-{random.randint(1000, 9999)}",
                "emergencyContactName": f"{last} Family",
                "emergencyContactPhone": f"+1-555-{random.randint(200, 999)}-{random.randint(1000, 9999)}",
                "address": f"{random.randint(100, 9999)} Main St",
                "city": city,
                "state": st,
                "country": "United States",
                "department": dept,
                "position": position,
                "jobLevel": level,
                "employmentType": emp_type,
                "workLocation": location,
                "managerId": mgr["id"] if mgr else None,
                "managerName": mgr["name"] if mgr else None,
                "businessUnit": BUSINESS_UNIT.get(dept),
                "hireDate": hire_str,
                "probationEndDate": (hire + timedelta(days=90)).isoformat(),
                "salary": float(salary),
                "currency": 840,
                "paygrade": paygrade,
                "benefitsEligible": benefits,
                "performanceRating": perf,
                "trainingStatus": training,
                "developmentNotes": f"Onboarding plan in place for {first}.",
                "nextReviewDate": (hire + timedelta(days=180)).isoformat(),
                "backgroundCheckStatus": bg,
                "docType": "employee",
                "source": "HR",
                "hrAssignment": {
                    "assignedTo": "Unassigned",
                    "assignedDate": hire_str,
                    "managerEmail": mgr["email"] if mgr else None,
                    "managerAssignDate": hire_str if mgr else None,
                },
            }

            emp = await service.create_employee(EmployeeCreate(**payload))
            created[key] = {
                "id": emp.id,
                "name": full,
                "email": payload["workEmail"],
                "hire": hire,
            }
            print(f"  {hire_str}  {level:<8} {full} ({dept})"
                  + (f" -> {mgr['name']}" if mgr else "  [org root]"))

        print(f"\nSeeded {len(created)} employees from {WINDOW_START} to {TODAY}.")
        return 0
    finally:
        await close_mongo_connection()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
