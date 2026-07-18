"""Per-user rate limiting and usage logging for the AI assistant (Phase 2).

Rate limits are enforced by counting recent rows in the ``ai_usage`` collection
for the caller (keyed by email, since UserInDB carries no id). Rows are written
only after a successful streamed answer, so failed calls don't consume quota.
"""

from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status

from app.config import settings
from app.database import get_database
from app.models.user import UserInDB
from app.utils.dependencies import get_current_user

_DAILY_WINDOW = timedelta(days=1)
_MONTHLY_WINDOW = timedelta(days=30)


async def _count_since(db, user_key: str, since: datetime) -> int:
    return await db.ai_usage.count_documents(
        {"userId": user_key, "createdAt": {"$gte": since}}
    )


async def enforce_ai_rate_limit(
    current_user: UserInDB = Depends(get_current_user),
) -> None:
    """FastAPI dependency: 429 when the caller is over their daily/monthly cap.

    Runs before the endpoint body so the client gets a clean HTTP 429 instead of
    a mid-stream error.
    """
    db = await get_database()
    now = datetime.utcnow()
    key = current_user.email

    if await _count_since(db, key, now - _DAILY_WINDOW) >= settings.ai_daily_cap:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Daily AI request limit reached. Please try again later.",
        )
    if await _count_since(db, key, now - _MONTHLY_WINDOW) >= settings.ai_monthly_cap:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Monthly AI request limit reached.",
        )


async def record_ai_usage(
    user_key: str, tokens_in: int, tokens_out: int, cache_read: int, iterations: int
) -> None:
    """Write one ai_usage row for a completed AI call."""
    db = await get_database()
    await db.ai_usage.insert_one(
        {
            "userId": user_key,
            "tokensIn": tokens_in,
            "tokensOut": tokens_out,
            "cacheReadTokens": cache_read,
            "iterations": iterations,
            "createdAt": datetime.utcnow(),
        }
    )
