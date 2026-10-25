from uuid import UUID
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Order, OrderItem, OrderStatus, Product, ProductVariant
from app.notifications import send_order_email, send_whatsapp_order_msg
from app.schemas import CheckoutIn, OrderOut

router = APIRouter(prefix="/api/v1/orders", tags=["Orders"])


@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
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


@router.get("/{order_id}", response_model=OrderOut)
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

