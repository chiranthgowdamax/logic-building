"""Run any problem solution from the repo root.

Usage:
    python run.py day01/problem1
    python run.py day01/problem2
    python run.py day01/problem3
"""
import importlib
import sys


def main():
    if len(sys.argv) < 2:
        print("Usage: python run.py <day/problem>")
        print("Example: python run.py day01/problem1")
        sys.exit(1)

    path = sys.argv[1].replace("/", ".").rstrip(".")
    module_name = f"{path}.solution"
    importlib.import_module(module_name)


if __name__ == "__main__":
    main()
