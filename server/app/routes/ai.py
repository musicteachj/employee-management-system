"""AI assistant API routes (Phase 0 scaffolding).

POST /api/ai/chat streams a toolless Claude reply over SSE. Requires auth via
``get_current_user`` (unauthenticated requests get a 401 for free).
"""

import json
from typing import AsyncGenerator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.models.ai import ChatRequest
from app.models.user import UserInDB
from app.services.ai_service import AIService
from app.utils.dependencies import get_current_user

router = APIRouter()


@router.post("/ai/chat")
async def chat(
    request: ChatRequest,
    service: AIService = Depends(),
    current_user: UserInDB = Depends(get_current_user),
):
    """Stream a Claude reply token-by-token as Server-Sent Events."""

    async def event_stream() -> AsyncGenerator[str, None]:
        try:
            async for chunk in service.stream_chat(request.messages):
                yield f"data: {json.dumps({'text': chunk})}\n\n"
        except Exception as exc:  # surface errors to the client without crashing the stream
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
