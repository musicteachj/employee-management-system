"""Validate transformed employee JSON against Pydantic models.

Usage:
  python -m scripts.validate_data path/to/employees.json
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from app.models.employee import Employee


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.validate_data <employees.json>")
        return 2

    json_path = Path(sys.argv[1])
    if not json_path.exists():
        print(f"File not found: {json_path}")
        return 2

    try:
        payload: Any = json.loads(json_path.read_text())
    except Exception as exc:
        print(f"Invalid JSON: {exc}")
        return 2

    if not isinstance(payload, list):
        print("Top-level JSON must be a list of employees")
        return 2

    valid_count = 0
    errors: list[str] = []

    for idx, item in enumerate(payload):
        try:
            Employee.model_validate(item)
            valid_count += 1
        except Exception as exc:  # Pydantic ValidationError string is informative
            errors.append(f"Index {idx}: {exc}")

    print(f"Validated {valid_count}/{len(payload)} employees")
    if errors:
        print("\nValidation errors:")
        for e in errors:
            print(f"- {e}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())


