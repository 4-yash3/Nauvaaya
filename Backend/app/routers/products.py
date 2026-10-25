from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Product
from app.schemas import ProductCardOut, ProductDetailOut

router = APIRouter(prefix="/api/v1/products", tags=["Products"])


@router.get("", response_model=List[ProductCardOut])
@router.get("/", response_model=List[ProductCardOut], include_in_schema=False)
async def list_products(db: AsyncSession = Depends(get_db)):
    """Catalog Grid Endpoint with eager loaded images and variants."""
    stmt = (
        select(Product)
        .options(selectinload(Product.images), selectinload(Product.variants))
        .where(Product.is_active == True)
        .order_by(Product.name)
    )
    result = await db.execute(stmt)
    products = result.scalars().all()

    response = []
    for p in products:
        primary_img = next((img.image_url for img in p.images if img.is_primary), None)
        if not primary_img and p.images:
            primary_img = p.images[0].image_url

        available_sizes = [v.size for v in p.variants if v.stock_quantity > 0]
        has_stock = any(v.stock_quantity > 0 for v in p.variants)

        response.append(ProductCardOut(
            id=p.id,
            name=p.name,
            slug=p.slug,
            price=float(p.price),
            primary_image_url=primary_img,
            available_sizes=available_sizes,
            in_stock=has_stock
        ))
    return response


@router.get("/{slug}", response_model=ProductDetailOut)
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Product Detail Page lookup by slug."""
    stmt = (
        select(Product)
        .options(selectinload(Product.images), selectinload(Product.variants))
        .where(Product.slug == slug, Product.is_active == True)
    )
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found"
        )
    return product

