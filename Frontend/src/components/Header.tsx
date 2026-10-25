import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Search, User, ShoppingBag } from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/mockProducts';

interface HeaderProps {
  currentPage: 'home' | 'shop' | 'product' | 'about';
  cartItemCount: number;
  onNavigate: (page: 'home' | 'shop' | 'about', category?: string) => void;
  onOpenCart: () => void;
  onAboutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  cartItemCount,
  onNavigate,
  onOpenCart,
  onAboutClick,
}) => {
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#965438] text-[#fbf9f5] text-[10px] sm:text-[11px] tracking-[0.24em] uppercase py-2 px-4 font-normal flex items-center justify-between border-b border-[#84472f]">
        <button 
          onClick={() => setAnnouncementIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
          className="opacity-75 hover:opacity-100 transition p-1 cursor-pointer"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>

        <div className="flex items-center justify-center gap-3 sm:gap-6 overflow-hidden whitespace-nowrap text-center text-xs sm:text-[11px]">
          <span>{ANNOUNCEMENTS[announcementIndex]}</span>
        </div>

        <button 
          onClick={() => setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
          className="opacity-75 hover:opacity-100 transition p-1 cursor-pointer"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>

      {/* 2. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#f7f4ee]/90 backdrop-blur-md border-b border-[#e6dfd5]/60 transition-all">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 sm:h-24 flex items-center justify-between">
          
          {/* Left Navigation */}
          <nav className="flex items-center gap-6 sm:gap-8 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium text-[#443c37]">
            <button 
              onClick={() => onNavigate('shop', 'All')}
              className={`flex items-center gap-1.5 transition cursor-pointer ${
                currentPage === 'shop'
                  ? 'text-[#965438] font-bold border-b-2 border-[#965438] pb-0.5' 
                  : 'hover:text-[#965438]'
              }`}
            >
              SHOP <ChevronDown className="w-3 h-3 opacity-60 stroke-[1.5]" />
            </button>
            
            <button 
              onClick={() => onNavigate('home')}
              className="hover:text-[#965438] transition cursor-pointer"
            >
              JOURNAL
            </button>
          </nav>

          {/* Centered Brand Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center group cursor-pointer py-1"
            aria-label="Nauvaaya Home"
          >
            <img 
              src="/logo.png" 
              alt="Nauvaaya" 
              className="h-14 sm:h-18 md:h-20 w-auto object-contain hover:opacity-90 transition-opacity" 
            />
          </button>

          {/* Right Navigation & Icons */}
          <div className="flex items-center gap-5 sm:gap-7">
            <nav className="hidden lg:flex items-center gap-8 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium text-[#443c37]">
              <button 
                onClick={onAboutClick}
                className={`hover:text-[#965438] transition cursor-pointer uppercase tracking-[0.22em] ${
                  currentPage === 'about'
                    ? 'text-[#965438] font-bold border-b-2 border-[#965438] pb-0.5' 
                    : ''
                }`}
              >
                ABOUT US
              </button>
              <a href="#contact" className="hover:text-[#965438] transition">CONTACT</a>
            </nav>
            
            <div className="flex items-center gap-3.5 sm:gap-4 text-[#28221e]">
              <button 
                onClick={() => onNavigate('shop')}
                aria-label="Search Catalog" 
                className="hover:text-[#965438] transition p-1 cursor-pointer"
              >
                <Search className="w-[19px] h-[19px] stroke-[1.5]" />
              </button>
              
              <button aria-label="Account" className="hover:text-[#965438] transition p-1 cursor-pointer">
                <User className="w-[19px] h-[19px] stroke-[1.5]" />
              </button>
              
              <button 
                onClick={onOpenCart}
                aria-label="Bag" 
                className="relative hover:text-[#965438] transition p-1 cursor-pointer"
              >
                <ShoppingBag className="w-[19px] h-[19px] stroke-[1.5]" />
                <span className="absolute -top-1 -right-1.5 bg-[#28221e] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-medium">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

