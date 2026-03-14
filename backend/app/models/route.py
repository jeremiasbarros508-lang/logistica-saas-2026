import uuid
from sqlalchemy import String, Float, Integer, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import ModelBase
from app.core.constants import RouteStatus


class Route(ModelBase):
    __tablename__ = "routes"

    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default=RouteStatus.PENDING, nullable=False, index=True
    )
    total_distance_km: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    estimated_time_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    vehicle_id: Mapped[uuid.UUID | None] = mapped_column(Uuid(), nullable=True)
    driver_id: Mapped[uuid.UUID | None] = mapped_column(Uuid(), nullable=True)
    optimization_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    stops_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="routes")  # type: ignore[name-defined]
    stops: Mapped[list["RouteStop"]] = relationship(
        "RouteStop", back_populates="route", order_by="RouteStop.sequence_order", lazy="noload"
    )


class RouteStop(ModelBase):
    __tablename__ = "route_stops"

    route_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(), ForeignKey("routes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    delivery_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(), ForeignKey("deliveries.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sequence_order: Mapped[int] = mapped_column(Integer, nullable=False)
    distance_from_prev_km: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Relationships
    route: Mapped["Route"] = relationship("Route", back_populates="stops")
    delivery: Mapped["Delivery"] = relationship("Delivery", back_populates="route_stop")  # type: ignore[name-defined]
