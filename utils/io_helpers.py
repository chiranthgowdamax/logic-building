"""Common input/output helpers used across problem solutions.

These utilities encapsulate repeated patterns:
- Reading typed user input (integer, float, multiple values)
- Displaying formatted results
"""


def get_integer(prompt: str = "") -> int:
    """Read an integer from stdin with an optional prompt."""
    if prompt:
        return int(input(prompt))
    return int(input())


def get_float(prompt: str = "") -> float:
    """Read a float from stdin with an optional prompt."""
    if prompt:
        return float(input(prompt))
    return float(input())


def get_multiple_integers(prompt: str = "", count: int = 2) -> list[int]:
    """Read multiple integers from a single comma-separated input line."""
    raw = input(prompt) if prompt else input()
    parts = [s.strip() for s in raw.split(",")]
    return [int(p) for p in parts[:count]]


def display_result(label: str, value) -> None:
    """Print a result in the standard 'Label: value' format."""
    print(f"{label}: {value}")
