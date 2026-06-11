from day01.problem1.solution import format_integer


class TestFormatInteger:
    def test_positive_number(self):
        assert format_integer(42) == "You entered: 42"

    def test_zero(self):
        assert format_integer(0) == "You entered: 0"

    def test_negative_number(self):
        assert format_integer(-7) == "You entered: -7"

    def test_large_number(self):
        assert format_integer(1000000) == "You entered: 1000000"
