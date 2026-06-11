import sys

from day01.problem2.solution import format_type_sizes, get_type_sizes


class TestGetTypeSizes:
    def test_returns_dict_with_expected_keys(self):
        sizes = get_type_sizes()
        assert set(sizes.keys()) == {"int", "float", "str", "bool"}

    def test_all_values_are_positive_ints(self):
        sizes = get_type_sizes()
        for value in sizes.values():
            assert isinstance(value, int)
            assert value > 0

    def test_int_size_matches_sys(self):
        sizes = get_type_sizes()
        assert sizes["int"] == sys.getsizeof(0)

    def test_float_size_matches_sys(self):
        sizes = get_type_sizes()
        assert sizes["float"] == sys.getsizeof(0.0)

    def test_str_size_matches_sys(self):
        sizes = get_type_sizes()
        assert sizes["str"] == sys.getsizeof("")

    def test_bool_size_matches_sys(self):
        sizes = get_type_sizes()
        assert sizes["bool"] == sys.getsizeof(True)


class TestFormatTypeSizes:
    def test_format_single_entry(self):
        result = format_type_sizes({"int": 28})
        assert result == "Size of int: 28 bytes"

    def test_format_multiple_entries(self):
        sizes = {"int": 28, "float": 24}
        result = format_type_sizes(sizes)
        assert "Size of int: 28 bytes" in result
        assert "Size of float: 24 bytes" in result

    def test_format_empty_dict(self):
        result = format_type_sizes({})
        assert result == ""
