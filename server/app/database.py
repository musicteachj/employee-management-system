"""Database connection placeholders.

This module provides no-op async functions so the app can run without a
MongoDB instance during Phase 1. Real connections will be added later.
"""

from typing import Any


class Database:
    client: Any = None


db = Database()


async def get_database() -> Any:
    """Return a placeholder database-like object.

    In Phase 1, we return a minimal stub so importers can depend on the
    function without requiring a live MongoDB.
    """

    class _StubDB:
        def __getattr__(self, name: str) -> Any:
            raise RuntimeError(
                "Database is not configured. Add MongoDB in later phases."
            )

    return _StubDB()


async def connect_to_mongo() -> None:
    """No-op connect placeholder for Phase 1."""
    return None


async def close_mongo_connection() -> None:
    """No-op close placeholder for Phase 1."""
    return None


async def create_indexes() -> None:
    """No-op index creation placeholder for Phase 1."""
    return None


