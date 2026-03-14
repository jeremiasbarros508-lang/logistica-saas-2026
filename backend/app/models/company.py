import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import ModelBase
from app.core.constants import PlanType, SubscriptionStatus


class Company(ModelBase):
    __tablename__ = "companies"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    cnpj: Mapped[str | None] = mapped_column(String(18), unique=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address: Mapped[str | None] = mapped_column(String(500), nullable=True)
    plan: Mapped[str] = mapped_column(String(50), default=PlanType.FREE, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    users: Mapped[list] = relationship("User", back_populates="company", lazy="noload")
    deliveries: Mapped[list] = relationship("Delivery", back_populates="company", lazy="noload")
    routes: Mapped[list] = relationship("Route", back_populates="company", lazy="noload")
    vehicles: Mapped[list] = relationship("Vehicle", back_populates="company", lazy="noload")
    drivers: Mapped[list] = relationship("Driver", back_populates="company", lazy="noload")
    subscriptions: Mapped[list] = relationship("Subscription", back_populates="company", lazy="noload")


class Subscription(ModelBase):
    __tablename__ = "subscriptions"

    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    plan: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default=SubscriptionStatus.TRIAL, nullable=False
    )
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationship
    company: Mapped["Company"] = relationship("Company", back_populates="subscriptions")
