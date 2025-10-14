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
from app.routes import health, employees, analytics, bulk_operations, performance, auth


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
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(employees.router, prefix="/api", tags=["employees"])
app.include_router(analytics.router, prefix="/api", tags=["analytics"])
app.include_router(bulk_operations.router, prefix="/api", tags=["bulk"])
app.include_router(performance.router, prefix="/api", tags=["performance"])


if settings.environment == "production":
    from pathlib import Path
    
    # Serve static assets explicitly
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    
    # Catch-all route for SPA (must be LAST)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the Vue.js SPA for all non-API routes."""
        # If requesting a file with extension, try to serve it from dist
        if "." in full_path.split("/")[-1]:
            file_path = Path("dist") / full_path
            if file_path.is_file():
                return FileResponse(file_path)
        
        # For all other paths (Vue routes), serve index.html
        return FileResponse("dist/index.html")


