import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Home, 
  ChevronLeft, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Lock 
} from 'lucide-react';
import type { OrderDetails } from '../types';

interface OrderStatusPageProps {
  orderId: string;
  initialEmail?: string;
  initialPhone?: string;
  onBackToStore?: () => void;
}

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed & Cut', icon: CheckCircle2 },
  { key: 'dispatched', label: 'In Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

export const OrderStatusPage: React.FC<OrderStatusPageProps> = ({ 
  orderId, 
  initialEmail = '', 
  initialPhone = '', 
  onBackToStore 
}) => {
  // Read params from URL search if props aren't provided
  const queryParams = new URLSearchParams(window.location.search);
  const queryOrderId = queryParams.get('order_id') || queryParams.get('order') || '';
  const initialResolvedOrderId = orderId || queryOrderId;

  const [inputOrderId, setInputOrderId] = useState<string>(initialResolvedOrderId);
  const [email, setEmail] = useState<string>(initialEmail || queryParams.get('email') || '');
  const [phone, setPhone] = useState<string>(initialPhone || queryParams.get('phone') || '');

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  const fetchOrderDetails = async (verifyEmail: string, verifyPhone: string, targetOrderId?: string) => {
    const idToFetch = (targetOrderId || inputOrderId || initialResolvedOrderId).trim();
    if (!verifyEmail || !verifyPhone || !idToFetch) {
      setNeedsVerification(true);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setNeedsVerification(false);

      const url = `http://127.0.0.1:8000/api/v1/orders/${idToFetch}?email=${encodeURIComponent(verifyEmail.trim())}&phone=${encodeURIComponent(verifyPhone.trim())}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 || res.status === 404) {
          setNeedsVerification(true);
        }
        throw new Error(data.detail || 'Could not verify order credentials.');
      }

      setOrder(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to retrieve order status.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialResolvedOrderId) {
      fetchOrderDetails(email, phone, initialResolvedOrderId);
    } else {
      setNeedsVerification(true);
    }
  }, [initialResolvedOrderId]);

  const handleManualVerification = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderDetails(email, phone, inputOrderId);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-[#2C2420]">
        <Loader2 className="w-8 h-8 animate-spin text-[#965438] mb-3" />
        <p className="text-xs uppercase tracking-widest text-stone-600 font-mono">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  // 2. Verification Challenge (If opened without params or mismatched credentials)
  if (needsVerification && !order) {
    const displayId = (inputOrderId || initialResolvedOrderId).trim();
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#E0D5C7] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#965438]">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Protected Guest Access</span>
          </div>

          <h2 className="font-serif text-2xl text-[#2C2420] mb-2">Track Your Order</h2>
          <p className="text-xs text-stone-600 mb-6 font-light leading-relaxed">
            {displayId ? (
              <>To view details for order <strong className="font-mono text-stone-900">#{displayId.slice(0, 8).toUpperCase()}</strong>, please verify the contact information entered during checkout.</>
            ) : (
              <>Please enter your order reference and contact details to verify and view live dispatch status.</>
            )}
          </p>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleManualVerification} className="space-y-4">
            {!initialResolvedOrderId && (
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                  Order Reference (UUID)
                </label>
                <input
                  type="text"
                  required
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value)}
                  placeholder="e.g. 8957ee14-346b-47a6-9944-cb60da7fff8c"
                  className="w-full border border-[#D5C7BB] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#965438] font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-[#D5C7BB] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#965438]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-[#D5C7BB] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#965438]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#965438] text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#80442c] transition cursor-pointer"
            >
              Verify & View Tracking
            </button>
          </form>

          {onBackToStore && (
            <button
              onClick={onBackToStore}
              className="mt-6 text-center w-full text-xs text-stone-500 hover:text-stone-900 transition cursor-pointer"
            >
              Back to Catalog
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!order) return null;

  const getStepIndex = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'paid': return 1;
      case 'processing': return 1;
      case 'dispatched': return 2;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  // 3. Render Order Status Screen
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {onBackToStore && (
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-600 hover:text-[#965438] transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </button>
        )}

        <div className="bg-white border border-[#E0D5C7] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E0D5C7]/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#965438]">
                  Verified Guest Access
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#2C2420]">
                Thank you, {order.customer_name ? order.customer_name.split(' ')[0] : 'Valued Patron'}!
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Receipt and tracking link sent to <strong className="text-stone-700">{order.email}</strong>.
              </p>
            </div>
            <div className="sm:text-right bg-[#FAF7F2] sm:bg-transparent p-3 sm:p-0 border sm:border-0 border-[#E0D5C7]">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Order Reference</span>
              <span className="font-mono text-sm font-semibold text-[#2C2420]">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="pt-8 pb-4">
            <div className="relative flex justify-between items-center">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-stone-200 z-0" />
              <div 
                className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#965438] transition-all duration-500 z-0"
                style={{ width: `${(currentStepIdx / (ORDER_STEPS.length - 1)) * 100}%` }}
              />

              {ORDER_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted 
                          ? 'bg-[#965438] border-[#965438] text-white' 
                          : 'bg-white border-stone-300 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-[#965438]/20' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] mt-2 font-medium tracking-tight text-center ${
                      isCompleted ? 'text-[#2C2420]' : 'text-stone-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-[#E0D5C7] p-6 shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.18em] font-semibold text-stone-700 pb-3 border-b border-[#E0D5C7]">
              Items Ordered ({order.items.length})
            </h2>

            <div className="divide-y divide-[#E0D5C7]/50">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-[#2C2420] block">{item.product_name}</span>
                    <span className="text-xs text-stone-500">
                      Size: <strong className="text-[#965438] font-medium">{item.size}</strong> × {item.quantity}
                    </span>
                  </div>
                  <span className="font-serif text-sm font-semibold text-[#2C2420]">
                    ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E0D5C7] pt-4 mt-2 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Shipping</span>
                <span>Free (Standard Delivery)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E0D5C7] text-sm font-semibold text-[#2C2420]">
                <span>Total Amount</span>
                <span className="font-serif text-base text-[#965438]">
                  ₹{order.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-[#E0D5C7] p-6 shadow-sm">
              <h2 className="text-xs uppercase tracking-[0.18em] font-semibold text-stone-700 pb-3 border-b border-[#E0D5C7] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#965438]" /> Delivery Destination
              </h2>
              <div className="mt-3 text-xs text-stone-600 space-y-1 leading-relaxed">
                <p className="font-medium text-[#2C2420]">{order.customer_name}</p>
                <p>{order.shipping_address || 'Address provided at checkout'}</p>
                <p>{order.city ? `${order.city}, ${order.state} - ${order.pincode}` : ''}</p>
                {order.phone && (
                  <p className="pt-2 text-stone-500 flex items-center gap-1.5 font-mono">
                    <Phone className="w-3 h-3 text-stone-400" /> {order.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E0D5C7] p-5 text-xs text-stone-600">
              <span className="font-semibold text-[#2C2420] block mb-1">Need assistance?</span>
              <p className="text-[11px] text-stone-500 leading-relaxed mb-3">
                Have questions regarding delivery timing or tailoring? Contact our atelier.
              </p>
              <a
                href={`mailto:nauvaaya@gmail.com?subject=Inquiry on Order #${order.id.slice(0, 8).toUpperCase()}`}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#965438] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" /> Contact Support
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

