"""create initial tables

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "companies",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("cnpj", sa.String(18), nullable=True, unique=True),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("address", sa.String(500), nullable=True),
        sa.Column("plan", sa.String(50), nullable=False, server_default="free"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_companies_email", "companies", ["email"])

    op.create_table(
        "subscriptions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", UUID(as_uuid=True), nullable=False),
        sa.Column("plan", sa.String(50), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="trial"),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_subscriptions_company_id", "subscriptions", ["company_id"])

    op.create_table(
        "users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), nullable=False, server_default="operator"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_company_id", "users", ["company_id"])

    op.create_table(
        "vehicles",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("plate", sa.String(20), nullable=False),
        sa.Column("model", sa.String(100), nullable=True),
        sa.Column("capacity_kg", sa.Float(), nullable=False, server_default="1000"),
        sa.Column("fuel_type", sa.String(50), nullable=True),
        sa.Column("fuel_consumption_per_km", sa.Float(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_vehicles_company_id", "vehicles", ["company_id"])

    op.create_table(
        "drivers",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("license_number", sa.String(50), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("user_id", UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_drivers_company_id", "drivers", ["company_id"])
    op.create_index("ix_drivers_user_id", "drivers", ["user_id"])

    op.create_table(
        "routes",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("total_distance_km", sa.Float(), nullable=False, server_default="0"),
        sa.Column("estimated_time_minutes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("vehicle_id", UUID(as_uuid=True), nullable=True),
        sa.Column("driver_id", UUID(as_uuid=True), nullable=True),
        sa.Column("optimization_score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("stops_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_routes_company_id", "routes", ["company_id"])
    op.create_index("ix_routes_status", "routes", ["status"])

    op.create_table(
        "deliveries",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", UUID(as_uuid=True), nullable=False),
        sa.Column("customer_name", sa.String(255), nullable=False),
        sa.Column("address", sa.String(500), nullable=False),
        sa.Column("lat", sa.Float(), nullable=True),
        sa.Column("lng", sa.Float(), nullable=True),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("product", sa.String(255), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("priority", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("time_window_start", sa.DateTime(timezone=True), nullable=True),
        sa.Column("time_window_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("route_id", UUID(as_uuid=True), nullable=True),
        sa.Column("weight_kg", sa.Float(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_deliveries_company_id", "deliveries", ["company_id"])
    op.create_index("ix_deliveries_status", "deliveries", ["status"])
    op.create_index("ix_deliveries_route_id", "deliveries", ["route_id"])

    op.create_table(
        "route_stops",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("route_id", UUID(as_uuid=True), nullable=False),
        sa.Column("delivery_id", UUID(as_uuid=True), nullable=False),
        sa.Column("sequence_order", sa.Integer(), nullable=False),
        sa.Column("distance_from_prev_km", sa.Float(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["delivery_id"], ["deliveries.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_route_stops_route_id", "route_stops", ["route_id"])
    op.create_index("ix_route_stops_delivery_id", "route_stops", ["delivery_id"])


def downgrade() -> None:
    op.drop_table("route_stops")
    op.drop_table("deliveries")
    op.drop_table("routes")
    op.drop_table("drivers")
    op.drop_table("vehicles")
    op.drop_table("users")
    op.drop_table("subscriptions")
    op.drop_table("companies")
