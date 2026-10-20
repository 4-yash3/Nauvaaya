from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles

from app.database import get_db
from app.models import Product, Order, OrderItem, ProductVariant
from app.schemas import ProductDetailOut, ProductCardOut, CheckoutIn, OrderOut
from sqlalchemy.orm import selectinload
from app.models import Product, ProductVariant, Order, OrderItem, OrderStatus

app = FastAPI(
    title="E-commerce Store API",
    version="1.0.0",
    description="Backend API for shirts catalog and inventory tracking"
)

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory so product images and videos are served
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "Static"
if not STATIC_DIR.exists():
    STATIC_DIR = BASE_DIR / "static"

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


# 1. Catalog Grid Endpoint (Homepage)
@app.get("/api/v1/products", response_model=List[ProductCardOut])
async def list_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.is_active == True).order_by(Product.name)
    )
    products = result.scalars().all()

    response = []
    for p in products:
        # Determine primary image URL
        primary_img = next((img.image_url for img in p.images if img.is_primary), None)
        if not primary_img and p.images:
            primary_img = p.images[0].image_url

        # Available sizes that have stock > 0
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

# 2. Product Detail Endpoint (by slug)
@app.get("/api/v1/products/{slug}", response_model=ProductDetailOut)
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.slug == slug, Product.is_active == True)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found"
        )
    return product

from fastapi import BackgroundTasks
from app.notifications import send_order_email, send_whatsapp_order_msg

@app.post("/api/v1/orders/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def checkout(
    payload: CheckoutIn, 
    background_tasks: BackgroundTasks,  # <-- Injected by FastAPI
    db: AsyncSession = Depends(get_db)
):
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Your cart is empty."
        )

    # Begin atomic transaction
    async with db.begin():
        calculated_total = 0.0
        order_items_to_create = []

        for item in payload.items:
            stmt = (
                select(ProductVariant)
                .where(ProductVariant.id == item.variant_id)
                .with_for_update()
            )
            res = await db.execute(stmt)
            variant = res.scalar_one_or_none()

            if not variant:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Item variant {item.variant_id} does not exist."
                )

            if variant.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for size {variant.size}. Available: {variant.stock_quantity}."
                )

            prod_res = await db.execute(
                select(Product).where(Product.id == variant.product_id)
            )
            product = prod_res.scalar_one_or_none()

            item_price = float(product.price)
            calculated_total += item_price * item.quantity
            variant.stock_quantity -= item.quantity

            order_items_to_create.append(
                OrderItem(
                    product_id=product.id,
                    variant_id=variant.id,
                    product_name=product.name,
                    size=variant.size,
                    unit_price=item_price,
                    quantity=item.quantity
                )
            )

        new_order = Order(
            customer_name=payload.customer_name,
            email=payload.email,
            phone=payload.phone,
            shipping_address=payload.shipping_address,
            city=payload.city,
            state=payload.state,
            pincode=payload.pincode,
            total_amount=calculated_total,
            status=OrderStatus.pending,
            items=order_items_to_create
        )
        db.add(new_order)
        await db.flush()
        order_id = new_order.id

    # Fetch newly created order with eager items
    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    result = await db.execute(stmt)
    saved_order = result.scalar_one()

    # Dispatch notifications in the background (Non-blocking)
    background_tasks.add_task(send_order_email, saved_order)
    background_tasks.add_task(send_whatsapp_order_msg, saved_order)

    return saved_order