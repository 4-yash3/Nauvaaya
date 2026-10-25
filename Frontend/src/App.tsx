import React, { useState, useEffect, useMemo } from 'react';
import type { 
  MediaItem, 
  Variant, 
  Product, 
  CartItem, 
  OrderConfirmation 
} from './types';
import { API_BASE_URL } from './config';
import { MOCK_PRODUCTS, PRODUCT_METADATA } from './data/mockProducts';

import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutUsPage } from './components/AboutUsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderStatusPage } from './components/OrderStatusPage';
import { CartDrawer } from './components/CartDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'product' | 'about'>('home');
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(
    window.location.hash === '#admin'
  );
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [, setCompletedOrder] = useState<OrderConfirmation | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<{ id: string; email: string; phone: string } | null>(() => {
    const query = new URLSearchParams(window.location.search);
    const orderId = query.get('order_id') || query.get('order');
    if (orderId) {
      return {
        id: orderId,
        email: query.get('email') || '',
        phone: query.get('phone') || ''
      };
    }
    return null;
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(MOCK_PRODUCTS[0]);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'craft' | 'fit' | 'shipping' | 'care'>('craft');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(1);

  // Shop Page Filters & Controls
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterAgreed, setNewsletterAgreed] = useState(true);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Sync hash routing with page state
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const onAdmin = hash === '#admin';
      setIsAdminRoute(onAdmin);
      if (onAdmin) {
        return;
      }
      if (hash.startsWith('#order-')) {
        const orderIdFromHash = hash.replace('#order-', '');
        setTrackedOrder({
          id: orderIdFromHash,
          email: '',
          phone: '',
        });
        return;
      }
      if (hash.startsWith('#product-')) {
        const slug = hash.replace('#product-', '');
        const found = products.find(p => p.slug === slug);
        if (found) {
          setSelectedProduct(found);
          setSelectedSize(found.available_sizes[0] || 'M');
          setSelectedGalleryIdx(0);
          setProductQuantity(1);
          setCurrentPage('product');
          return;
        }
      }
      if (hash === '#about') {
        setCurrentPage('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash.startsWith('#shop')) {
        setCurrentPage('shop');
      } else {
        setCurrentPage('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  const navigateTo = (page: 'home' | 'shop' | 'about', category = 'All') => {
    setCurrentPage(page);
    if (category !== 'All') {
      setSelectedCategory(category);
    }
    if (page === 'shop') {
      window.location.hash = '#shop';
    } else if (page === 'about') {
      window.location.hash = '#about';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutClick = () => {
    navigateTo('about');
  };

  const openProductPage = async (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.available_sizes[0] || 'M');
    setSelectedGalleryIdx(0);
    setProductQuantity(1);
    setCurrentPage('product');
    window.location.hash = `#product-${product.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch full product detail with all media and variants from FastAPI backend
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products/${product.slug}`);
      if (res.ok) {
        const detail = await res.json();
        const gallery = detail.images?.map((img: MediaItem) => img.image_url) || product.gallery_urls;
        setSelectedProduct(prev => {
          if (!prev) return null;
          const detailStock = detail.variants && detail.variants.length > 0
            ? detail.variants.some((v: Variant) => v.stock_quantity > 0)
            : prev.in_stock;
          return {
            ...prev,
            ...detail,
            gallery_urls: gallery,
            media: detail.images || prev.media,
            variants: detail.variants || prev.variants,
            available_sizes: detail.variants?.filter((v: Variant) => v.stock_quantity > 0).map((v: Variant) => v.size) || prev.available_sizes,
            in_stock: detailStock
          };
        });
      }
    } catch {
      // Fallback seamlessly to existing product state
    }
  };

  // Reusable catalog loader that syncs live database variants and stock
  const loadCatalog = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products`);
      if (!res.ok) throw new Error('API request failed');
      const catalog: Product[] = await res.json();
      if (catalog && catalog.length > 0) {
        // Fetch full media & variants array for each product in parallel
        const enrichedList = await Promise.all(
          catalog.map(async (prod) => {
            const meta = PRODUCT_METADATA[prod.slug] || {};
            try {
              const detailRes = await fetch(`${API_BASE_URL}/api/v1/products/${prod.slug}`);
              if (detailRes.ok) {
                const detail = await detailRes.json();
                const gallery = detail.images?.map((img: MediaItem) => img.image_url) || [prod.primary_image_url];
                const hasStock = detail.variants && detail.variants.length > 0
                  ? detail.variants.some((v: Variant) => v.stock_quantity > 0)
                  : (prod.in_stock ?? true);
                return {
                  ...prod,
                  ...detail,
                  ...meta,
                  primary_image_url: prod.primary_image_url || gallery[0],
                  gallery_urls: gallery,
                  media: detail.images || [],
                  variants: detail.variants || [],
                  available_sizes: detail.variants?.filter((v: Variant) => v.stock_quantity > 0).map((v: Variant) => v.size) || prod.available_sizes,
                  in_stock: hasStock
                };
              }
            } catch {
              // If detail fetch fails, use card response
            }
            return {
              ...prod,
              ...meta,
              gallery_urls: prod.primary_image_url ? [prod.primary_image_url] : []
            };
          })
        );
        setProducts(enrichedList);
        setSelectedProduct(prev => {
          if (!prev) return prev;
          const found = enrichedList.find(p => p.id === prev.id);
          return found || prev;
        });
      }
    } catch {
      setProducts(MOCK_PRODUCTS);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleOrderSuccess = (order: OrderConfirmation) => {
    setCompletedOrder(order);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setTrackedOrder({
      id: order.id,
      email: order.email,
      phone: order.phone || '',
    });
    // Reload products so deducted stock quantities in PostgreSQL are updated in UI
    loadCatalog();
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addToCart = (product: Product, selectedSize: string, quantity = 1) => {
    const liveProd = products.find(p => p.id === product.id) || product;
    const chosenVariant = liveProd.variants?.find((v) => v.size === selectedSize);

    if (!chosenVariant) {
      alert("Please select a size first.");
      return;
    }

    if (chosenVariant.stock_quantity <= 0) {
      alert(`Size ${selectedSize} is sold out.`);
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.variant_id === chosenVariant.id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        
        if (newQty > chosenVariant.stock_quantity) {
          alert(`Only ${chosenVariant.stock_quantity} available in size ${selectedSize}.`);
          return prevCart;
        }
        
        updated[existingIndex].quantity = newQty;
        return updated;
      }

      const primaryImg = liveProd.media?.find((img) => img.is_primary)?.image_url 
        || liveProd.primary_image_url 
        || liveProd.gallery_urls?.[0] 
        || '';

      return [
        ...prevCart,
        {
          variant_id: chosenVariant.id,
          product_id: liveProd.id,
          name: liveProd.name,
          size: chosenVariant.size,
          price: liveProd.price,
          image_url: primaryImg,
          quantity: quantity,
          max_stock: chosenVariant.stock_quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, selectedSize: string, quantity = 1) => {
    addToCart(product, selectedSize, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const updateQuantity = (variant_id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.variant_id === variant_id) {
        const newQty = item.quantity + delta;
        if (newQty > item.max_stock) {
          alert(`Only ${item.max_stock} available in stock for size ${item.size}.`);
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterAgreed) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 4000);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Shop Page filtered & sorted product list
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        if (selectedCategory !== 'All' && prod.category !== selectedCategory) return false;
        if (selectedSizeFilter !== 'All' && !prod.available_sizes.includes(selectedSizeFilter)) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = prod.name.toLowerCase().includes(q);
          const matchCat = (prod.category || '').toLowerCase().includes(q);
          const matchTag = (prod.tag || '').toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchTag) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name-az') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, selectedSizeFilter, sortBy, searchQuery]);

  // Related products for product detail page
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter(p => p.id !== selectedProduct.id)
      .slice(0, 4);
  }, [products, selectedProduct]);

  if (isAdminRoute) {
    return (
      <AdminDashboard
        onBackToStore={() => {
          window.location.hash = '';
          setIsAdminRoute(false);
        }}
      />
    );
  }

  if (trackedOrder) {
    return (
      <OrderStatusPage
        orderId={trackedOrder.id}
        initialEmail={trackedOrder.email}
        initialPhone={trackedOrder.phone}
        onBackToStore={() => {
          setTrackedOrder(null);
          setCompletedOrder(null);
          if (window.location.search.includes('order')) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#28221e] font-sans antialiased selection:bg-[#965438] selection:text-white">
      
      {/* 1 & 2. TOP ANNOUNCEMENT BAR & HEADER */}
      <Header
        currentPage={currentPage}
        cartItemCount={cartItemCount}
        onNavigate={navigateTo}
        onOpenCart={() => setIsCartOpen(true)}
        onAboutClick={handleAboutClick}
      />

      {/* 3. CONDITIONAL FULL SCREEN PAGES: HOME, SHOP, PRODUCT DETAIL, OR ABOUT US */}
      {currentPage === 'home' && (
        <HomePage
          products={products}
          wishlist={wishlist}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={openProductPage}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'shop' && (
        <ShopPage
          products={products}
          filteredProducts={filteredProducts}
          wishlist={wishlist}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSizeFilter={selectedSizeFilter}
          onSelectSizeFilter={setSelectedSizeFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onResetFilters={() => {
            setSelectedCategory('All');
            setSelectedSizeFilter('All');
            setSearchQuery('');
          }}
          onToggleWishlist={toggleWishlist}
          onOpenProduct={openProductPage}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'product' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          quantity={productQuantity}
          onQuantityChange={setProductQuantity}
          selectedGalleryIdx={selectedGalleryIdx}
          onSelectGalleryIdx={setSelectedGalleryIdx}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
          relatedProducts={relatedProducts}
          onOpenProduct={openProductPage}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'about' && (
        <AboutUsPage 
          onExploreCollection={() => navigateTo('shop')} 
          onNavigateHome={() => navigateTo('home')} 
        />
      )}

      {/* 4. NEWSLETTER SECTION */}
      <NewsletterSection
        email={newsletterEmail}
        onEmailChange={setNewsletterEmail}
        agreed={newsletterAgreed}
        onAgreedChange={setNewsletterAgreed}
        success={newsletterSuccess}
        onSubmit={handleNewsletterSubmit}
      />

      {/* 5. MAIN FOOTER */}
      <Footer
        onNavigate={navigateTo}
        onAboutClick={handleAboutClick}
        onTrackOrder={() => setTrackedOrder({ id: '', email: '', phone: '' })}
      />

      {/* 6. SIZE GUIDE MODAL */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* 7. SHOPPING BAG DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onExplore={() => {
          setIsCartOpen(false);
          navigateTo('shop');
        }}
      />

      {/* 8. CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}