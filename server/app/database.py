"""MongoDB connection management using Motor (Phase 3)."""

from typing import Optional
import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings


class Database:
    client: Optional[AsyncIOMotorClient] = None


db = Database()


async def get_database() -> AsyncIOMotorDatabase:
    if not db.client:
        raise RuntimeError("MongoDB client is not initialized. Call connect_to_mongo() first.")
    return db.client[settings.database_name]


async def connect_to_mongo() -> None:
    """Create and test database connection."""
    try:
        db.client = AsyncIOMotorClient(settings.mongodb_url)
        # Test connection
        await db.client.admin.command("ping")
        logging.info("Connected to MongoDB")
    except Exception as exc:
        logging.error(f"Could not connect to MongoDB: {exc}")
        raise


async def close_mongo_connection() -> None:
    """Close database connection."""
    if db.client:
        db.client.close()
        logging.info("Disconnected from MongoDB")


