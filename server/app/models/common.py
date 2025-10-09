"""Common/shared models (Phase 1 scaffolding)."""

from pydantic import BaseModel


class Message(BaseModel):
    message: str


