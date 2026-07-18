import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

from fastapi import HTTPException

from app.config import settings
from app.services import ai_usage_service as svc


def _fake_db(count=0):
    db = MagicMock()
    db.ai_usage.count_documents = AsyncMock(return_value=count)
    db.ai_usage.insert_one = AsyncMock()
    return db


def _user(email="u@example.com"):
    return SimpleNamespace(email=email)


@pytest.mark.asyncio
async def test_under_cap_passes():
    db = _fake_db(count=0)
    with patch.object(svc, "get_database", AsyncMock(return_value=db)):
        await svc.enforce_ai_rate_limit(current_user=_user())  # no raise


@pytest.mark.asyncio
async def test_over_daily_cap_raises_429():
    db = _fake_db(count=settings.ai_daily_cap)
    with patch.object(svc, "get_database", AsyncMock(return_value=db)):
        with pytest.raises(HTTPException) as ei:
            await svc.enforce_ai_rate_limit(current_user=_user())
    assert ei.value.status_code == 429


@pytest.mark.asyncio
async def test_record_writes_row_with_email_key():
    db = _fake_db()
    with patch.object(svc, "get_database", AsyncMock(return_value=db)):
        await svc.record_ai_usage("u@example.com", tokens_in=10, tokens_out=5,
                                  cache_read=3, iterations=2)
    doc = db.ai_usage.insert_one.call_args.args[0]
    assert doc["userId"] == "u@example.com"
    assert doc["tokensIn"] == 10 and doc["tokensOut"] == 5
    assert doc["cacheReadTokens"] == 3 and doc["iterations"] == 2
    assert "createdAt" in doc
