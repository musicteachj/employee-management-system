"""Placeholder date helper utilities (Phase 1 scaffolding)."""

from datetime import datetime


def utc_now_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


