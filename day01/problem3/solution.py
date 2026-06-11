def find_larger(a: int, b: int) -> int:
    return a if a >= b else b


if __name__ == "__main__":
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    print(f"The larger number is: {find_larger(a, b)}")
