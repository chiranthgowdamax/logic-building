def format_integer(value: int) -> str:
    return f"You entered: {value}"


if __name__ == "__main__":
    integer = int(input())
    print(format_integer(integer))
