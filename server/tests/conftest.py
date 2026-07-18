"""Shared test fakes for the AI feature (no real Anthropic or DB calls)."""

import sys
from pathlib import Path
from types import SimpleNamespace

# Make `import app...` work when pytest runs from server/.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


def tool_use_block(block_id, name, tool_input):
    return SimpleNamespace(type="tool_use", id=block_id, name=name, input=tool_input)


def text_block(text):
    return SimpleNamespace(type="text", text=text)


def final_message(stop_reason, content, usage=None):
    if usage is None:
        usage = SimpleNamespace(
            input_tokens=0, output_tokens=0, cache_read_input_tokens=0
        )
    return SimpleNamespace(stop_reason=stop_reason, content=content, usage=usage)


class FakeStream:
    """Stands in for the object returned by ``client.messages.stream(...)``.

    Acts as both the async context manager and the stream: ``__aenter__`` returns
    self, ``text_stream`` yields the given text chunks, ``get_final_message``
    returns the given final message.
    """

    def __init__(self, text_chunks, final):
        self._chunks = list(text_chunks)
        self._final = final

    async def __aenter__(self):
        return self

    async def __aexit__(self, *exc):
        return False

    @property
    def text_stream(self):
        async def _gen():
            for chunk in self._chunks:
                yield chunk

        return _gen()

    async def get_final_message(self):
        return self._final
