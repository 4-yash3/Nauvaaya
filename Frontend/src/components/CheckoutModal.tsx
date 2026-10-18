import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, Loader2 } from 'lucide-react';
import type { CartItem, CheckoutFormData, OrderConfirmation } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderSuccess: (order: OrderConfirmation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    email: '',
    phone: '',
    shipping_address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const payload = {
      ...formData,
      items: cart.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Checkout failed. Please check stock and try again.');
      }

      onOrderSuccess(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FAF7F2] border border-[#E0D5C7] max-w-xl w-full p-6 md:p-8 shadow-2xl relative my-8 animate-fadeIn">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-black transition cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#965438] font-semibold">
            SECURE CHECKOUT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#965438]" />
          <span className="text-[10px] uppercase tracking-wider text-stone-500 flex items-center gap-1 font-mono">
            <Lock className="w-2.5 h-2.5" /> 256-BIT ENCRYPTED
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#28221e] mb-2">Shipping & Order Details</h2>
        <p className="text-xs text-stone-600 mb-5 font-light">
          Please provide your delivery destination. Inventory is reserved upon order confirmation.
        </p>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 rounded-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Order Items Mini Summary */}
        <div className="mb-5 p-3.5 bg-white/70 border border-[#E0D5C7] divide-y divide-[#E0D5C7]/50 max-h-36 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.variant_id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-8 h-10 object-cover bg-stone-200 border border-[#E0D5C7]" 
                />
                <div>
                  <span className="font-medium text-[#28221e] block">{item.name}</span>
                  <span className="text-[11px] text-stone-500">Size: <strong className="text-[#965438]">{item.size}</strong> × {item.quantity}</span>
                </div>
              </div>
              <span className="font-serif text-stone-900 font-semibold">
                ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="customer_name"
              required
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full border border-[#D5C7BB] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#965438] placeholder:text-stone-400 text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full border border-[#D5C7BB] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#965438] placeholder:text-stone-400 text-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full border border-[#D5C7BB] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#965438] placeholder:text-stone-400 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
              Shipping Address *
            </label>
            <textarea
              name="shipping_address"
              required
              rows={2}
              value={formData.shipping_address}
              onChange={handleChange}
              placeholder="Apartment, Street address, Area"
              className="w-full border border-[#D5C7BB] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#965438] placeholder:text-stone-400 text-stone-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Jaipur"
                className="w-full border border-[#D5C7BB] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#965438] placeholder:text-stone-400 text-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="Rajasthan"
                className="w-full border border-[#D5C7BB] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#965438] placeholder:text-stone-400 text-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                required
                pattern="[0-9]{6}"
                title="6-digit Indian Pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="302001"
                className="w-full border border-[#D5C7BB] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#965438] placeholder:text-stone-400 text-stone-900 font-mono"
              />
            </div>
          </div>

          {/* Cart Summary & Submit */}
          <div className="border-t border-[#E0D5C7] pt-4 mt-6">
            <div className="flex justify-between items-baseline mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-stone-600 block">Total Payable</span>
                <span className="text-[11px] text-stone-500 font-light">Free delivery & taxes included</span>
              </div>
              <span className="font-serif text-2xl font-semibold text-[#28221e]">
                ₹ {totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-[#965438] text-white py-3.5 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#80442c] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>DEDUCTING STOCK & RESERVING...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>CONFIRM & PLACE ORDER</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
