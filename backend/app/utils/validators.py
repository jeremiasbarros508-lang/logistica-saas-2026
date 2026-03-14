import re
from app.utils.exceptions import ValidationError


def validate_cnpj(cnpj: str) -> str:
    """Validate and format a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica).

    Accepts both formatted (XX.XXX.XXX/XXXX-XX) and digits-only (14-digit) strings.
    Returns the CNPJ formatted as XX.XXX.XXX/XXXX-XX on success.
    Raises ValidationError if the CNPJ is structurally or algorithmically invalid.
    """
    digits = re.sub(r"\D", "", cnpj)
    if len(digits) != 14:
        raise ValidationError("CNPJ must have 14 digits")

    # Reject obvious invalid patterns
    if len(set(digits)) == 1:
        raise ValidationError("Invalid CNPJ")

    def _calc(d: str, weights: list[int]) -> int:
        total = sum(int(d[i]) * weights[i] for i in range(len(weights)))
        remainder = total % 11
        return 0 if remainder < 2 else 11 - remainder

    w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    if _calc(digits, w1) != int(digits[12]):
        raise ValidationError("Invalid CNPJ check digit")
    if _calc(digits, w2) != int(digits[13]):
        raise ValidationError("Invalid CNPJ check digit")

    return f"{digits[:2]}.{digits[2:5]}.{digits[5:8]}/{digits[8:12]}-{digits[12:]}"


def validate_phone(phone: str) -> str:
    """Validate and return cleaned phone (digits only, 8-15 chars)."""
    digits = re.sub(r"\D", "", phone)
    if not (8 <= len(digits) <= 15):
        raise ValidationError("Phone must have between 8 and 15 digits")
    return digits


def validate_coordinates(lat: float, lng: float) -> None:
    """Raise ValidationError if coordinates are out of range."""
    if not (-90.0 <= lat <= 90.0):
        raise ValidationError(f"Latitude {lat} out of range [-90, 90]")
    if not (-180.0 <= lng <= 180.0):
        raise ValidationError(f"Longitude {lng} out of range [-180, 180]")
