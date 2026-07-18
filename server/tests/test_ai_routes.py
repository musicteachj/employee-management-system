from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.database import db as mongo_db
from app.main import app
from app.models.user import UserInDB
from app.services.ai_service import AIService
from app.utils.dependencies import get_current_user


def test_missing_auth_header_returns_403():
    client = TestClient(app)
    r = client.post("/api/ai/chat", json={"messages": [{"role": "user", "content": "hi"}]})
    assert r.status_code == 403


def test_bad_token_returns_401(monkeypatch):
    # `TestClient(app)` is used without a `with` block (see module docstring
    # above), so the app's lifespan never runs and `db.client` stays None.
    # `get_current_user` declares `db: AsyncIOMotorDatabase = Depends(get_database)`
    # as a sibling of `credentials` — FastAPI resolves *all* of a dependant's
    # parameters before the function body runs, so `get_database()` is invoked
    # (and raises `RuntimeError`) even on the bad-token path, which never
    # actually reads `db`. Stub a truthy client so dependency resolution
    # succeeds and the token-validation logic actually executes.
    monkeypatch.setattr(mongo_db, "client", MagicMock())
    client = TestClient(app)
    r = client.post(
        "/api/ai/chat",
        headers={"Authorization": "Bearer not-a-real-token"},
        json={"messages": [{"role": "user", "content": "hi"}]},
    )
    assert r.status_code == 401


def test_authenticated_request_streams_sse(monkeypatch):
    async def fake_stream_chat(self, messages):
        yield "Hello "
        yield "world"

    monkeypatch.setattr(AIService, "stream_chat", fake_stream_chat)
    app.dependency_overrides[get_current_user] = lambda: UserInDB(
        email="test@example.com", hashed_password="x", full_name="Test"
    )
    try:
        client = TestClient(app)
        r = client.post(
            "/api/ai/chat", json={"messages": [{"role": "user", "content": "hi"}]}
        )
    finally:
        app.dependency_overrides.clear()

    assert r.status_code == 200
    assert "Hello " in r.text
    assert "world" in r.text
    assert "[DONE]" in r.text
