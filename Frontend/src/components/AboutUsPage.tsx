import React from 'react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

interface AboutUsPageProps {
  onExploreCollection: () => void;
  onNavigateHome: () => void;
}

/**
 * =========================================================================
 * ADD YOUR IMAGES HERE:
 * Simply paste your image paths or URLs into the fields below.
 * While empty (""), elegant placeholders matching the design will display.
 * =========================================================================
 */
export const ABOUT_IMAGES = {
  heroModel: '',       // Left large hero image (e.g. model from back)
  signatureCollar: '', // Top collar embroidery closeup
  chairFolded: '',     // Top right shirt draped on chair
  cuffEmbroidery: '',  // Middle cuff embroidery closeup
  backEmbroidery: '',  // Bottom back neck embroidery closeup
};

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ 
  onExploreCollection,
  onNavigateHome 
}) => {
  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#28221E] py-8 sm:py-12 animate-fadeIn">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#736B63] mb-8 pb-4 border-b border-[#E6DFD5]/80">
          <button 
            onClick={onNavigateHome}
            className="hover:text-[#965438] transition cursor-pointer"
          >
            HOME
          </button>
          <span>/</span>
          <span className="text-[#28221E] font-semibold">ABOUT US</span>
        </div>

        {/* Master Editorial Screen (Matching Design Specification) */}
        <div className="bg-[#FAF7F2] border border-[#E0D5C7] shadow-sm relative overflow-hidden p-6 sm:p-10 lg:p-14">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start relative z-10">
            
            {/* ========================================================= */}
            {/* LEFT COLUMN: Narrative & Hero Image Placement */}
            {/* ========================================================= */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              
              <div>
                <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#736B63] block mb-3">
                  OUR CRAFT
                </span>

                <h1 className="font-serif text-5xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-tight font-normal text-[#28221E]">
                  Details <br />
                  that <br />
                  <span className="italic font-normal">Stay</span>
                </h1>

                {/* Vertical Accent Line & Story Text */}
                <div className="flex items-start gap-4 mt-8 mb-8 max-w-md">
                  <div className="w-[1.5px] h-12 bg-[#965438] shrink-0 mt-1" />
                  <p className="text-[#655D56] text-sm sm:text-base leading-relaxed font-light">
                    Thoughtfully designed shirts with handcrafted details, inspired by tradition and made for today.
                  </p>
                </div>

                {/* Explore Collection CTA Button */}
                <button 
                  onClick={onExploreCollection}
                  className="inline-flex items-center gap-4 bg-[#965438] hover:bg-[#80442C] text-white px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium transition-all group shadow-sm hover:shadow cursor-pointer"
                >
                  <span>EXPLORE COLLECTION</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                    ————→
                  </span>
                </button>
              </div>

              {/* Hero Image Container Placeholder (Model from back in mockup) */}
              <div className="relative w-full aspect-[4/5] max-w-[460px] bg-[#EAE3D9] border border-[#D5C7BB] flex flex-col items-center justify-center overflow-hidden group shadow-xs">
                {ABOUT_IMAGES.heroModel ? (
                  <img 
                    src={getImageUrl(ABOUT_IMAGES.heroModel)} 
                    alt="Our Craft Hero" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-[#736B63]">
                    <div className="w-12 h-12 rounded-full bg-white/70 border border-[#D5C7BB] flex items-center justify-center mb-3 text-[#965438]">
                      <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221E]">
                      Hero Model Image Slot
                    </span>
                    <span className="text-[11px] text-[#8A8076] mt-1 font-light max-w-xs">
                      Model back view with handcrafted embroidery. (Set <code className="bg-white/80 px-1 py-0.5 rounded-xs text-[#965438]">heroModel</code> in AboutUsPage.tsx)
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: 4-Photo Collage Mosaic with 3 Feature Callouts */}
            {/* ========================================================= */}
            <div className="lg:col-span-6 flex flex-col space-y-8">
              
              {/* TOP ROW: 2 Images (Collar on left with text, Chair on right) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                
                {/* 1. Signature Details: Collar Photo & Caption */}
                <div className="sm:col-span-6 flex flex-col">
                  <div className="relative aspect-[3/4] bg-[#EAE3D9] border border-[#D5C7BB] flex flex-col items-center justify-center overflow-hidden shadow-xs">
                    {ABOUT_IMAGES.signatureCollar ? (
                      <img 
                        src={getImageUrl(ABOUT_IMAGES.signatureCollar)} 
                        alt="Signature Details" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-[#736B63]">
                        <ImageIcon className="w-5 h-5 mb-2 text-stone-400 stroke-[1.5]" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#28221E]">
                          Collar Detail Image
                        </span>
                        <span className="text-[9px] text-[#8A8076] mt-0.5">
                          Set signatureCollar
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3.5">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#28221E] block">
                      SIGNATURE DETAILS
                    </span>
                    <p className="text-xs text-[#655D56] mt-1 leading-relaxed font-light">
                      Unique finishing touches inspired by culture and craft.
                    </p>
                  </div>
                </div>

                {/* 2. Chair Photo (Top Right) */}
                <div className="sm:col-span-6 flex flex-col sm:pt-4">
                  <div className="relative aspect-[3/4] bg-[#EAE3D9] border border-[#D5C7BB] flex flex-col items-center justify-center overflow-hidden shadow-xs">
                    {ABOUT_IMAGES.chairFolded ? (
                      <img 
                        src={getImageUrl(ABOUT_IMAGES.chairFolded)} 
                        alt="Artisanal Folded Shirt" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-[#736B63]">
                        <ImageIcon className="w-5 h-5 mb-2 text-stone-400 stroke-[1.5]" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#28221E]">
                          Chair & Shirt Image
                        </span>
                        <span className="text-[9px] text-[#8A8076] mt-0.5">
                          Set chairFolded
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* MIDDLE ROW: Cuff Photo on Left + Handcrafted Embroidery Caption on Right */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* 3. Cuff Photo */}
                <div className="sm:col-span-7">
                  <div className="relative aspect-[4/3] bg-[#EAE3D9] border border-[#D5C7BB] flex flex-col items-center justify-center overflow-hidden shadow-xs">
                    {ABOUT_IMAGES.cuffEmbroidery ? (
                      <img 
                        src={getImageUrl(ABOUT_IMAGES.cuffEmbroidery)} 
                        alt="Handcrafted Embroidery Cuff" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-[#736B63]">
                        <ImageIcon className="w-5 h-5 mb-2 text-stone-400 stroke-[1.5]" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#28221E]">
                          Cuff Embroidery Image
                        </span>
                        <span className="text-[9px] text-[#8A8076] mt-0.5">
                          Set cuffEmbroidery
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Handcrafted Embroidery Text */}
                <div className="sm:col-span-5">
                  <div className="w-6 h-[1.5px] bg-[#965438] mb-2 hidden sm:block" />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#28221E] block">
                    HANDCRAFTED EMBROIDERY
                  </span>
                  <p className="text-xs text-[#655D56] mt-1.5 leading-relaxed font-light">
                    Motifs, textures and stitches that bring each shirt to life.
                  </p>
                </div>

              </div>

              {/* BOTTOM ROW: Back Panel Photo on Left + Limited Pieces Caption on Right */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
                
                {/* 4. Back Embroidery (Hindi script in mockup) */}
                <div className="sm:col-span-7">
                  <div className="relative aspect-[16/9] bg-[#EAE3D9] border border-[#D5C7BB] flex flex-col items-center justify-center overflow-hidden shadow-xs">
                    {ABOUT_IMAGES.backEmbroidery ? (
                      <img 
                        src={getImageUrl(ABOUT_IMAGES.backEmbroidery)} 
                        alt="Limited Pieces Back Detail" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-[#736B63]">
                        <ImageIcon className="w-5 h-5 mb-2 text-stone-400 stroke-[1.5]" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#28221E]">
                          Back Panel Text Image
                        </span>
                        <span className="text-[9px] text-[#8A8076] mt-0.5">
                          Set backEmbroidery
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Limited Pieces Text */}
                <div className="sm:col-span-5">
                  <div className="w-6 h-[1.5px] bg-[#965438] mb-2 hidden sm:block" />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#28221E] block">
                    LIMITED PIECES
                  </span>
                  <p className="text-xs text-[#655D56] mt-1.5 leading-relaxed font-light">
                    Crafted in small batches with a focus on quality and individuality.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Delicate Botanical Line-Art SVG in Bottom Left Corner */}
          <div className="absolute -left-6 -bottom-8 w-44 sm:w-56 pointer-events-none opacity-20 text-[#965438]">
            <svg viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M10 230 C40 180 80 120 120 40" />
              <path d="M50 170 C30 145 25 105 45 80 C60 110 70 145 65 175" />
              <path d="M75 140 C60 115 65 80 90 60 C98 90 92 120 85 145" />
              <path d="M95 105 C85 85 92 55 115 45 C120 70 115 95 105 110" />
              <circle cx="120" cy="40" r="12" />
              <circle cx="120" cy="40" r="20" strokeDasharray="3 3" />
              <path d="M115 35 C110 20 120 12 130 12 C138 12 142 20 138 35" />
              <path d="M105 45 C90 40 85 50 90 60 C95 70 105 65 112 55" />
              <path d="M135 45 C150 40 155 50 150 60 C145 70 135 65 128 55" />
            </svg>
          </div>

        </div>

        {/* Bottom Navigation Return Strip */}
        <div className="mt-12 pt-8 border-t border-[#E6DFD5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#736B63] gap-4">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#965438] transition cursor-pointer"
          >
            ← RETURN TO HOMEPAGE
          </button>

          <button
            onClick={onExploreCollection}
            className="inline-flex items-center gap-2 uppercase tracking-wider font-semibold text-[#965438] hover:text-[#80442C] transition cursor-pointer"
          >
            <span>SHOP HANDCRAFTED APPAREL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </main>
  );
};

