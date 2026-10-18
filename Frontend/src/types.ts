export interface MediaItem {
  id?: string;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
  display_order?: number;
  media_type?: 'image' | 'video';
}

export interface Variant {
  id: string;
  size: string;
  sku: string;
  stock_quantity: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  primary_image_url?: string;
  gallery_urls?: string[];
  media?: MediaItem[];
  available_sizes: string[];
  variants?: Variant[];
  in_stock: boolean;
  category?: string;
  colors?: string[];
  tag?: string;
  description?: string;
  fabric?: string;
  artisan_technique?: string;
}

export interface CartItem {
  variant_id: string; // Required for backend atomic deduction
  product_id: string;
  name: string;
  size: string;
  price: number;
  image_url: string;
  quantity: number;
  max_stock: number;
}

export interface CheckoutFormData {
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItemConfirmation {
  id: string;
  product_name: string;
  size: string;
  unit_price: number;
  quantity: number;
}

export interface OrderConfirmation {
  id: string;
  customer_name: string;
  email: string;
  total_amount: number;
  status: string;
  items: OrderItemConfirmation[];
}

