import sys  # noqa: E402
sys.path.insert(0, ".")
from utils.io_helpers import get_multiple_integers, display_result  # noqa: E402

numbers = get_multiple_integers("Enter two numbers: ", count=2)
larger = max(numbers)
display_result("The larger number is", larger)
