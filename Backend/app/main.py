from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.auth import get_approved_admins, verify_admin_token
from app.config import STATIC_DIR
from app.routers import admin, orders, products

app = FastAPI(
    title="Nauvaaya Atelier API",
    version="1.0.0",
    description="Backend API for Nauvaaya e-commerce and inventory operations"
)

# Explicit allowed origins for CORS (Wildcard '*' cannot be used with allow_credentials=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://nauvaaya.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # Safely permits all Vercel preview & production deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include modular routers
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/")
def read_root():
    return {"status": "online", "service": "Nauvaaya Atelier API", "docs": "/docs"}


# Re-exports for backwards compatibility
__all__ = [
    "app",
    "get_approved_admins",
    "verify_admin_token",
    "STATIC_DIR",
]
