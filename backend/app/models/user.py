import uuid
from sqlalchemy import String, Boolean, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import ModelBase
from app.core.constants import UserRole


class User(ModelBase):
    __tablename__ = "users"

    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        String(50), default=UserRole.OPERATOR, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="users")  # type: ignore[name-defined]
    driver: Mapped["Driver"] = relationship("Driver", back_populates="user", uselist=False, lazy="noload")  # type: ignore[name-defined]
