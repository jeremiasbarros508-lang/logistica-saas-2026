import io
import csv
from typing import Any

import pandas as pd


def import_from_csv(content: bytes) -> list[dict[str, Any]]:
    """Parse CSV bytes and return list of delivery dicts."""
    text = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))
    rows = []
    for row in reader:
        rows.append(_normalize_row(row))
    return rows


def import_from_excel(content: bytes) -> list[dict[str, Any]]:
    """Parse Excel bytes and return list of delivery dicts."""
    df = pd.read_excel(io.BytesIO(content), dtype=str)
    df.fillna("", inplace=True)
    rows = []
    for _, row in df.iterrows():
        rows.append(_normalize_row(row.to_dict()))
    return rows


_FIELD_MAP = {
    "nome": "customer_name",
    "name": "customer_name",
    "customer": "customer_name",
    "customer_name": "customer_name",
    "endereco": "address",
    "address": "address",
    "telefone": "phone",
    "phone": "phone",
    "produto": "product",
    "product": "product",
    "quantidade": "quantity",
    "quantity": "quantity",
    "priority": "priority",
    "prioridade": "priority",
    "observacoes": "notes",
    "notes": "notes",
    "peso_kg": "weight_kg",
    "weight_kg": "weight_kg",
}


def _normalize_row(raw: dict[str, Any]) -> dict[str, Any]:
    normalized: dict[str, Any] = {
        "customer_name": "",
        "address": "",
        "phone": None,
        "product": None,
        "quantity": 1,
        "priority": 0,
        "notes": None,
        "weight_kg": 0.0,
    }
    for raw_key, value in raw.items():
        mapped = _FIELD_MAP.get(raw_key.strip().lower().replace(" ", "_"))
        if mapped:
            if mapped in ("quantity", "priority"):
                try:
                    normalized[mapped] = int(float(str(value)))
                except (ValueError, TypeError):
                    normalized[mapped] = 0
            elif mapped == "weight_kg":
                try:
                    normalized[mapped] = float(str(value))
                except (ValueError, TypeError):
                    normalized[mapped] = 0.0
            else:
                normalized[mapped] = str(value).strip() or None
    return normalized
