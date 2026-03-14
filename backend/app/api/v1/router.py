from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    companies,
    users,
    deliveries,
    routes,
    vehicles,
    drivers,
    maps,
    dashboard,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(deliveries.router, prefix="/deliveries", tags=["Deliveries"])
api_router.include_router(routes.router, prefix="/routes", tags=["Routes"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["Vehicles"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["Drivers"])
api_router.include_router(maps.router, prefix="/maps", tags=["Maps"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
