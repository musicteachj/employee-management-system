from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import (
    connect_to_mongo,
    close_mongo_connection,
)
from app.routes import health, employees, analytics, bulk_operations, performance


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Employee Management System API",
    description="Backend API for Employee Management System",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(employees.router, prefix="/api", tags=["employees"])
app.include_router(analytics.router, prefix="/api", tags=["analytics"])
app.include_router(bulk_operations.router, prefix="/api", tags=["bulk"])
app.include_router(performance.router, prefix="/api", tags=["performance"])


if settings.environment == "production":
    app.mount("/static", StaticFiles(directory="dist"), name="static")

    @app.get("/{path:path}")
    async def serve_spa(path: str):
        return FileResponse("dist/index.html")


