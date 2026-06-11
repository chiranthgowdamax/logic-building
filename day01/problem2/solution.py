import sys


def get_type_sizes() -> dict[str, int]:
    return {
        "int": sys.getsizeof(0),
        "float": sys.getsizeof(0.0),
        "str": sys.getsizeof(""),
        "bool": sys.getsizeof(True),
    }


def format_type_sizes(sizes: dict[str, int]) -> str:
    lines = [f"Size of {name}: {size} bytes" for name, size in sizes.items()]
    return "\n".join(lines)


if __name__ == "__main__":
    sizes = get_type_sizes()
    print(format_type_sizes(sizes))
