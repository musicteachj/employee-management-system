"""AI assistant service (Phase 0 scaffolding).

Phase 0 is a toolless streaming chat that proves the Anthropic SDK, config, and
SSE plumbing work end-to-end. The agentic tool-use loop is added in Phase 1.
"""

from typing import AsyncGenerator, List

from anthropic import AsyncAnthropic

from app.config import settings
from app.models.ai import ChatMessage

SYSTEM_PROMPT = (
    "You are the Workforce Insights Assistant for an Employee Management System. "
    "You help HR managers understand their workforce. Be concise and professional. "
    "(Phase 0: you do not yet have access to any tools or live employee data.)"
)


class AIService:
    """Wraps the async Anthropic client. Instantiated per-request via FastAPI's
    ``Depends()`` (zero-arg), matching the other services in this app."""

    def __init__(self) -> None:
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    async def stream_chat(
        self, messages: List[ChatMessage]
    ) -> AsyncGenerator[str, None]:
        """Stream a toolless assistant reply, yielding text chunks as they arrive."""
        async with self.client.messages.stream(
            model=settings.ai_model,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": m.role, "content": m.content} for m in messages],
        ) as stream:
            async for text in stream.text_stream:
                yield text
