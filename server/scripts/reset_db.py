"""Reset the database to a clean slate.

Clears the `employees` and `users` collections, then re-seeds the single default
login account so the app remains usable after the wipe. Used to rebuild the org
from scratch under the canonical hierarchy rules.

DESTRUCTIVE — removes all employees and users. Run intentionally:
  python -m scripts.reset_db
"""

import asyncio

from app.database import connect_to_mongo, close_mongo_connection, get_database
from app.models.user import UserCreate
from app.services.auth_service import create_user

# Default demo login surfaced on the client login page (Login.vue).
DEFAULT_USER = UserCreate(
    email="test@example.com",
    password="Test123!",
    full_name="Test User",
    is_admin=True,
)


async def main() -> int:
    await connect_to_mongo()
    try:
        db = await get_database()

        emp_result = await db.employees.delete_many({})
        user_result = await db.users.delete_many({})
        print(f"Deleted {emp_result.deleted_count} employees")
        print(f"Deleted {user_result.deleted_count} users")

        # Re-seed the default login account (password hashed via the app's bcrypt
        # helper so it matches authenticate_user).
        created = await create_user(db, DEFAULT_USER)
        print(f"Seeded default user: {created.email}")

        return 0
    finally:
        await close_mongo_connection()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
