import React from 'react';
import { 
  Heart, 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag 
} from 'lucide-react';
import type { Product } from '../types';
import { getImageUrl } from '../utils/imageUrl';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface ShopPageProps {
  products: Product[];
  filteredProducts: Product[];
  wishlist: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSizeFilter: string;
  onSelectSizeFilter: (sz: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  onResetFilters: () => void;
  onToggleWishlist: (id: string) => void;
  onOpenProduct: (product: Product) => void;
  onNavigate: (page: 'home' | 'shop' | 'about', category?: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  filteredProducts,
  wishlist,
  selectedCategory,
  onSelectCategory,
  selectedSizeFilter,
  onSelectSizeFilter,
  sortBy,
  onSortByChange,
  searchQuery,
  onSearchQueryChange,
  onResetFilters,
  onToggleWishlist,
  onOpenProduct,
  onNavigate,
}) => {
  return (
    <main className="py-8 sm:py-12 max-w-[1440px] mx-auto px-6 lg:px-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#736b63] mb-6">
        <button 
          onClick={() => onNavigate('home')}
          className="hover:text-[#965438] transition cursor-pointer"
        >
          HOME
        </button>
        <span>/</span>
        <span className="text-[#28221e] font-semibold">
          {selectedCategory === 'All' ? 'SHOP ALL' : selectedCategory.toUpperCase()}
        </span>
      </div>

      {/* Shop Page Editorial Hero Banner */}
      <div className="border-b border-[#e6dfd5] pb-10 sm:pb-12 mb-10">
        <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#736b63] block mb-2">
          CONSCIOUS ARCHIVE • HANDCRAFTED COTTON
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#28221e] font-normal tracking-tight">
          Artisanal Shirts & Handcrafted Stories
        </h1>
        <p className="text-[#655d56] text-sm sm:text-base leading-relaxed max-w-2xl mt-4 font-normal">
          Every shirt is tailored from breathable natural fibers, detailed with intricate needlework, and produced in strictly limited, conscious batches inspired by regional Indian heritage.
        </p>
      </div>

      {/* Refinement & Filter Toolbar */}
      <div className="space-y-6 mb-12">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Shirts', 'Embroidered Pieces', 'Statement Shirts', 'Exclusive Collections'].map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs uppercase tracking-[0.18em] transition-all rounded-xs cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#28221e] text-[#fbf9f5] font-medium shadow-xs'
                  : 'bg-[#ede6dc] text-[#554b44] hover:bg-[#e4dbcf] hover:text-[#28221e]'
              }`}
            >
              {cat === 'All' ? 'All Pieces' : cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[#e6dfd5]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Size Filter Pills */}
            <div className="flex items-center gap-2 text-xs">
              <span className="uppercase tracking-wider text-[#736b63] text-[11px]">Size:</span>
              <div className="flex items-center gap-1">
                {['All', 'S', 'M', 'L'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onSelectSizeFilter(sz)}
                    className={`w-8 h-8 flex items-center justify-center border text-xs font-mono transition-all cursor-pointer ${
                      selectedSizeFilter === sz
                        ? 'border-[#28221e] bg-[#28221e] text-white font-bold'
                        : 'border-[#d5c7bb] hover:border-[#28221e] text-[#443c37]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Catalog Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#736b63]" />
              <input 
                type="text"
                placeholder="Search embroidery, motif..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="w-full bg-[#ede6dc] text-xs pl-8 pr-3 py-2 border border-transparent focus:border-[#28221e] focus:bg-white focus:outline-none transition-all placeholder:text-[#8a7f76]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <span className="text-xs text-[#736b63] font-mono">
              Showing {filteredProducts.length} of {products.length} pieces
            </span>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="appearance-none bg-[#ede6dc] text-xs uppercase tracking-wider text-[#28221e] px-4 py-2 pr-8 border border-transparent hover:border-[#d5c7bb] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Archive</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A to Z</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#736b63]" />
            </div>
          </div>
        </div>

        {/* Reset Filter Button if any filter active */}
        {(selectedCategory !== 'All' || selectedSizeFilter !== 'All' || searchQuery !== '') && (
          <div className="flex items-center gap-3 pt-2 text-xs text-[#965438]">
            <span>Active Filters applied</span>
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[#28221e] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#d5c7bb] bg-[#ede6dc]/30 p-8 my-8">
          <SlidersHorizontal className="w-8 h-8 text-[#965438] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-2xl text-[#28221e]">No shirts match your refinement</h3>
          <p className="text-xs text-[#736b63] mt-2 max-w-sm mx-auto">
            Try adjusting your category, size selection, or search keywords to view available pieces.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-6 bg-[#28221e] text-[#fbf9f5] px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#965438] transition cursor-pointer"
          >
            Show All Pieces
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((shirt) => {
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
      )}

      {/* Artisanal Craft Commitment Strip */}
      <div className="mt-24 pt-12 border-t border-[#e6dfd5] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[#28221e]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#ede5dc] border border-[#dcd3c7] flex items-center justify-center shrink-0 text-[#965438]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221e]">HAND-EMBROIDERED</h4>
            <p className="text-xs text-[#736b63] mt-1.5 leading-relaxed font-light">
              Meticulous threadwork crafted by regional artisans honoring traditional needle art.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#ede5dc] border border-[#dcd3c7] flex items-center justify-center shrink-0 text-[#965438]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221e]">100% PURE COTTON</h4>
            <p className="text-xs text-[#736b63] mt-1.5 leading-relaxed font-light">
              Breathable, natural staple fibers that soften beautifully with every gentle wash.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#ede5dc] border border-[#dcd3c7] flex items-center justify-center shrink-0 text-[#965438]">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221e]">SMALL-BATCH ETHOS</h4>
            <p className="text-xs text-[#736b63] mt-1.5 leading-relaxed font-light">
              Consciously manufactured in limited quantities to prevent overproduction and textile waste.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#ede5dc] border border-[#dcd3c7] flex items-center justify-center shrink-0 text-[#965438]">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221e]">RESPONSIBLE CARE</h4>
            <p className="text-xs text-[#736b63] mt-1.5 leading-relaxed font-light">
              Carefully boxed in plastic-free recycled paper with domestic and worldwide shipping.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

