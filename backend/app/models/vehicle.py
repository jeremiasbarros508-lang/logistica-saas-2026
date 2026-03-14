import uuid
from sqlalchemy import String, Float, Boolean, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import ModelBase


class Vehicle(ModelBase):
    __tablename__ = "vehicles"

    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    plate: Mapped[str] = mapped_column(String(20), nullable=False)
    model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    capacity_kg: Mapped[float] = mapped_column(Float, default=1000.0, nullable=False)
    fuel_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    fuel_consumption_per_km: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationship
    company: Mapped["Company"] = relationship("Company", back_populates="vehicles")  # type: ignore[name-defined]
