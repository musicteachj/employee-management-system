"""Analytics service with full pandas-based analytics (Phase 5)."""

from datetime import datetime, timedelta
from typing import Dict

import pandas as pd

from app.database import get_database


class AnalyticsService:
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


