import base64
import hashlib
import hmac
import os
import time
from pathlib import Path
from typing import List, Optional
from uuid import UUID, uuid4

from dotenv import load_dotenv
from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    Header,
    HTTPException,
    Query,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Order, OrderItem, OrderStatus, Product, ProductImage, ProductVariant
from app.notifications import send_order_email, send_whatsapp_order_msg
from app.schemas import CheckoutIn, OrderOut, ProductCardOut, ProductDetailOut

# ----------------------------------------------------
# 1. Environment & Directories Setup
# ----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")
load_dotenv()  # Fallback to current working directory

STATIC_DIR = BASE_DIR / "Static"
if not STATIC_DIR.exists():
    STATIC_DIR = BASE_DIR / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

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
        "https://nauvaaya.vercel.app"   # Permits Vercel preview and production domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


# ----------------------------------------------------
# 2. Admin Authentication Setup (MUST BE BEFORE ROUTES)
# ----------------------------------------------------
ADMIN_USERS_RAW = os.getenv("ADMIN_USERS", "")
ADMIN_JWT_SECRET = os.getenv("ADMIN_JWT_SECRET", "")

def get_approved_admins():
    """Parses approved admin email:password pairs from .env"""
    admins = {}
    for entry in ADMIN_USERS_RAW.split(","):
        if ":" in entry:
            email, pwd = entry.strip().split(":", 1)
            admins[email.lower()] = pwd
    return admins

async def verify_admin_token(x_admin_token: str = Header(..., description="Staff Authorization Token")):
    """Dependency protecting all admin routes via signed HMAC token."""
    try:
        parts = x_admin_token.split("|")
        if len(parts) != 3:
            raise ValueError()

        email, timestamp, signature = parts
        expected_sig = hmac.new(
            ADMIN_JWT_SECRET.encode(),
            f"{email}|{timestamp}".encode(),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(signature, expected_sig):
            raise ValueError()

        # Token valid for 24 hours (86400 seconds)
        if time.time() - int(timestamp) > 86400:
            raise HTTPException(status_code=401, detail="Session expired. Please log in again.")

        return email
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Invalid or expired admin credentials."
        )


# ----------------------------------------------------
# 3. Request / Response Pydantic Schemas
# ----------------------------------------------------
class AdminLoginIn(BaseModel):
    email: EmailStr
    password: str

class OrderStatusUpdateIn(BaseModel):
    status: OrderStatus

class StockUpdateIn(BaseModel):
    stock_quantity: int

class ProductVariantCreate(BaseModel):
    size: str
    stock_quantity: int

class ProductCreateIn(BaseModel):
    name: str
    slug: str
    description: str
    price: float
    image_url: str
    variants: List[ProductVariantCreate]

class ImageUploadIn(BaseModel):
    filename: str
    image_data: str


# ----------------------------------------------------
# 4. Public Storefront Endpoints
# ----------------------------------------------------
@app.get("/")
def read_root():
    return {"status": "online", "service": "Nauvaaya Atelier API", "docs": "/docs"}

@app.get("/api/v1/products", response_model=List[ProductCardOut])
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

@app.get("/api/v1/products/{slug}", response_model=ProductDetailOut)
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

@app.post("/api/v1/orders/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def checkout(
    payload: CheckoutIn,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Atomic inventory decrement and guest checkout creation."""
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your cart is empty."
        )

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

    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    result = await db.execute(stmt)
    saved_order = result.scalar_one()

    # Non-blocking async notification dispatch
    background_tasks.add_task(send_order_email, saved_order)
    background_tasks.add_task(send_whatsapp_order_msg, saved_order)

    return saved_order

@app.get("/api/v1/orders/{order_id}", response_model=OrderOut)
async def get_order_status(
    order_id: UUID,
    email: str = Query(..., description="Customer email address used at checkout"),
    phone: str = Query(..., description="Customer phone number used at checkout"),
    db: AsyncSession = Depends(get_db)
):
    """Secure guest lookup requiring matching order ID, email, and phone."""
    clean_email = email.strip().lower()
    clean_phone = phone.strip().replace(" ", "").replace("-", "")

    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id)
    )
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found. Please verify the order reference."
        )

    db_email = order.email.strip().lower()
    db_phone = order.phone.strip().replace(" ", "").replace("-", "")

    input_phone_digits = clean_phone[-10:] if len(clean_phone) >= 10 else clean_phone
    db_phone_digits = db_phone[-10:] if len(db_phone) >= 10 else db_phone

    if db_email != clean_email or db_phone_digits != input_phone_digits:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Authentication failed. The provided email and phone do not match this order."
        )

    return order


# ----------------------------------------------------
# 5. Protected Admin Endpoints
# ----------------------------------------------------
@app.post("/api/v1/admin/login")
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
    signature = hmac.new(
        ADMIN_JWT_SECRET.encode(),
        payload_str.encode(),
        hashlib.sha256
    ).hexdigest()

    token = f"{payload_str}|{signature}"
    return {
        "status": "success",
        "token": token,
        "admin_email": clean_email
    }

@app.get("/api/v1/admin/orders", response_model=List[OrderOut], dependencies=[Depends(verify_admin_token)])
async def admin_get_all_orders(db: AsyncSession = Depends(get_db)):
    """Fetch all orders sorted by newest first with their line items."""
    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@app.patch("/api/v1/admin/orders/{order_id}/status", response_model=OrderOut, dependencies=[Depends(verify_admin_token)])
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

@app.get("/api/v1/admin/products", dependencies=[Depends(verify_admin_token)])
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

@app.patch("/api/v1/admin/variants/{variant_id}/stock", dependencies=[Depends(verify_admin_token)])
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

@app.post("/api/v1/admin/products", status_code=status.HTTP_201_CREATED, dependencies=[Depends(verify_admin_token)])
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

@app.delete("/api/v1/admin/products/{product_id}", dependencies=[Depends(verify_admin_token)])
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

@app.post("/api/v1/admin/upload-image", dependencies=[Depends(verify_admin_token)])
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