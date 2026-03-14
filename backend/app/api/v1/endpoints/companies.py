from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.company import CompanyRead, CompanyUpdate
from app.services import company_service
from app.utils.exceptions import AppError

router = APIRouter()


@router.get("/me", response_model=CompanyRead)
async def get_my_company(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await company_service.get_company(db, current_user.company_id)
    except AppError as e:
        raise e.to_http()


@router.put("/me", response_model=CompanyRead)
async def update_my_company(
    data: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await company_service.update_company(db, current_user.company_id, data)
    except AppError as e:
        raise e.to_http()
