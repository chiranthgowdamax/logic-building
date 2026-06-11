try:
    integer = int(input("Enter an integer: "))
    print(f"You entered: {integer}")
except ValueError:
    print("Error: Please enter a valid integer.")
except EOFError:
    print("Error: No input provided.")
