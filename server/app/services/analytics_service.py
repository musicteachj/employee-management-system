"""Analytics service with full pandas-based analytics (Phase 6)."""

from datetime import datetime, timedelta
from typing import Dict, List

import pandas as pd
from dateutil.relativedelta import relativedelta

from app.database import get_database


class AnalyticsService:
    async def get_dashboard_analytics(self) -> Dict:
        """Get complete analytics dashboard data."""
        db = await get_database()
        
        # Get all employees
        cursor = db.employees.find({})
        employees = await cursor.to_list(length=None)
        
        if not employees:
            return self._empty_dashboard()
        
        df = pd.DataFrame(employees)
        
        # Filter active employees for most calculations
        active_df = df[df["status"] == "Active"] if "status" in df.columns else df
        
        # Basic counts
        total_employees = len(df)
        active_employees = len(active_df)
        total_departments = df["department"].nunique() if "department" in df.columns else 0
        
        # Average salary (active employees only)
        average_salary = float(active_df["salary"].mean()) if "salary" in active_df.columns and len(active_df) > 0 else 0
        
        # Department distribution
        department_distribution = []
        if "department" in active_df.columns and len(active_df) > 0:
            dept_counts = active_df["department"].value_counts()
            department_distribution = [
                {
                    "name": dept,
                    "count": int(count),
                    "percentage": round((count / len(active_df)) * 100)
                }
                for dept, count in dept_counts.items()
            ]
            department_distribution.sort(key=lambda x: x["count"], reverse=True)
        
        # Status distribution
        status_distribution = []
        if "status" in df.columns and len(df) > 0:
            status_counts = df["status"].value_counts()
            status_distribution = [
                {
                    "status": status,
                    "count": int(count),
                    "percentage": round((count / len(df)) * 100)
                }
                for status, count in status_counts.items()
            ]
        
        # Salary by department
        salary_by_department = []
        if "department" in active_df.columns and "salary" in active_df.columns and len(active_df) > 0:
            dept_salary = active_df.groupby("department")["salary"].agg(["mean", "count"])
            salary_by_department = [
                {
                    "department": dept,
                    "averageSalary": round(float(row["mean"])),
                    "count": int(row["count"])
                }
                for dept, row in dept_salary.iterrows()
            ]
            salary_by_department.sort(key=lambda x: x["averageSalary"], reverse=True)
        
        # Job level distribution
        job_level_distribution = []
        if "jobLevel" in active_df.columns and len(active_df) > 0:
            level_counts = active_df["jobLevel"].value_counts()
            job_level_distribution = [
                {
                    "level": level,
                    "count": int(count),
                    "percentage": round((count / len(active_df)) * 100)
                }
                for level, count in level_counts.items()
            ]
            job_level_distribution.sort(key=lambda x: x["count"], reverse=True)
        
        # Hiring trends (last 12 months)
        hiring_trends = self._calculate_hiring_trends(df)
        
        # Recent hires (last 30 days)
        recent_hires = self._get_recent_hires(df)
        
        # Top departments (top 5)
        top_departments = [
            {"name": item["name"], "count": item["count"]}
            for item in department_distribution[:5]
        ]
        
        # Employment types
        employment_types = []
        if "employmentType" in active_df.columns and len(active_df) > 0:
            type_counts = active_df["employmentType"].value_counts()
            employment_types = [
                {
                    "type": emp_type,
                    "count": int(count),
                    "percentage": round((count / len(active_df)) * 100)
                }
                for emp_type, count in type_counts.items()
            ]
            employment_types.sort(key=lambda x: x["count"], reverse=True)
        
        return {
            "totalEmployees": total_employees,
            "activeEmployees": active_employees,
            "totalDepartments": total_departments,
            "averageSalary": average_salary,
            "departmentDistribution": department_distribution,
            "statusDistribution": status_distribution,
            "salaryByDepartment": salary_by_department,
            "jobLevelDistribution": job_level_distribution,
            "hiringTrends": hiring_trends,
            "recentHires": recent_hires,
            "topDepartments": top_departments,
            "employmentTypes": employment_types
        }
    
    def _calculate_hiring_trends(self, df: pd.DataFrame) -> List[Dict]:
        """Calculate hiring trends for last 12 months."""
        if "hireDate" not in df.columns or len(df) == 0:
            return []
        
        # Initialize last 12 months
        today = datetime.now()
        hiring_trends = {}
        for i in range(11, -1, -1):
            month = today - relativedelta(months=i)
            month_key = month.strftime("%Y-%m")
            hiring_trends[month_key] = 0
        
        # Convert hireDate to datetime and count
        df_copy = df.copy()
        df_copy["hireDate"] = pd.to_datetime(df_copy["hireDate"], errors="coerce")
        df_copy = df_copy.dropna(subset=["hireDate"])
        
        for _, row in df_copy.iterrows():
            month_key = row["hireDate"].strftime("%Y-%m")
            if month_key in hiring_trends:
                hiring_trends[month_key] += 1
        
        # Format output
        result = []
        for month_key in sorted(hiring_trends.keys()):
            month_obj = datetime.strptime(month_key, "%Y-%m")
            result.append({
                "month": month_obj.strftime("%b %Y"),
                "hires": hiring_trends[month_key]
            })
        
        return result
    
    def _get_recent_hires(self, df: pd.DataFrame) -> List[Dict]:
        """Get employees hired in last 30 days."""
        if "hireDate" not in df.columns or len(df) == 0:
            return []
        
        df_copy = df.copy()
        df_copy["hireDate"] = pd.to_datetime(df_copy["hireDate"], errors="coerce")
        df_copy = df_copy.dropna(subset=["hireDate"])
        
        # Filter last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent = df_copy[df_copy["hireDate"] > thirty_days_ago]
        
        # Sort by hire date descending
        recent = recent.sort_values("hireDate", ascending=False)
        
        result = []
        for _, row in recent.iterrows():
            result.append({
                "id": str(row.get("_id", "")),
                "name": row.get("fullName", ""),
                "department": row.get("department", ""),
                "hireDate": row["hireDate"].strftime("%b %d, %Y")
            })
        
        return result
    
    def _empty_dashboard(self) -> Dict:
        """Return empty dashboard structure."""
        return {
            "totalEmployees": 0,
            "activeEmployees": 0,
            "totalDepartments": 0,
            "averageSalary": 0,
            "departmentDistribution": [],
            "statusDistribution": [],
            "salaryByDepartment": [],
            "jobLevelDistribution": [],
            "hiringTrends": [],
            "recentHires": [],
            "topDepartments": [],
            "employmentTypes": []
        }
    async def get_department_distribution(self) -> Dict:
        """Get employee distribution by department."""
        db = await get_database()
        pipeline = [
            {"$group": {"_id": "$department", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        result = await db.employees.aggregate(pipeline).to_list(length=None)
        return {
            "departments": [item.get("_id") for item in result],
            "counts": [item.get("count", 0) for item in result],
            "total": sum(item.get("count", 0) for item in result),
        }

    async def get_performance_trends(self, timeframe: str = "12months") -> Dict:
        """Get performance rating trends over time."""
        db = await get_database()
        
        # Get all employees with performance data
        cursor = db.employees.find(
            {},
            {"performanceRating": 1, "lastReviewDate": 1, "hireDate": 1}
        )
        employees = await cursor.to_list(length=None)
        
        if not employees:
            return {"timeframe": timeframe, "series": []}
        
        df = pd.DataFrame(employees)
        
        # Group by rating and count
        rating_counts = df["performanceRating"].value_counts().to_dict()
        
        return {
            "timeframe": timeframe,
            "series": [
                {"rating": rating, "count": count}
                for rating, count in rating_counts.items()
            ]
        }

    async def get_salary_analytics(self) -> Dict:
        """Get salary distribution and statistics using pandas."""
        db = await get_database()
        
        # Get all salary data
        cursor = db.employees.find(
            {},
            {"salary": 1, "department": 1, "jobLevel": 1, "status": 1}
        )
        employees = await cursor.to_list(length=None)
        
        if not employees:
            return {
                "overall": {},
                "by_department": {},
                "by_job_level": {}
            }
        
        # Use pandas for analysis
        df = pd.DataFrame(employees)
        
        # Filter to active employees only
        if "status" in df.columns:
            df = df[df["status"] == "Active"]
        
        overall_stats = {
            "mean": float(df["salary"].mean()) if len(df) > 0 else 0,
            "median": float(df["salary"].median()) if len(df) > 0 else 0,
            "min": float(df["salary"].min()) if len(df) > 0 else 0,
            "max": float(df["salary"].max()) if len(df) > 0 else 0,
            "std": float(df["salary"].std()) if len(df) > 0 else 0,
        }
        
        # By department
        by_dept = {}
        if "department" in df.columns and len(df) > 0:
            dept_stats = df.groupby("department")["salary"].agg(["mean", "count"])
            by_dept = {
                dept: {"mean": float(row["mean"]), "count": int(row["count"])}
                for dept, row in dept_stats.iterrows()
            }
        
        # By job level
        by_level = {}
        if "jobLevel" in df.columns and len(df) > 0:
            level_stats = df.groupby("jobLevel")["salary"].agg(["mean", "count"])
            by_level = {
                level: {"mean": float(row["mean"]), "count": int(row["count"])}
                for level, row in level_stats.iterrows()
            }
        
        return {
            "overall": overall_stats,
            "by_department": by_dept,
            "by_job_level": by_level
        }

    async def get_hiring_trends(self) -> Dict:
        """Get hiring trends over time."""
        db = await get_database()
        
        # Get all employees with hire dates
        cursor = db.employees.find({}, {"hireDate": 1, "status": 1})
        employees = await cursor.to_list(length=None)
        
        if not employees:
            return {"timeline": []}
        
        df = pd.DataFrame(employees)
        
        # Convert hireDate to datetime
        df["hireDate"] = pd.to_datetime(df["hireDate"], errors="coerce")
        df = df.dropna(subset=["hireDate"])
        
        # Group by year-month
        df["yearMonth"] = df["hireDate"].dt.to_period("M")
        monthly_hires = df.groupby("yearMonth").size()
        
        timeline = [
            {"period": str(period), "count": int(count)}
            for period, count in monthly_hires.items()
        ]
        
        return {"timeline": timeline}


