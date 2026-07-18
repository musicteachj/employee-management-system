"""AI assistant service (Phase 1): read-only agentic tool-use loop.

stream_chat runs a manual loop with the async Anthropic SDK: stream a turn; if
Claude requests tools, execute them against the EMS's existing services and feed
the results back; repeat until Claude answers (end_turn) or an iteration cap is
hit. Answer text streams to the caller token-by-token; thinking stays server-side.
"""

from typing import AsyncGenerator, List

from anthropic import AsyncAnthropic

from app.config import settings
from app.models.ai import ChatMessage
from app.services.ai_tools import TOOLS, dispatch_tool

MAX_TOKENS = 8192  # room for adaptive thinking + a concise grounded answer

SYSTEM_PROMPT = (
    "You are the Workforce Insights Assistant for an Employee Management System. "
    "You help HR managers understand their workforce by answering questions grounded "
    "in live data.\n\n"
    "Use the provided tools to look up real employee, org-structure, performance, and "
    "analytics data. Base every factual claim on tool results — never invent names, "
    "numbers, departments, or dates. If the tools don't return what's needed, say so.\n\n"
    "When to use each tool:\n"
    "- search_employees: find people by name, department, position, status, manager, "
    "employment type, or job level.\n"
    "- get_workforce_analytics: headcount, department distribution, average salary by "
    "department, hiring trends, and other aggregate metrics.\n"
    "- get_overdue_reviews: employees whose next performance review date has passed.\n"
    "- get_direct_reports: who reports to a specific employee (by their id).\n\n"
    "For multi-part questions, call several tools and combine the results.\n\n"
    "Privacy: tool results are intentionally limited to non-sensitive fields — no SSNs, "
    "dates of birth, personal contact info, or individual salaries. Salary is available "
    "only in aggregate via get_workforce_analytics. If asked for an individual's salary "
    "or other restricted personal data, explain that it isn't available to you.\n\n"
    "Keep answers concise and professional."
)


class AIService:
    """Wraps the async Anthropic client. Instantiated per-request via ``Depends()``."""

    def __init__(self) -> None:
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        # Usage accumulated across the agentic loop for this request (read by the
        # route to write an ai_usage row).
        self.tokens_in = 0
        self.tokens_out = 0
        self.cache_read = 0
        self.iterations = 0

    def _request_kwargs(self, convo: list) -> dict:
        return dict(
            model=settings.ai_model,
            max_tokens=MAX_TOKENS,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    # Cache the stable tools+system prefix for multi-turn reuse
                    # (verified in Phase 2).
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            tools=TOOLS,
            thinking={"type": "adaptive"},
            output_config={"effort": "medium"},
            messages=convo,
        )

    async def stream_chat(
        self, messages: List[ChatMessage]
    ) -> AsyncGenerator[str, None]:
        """Stream a grounded assistant reply, running tools as needed."""
        if not messages:
            yield "I didn't get a question — ask me something about your workforce."
            return
        convo: list = [{"role": m.role, "content": m.content} for m in messages]

        for _ in range(settings.ai_max_iterations):
            async with self.client.messages.stream(
                **self._request_kwargs(convo)
            ) as stream:
                async for text in stream.text_stream:
                    yield text
                final = await stream.get_final_message()

            self.iterations += 1
            usage = getattr(final, "usage", None)
            if usage is not None:
                self.tokens_in += getattr(usage, "input_tokens", 0) or 0
                self.tokens_out += getattr(usage, "output_tokens", 0) or 0
                self.cache_read += getattr(usage, "cache_read_input_tokens", 0) or 0

            if final.stop_reason != "tool_use":
                return

            tool_uses = [b for b in final.content if getattr(b, "type", None) == "tool_use"]
            if not tool_uses:  # defensive: tool_use stop but no blocks
                return

            # Preserve the full assistant turn (thinking + tool_use blocks).
            convo.append({"role": "assistant", "content": final.content})

            results = []
            for block in tool_uses:
                content, is_error = await dispatch_tool(block.name, block.input)
                results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": content,
                        "is_error": is_error,
                    }
                )
            convo.append({"role": "user", "content": results})

        yield "\n\n(I reached the maximum number of steps for this question. " \
              "Try narrowing it down.)"
