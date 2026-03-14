import io
import uuid
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer

import pandas as pd

from app.models.route import Route
from app.models.delivery import Delivery


def generate_pdf_report(route: Route, deliveries: list[Delivery]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph(f"Route Report: {route.name}", styles["Title"]))
    elements.append(Spacer(1, 12))
    elements.append(
        Paragraph(
            f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}",
            styles["Normal"],
        )
    )
    elements.append(Spacer(1, 12))

    summary_data = [
        ["Total Distance (km)", f"{route.total_distance_km:.2f}"],
        ["Estimated Time (min)", str(route.estimated_time_minutes)],
        ["Stops", str(route.stops_count)],
        ["Status", route.status],
        ["Optimization Score", f"{route.optimization_score:.1f}"],
    ]
    summary_table = Table(summary_data, colWidths=[200, 200])
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
            ]
        )
    )
    elements.append(summary_table)
    elements.append(Spacer(1, 20))

    delivery_data = [["#", "Customer", "Address", "Status", "Product"]]
    for i, d in enumerate(deliveries, 1):
        delivery_data.append(
            [str(i), d.customer_name, d.address[:40], d.status, d.product or ""]
        )

    delivery_table = Table(delivery_data, colWidths=[30, 120, 160, 80, 80])
    delivery_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563eb")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f3f4f6")]),
            ]
        )
    )
    elements.append(delivery_table)

    doc.build(elements)
    return buffer.getvalue()


def generate_excel_report(route: Route, deliveries: list[Delivery]) -> bytes:
    rows = []
    for i, d in enumerate(deliveries, 1):
        rows.append(
            {
                "Sequence": i,
                "Customer": d.customer_name,
                "Address": d.address,
                "Product": d.product or "",
                "Quantity": d.quantity,
                "Status": d.status,
                "Weight (kg)": d.weight_kg,
                "Priority": d.priority,
            }
        )

    df_deliveries = pd.DataFrame(rows)
    summary = {
        "Route Name": [route.name],
        "Total Distance (km)": [route.total_distance_km],
        "Estimated Time (min)": [route.estimated_time_minutes],
        "Stops": [route.stops_count],
        "Status": [route.status],
        "Optimization Score": [route.optimization_score],
    }
    df_summary = pd.DataFrame(summary)

    buffer = io.BytesIO()
    with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
        df_summary.to_excel(writer, sheet_name="Summary", index=False)
        df_deliveries.to_excel(writer, sheet_name="Deliveries", index=False)

    return buffer.getvalue()
