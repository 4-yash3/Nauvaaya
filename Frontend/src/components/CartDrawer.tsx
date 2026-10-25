import React from 'react';
import { ShoppingBag, X, Minus, Plus, ArrowRight } from 'lucide-react';
import type { CartItem } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartItemCount: number;
  cartTotal: number;
  onUpdateQuantity: (variantId: string, delta: number) => void;
  onCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  cartItemCount,
  cartTotal,
  onUpdateQuantity,
  onCheckout,
  onExplore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#fcfbf9] h-full shadow-2xl flex flex-col justify-between p-6 border-l border-[#e4dcce]">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#e6dfd5]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#965438]" />
            <h3 className="font-serif text-xl tracking-tight">Your Bag ({cartItemCount})</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:text-[#965438] transition cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-[#736b63]">
              <p className="font-serif text-lg">Your bag is currently empty.</p>
              <p className="text-xs mt-1">Explore our shirts and add your favorites.</p>
              <button 
                onClick={onExplore}
                className="mt-5 inline-block bg-[#965438] text-white text-xs uppercase tracking-[0.2em] font-medium px-5 py-2.5 hover:bg-[#80442c] transition cursor-pointer"
              >
                EXPLORE SHIRTS
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.variant_id} className="flex gap-4 pb-4 border-b border-[#f0eae1]">
                <img src={getImageUrl(item.image_url)} alt={item.name} className="w-20 h-24 object-cover bg-[#e9e2d8]" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-[#736b63] mt-0.5">Size: <span className="font-semibold text-[#28221e]">{item.size}</span></p>
                    <p className="text-xs font-normal text-[#28221e] mt-1">₹ {item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => onUpdateQuantity(item.variant_id, -1)}
                      className="w-6 h-6 border border-[#d2c7bd] flex items-center justify-center hover:bg-black hover:text-white transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.variant_id, 1)}
                      className="w-6 h-6 border border-[#d2c7bd] flex items-center justify-center hover:bg-black hover:text-white transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="pt-4 border-t border-[#e6dfd5] space-y-4">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-[#736b63] uppercase tracking-wider text-xs">Subtotal</span>
              <span className="font-serif text-xl font-bold">₹ {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[11px] text-[#736b63]">Taxes and shipping calculated at checkout.</p>
            <button 
              onClick={onCheckout}
              className="w-full bg-[#965438] text-white py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#80442c] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

