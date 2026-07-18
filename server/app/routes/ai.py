"""AI assistant API routes.

POST /api/ai/chat streams a grounded, tool-using Claude reply over SSE. Requires
auth (``get_current_user``) and enforces per-user rate limits
(``enforce_ai_rate_limit``); one usage row is logged per call.
"""

import json
import logging
from typing import AsyncGenerator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.models.ai import ChatRequest, ConfirmActionRequest
from app.models.user import UserInDB
from app.services.ai_actions_service import execute_confirmed_action
from app.services.ai_service import AIService
from app.services.ai_usage_service import enforce_ai_rate_limit, record_ai_usage
from app.utils.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/ai/chat")
async def chat(
    request: ChatRequest,
    service: AIService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
    _rate: None = Depends(enforce_ai_rate_limit),
):
    """Stream a Claude reply token-by-token as Server-Sent Events."""

    async def event_stream() -> AsyncGenerator[str, None]:
        try:
            async for event in service.stream_chat(request.messages):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception:  # log server-side; don't leak internals to the client
            logger.exception("AI chat stream failed")
            yield f"data: {json.dumps({'type': 'error', 'message': 'The assistant hit an unexpected error. Please try again.'})}\n\n"
        finally:
            if service.iterations > 0:
                try:
                    await record_ai_usage(
                        current_user.email,
                        service.tokens_in,
                        service.tokens_out,
                        service.cache_read,
                        service.iterations,
                    )
                except Exception:  # logging must never break the response
                    logger.exception("Failed to record AI usage")
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/ai/confirm-action")
async def confirm_action(
    request: ConfirmActionRequest,
    current_user: UserInDB = Depends(get_current_user),
):
    """Execute a user-confirmed write proposal. No model call; auth required."""
    return await execute_confirmed_action(request.action, request.input, current_user)
