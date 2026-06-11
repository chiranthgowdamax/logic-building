import struct
import sys  # noqa: E402
sys.path.insert(0, ".")
from utils.io_helpers import display_result  # noqa: E402

display_result("Size of int", f"{struct.calcsize('i')} bytes")
display_result("Size of float", f"{struct.calcsize('f')} bytes")
display_result("Size of double", f"{struct.calcsize('d')} bytes")
display_result("Size of char", f"{struct.calcsize('c')} byte")
