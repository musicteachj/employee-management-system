"""AI assistant models (Phase 0 scaffolding).

Phase 0 covers only a toolless streaming chat. ``AIUsageLog`` is declared here
now but is not written until Phase 2 (rate limiting + usage logging).
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ChatMessage(BaseModel):
    """A single turn in the conversation, sent from the client."""

    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    """Request body for POST /api/ai/chat. The frontend holds conversation
    history and sends the full message list each turn (backend is stateless)."""

    messages: List[ChatMessage]


class AIUsageLog(BaseModel):
    """One row per AI call, written to the ``ai_usage`` collection in Phase 2."""

    id: Optional[str] = Field(None, alias="_id")
    user_id: str = Field(..., alias="userId")
    tokens_in: int = Field(0, alias="tokensIn")
    tokens_out: int = Field(0, alias="tokensOut")
    iterations: int = Field(1, alias="iterations")
    created_at: Optional[datetime] = Field(None, alias="createdAt")

    model_config = ConfigDict(populate_by_name=True)
