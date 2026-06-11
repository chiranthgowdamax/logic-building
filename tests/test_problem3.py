from day01.problem3.solution import find_larger


class TestFindLarger:
    def test_second_is_larger(self):
        assert find_larger(15, 20) == 20

    def test_first_is_larger(self):
        assert find_larger(20, 15) == 20

    def test_equal_numbers(self):
        assert find_larger(10, 10) == 10

    def test_negative_numbers(self):
        assert find_larger(-5, -3) == -3

    def test_mixed_sign(self):
        assert find_larger(-10, 5) == 5

    def test_zero_and_positive(self):
        assert find_larger(0, 1) == 1

    def test_zero_and_negative(self):
        assert find_larger(0, -1) == 0

    def test_large_numbers(self):
        assert find_larger(999999, 1000000) == 1000000
