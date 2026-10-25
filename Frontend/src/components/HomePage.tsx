import React from 'react';
import { ArrowRight, ArrowDown, ArrowLeft, Heart } from 'lucide-react';
import type { Product } from '../types';
import { getImageUrl } from '../utils/imageUrl';
import { CATEGORIES, MOCK_PRODUCTS, SUPABASE_STORAGE_URL } from '../data/mockProducts';

interface HomePageProps {
  products: Product[];
  wishlist: string[];
  currentSlide: number;
  onSlideChange: (num: number) => void;
  onToggleWishlist: (id: string) => void;
  onOpenProduct: (product: Product) => void;
  onNavigate: (page: 'home' | 'shop' | 'about', category?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  wishlist,
  currentSlide,
  onSlideChange,
  onToggleWishlist,
  onOpenProduct,
  onNavigate,
}) => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center overflow-hidden bg-[#eae3d9]">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(`${SUPABASE_STORAGE_URL}/sun-and-script/1.png`)} 
            alt="Handcrafted Artisanal Embroidered Apparel" 
            className="w-full h-full object-cover object-center lg:object-[70%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#eae3d9] via-[#eae3d9]/80 to-transparent lg:w-[65%]" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full py-16 lg:py-24 flex flex-col justify-between min-h-[75vh]">
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#736b63] block mb-4">
              WEAR A NEW BEGINNING
            </span>
            
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-[88px] leading-[1.02] tracking-tight font-normal text-[#28221e] mb-6">
              Crafted <br />
              <span className="italic font-normal">for your</span> <br />
              story
            </h1>
            
            <p className="text-[#655d56] text-sm sm:text-base leading-relaxed max-w-sm mb-9 font-normal">
              Thoughtfully designed shirts with handcrafted details, inspired by tradition and made for today.
            </p>
            
            <button 
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-4 bg-[#965438] hover:bg-[#80442c] text-white px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium transition-all group shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>EXPLORE COLLECTION</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                ————→
              </span>
            </button>
          </div>

          {/* Bottom Indicators */}
          <div className="flex items-end justify-between pt-16">
            <div className="flex items-center gap-7 text-xs tracking-widest font-medium text-[#736b63]">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => onSlideChange(num)}
                  className={`transition-all pb-1 cursor-pointer ${
                    currentSlide === num 
                      ? 'text-[#28221e] border-b-2 border-[#28221e] font-semibold' 
                      : 'text-[#8a8076] hover:text-[#28221e]'
                  }`}
                >
                  0{num}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex relative items-center justify-center w-28 h-28 cursor-pointer select-none">
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="circlePathHero"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9.2px] uppercase tracking-[0.24em] fill-[#504741] font-medium">
                    <textPath href="#circlePathHero" startOffset="0%">
                      SCROLL TO EXPLORE • SCROLL TO EXPLORE •
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#504741]/40 flex items-center justify-center text-[#504741]">
                <ArrowDown className="w-4 h-4 stroke-[1.5]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section className="py-20 lg:py-24 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#736b63] block mb-1">
              EXPLORE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#28221e]">
              Shop by Category
            </h2>
          </div>
          
          <button 
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#28221e] hover:text-[#965438] transition group cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <div 
              key={idx} 
              onClick={() => onNavigate('shop', cat.categoryKey)}
              className="group relative h-64 sm:h-72 lg:h-80 overflow-hidden cursor-pointer bg-[#e9e2d8]"
            >
              <img
                src={getImageUrl(cat.image)} 
                alt={cat.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                <span className="text-xs sm:text-[13px] uppercase tracking-[0.2em] font-medium drop-shadow-sm">
                  {cat.title}
                </span>
                <span className="w-8 h-8 rounded-full border border-white/70 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#28221e] transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS SECTION (Displays live backend database shirts) */}
      <section id="arrivals" className="pb-24 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#736b63] block mb-1">
              FRESHLY CRAFTED
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#28221e]">
              New Arrivals
            </h2>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-8">
            <p className="text-xs text-[#736b63] max-w-xs font-normal leading-relaxed hidden sm:block">
              Contemporary shirts with handcrafted details, made for everyday stories and special moments.
            </p>
            <button 
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#28221e] hover:text-[#965438] transition group cursor-pointer"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((shirt) => {
            const isOutOfStock = !shirt.in_stock || (shirt.variants && shirt.variants.length > 0 && shirt.variants.every(v => v.stock_quantity <= 0));
            return (
              <div 
                key={shirt.id} 
                className="group flex flex-col cursor-pointer"
                onClick={() => onOpenProduct(shirt)}
              >
                <div className="relative aspect-[3/4] bg-[#e9e2d8] overflow-hidden mb-3.5 border border-[#e2d8cc]">
                  <img 
                    src={getImageUrl(shirt.primary_image_url || MOCK_PRODUCTS[0].primary_image_url)} 
                    alt={shirt.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {isOutOfStock ? (
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
                      <span className="bg-[#28221e] text-white border border-white/20 text-[10px] uppercase tracking-[0.25em] font-semibold px-3 py-1.5 shadow-md">
                        OUT OF STOCK
                      </span>
                    </div>
                  ) : shirt.tag ? (
                    <span className="absolute top-3.5 left-3.5 bg-[#28221e]/85 backdrop-blur-md text-white text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-0.5 z-10">
                      {shirt.tag}
                    </span>
                  ) : null}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(shirt.id);
                    }}
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:text-[#df8f9f] hover:bg-black/40 transition shadow-sm cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 stroke-[1.75] ${
                        wishlist.includes(shirt.id) 
                          ? 'fill-[#df8f9f] text-[#df8f9f]' 
                          : 'text-white'
                      }`} 
                    />
                  </button>
                </div>

                <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#8a7f76]">
                  {shirt.category || 'Handcrafted Pieces'}
                </span>

                <h3 className="font-serif text-lg text-[#28221e] font-normal group-hover:text-[#965438] transition-colors leading-snug mt-0.5">
                  {shirt.name}
                </h3>
                
                <p className="text-sm font-normal text-[#28221e] mt-0.5">
                  ₹ {shirt.price.toLocaleString('en-IN')}
                </p>

                <div className="flex items-center gap-1.5 mt-2.5">
                  {(shirt.colors || ['#e5973b', '#b8b5b0', '#d8caa8']).map((color, cIdx) => (
                    <span 
                      key={cIdx}
                      className="w-3 h-3 rounded-full border border-black/15 inline-block shadow-2xs"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-5 mt-16">
          <button 
            className="w-10 h-10 rounded-full border border-[#d2c7bd] flex items-center justify-center text-[#28221e] hover:bg-[#28221e] hover:text-white hover:border-[#28221e] transition cursor-pointer"
            aria-label="Previous Page"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          
          <span className="text-xs tracking-[0.2em] text-[#736b63] font-mono px-3">
            01 &nbsp;/&nbsp; 04
          </span>
          
          <button 
            className="w-10 h-10 rounded-full border border-[#d2c7bd] flex items-center justify-center text-[#28221e] hover:bg-[#28221e] hover:text-white hover:border-[#28221e] transition cursor-pointer"
            aria-label="Next Page"
          >
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </section>
    </>
  );
};

