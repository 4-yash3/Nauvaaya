import React, { useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Star, 
  Ruler, 
  Sparkles, 
  Minus, 
  Plus, 
  Truck, 
  RefreshCw, 
  ChevronDown 
} from 'lucide-react';
import type { Product, MediaItem } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface ProductDetailPageProps {
  product: Product;
  selectedSize: string;
  onSelectSize: (sz: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  selectedGalleryIdx: number;
  onSelectGalleryIdx: (idx: number | ((prev: number) => number)) => void;
  activeTab: 'craft' | 'fit' | 'shipping' | 'care';
  onActiveTabChange: (tab: 'craft' | 'fit' | 'shipping' | 'care') => void;
  onOpenSizeGuide: () => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, quantity: number) => void;
  relatedProducts: Product[];
  onOpenProduct: (product: Product) => void;
  onNavigate: (page: 'home' | 'shop' | 'about', category?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  selectedSize,
  onSelectSize,
  quantity,
  onQuantityChange,
  selectedGalleryIdx,
  onSelectGalleryIdx,
  activeTab,
  onActiveTabChange,
  onOpenSizeGuide,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  relatedProducts,
  onOpenProduct,
  onNavigate,
}) => {
  // Full normalized media list for the selected product
  const currentProductMedia = useMemo(() => {
    if (!product) return [];
    if (product.media && product.media.length > 0) {
      return product.media;
    }
    if (product.gallery_urls && product.gallery_urls.length > 0) {
      return product.gallery_urls.map(url => ({
        image_url: url,
        media_type: (url && url.endsWith('.mp4')) ? ('video' as const) : ('image' as const)
      }));
    }
    if (product.primary_image_url) {
      return [{
        image_url: product.primary_image_url,
        media_type: 'image' as const
      }];
    }
    return [];
  }, [product]);

  const handlePrevMedia = () => {
    if (currentProductMedia.length <= 1) return;
    onSelectGalleryIdx(prev => (prev === 0 ? currentProductMedia.length - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    if (currentProductMedia.length <= 1) return;
    onSelectGalleryIdx(prev => (prev === currentProductMedia.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevMedia();
      if (e.key === 'ArrowRight') handleNextMedia();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProductMedia.length]);

  const activeMediaItem: MediaItem | undefined = useMemo(() => {
    if (!currentProductMedia || currentProductMedia.length === 0) {
      return product.primary_image_url ? {
        image_url: product.primary_image_url,
        media_type: 'image'
      } : undefined;
    }
    return currentProductMedia[selectedGalleryIdx] || currentProductMedia[0];
  }, [currentProductMedia, selectedGalleryIdx, product.primary_image_url]);

  const isSelectedProductOutOfStock = !product.in_stock || 
    (product.variants && product.variants.length > 0 && product.variants.every(v => v.stock_quantity <= 0));
  const selectedVariant = product.variants?.find(v => v.size === selectedSize);
  const isSelectedSizeSoldOut = selectedVariant ? selectedVariant.stock_quantity <= 0 : false;
  const disableButton = isSelectedProductOutOfStock || isSelectedSizeSoldOut;

  return (
    <main className="py-8 sm:py-12 max-w-[1440px] mx-auto px-6 lg:px-12 animate-fadeIn">
      
      {/* Breadcrumb & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#e6dfd5]/80">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#736b63]">
          <button 
            onClick={() => onNavigate('home')}
            className="hover:text-[#965438] transition cursor-pointer"
          >
            HOME
          </button>
          <span>/</span>
          <button 
            onClick={() => onNavigate('shop')}
            className="hover:text-[#965438] transition cursor-pointer"
          >
            SHOP
          </button>
          <span>/</span>
          <button 
            onClick={() => onNavigate('shop', product.category)}
            className="hover:text-[#965438] transition cursor-pointer"
          >
            {product.category?.toUpperCase() || 'COLLECTION'}
          </button>
          <span>/</span>
          <span className="text-[#28221e] font-semibold">{product.name}</span>
        </div>

        <button 
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#28221e] hover:text-[#965438] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ARCHIVE</span>
        </button>
      </div>

      {/* 2-Column Full Screen Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* LEFT COLUMN: Gallery Showcase with Controlled Height & In-Viewer Controls */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4">
          
          {/* Main Media Display */}
          <div className="relative w-full max-w-[500px] aspect-[4/5] max-h-[68vh] bg-[#ede5dc] overflow-hidden border border-[#e4dcce] shadow-xs flex items-center justify-center group select-none">
            {activeMediaItem?.media_type === 'video' ? (
              <video 
                key={activeMediaItem.image_url}
                src={getImageUrl(activeMediaItem.image_url)} 
                controls 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                key={activeMediaItem?.image_url}
                src={getImageUrl(activeMediaItem?.image_url || product.primary_image_url)} 
                alt={product.name}
                className="w-full h-full object-cover object-top transition-all duration-300"
              />
            )}

            {/* Badge in top-left */}
            {product.tag && (
              <span className="absolute top-4 left-4 bg-[#28221e]/85 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.24em] font-medium px-3 py-1 shadow-sm pointer-events-none">
                {product.tag}
              </span>
            )}

            {/* Wishlist Button */}
            <button 
              onClick={() => onToggleWishlist(product.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#e6dfd5] flex items-center justify-center text-[#28221e] hover:text-[#df8f9f] transition shadow-sm cursor-pointer z-20"
              aria-label="Wishlist"
            >
              <Heart 
                className={`w-4 h-4 stroke-[1.75] ${
                  wishlist.includes(product.id) 
                    ? 'fill-[#df8f9f] text-[#df8f9f]' 
                    : 'text-[#28221e]'
                }`} 
              />
            </button>

            {/* Left Navigation Arrow */}
            {currentProductMedia.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevMedia();
                }}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#28221e] hover:text-[#965438] backdrop-blur-md border border-[#e2d8cc] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 z-20 group/btn"
                aria-label="Previous image"
                title="Previous image"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2] transition-transform group-hover/btn:-translate-x-0.5" />
              </button>
            )}

            {/* Right Navigation Arrow */}
            {currentProductMedia.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextMedia();
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#28221e] hover:text-[#965438] backdrop-blur-md border border-[#e2d8cc] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 z-20 group/btn"
                aria-label="Next image"
                title="Next image"
              >
                <ChevronRight className="w-5 h-5 stroke-[2] transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            )}

            {/* Media Index Pill */}
            {currentProductMedia.length > 1 && (
              <div className="absolute bottom-3.5 right-3.5 bg-[#28221e]/75 backdrop-blur-md text-white text-[10px] tracking-[0.2em] font-medium px-2.5 py-1 rounded-full border border-white/20 select-none z-10 pointer-events-none">
                {selectedGalleryIdx + 1} / {currentProductMedia.length}
              </div>
            )}
          </div>

          {/* Gallery Thumbnails (Images & Videos) */}
          {currentProductMedia.length > 1 && (
            <div className="flex items-center justify-center gap-2.5 max-w-[500px] w-full pt-1 overflow-x-auto py-1">
              {currentProductMedia.map((m: any, gIdx: number) => (
                <button
                  key={gIdx}
                  onClick={() => onSelectGalleryIdx(gIdx)}
                  className={`relative w-14 h-17 sm:w-16 sm:h-20 shrink-0 bg-[#e9e2d8] overflow-hidden border transition-all cursor-pointer ${
                    selectedGalleryIdx === gIdx 
                      ? 'border-[#965438] ring-2 ring-[#965438] scale-102 shadow-xs' 
                      : 'border-[#e0d6c8] hover:border-[#28221e] opacity-70 hover:opacity-100'
                  }`}
                >
                  {m.media_type === 'video' ? (
                    <div className="w-full h-full bg-[#28221e] flex flex-col items-center justify-center text-white">
                      <Play className="w-4 h-4 fill-white" />
                      <span className="text-[8px] uppercase tracking-wider mt-0.5 font-bold">REEL</span>
                    </div>
                  ) : (
                    <img src={getImageUrl(m.image_url)} alt={`View ${gIdx + 1}`} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Details, Specifications, & Purchasing Suite */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-7 lg:sticky lg:top-24">
          
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-[#736b63] mb-2">
              <span className="uppercase tracking-[0.25em] font-semibold text-[#965438]">
                {product.category || 'HANDCRAFTED APPAREL'}
              </span>
              
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#443c37]">
                <div className="flex text-[#e5973b]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="ml-1">4.9 (42)</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#28221e] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price & Live Stock Indicator */}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl sm:text-3xl font-normal text-[#28221e]">
                ₹ {product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#736b63] font-light">Inclusive of all taxes</span>
              {(!product.in_stock || (product.variants && product.variants.length > 0 && product.variants.every(v => v.stock_quantity <= 0))) ? (
                <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] uppercase font-mono px-2.5 py-0.5 font-bold tracking-wider">
                  OUT OF STOCK
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-mono px-2.5 py-0.5 font-medium tracking-wider">
                  IN STOCK
                </span>
              )}
            </div>

            {/* Story Description */}
            <p className="text-sm text-[#554b44] mt-5 leading-relaxed font-light">
              {product.description || 'Thoughtfully cut from pure breathable cotton, elevated with handcrafted thread embroidery, inspired by age-old craft and tailored for modern silhouettes.'}
            </p>

            {/* Color Palette Display */}
            <div className="mt-6 pt-6 border-t border-[#e6dfd5]/80">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#443c37] block mb-2.5">
                Artisan Colorway
              </span>
              <div className="flex items-center gap-2">
                {(product.colors || ['#e5973b', '#b8b5b0', '#d8caa8']).map((clr, cIdx) => (
                  <span 
                    key={cIdx}
                    className="w-5 h-5 rounded-full border-2 border-white ring-1 ring-black/20 shadow-xs inline-block"
                    style={{ backgroundColor: clr }}
                  />
                ))}
                <span className="text-xs text-[#736b63] ml-2 font-mono">Natural Plant & Fiber Tones</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#443c37]">
                  Select Size: <span className="font-bold text-[#965438]">{selectedSize}</span>
                </span>
                <button 
                  onClick={onOpenSizeGuide}
                  className="text-xs underline text-[#736b63] hover:text-[#965438] flex items-center gap-1 cursor-pointer transition"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['S', 'M', 'L'].map((sz) => {
                  const variantForSize = product.variants?.find(v => v.size === sz);
                  const isSoldOut = variantForSize ? variantForSize.stock_quantity <= 0 : false;
                  const isSelected = selectedSize === sz;

                  return (
                    <button
                      key={sz}
                      disabled={isSoldOut}
                      onClick={() => onSelectSize(sz)}
                      className={`py-3 text-xs font-medium uppercase border transition-all relative ${
                        isSoldOut
                          ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-[#965438] bg-[#965438] text-white shadow-xs cursor-pointer'
                          : 'border-[#d2c7bd] text-[#28221e] hover:border-[#28221e] bg-white cursor-pointer'
                      }`}
                    >
                      <span>{sz}</span>
                      {isSoldOut && (
                        <span className="block text-[8px] no-underline font-normal text-red-600 mt-0.5">Sold Out</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Scarcity / Small Batch note */}
              <p className="text-[11px] text-[#965438] mt-2.5 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Conscious small batch: Limited pieces remain in size {selectedSize}.</span>
              </p>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#d2c7bd] bg-white h-12 px-3">
                  <button 
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#965438] transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-mono font-medium">{quantity}</span>
                  <button 
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="p-1 hover:text-[#965438] transition cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button 
                  disabled={disableButton}
                  onClick={() => onAddToCart(product, selectedSize, quantity)}
                  className={`flex-1 h-12 text-xs uppercase tracking-[0.22em] font-medium transition flex items-center justify-center gap-3 shadow-sm ${
                    disableButton
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-[#965438] hover:bg-[#80442c] text-white cursor-pointer hover:shadow'
                  }`}
                >
                  <span>{isSelectedProductOutOfStock ? 'OUT OF STOCK' : isSelectedSizeSoldOut ? `SIZE ${selectedSize} SOLD OUT` : 'ADD TO BAG'}</span>
                  {!disableButton && (
                    <>
                      <span>•</span>
                      <span>₹ {(product.price * quantity).toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {(!isSelectedProductOutOfStock && !isSelectedSizeSoldOut) && (
                <button 
                  onClick={() => onBuyNow(product, selectedSize, quantity)}
                  className="w-full bg-[#28221e] hover:bg-black text-[#fbf9f5] h-12 text-xs uppercase tracking-[0.22em] font-medium transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  <span>BUY IT NOW (EXPRESS CHECKOUT)</span>
                </button>
              )}
            </div>

            {/* Fast Highlights */}
            <div className="mt-8 p-4 bg-[#ede5dc]/60 border border-[#e2d7cb] space-y-2.5 text-xs text-[#554b44]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#965438] shrink-0" />
                <span>Free shipping across India on orders over ₹ 5,000. Dispatched in 24–48 hours.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-[#965438] shrink-0" />
                <span>Easy 7-day hassle-free size exchange & returns.</span>
              </div>
            </div>

            {/* Collapsible Accordion Tabs */}
            <div className="mt-8 border-t border-[#e6dfd5] divide-y divide-[#e6dfd5]">
              <div className="py-4">
                <button 
                  onClick={() => onActiveTabChange(activeTab === 'craft' ? ('' as any) : 'craft')}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] font-semibold text-[#28221e] cursor-pointer"
                >
                  <span>CRAFTSMANSHIP &amp; FABRIC</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'craft' ? 'rotate-180 text-[#965438]' : ''}`} />
                </button>
                {activeTab === 'craft' && (
                  <div className="pt-3 text-xs text-[#655d56] leading-relaxed space-y-2 animate-fadeIn font-light">
                    <p><strong>Fabric:</strong> {product.fabric || '100% Breathable Long-Staple Cotton'}.</p>
                    <p><strong>Artisan Technique:</strong> {product.artisan_technique || 'Hand-embroidered threadwork executed with colorfast natural and cotton threads'}.</p>
                    <p><strong>Hardware:</strong> Hand-finished mother-of-pearl buttons with reinforced cross-stitching.</p>
                  </div>
                )}
              </div>

              <div className="py-4">
                <button 
                  onClick={() => onActiveTabChange(activeTab === 'fit' ? ('' as any) : 'fit')}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] font-semibold text-[#28221e] cursor-pointer"
                >
                  <span>FIT &amp; SILHOUETTE GUIDE</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'fit' ? 'rotate-180 text-[#965438]' : ''}`} />
                </button>
                {activeTab === 'fit' && (
                  <div className="pt-3 text-xs text-[#655d56] leading-relaxed space-y-2 animate-fadeIn font-light">
                    <p>Designed for a relaxed contemporary unisex silhouette with gentle drape.</p>
                    <p>Model is 5'10" and wearing Size M (Chest 40", Shirt Length 28.5").</p>
                    <p>If you prefer an oversized street-style drape, we suggest ordering one size up.</p>
                  </div>
                )}
              </div>

              <div className="py-4">
                <button 
                  onClick={() => onActiveTabChange(activeTab === 'shipping' ? ('' as any) : 'shipping')}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] font-semibold text-[#28221e] cursor-pointer"
                >
                  <span>SHIPPING &amp; EASY EXCHANGES</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'shipping' ? 'rotate-180 text-[#965438]' : ''}`} />
                </button>
                {activeTab === 'shipping' && (
                  <div className="pt-3 text-xs text-[#655d56] leading-relaxed space-y-2 animate-fadeIn font-light">
                    <p>Domestic orders are delivered within 3–5 business days via express courier.</p>
                    <p>Worldwide international shipping calculated at checkout (typically 7–10 days).</p>
                    <p>Complimentary 7-day exchanges if you need an alternative size.</p>
                  </div>
                )}
              </div>

              <div className="py-4">
                <button 
                  onClick={() => onActiveTabChange(activeTab === 'care' ? ('' as any) : 'care')}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] font-semibold text-[#28221e] cursor-pointer"
                >
                  <span>GARMENT CARE INSTRUCTIONS</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'care' ? 'rotate-180 text-[#965438]' : ''}`} />
                </button>
                {activeTab === 'care' && (
                  <div className="pt-3 text-xs text-[#655d56] leading-relaxed space-y-2 animate-fadeIn font-light">
                    <p>Hand wash cold with similar light colors using a mild eco-friendly detergent.</p>
                    <p>Line dry inside out in shaded breeze to protect color vibrancy.</p>
                    <p>Warm iron on reverse side; avoid ironing directly on embroidery motifs.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* RELATED PRODUCTS ("You May Also Admire") */}
      <section className="mt-28 pt-16 border-t border-[#e6dfd5]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#736b63] block mb-1">
              CURATED DISCOVERIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#28221e] font-normal">
              You May Also Admire
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#28221e] hover:text-[#965438] transition cursor-pointer"
          >
            <span>EXPLORE ALL PIECES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((shirt) => (
            <div 
              key={shirt.id} 
              className="group flex flex-col cursor-pointer"
              onClick={() => onOpenProduct(shirt)}
            >
              <div className="relative aspect-[3/4] bg-[#e9e2d8] overflow-hidden mb-3.5 border border-[#e2d8cc]">
                <img
                  src={getImageUrl(shirt.primary_image_url)}
                  alt={shirt.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(shirt.id);
                  }}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:text-[#df8f9f] transition shadow-sm cursor-pointer"
                >
                  <Heart 
                    className={`w-3.5 h-3.5 ${
                      wishlist.includes(shirt.id) ? 'fill-[#df8f9f] text-[#df8f9f]' : 'text-white'
                    }`} 
                  />
                </button>
              </div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#8a7f76]">
                {shirt.category}
              </span>
              <h3 className="font-serif text-lg text-[#28221e] font-normal group-hover:text-[#965438] transition-colors leading-snug mt-1">
                {shirt.name}
              </h3>
              <p className="text-sm font-normal text-[#28221e] mt-0.5">
                ₹ {shirt.price.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

