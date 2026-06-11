try:
    num1 = int(input("Enter first number: "))
    num2 = int(input("Enter second number: "))

    if num1 > num2:
        print(f"The larger number is: {num1}")
    elif num2 > num1:
        print(f"The larger number is: {num2}")
    else:
        print(f"Both numbers are equal: {num1}")
except ValueError:
    print("Error: Please enter valid integers.")
except EOFError:
    print("Error: No input provided.")
