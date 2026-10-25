import base64
import hashlib
import hmac
import os
import time
from pathlib import Path
from typing import List
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth import ADMIN_JWT_SECRET, get_approved_admins, verify_admin_token
from app.config import STATIC_DIR
from app.database import get_db
from app.models import Order, Product, ProductImage, ProductVariant
from app.schemas import (
    AdminLoginIn,
    ImageUploadIn,
    OrderOut,
    OrderStatusUpdateIn,
    ProductCreateIn,
    StockUpdateIn,
)

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


@router.post("/login")
async def admin_login(payload: AdminLoginIn):
    """Authenticate approved admin credentials and return an authorized token."""
    approved_admins = get_approved_admins()
    clean_email = payload.email.strip().lower()

    if clean_email not in approved_admins or approved_admins[clean_email] != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Incorrect email or password."
        )

    timestamp = str(int(time.time()))
    payload_str = f"{clean_email}|{timestamp}"
    jwt_secret = os.getenv("ADMIN_JWT_SECRET", ADMIN_JWT_SECRET)
    signature = hmac.new(
        jwt_secret.encode(),
        payload_str.encode(),
        hashlib.sha256
    ).hexdigest()

    token = f"{payload_str}|{signature}"
    return {
        "status": "success",
        "token": token,
        "admin_email": clean_email
    }


@router.get("/orders", response_model=List[OrderOut], dependencies=[Depends(verify_admin_token)])
async def admin_get_all_orders(db: AsyncSession = Depends(get_db)):
    """Fetch all orders sorted by newest first with their line items."""
    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch("/orders/{order_id}/status", response_model=OrderOut, dependencies=[Depends(verify_admin_token)])
async def admin_update_order_status(
    order_id: UUID,
    payload: OrderStatusUpdateIn,
    db: AsyncSession = Depends(get_db)
):
    """Update order status across the fulfillment pipeline."""
    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = payload.status
    await db.commit()
    await db.refresh(order)
    return order


@router.get("/products", dependencies=[Depends(verify_admin_token)])
async def admin_get_products(db: AsyncSession = Depends(get_db)):
    """Fetch all active products with variants and stock counts for admin."""
    stmt = (
        select(Product)
        .where(Product.is_active == True)
        .options(selectinload(Product.variants), selectinload(Product.images))
        .order_by(Product.name)
    )
    result = await db.execute(stmt)
    products = result.scalars().all()
    out = []
    for p in products:
        primary_img = next((img.image_url for img in p.images if img.is_primary), None)
        if not primary_img and p.images:
            primary_img = p.images[0].image_url
        has_stock = any(v.stock_quantity > 0 for v in p.variants)
        out.append({
            "id": str(p.id),
            "name": p.name,
            "slug": p.slug,
            "description": p.description or "",
            "price": float(p.price),
            "image_url": primary_img or "",
            "in_stock": has_stock,
            "variants": [
                {"id": str(v.id), "size": v.size, "stock_quantity": v.stock_quantity}
                for v in p.variants
            ]
        })
    return out


@router.patch("/variants/{variant_id}/stock", dependencies=[Depends(verify_admin_token)])
async def admin_update_variant_stock(
    variant_id: UUID,
    payload: StockUpdateIn,
    db: AsyncSession = Depends(get_db)
):
    """Directly adjust inventory count for a specific size variant."""
    stmt = select(ProductVariant).where(ProductVariant.id == variant_id)
    res = await db.execute(stmt)
    variant = res.scalar_one_or_none()

    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")

    variant.stock_quantity = payload.stock_quantity
    await db.commit()
    return {"message": "Stock updated", "variant_id": str(variant.id), "new_stock": variant.stock_quantity}


@router.post("/products", status_code=status.HTTP_201_CREATED, dependencies=[Depends(verify_admin_token)])
async def admin_create_product(
    payload: ProductCreateIn,
    db: AsyncSession = Depends(get_db)
):
    """Add a new artisanal garment and assign size variants."""
    stmt = select(Product).where(Product.slug == payload.slug)
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A product with this slug already exists.")

    new_product = Product(
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        price=payload.price,
    )
    db.add(new_product)
    await db.flush()

    if payload.image_url:
        img = ProductImage(
            product_id=new_product.id,
            image_url=payload.image_url,
            is_primary=True,
            display_order=1,
            media_type="image"
        )
        db.add(img)

    for v in payload.variants:
        variant = ProductVariant(
            product_id=new_product.id,
            size=v.size.upper(),
            sku=f"{payload.slug.upper()[:10]}-{v.size.upper()}",
            stock_quantity=v.stock_quantity
        )
        db.add(variant)

    await db.commit()
    await db.refresh(new_product)
    return {"message": "Product created successfully", "product_id": str(new_product.id)}


@router.delete("/products/{product_id}", dependencies=[Depends(verify_admin_token)])
async def admin_delete_product(
    product_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Safely archive or delete a piece from the catalog."""
    stmt = select(Product).where(Product.id == product_id)
    res = await db.execute(stmt)
    product = res.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        await db.delete(product)
        await db.commit()
        return {"message": "Product removed successfully", "product_id": str(product_id)}
    except Exception:
        await db.rollback()
        # Soft delete if linked to historical order items
        ref_stmt = select(Product).where(Product.id == product_id)
        ref_res = await db.execute(ref_stmt)
        p = ref_res.scalar_one()
        p.is_active = False
        await db.commit()
        return {"message": "Product archived from catalog", "product_id": str(product_id)}


@router.post("/upload-image", dependencies=[Depends(verify_admin_token)])
async def admin_upload_image(payload: ImageUploadIn):
    """Upload product image file directly from admin dashboard."""
    try:
        raw_data = payload.image_data
        if "," in raw_data:
            header, encoded = raw_data.split(",", 1)
        else:
            header = ""
            encoded = raw_data

        file_bytes = base64.b64decode(encoded)

        ext = ".jpg"
        lower_name = payload.filename.lower()
        if "image/png" in header or lower_name.endswith(".png"):
            ext = ".png"
        elif "image/webp" in header or lower_name.endswith(".webp"):
            ext = ".webp"
        elif "image/gif" in header or lower_name.endswith(".gif"):
            ext = ".gif"
        elif "image/jpeg" in header or lower_name.endswith((".jpg", ".jpeg")):
            ext = ".jpg"

        upload_dir = STATIC_DIR / "uploads"
        upload_dir.mkdir(parents=True, exist_ok=True)

        clean_stem = "".join(c for c in Path(payload.filename).stem if c.isalnum() or c in "-_")[:20]
        filename = f"{uuid4().hex[:8]}_{clean_stem or 'photo'}{ext}"
        filepath = upload_dir / filename

        with open(filepath, "wb") as f:
            f.write(file_bytes)

        image_url = f"/static/uploads/{filename}"
        return {"image_url": image_url, "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image upload failed: {str(e)}")

