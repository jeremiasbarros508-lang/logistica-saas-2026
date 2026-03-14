import uuid
from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.route import RouteCreate, RouteRead, RouteUpdate
from app.schemas.base import PaginatedResponse
from app.services import route_service
from app.services.report_service import generate_pdf_report, generate_excel_report
from app.repositories.delivery_repo import DeliveryRepository
from app.utils.exceptions import AppError

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[RouteRead])
async def list_routes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    offset = (page - 1) * page_size
    items, total = await route_service.list_routes(db, current_user.company_id, offset=offset, limit=page_size)
    return PaginatedResponse.create(items, total, page, page_size)


@router.post("/", response_model=RouteRead, status_code=201)
async def create_route(
    data: RouteCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await route_service.create_route(db, current_user.company_id, data)
    except AppError as e:
        raise e.to_http()


@router.get("/{route_id}", response_model=RouteRead)
async def get_route(
    route_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await route_service.get_route(db, route_id, current_user.company_id)
    except AppError as e:
        raise e.to_http()


@router.put("/{route_id}/optimize", response_model=RouteRead)
async def optimize_route(
    route_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await route_service.optimize_route(db, route_id, current_user.company_id)
    except AppError as e:
        raise e.to_http()


@router.get("/{route_id}/polyline")
async def get_polyline(
    route_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        route = await route_service.get_route(db, route_id, current_user.company_id)
        delivery_repo = DeliveryRepository(db)
        coords = []
        for stop in route.stops:
            d = await delivery_repo.get(stop.delivery_id)
            if d and d.lat is not None and d.lng is not None:
                coords.append({"lat": d.lat, "lng": d.lng, "sequence": stop.sequence_order})
        return {"route_id": str(route_id), "coords": coords}
    except AppError as e:
        raise e.to_http()


@router.post("/{route_id}/export")
async def export_route(
    route_id: uuid.UUID,
    format: str = Query("pdf", pattern="^(pdf|excel)$"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        route = await route_service.get_route(db, route_id, current_user.company_id)
        delivery_repo = DeliveryRepository(db)
        deliveries = []
        for stop in route.stops:
            d = await delivery_repo.get(stop.delivery_id)
            if d:
                deliveries.append(d)

        if format == "excel":
            content = generate_excel_report(route, deliveries)
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            filename = f"route_{route_id}.xlsx"
        else:
            content = generate_pdf_report(route, deliveries)
            media_type = "application/pdf"
            filename = f"route_{route_id}.pdf"

        return Response(
            content=content,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except AppError as e:
        raise e.to_http()
