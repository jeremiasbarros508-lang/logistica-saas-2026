import uuid
from sqlalchemy import String, Boolean, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import ModelBase


class Driver(ModelBase):
    __tablename__ = "drivers"

    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    license_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Relationship
    company: Mapped["Company"] = relationship("Company", back_populates="drivers")  # type: ignore[name-defined]
    user: Mapped["User"] = relationship("User", back_populates="driver")  # type: ignore[name-defined]
