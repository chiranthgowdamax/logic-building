import sys  # noqa: E402
sys.path.insert(0, ".")
from utils.io_helpers import get_integer, display_result  # noqa: E402

integer = get_integer()
display_result("You entered", integer)
