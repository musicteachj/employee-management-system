import pytest
from unittest.mock import MagicMock

from app.config import settings
from app.models.ai import ChatMessage
from app.services.ai_service import AIService
from tests.conftest import FakeStream, final_message, text_block, tool_use_block


async def _collect(agen):
    return "".join([chunk async for chunk in agen])


@pytest.mark.asyncio
async def test_plain_answer_no_tools():
    svc = AIService()
    svc.client = MagicMock()
    fm = final_message("end_turn", [text_block("Hello!")])
    svc.client.messages.stream = MagicMock(return_value=FakeStream(["Hello!"], fm))

    out = await _collect(svc.stream_chat([ChatMessage(role="user", content="hi")]))

    assert "Hello!" in out
    assert svc.client.messages.stream.call_count == 1


@pytest.mark.asyncio
async def test_tool_call_then_grounded_answer(monkeypatch):
    svc = AIService()
    svc.client = MagicMock()
    turn1 = FakeStream([], final_message("tool_use", [tool_use_block("t1", "get_overdue_reviews", {})]))
    turn2 = FakeStream(["Two people are overdue."], final_message("end_turn", [text_block("Two people are overdue.")]))
    svc.client.messages.stream = MagicMock(side_effect=[turn1, turn2])

    seen = {}

    async def fake_dispatch(name, tool_input):
        seen["name"] = name
        return '{"count": 2}', False

    monkeypatch.setattr("app.services.ai_service.dispatch_tool", fake_dispatch)

    out = await _collect(svc.stream_chat([ChatMessage(role="user", content="who is overdue?")]))

    assert seen["name"] == "get_overdue_reviews"
    assert "overdue" in out
    assert svc.client.messages.stream.call_count == 2


@pytest.mark.asyncio
async def test_iteration_cap_stops_the_loop(monkeypatch):
    svc = AIService()
    svc.client = MagicMock()
    # Model asks for a tool forever.
    svc.client.messages.stream = MagicMock(
        side_effect=lambda **kw: FakeStream(
            [], final_message("tool_use", [tool_use_block("t", "get_overdue_reviews", {})])
        )
    )

    async def fake_dispatch(name, tool_input):
        return "{}", False

    monkeypatch.setattr("app.services.ai_service.dispatch_tool", fake_dispatch)

    out = await _collect(svc.stream_chat([ChatMessage(role="user", content="loop")]))

    assert svc.client.messages.stream.call_count == settings.ai_max_iterations
    assert "maximum" in out.lower()


@pytest.mark.asyncio
async def test_empty_messages_short_circuits():
    svc = AIService()
    svc.client = MagicMock()
    svc.client.messages.stream = MagicMock()

    out = await _collect(svc.stream_chat([]))

    assert "didn't get a question" in out
    assert svc.client.messages.stream.call_count == 0
