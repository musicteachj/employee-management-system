"""Quick connectivity check to MongoDB.

Usage:
  python -m scripts.test_db
"""

import asyncio
from app.database import connect_to_mongo, close_mongo_connection, get_database


async def main() -> int:
    await connect_to_mongo()
    try:
        db = await get_database()
        count = await db.employees.count_documents({})
        print(f"employees count: {count}")
        # Fetch one doc id to prove reads work
        doc = await db.employees.find_one({}, {"_id": 1})
        if doc:
            print(f"sample _id: {doc.get('_id')}")
        return 0
    finally:
        await close_mongo_connection()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))


