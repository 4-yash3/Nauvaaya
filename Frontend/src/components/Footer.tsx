import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'shop' | 'about', category?: string) => void;
  onAboutClick: () => void;
  onTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onAboutClick,
  onTrackOrder,
}) => {
  return (
    <footer className="relative bg-[#f7f4ee] text-[#28221e] pt-16 lg:pt-20 pb-8 border-t border-[#e6dfd5]/80 overflow-hidden">
      <div className="absolute right-0 bottom-12 w-64 lg:w-80 opacity-20 pointer-events-none text-[#736b63]">
        <svg viewBox="0 0 240 320" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M220 300 C180 260 140 180 150 80" />
          <path d="M160 200 C130 190 90 195 70 215 C80 195 120 180 155 185" />
          <path d="M150 130 C120 115 80 120 60 140 C70 120 110 105 145 118" />
          <circle cx="150" cy="70" r="16" />
          <circle cx="150" cy="70" r="26" strokeDasharray="3 3" />
          <path d="M140 60 C135 45 145 35 155 35 C165 35 170 45 165 60" />
          <path d="M130 75 C115 70 110 80 115 90 C120 100 130 95 140 85" />
          <path d="M170 75 C185 70 190 80 185 90 C180 100 170 95 160 85" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          <div className="lg:col-span-4 flex flex-col items-start lg:pr-8">
            <button 
              onClick={() => onNavigate('home')}
              className="flex flex-col items-start cursor-pointer group text-left"
            >
              <img 
                src="/logo.png" 
                alt="Nauvaaya" 
                className="h-20 sm:h-24 w-auto object-contain -ml-2 mb-2 group-hover:opacity-90 transition-opacity" 
              />
            </button>

            <div className="mt-4 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#736b63] font-medium leading-relaxed">
              <p>TRADITION IN EVERY THREAD</p>
              <p>A STORY IN EVERY WEAR</p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-[#8a8076]/40 flex items-center justify-center text-[#443c37] hover:text-[#965438] hover:border-[#965438] transition"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full border border-[#8a8076]/40 flex items-center justify-center text-[#443c37] hover:text-[#965438] hover:border-[#965438] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>

              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-[#8a8076]/40 flex items-center justify-center text-[#443c37] hover:text-[#965438] hover:border-[#965438] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a 
                href="https://whatsapp.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-[#8a8076]/40 flex items-center justify-center text-[#443c37] hover:text-[#965438] hover:border-[#965438] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.204 8.204 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.216 8.216 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.19-.09-1.12-.55-1.3-.61-.17-.07-.3-.1-.42.09-.13.19-.49.61-.6.74-.11.13-.22.15-.41.06-.19-.09-.79-.29-1.51-.93-.56-.5-.94-1.11-1.06-1.31-.12-.2-.01-.31.08-.4.09-.09.19-.22.28-.33.1-.11.13-.19.19-.31.07-.13.03-.24-.02-.33-.05-.09-.42-1.01-.58-1.39-.15-.36-.31-.31-.42-.32h-.36c-.12 0-.32.05-.49.23-.17.19-.65.64-.65 1.56s.67 1.81.76 1.94c.09.13 1.32 2.01 3.2 2.82.45.19.8.31 1.07.4.45.14.86.12 1.18.07.36-.05 1.12-.46 1.28-.9.16-.45.16-.83.11-.91-.04-.08-.17-.13-.36-.23z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="hidden lg:block w-[1px] bg-[#e6dfd5] self-stretch -mr-4" />

          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#28221e] block">
              SHOP
            </span>
            <div className="w-5 h-[1.5px] bg-[#28221e]/30 mt-1.5 mb-5" />
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#554b44]">
              <li>
                <button onClick={() => onNavigate('shop', 'All')} className="hover:text-[#965438] transition cursor-pointer text-left">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Shirts')} className="hover:text-[#965438] transition cursor-pointer text-left">
                  Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Embroidered Pieces')} className="hover:text-[#965438] transition cursor-pointer text-left">
                  Embroidered Pieces
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Statement Shirts')} className="hover:text-[#965438] transition cursor-pointer text-left">
                  Statement Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Exclusive Collections')} className="hover:text-[#965438] transition cursor-pointer text-left">
                  Exclusive Collections
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#28221e] block">
              ABOUT US
            </span>
            <div className="w-5 h-[1.5px] bg-[#28221e]/30 mt-1.5 mb-5" />
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#554b44]">
              <li>
                <button 
                  onClick={onAboutClick} 
                  className="hover:text-[#965438] transition cursor-pointer text-left"
                >
                  Our Story & Craft
                </button>
              </li>
              <li><a href="#journal" className="hover:text-[#965438] transition">Our Journal</a></li>
              <li><a href="#craft" className="hover:text-[#965438] transition">Craft & Culture</a></li>
              <li><a href="#sustainability" className="hover:text-[#965438] transition">Sustainability</a></li>
              <li><a href="#contact" className="hover:text-[#965438] transition">Contact Us</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#28221e] block">
              CUSTOMER CARE
            </span>
            <div className="w-5 h-[1.5px] bg-[#28221e]/30 mt-1.5 mb-5" />
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#554b44]">
              <li><a href="#faqs" className="hover:text-[#965438] transition">FAQs</a></li>
              <li><a href="#shipping" className="hover:text-[#965438] transition">Shipping & Delivery</a></li>
              <li><a href="#returns" className="hover:text-[#965438] transition">Returns & Exchanges</a></li>
              <li>
                <button 
                  onClick={onTrackOrder} 
                  className="hover:text-[#965438] transition cursor-pointer text-left"
                >
                  Track Your Order
                </button>
              </li>
              <li><a href="#size-guide" className="hover:text-[#965438] transition">Size Guide</a></li>
              <li><a href="#care" className="hover:text-[#965438] transition">Care Instructions</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#e6dfd5] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#736b63] gap-4">
          <div>
            © 2026 Nauvaaya. All Rights Reserved.
          </div>

          <div className="flex items-center gap-3">
            <a href="#privacy" className="hover:text-[#28221e] transition">Privacy Policy</a>
            <span className="opacity-40">|</span>
            <a href="#terms" className="hover:text-[#28221e] transition">Terms & Conditions</a>
            <span className="opacity-40">|</span>
            <a href="#sitemap" className="hover:text-[#28221e] transition">Sitemap</a>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-[#965438] stroke-[1.5] inline-block" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

