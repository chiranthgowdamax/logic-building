import sys

try:
    print(f"Size of int: {sys.getsizeof(int())} bytes")
    print(f"Size of float: {sys.getsizeof(float())} bytes")
    print(f"Size of complex: {sys.getsizeof(complex())} bytes")
    print(f"Size of str (char): {sys.getsizeof(str())} bytes")
except Exception as e:
    print(f"Error: Could not determine data type sizes: {e}")
