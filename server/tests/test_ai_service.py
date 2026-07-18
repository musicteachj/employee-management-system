import pytest
from unittest.mock import MagicMock

from app.config import settings
from app.models.ai import ChatMessage
from app.services.ai_service import AIService
from tests.conftest import FakeStream, final_message, text_block, tool_use_block


async def _collect(agen):
    return "".join([e["text"] async for e in agen if e.get("type") == "text"])


async def _events(agen):
    return [e async for e in agen]


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
async def test_usage_is_accumulated_across_turns(monkeypatch):
    from types import SimpleNamespace
    svc = AIService()
    svc.client = MagicMock()
    u1 = SimpleNamespace(input_tokens=100, output_tokens=20, cache_read_input_tokens=0)
    u2 = SimpleNamespace(input_tokens=150, output_tokens=30, cache_read_input_tokens=90)
    turn1 = FakeStream([], final_message("tool_use", [tool_use_block("t1", "get_overdue_reviews", {})], usage=u1))
    turn2 = FakeStream(["done"], final_message("end_turn", [text_block("done")], usage=u2))
    svc.client.messages.stream = MagicMock(side_effect=[turn1, turn2])

    async def fake_dispatch(name, tool_input):
        return "{}", False

    monkeypatch.setattr("app.services.ai_service.dispatch_tool", fake_dispatch)

    await _collect(svc.stream_chat([ChatMessage(role="user", content="hi")]))

    assert svc.iterations == 2
    assert svc.tokens_in == 250
    assert svc.tokens_out == 50
    assert svc.cache_read == 90


@pytest.mark.asyncio
async def test_empty_messages_short_circuits():
    svc = AIService()
    svc.client = MagicMock()
    svc.client.messages.stream = MagicMock()

    out = await _collect(svc.stream_chat([]))

    assert "didn't get a question" in out
    assert svc.client.messages.stream.call_count == 0


@pytest.mark.asyncio
async def test_emits_tool_and_employees_events(monkeypatch):
    svc = AIService()
    svc.client = MagicMock()
    tu = tool_use_block("t1", "search_employees", {"department": "Engineering"})
    turn1 = FakeStream([], final_message("tool_use", [tu]))
    turn2 = FakeStream(["ok"], final_message("end_turn", [text_block("ok")]))
    svc.client.messages.stream = MagicMock(side_effect=[turn1, turn2])

    async def fake_dispatch(name, tool_input):
        return '{"count": 1, "employees": [{"id": "e1", "fullName": "Jane Doe"}]}', False

    monkeypatch.setattr("app.services.ai_service.dispatch_tool", fake_dispatch)
    events = await _events(svc.stream_chat([ChatMessage(role="user", content="hi")]))
    types = [e["type"] for e in events]
    assert "tool" in types and "employees" in types and "text" in types
    tool_ev = next(e for e in events if e["type"] == "tool")
    assert tool_ev["name"] == "search_employees"
    emp_ev = next(e for e in events if e["type"] == "employees")
    assert emp_ev["items"][0]["fullName"] == "Jane Doe"
