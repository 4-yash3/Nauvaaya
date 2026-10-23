from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from pydantic import EmailStr

class VariantOut(BaseModel):
    id: UUID
    size: str
    sku: str
    stock_quantity: int

    model_config = ConfigDict(from_attributes=True)

class MediaOut(BaseModel):
    id: UUID
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool
    display_order: int
    media_type: str  # 'image' or 'video'

    model_config = ConfigDict(from_attributes=True)

class ProductDetailOut(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    is_active: bool
    variants: List[VariantOut] = []
    images: List[MediaOut] = []  # Returns all 4 images + 1 video

    model_config = ConfigDict(from_attributes=True)

# Lightweight summary response (for the homepage catalog grid)
class ProductCardOut(BaseModel):
    id: UUID
    name: str
    slug: str
    price: float
    primary_image_url: Optional[str] = None
    available_sizes: List[str] = []
    in_stock: bool

    model_config = ConfigDict(from_attributes=True)


class CartItemIn(BaseModel):
    variant_id: UUID
    quantity: int

class CheckoutIn(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    shipping_address: str
    city: str
    state: str
    pincode: str
    items: List[CartItemIn]

class OrderItemOut(BaseModel):
    id: UUID
    product_name: str
    size: str
    unit_price: float
    quantity: int

    model_config = ConfigDict(from_attributes=True)

class OrderOut(BaseModel):
    id: UUID
    customer_name: str
    email: str
    phone: Optional[str] = None
    shipping_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    total_amount: float
    status: str
    created_at: Optional[datetime] = None
    items: List[OrderItemOut]

    model_config = ConfigDict(from_attributes=True)