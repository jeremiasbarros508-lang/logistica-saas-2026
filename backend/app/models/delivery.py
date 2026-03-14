import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Text, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import ModelBase
from app.core.constants import DeliveryStatus


class Delivery(ModelBase):
    __tablename__ = "deliveries"

    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    product: Mapped[str | None] = mapped_column(String(255), nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    priority: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    time_window_start: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    time_window_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(50), default=DeliveryStatus.PENDING, nullable=False, index=True
    )
    route_id: Mapped[uuid.UUID | None] = mapped_column(Uuid(), nullable=True, index=True)
    weight_kg: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="deliveries")  # type: ignore[name-defined]
    route_stop: Mapped["RouteStop"] = relationship("RouteStop", back_populates="delivery", uselist=False, lazy="noload")  # type: ignore[name-defined]
