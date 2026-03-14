import pytest
from app.utils.validators import validate_cnpj, validate_phone, validate_coordinates
from app.utils.exceptions import ValidationError


class TestCNPJ:
    def test_valid_cnpj_formatted(self):
        result = validate_cnpj("11.222.333/0001-81")
        assert result == "11.222.333/0001-81"

    def test_valid_cnpj_digits_only(self):
        # Known valid CNPJ
        result = validate_cnpj("11222333000181")
        assert result == "11.222.333/0001-81"

    def test_invalid_cnpj_all_zeros(self):
        with pytest.raises(ValidationError):
            validate_cnpj("00000000000000")

    def test_invalid_cnpj_short(self):
        with pytest.raises(ValidationError):
            validate_cnpj("123")

    def test_invalid_cnpj_wrong_digit(self):
        with pytest.raises(ValidationError):
            validate_cnpj("11222333000100")


class TestPhone:
    def test_valid_phone(self):
        result = validate_phone("+55 (11) 99999-9999")
        assert result == "5511999999999"

    def test_valid_phone_short(self):
        result = validate_phone("12345678")
        assert result == "12345678"

    def test_invalid_phone_too_short(self):
        with pytest.raises(ValidationError):
            validate_phone("1234")

    def test_invalid_phone_too_long(self):
        with pytest.raises(ValidationError):
            validate_phone("1" * 16)


class TestCoordinates:
    def test_valid_coords(self):
        validate_coordinates(-23.5, -46.6)  # should not raise

    def test_invalid_lat_too_high(self):
        with pytest.raises(ValidationError):
            validate_coordinates(91.0, 0.0)

    def test_invalid_lat_too_low(self):
        with pytest.raises(ValidationError):
            validate_coordinates(-91.0, 0.0)

    def test_invalid_lng_too_high(self):
        with pytest.raises(ValidationError):
            validate_coordinates(0.0, 181.0)

    def test_invalid_lng_too_low(self):
        with pytest.raises(ValidationError):
            validate_coordinates(0.0, -181.0)

    def test_boundary_values(self):
        validate_coordinates(90.0, 180.0)
        validate_coordinates(-90.0, -180.0)
