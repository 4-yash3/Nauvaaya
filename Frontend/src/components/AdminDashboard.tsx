import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  RefreshCw,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  LogOut
} from 'lucide-react';
import type { OrderDetails, AdminProduct } from '../types';
import { getImageUrl } from '../utils/imageUrl';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const AdminDashboard: React.FC<{ onBackToStore: () => void }> = ({ onBackToStore }) => {
  // Session Authentication State
  const [adminToken, setAdminToken] = useState<string>(() => sessionStorage.getItem('nauvaaya_admin_token') || '');
  const [adminEmail, setAdminEmail] = useState<string>(() => sessionStorage.getItem('nauvaaya_admin_email') || '');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Navigation & Data State
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'new-product'>('orders');
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    image_url: '',
    s_stock: '10',
    m_stock: '15',
    l_stock: '10'
  });

  // Fetch orders and catalog using X-Admin-Token
  const loadData = async (token = adminToken) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [ordersRes, prodsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/admin/orders`, {
          headers: { 'X-Admin-Token': token }
        }),
        fetch(`${API_BASE_URL}/api/v1/admin/products`, {
          headers: { 'X-Admin-Token': token }
        })
      ]);

      // If token is invalid or expired, reset session to show login gate
      if (ordersRes.status === 401 || ordersRes.status === 403 || ordersRes.status === 422) {
        sessionStorage.removeItem('nauvaaya_admin_token');
        sessionStorage.removeItem('nauvaaya_admin_email');
        setAdminToken('');
        return;
      }

      if (ordersRes.ok) {
        setOrders(await ordersRes.json());
      }

      if (prodsRes.ok) {
        const data = await prodsRes.json();
        const normalized = (data || []).map((p: any) => ({
          ...p,
          image_url: p.image_url || p.primary_image_url || '',
          variants: p.variants || []
        }));
        setProducts(normalized);
      }
    } catch (err) {
      console.error("Failed loading admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      loadData(adminToken);
    }
  }, [adminToken]);

  // Handle Staff Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      sessionStorage.setItem('nauvaaya_admin_token', data.token);
      sessionStorage.setItem('nauvaaya_admin_email', data.admin_email);
      setAdminToken(data.token);
      setAdminEmail(data.admin_email);
      loadData(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nauvaaya_admin_token');
    sessionStorage.removeItem('nauvaaya_admin_email');
    setAdminToken('');
    setAdminEmail('');
    onBackToStore();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setActionMessage(`Order #${orderId.slice(0, 8).toUpperCase()} updated to ${newStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStockUpdate = async (variantId: string, newQty: number) => {
    if (newQty < 0) return;
    try {
      setProducts(prev => prev.map(prod => ({
        ...prod,
        variants: prod.variants.map(v => v.id === variantId ? { ...v, stock_quantity: newQty } : v)
      })));

      await fetch(`${API_BASE_URL}/api/v1/admin/variants/${variantId}/stock`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken 
        },
        body: JSON.stringify({ stock_quantity: newQty })
      });
      loadData();
    } catch (e) {
      console.error(e);
      loadData();
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${productName}" from the catalog?\nThis piece will no longer appear on your storefront.`
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': adminToken }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Could not delete product');
      }

      setActionMessage(`"${productName}" was removed from the catalog.`);
      setTimeout(() => setActionMessage(null), 3000);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove piece');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setUploadPreview(base64Data);
      setUploadingImage(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/admin/upload-image`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Admin-Token': adminToken 
          },
          body: JSON.stringify({
            filename: file.name,
            image_data: base64Data
          })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Failed to upload photo');
        }
        const data = await res.json();
        setNewProd(p => ({ ...p, image_url: data.image_url }));
        setActionMessage(`Photo "${file.name}" uploaded successfully!`);
        setTimeout(() => setActionMessage(null), 3000);
      } catch (err: any) {
        alert(err.message || 'Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.image_url) {
      alert("Please upload a product photo or provide an image URL.");
      return;
    }

    try {
      const payload = {
        name: newProd.name,
        slug: newProd.slug.toLowerCase().replace(/\s+/g, '-'),
        description: newProd.description,
        price: parseFloat(newProd.price),
        image_url: newProd.image_url,
        variants: [
          { size: 'S', stock_quantity: parseInt(newProd.s_stock) || 0 },
          { size: 'M', stock_quantity: parseInt(newProd.m_stock) || 0 },
          { size: 'L', stock_quantity: parseInt(newProd.l_stock) || 0 }
        ]
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/admin/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Could not create product");
      }

      setActionMessage(`Piece "${newProd.name}" added to catalog.`);
      setActiveTab('inventory');
      setNewProd({
        name: '', slug: '', description: '', price: '', image_url: '',
        s_stock: '10', m_stock: '15', l_stock: '10'
      });
      setUploadPreview(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to add piece");
    }
  };

  // ----------------------------------------------------
  // GATE: If user is not authenticated, show Login Screen
  // ----------------------------------------------------
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-[#2C2420]">
        <div className="max-w-md w-full bg-white border border-[#E0D5C7] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#965438]">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Atelier Staff Portal</span>
          </div>

          <h2 className="font-serif text-2xl text-[#2C2420] mb-2">Staff Sign In</h2>
          <p className="text-xs text-stone-500 mb-6 font-light leading-relaxed">
            Authorized access only. Enter your registered atelier account to proceed.
          </p>

          {loginError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                Staff Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@nauvaaya.com"
                  className="w-full border border-[#D5C7BB] bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#965438]"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-[#D5C7BB] bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#965438]"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#965438] text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#80442c] transition cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <button
            onClick={onBackToStore}
            className="mt-6 text-center w-full text-xs text-stone-500 hover:text-stone-900 transition cursor-pointer"
          >
            ← Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total_amount : 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420]">
      {/* Top Navigation */}
      <header className="bg-white border-b border-[#E0D5C7] sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-serif text-xl tracking-wider uppercase font-medium">Nauvaaya Atelier</span>
          <span className="bg-[#FAF7F2] text-stone-600 text-[10px] font-mono px-2 py-0.5 border border-[#E0D5C7]">
            {adminEmail}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => loadData()}
            className="p-2 text-stone-600 hover:text-black border border-[#E0D5C7] bg-white transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onBackToStore}
            className="text-xs uppercase tracking-wider text-stone-600 hover:text-[#965438] px-3 py-1.5 border border-[#E0D5C7] bg-white transition cursor-pointer"
          >
            View Live Store
          </button>
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-wider text-red-700 hover:bg-red-50 px-3 py-1.5 border border-red-200 bg-white transition cursor-pointer flex items-center gap-1.5"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        {actionMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-[#E0D5C7] p-5 shadow-xs">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Total Revenue</span>
            <span className="font-serif text-2xl font-semibold text-[#2C2420] mt-1 block">
              ₹ {totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white border border-[#E0D5C7] p-5 shadow-xs">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Total Orders</span>
            <span className="font-serif text-2xl font-semibold text-[#2C2420] mt-1 block">
              {totalOrders}
            </span>
          </div>
          <div className="bg-white border border-[#E0D5C7] p-5 shadow-xs">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Pending Fulfillment</span>
            <span className="font-serif text-2xl font-semibold text-[#965438] mt-1 block">
              {pendingOrders}
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#E0D5C7] gap-8 mb-6 text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-medium transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'border-b-2 border-[#965438] text-[#965438]' 
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders CRM ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 font-medium transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'inventory' 
                ? 'border-b-2 border-[#965438] text-[#965438]' 
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" /> Products & Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('new-product')}
            className={`pb-3 font-medium transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'new-product' 
                ? 'border-b-2 border-[#965438] text-[#965438]' 
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4" /> Add New Piece
          </button>
        </div>

        {/* TAB 1: ORDERS CRM */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E0D5C7] overflow-hidden shadow-xs mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E0D5C7] text-stone-500 uppercase tracking-widest text-[10px]">
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Ordered Items</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0D5C7]/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF7F2]/40 transition">
                      <td className="p-4 font-mono">
                        <span className="font-semibold text-stone-900">#{ord.id.slice(0, 8).toUpperCase()}</span>
                        <span className="block text-[10px] text-stone-500 mt-0.5">
                          {ord.created_at 
                            ? new Date(ord.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : 'Recent'}
                        </span>
                      </td>
                      <td className="p-4">
                        <strong className="text-stone-900 block">{ord.customer_name}</strong>
                        <span className="text-stone-500 text-[11px] block">{ord.email}</span>
                        <span className="text-stone-500 font-mono text-[11px] block">{ord.phone}</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {ord.items.map((i) => (
                            <div key={i.id} className="text-[11px] text-stone-800">
                              {i.product_name} (<strong className="text-[#965438]">{i.size}</strong>) × {i.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-stone-600 max-w-xs text-[11px] leading-relaxed">
                        {ord.shipping_address}, {ord.city}, {ord.state} - {ord.pincode}
                      </td>
                      <td className="p-4 font-serif text-sm font-semibold text-stone-900">
                        ₹ {ord.total_amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="border border-[#D5C7BB] bg-white px-2.5 py-1 text-xs uppercase tracking-wider font-medium text-stone-800 focus:outline-none focus:border-[#965438] cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & PRODUCTS */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {products.map((prod) => {
              const isOutOfStock = !prod.variants || prod.variants.length === 0 || prod.variants.every(v => v.stock_quantity <= 0);

              return (
                <div key={prod.id} className="bg-white border border-[#E0D5C7] p-5 shadow-xs flex gap-5 relative group">
                  <div className="relative w-24 h-32 shrink-0 bg-[#FAF7F2] border border-[#E0D5C7] overflow-hidden">
                    {prod.image_url ? (
                      <img
                        src={getImageUrl(prod.image_url)} 
                        alt={prod.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center p-1 text-center">
                        <span className="bg-red-700 text-white text-[8px] font-mono uppercase px-1 py-0.5 leading-tight tracking-wider font-bold">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-base text-stone-900 font-medium truncate">{prod.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs text-[#965438]">
                            ₹ {prod.price.toLocaleString('en-IN')}
                          </span>
                          {isOutOfStock ? (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] uppercase font-mono px-2 py-0.5 font-bold tracking-wider">
                              OUT OF STOCK
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] uppercase font-mono px-2 py-0.5 font-medium tracking-wider">
                              IN STOCK
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="text-stone-400 hover:text-red-600 p-1.5 transition cursor-pointer hover:bg-red-50 border border-transparent hover:border-red-200"
                        title={`Remove "${prod.name}" from catalog`}
                        aria-label={`Remove ${prod.name}`}
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#E0D5C7]/70">
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-2">
                        Live Stock by Size:
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {(prod.variants || []).map((v) => (
                          <div 
                            key={v.id} 
                            className={`flex items-center gap-1.5 border px-2 py-1 text-xs transition-colors ${
                              v.stock_quantity <= 0 
                                ? 'bg-red-50/60 border-red-200 text-red-800' 
                                : 'bg-[#FAF7F2] border-[#E0D5C7] text-stone-800'
                            }`}
                          >
                            <span className="font-semibold w-5">{v.size}:</span>
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(v.id, v.stock_quantity - 1)}
                              className="w-4 h-4 flex items-center justify-center bg-white border border-[#D5C7BB] hover:bg-stone-100 text-stone-700 text-xs cursor-pointer"
                              title="Decrease stock"
                            >
                              -
                            </button>
                            <span className={`font-mono font-medium px-1 ${v.stock_quantity <= 0 ? 'text-red-700 font-bold' : 'text-stone-900'}`}>
                              {v.stock_quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(v.id, v.stock_quantity + 1)}
                              className="w-4 h-4 flex items-center justify-center bg-white border border-[#D5C7BB] hover:bg-stone-100 text-stone-700 text-xs cursor-pointer"
                              title="Increase stock"
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: ADD NEW PIECE */}
        {activeTab === 'new-product' && (
          <div className="max-w-2xl mx-auto bg-white border border-[#E0D5C7] p-8 shadow-xs mb-12">
            <h2 className="font-serif text-2xl text-stone-900 mb-1">Introduce a New Artisanal Piece</h2>
            <p className="text-xs text-stone-500 mb-6 font-light">
              Add garments to your catalog with automatic size variant allocation.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indigo Drape Shirt"
                  value={newProd.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewProd(p => ({
                      ...p,
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    }));
                  }}
                  className="w-full border border-[#D5C7BB] px-3 py-2 text-sm focus:outline-none focus:border-[#965438]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                    Slug / URL Key *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="indigo-drape-shirt"
                    value={newProd.slug}
                    onChange={(e) => setNewProd({ ...newProd, slug: e.target.value })}
                    className="w-full border border-[#D5C7BB] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#965438]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1899"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="w-full border border-[#D5C7BB] px-3 py-2 text-sm focus:outline-none focus:border-[#965438]"
                  />
                </div>
              </div>

              {/* Product Photo Upload + URL input */}
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                  Product Image *
                </label>

                <div className="border-2 border-dashed border-[#D5C7BB] hover:border-[#965438] bg-[#FAF7F2] p-4 transition-colors">
                  {newProd.image_url ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(newProd.image_url)} 
                        alt="Uploaded preview" 
                        className="w-16 h-20 object-cover border border-[#D5C7BB] bg-white shrink-0 shadow-xs" 
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-stone-900 block truncate font-mono">
                          {newProd.image_url}
                        </span>
                        <span className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                          <Check className="w-3.5 h-3.5" /> Photo attached to piece
                        </span>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[#965438] hover:underline font-medium cursor-pointer"
                          >
                            Change Photo
                          </button>
                          <span className="text-stone-300">|</span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewProd(p => ({ ...p, image_url: '' }));
                              setUploadPreview(null);
                            }}
                            className="text-red-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-5 text-center">
                      <Upload className="w-7 h-7 text-stone-400 mb-2 stroke-[1.5]" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="bg-white border border-[#D5C7BB] hover:border-[#965438] text-stone-800 text-xs px-5 py-2 font-medium uppercase tracking-wider transition cursor-pointer shadow-xs hover:bg-stone-50"
                      >
                        {uploadingImage ? 'Uploading image...' : 'Upload Image Photo'}
                      </button>
                      <span className="text-[11px] text-stone-500 mt-2 font-light">
                        Select a JPG, PNG, or WEBP file from your device
                      </span>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 whitespace-nowrap">Or Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://... or /static/products/..."
                    value={newProd.image_url}
                    onChange={(e) => {
                      setNewProd({ ...newProd, image_url: e.target.value });
                      setUploadPreview(e.target.value);
                    }}
                    className="flex-1 border border-[#D5C7BB] px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-[#965438]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Hand-loomed cotton shirt with natural dye accents..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full border border-[#D5C7BB] px-3 py-2 text-sm focus:outline-none focus:border-[#965438] resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-medium tracking-wider uppercase text-stone-700 mb-2">
                  Initial Inventory by Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 font-mono block mb-1">SIZE S</span>
                    <input
                      type="number"
                      value={newProd.s_stock}
                      onChange={(e) => setNewProd({ ...newProd, s_stock: e.target.value })}
                      className="w-full border border-[#D5C7BB] p-2 text-sm font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-mono block mb-1">SIZE M</span>
                    <input
                      type="number"
                      value={newProd.m_stock}
                      onChange={(e) => setNewProd({ ...newProd, m_stock: e.target.value })}
                      className="w-full border border-[#D5C7BB] p-2 text-sm font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-mono block mb-1">SIZE L</span>
                    <input
                      type="number"
                      value={newProd.l_stock}
                      onChange={(e) => setNewProd({ ...newProd, l_stock: e.target.value })}
                      className="w-full border border-[#D5C7BB] p-2 text-sm font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#965438] text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#80442c] transition cursor-pointer"
              >
                Publish Piece to Catalog
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};