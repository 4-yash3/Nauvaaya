import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';
import { SUPABASE_STORAGE_URL } from '../data/mockProducts';

interface NewsletterSectionProps {
  email: string;
  onEmailChange: (val: string) => void;
  agreed: boolean;
  onAgreedChange: (val: boolean) => void;
  success: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  email,
  onEmailChange,
  agreed,
  onAgreedChange,
  success,
  onSubmit,
}) => {
  return (
    <section className="relative bg-[#3e2417] text-[#fbf9f5] overflow-hidden py-16 lg:py-24">
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-48 lg:w-64 opacity-25 pointer-events-none text-[#d6b79e]">
        <svg viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M10 200 C40 180 80 120 120 40" />
          <path d="M50 160 C70 140 120 130 150 110 C140 140 100 165 70 170" />
          <path d="M75 130 C105 100 160 90 190 70 C170 105 130 130 95 138" />
          <path d="M90 95 C120 70 160 55 180 20 C160 50 120 75 100 85" />
          <path d="M30 220 C60 250 110 290 160 330 C130 310 90 280 45 235" />
          <path d="M60 260 C90 300 140 350 180 390 C150 360 110 320 75 275" />
          <path d="M20 190 C-10 160 -10 100 20 60 C30 90 25 140 15 180" />
        </svg>
      </div>

      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 lg:w-64 opacity-25 pointer-events-none text-[#d6b79e]">
        <svg viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M190 200 C160 180 120 120 80 40" />
          <path d="M150 160 C130 140 80 130 50 110 C60 140 100 165 130 170" />
          <path d="M125 130 C95 100 40 90 10 70 C30 105 70 130 105 138" />
          <path d="M110 95 C80 70 40 55 20 20 C40 50 80 75 100 85" />
          <path d="M170 220 C140 250 90 290 40 330 C70 310 110 280 155 235" />
          <path d="M140 260 C110 300 60 350 20 390 C50 360 90 320 125 275" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#cbb8ad] block mb-2">
            STAY CONNECTED
          </span>
          <div className="w-8 h-[1px] bg-[#cbb8ad]/50 mb-5" />
          
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] font-normal text-[#fbf9f5] tracking-tight">
            Join Our <br />
            Newsletter
          </h2>
          
          <p className="text-[#cbb8ad] text-sm sm:text-base leading-relaxed mt-5 mb-8 font-light max-w-md">
            Be the first to know about new arrivals, exclusive drops, styling inspiration and stories from our world.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-0 max-w-md">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS"
                className="bg-transparent border border-[#6b4737] focus:border-[#965438] text-xs uppercase tracking-[0.2em] px-5 py-3.5 text-[#fbf9f5] placeholder:text-[#9f8577] focus:outline-none flex-1 transition-colors"
              />
              <button 
                type="submit"
                className="bg-[#965438] hover:bg-[#80442c] text-white text-xs uppercase tracking-[0.22em] font-medium px-7 py-3.5 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm sm:border-l-0"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div 
              onClick={() => onAgreedChange(!agreed)}
              className="flex items-start gap-2.5 pt-1 cursor-pointer select-none group"
            >
              <div className={`w-4 h-4 rounded-xs border flex items-center justify-center mt-0.5 transition-colors ${
                agreed 
                  ? 'bg-[#965438] border-[#965438] text-white' 
                  : 'border-[#8d6957] bg-transparent'
              }`}>
                {agreed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-[11px] sm:text-xs text-[#cbb8ad] leading-normal font-light">
                I'd like to receive updates, styling ideas and exclusive offers from Nauvaaya.
              </span>
            </div>

            {success && (
              <p className="text-xs text-[#d8b89d] font-medium pt-1">
                ✓ Welcome to the Nauvaaya circle. Thank you for subscribing!
              </p>
            )}
          </form>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-t-[180px] lg:rounded-t-[220px] overflow-hidden border border-[#5c3a2a] shadow-2xl bg-[#2e1a10]">
            <img 
              src={getImageUrl(`${SUPABASE_STORAGE_URL}/paper-and-poppy/2.png`)} 
              alt="Artisanal Handcrafted Apparel Still Life"
              className="w-full h-full object-cover object-center" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

