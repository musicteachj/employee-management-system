"""Analytics service minimal reads (Phase 4)."""

from typing import Dict

from app.database import get_database


class AnalyticsService:
    async def get_department_distribution(self) -> Dict:
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
        # Placeholder; implemented in Phase 5/4 advanced
        return {"timeframe": timeframe, "series": []}

    async def get_salary_analytics(self) -> Dict:
        # Placeholder; implemented in Phase 5/4 advanced
        return {"overall": {}, "by_department": {}, "by_job_level": {}}

    async def get_hiring_trends(self) -> Dict:
        # Placeholder; implemented in Phase 5/4 advanced
        return {"timeline": []}


