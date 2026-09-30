import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { EditorialOutlineRing, EditorialSmallDots } from './DecorativeElements';

import whyUsCrystalsImg from '../assets/images/why_us_crystals_1790183910255.jpg';

export const WhyUsSection: React.FC = () => {
  const { setCurrentView } = useEcommerce();

  return (
    <section className="relative w-full bg-[#F8F5EE] border-b border-[#E5DED2] py-10 sm:py-14 lg:py-20 overflow-hidden select-none">
      {/* Centered Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Two-Column Editorial Layout */}
        <div className="flex flex-col lg:flex-row items-stretch gap-10 sm:gap-12 lg:gap-14 xl:gap-16">
          
          {/* LEFT COLUMN: LARGE GEMSTONE PHOTOGRAPH */}
          <div className="w-full lg:w-[46%] flex flex-col justify-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[560px] xl:h-[600px] rounded-[14px] overflow-hidden border border-[#E5DED2] shadow-[0_4px_24px_rgba(37,34,29,0.05)] bg-[#FAF8F3] group">
              <img
                src={whyUsCrystalsImg}
                alt="Exquisite natural crystals, amethyst cluster, rose quartz, lapis lazuli and quartz on warm sunlit stone"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10">
                <p className="font-serif italic text-2xl sm:text-3xl text-white drop-shadow-md leading-tight tracking-wide font-normal">
                  Nature's Beauty
                </p>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="w-8 h-[1px] bg-white/80 inline-block" />
                  <p className="font-serif italic text-lg sm:text-xl text-white/95 drop-shadow-md tracking-wider font-light">
                    in Every Stone
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTENT */}
          <div className="w-full lg:w-[54%] flex flex-col justify-center">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#B08D57] inline-block flex-shrink-0" />
              <span className="text-[12px] sm:text-[13px] font-sans font-medium tracking-[3px] text-[#B08D57] uppercase">
                WHY GEO GEMS CRYSTALS
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-normal text-[#292820] leading-[1.12] tracking-tight">
                A World of Natural Beauty
              </h2>
              <div aria-hidden="true" className="hidden sm:flex items-center gap-2.5 flex-shrink-0 pointer-events-none select-none">
                <span className="w-8 h-[1px] bg-[#B7AEA2]" style={{ opacity: 0.25 }} />
                <EditorialSmallDots variant="pair-horizontal" color="#B7AEA2" accentColor="#B08D57" opacity={0.28} />
              </div>
            </div>

            <p className="font-body text-[#4A453D] mb-7 sm:mb-8 max-reading-section">
              At Geo Gems Crystals, we celebrate the natural beauty of gemstones and crystals, carefully selected for their unique character, color, and lasting appeal. Discover distinctive natural stones with clear product details and a personal, trustworthy buying experience.
            </p>

            <div className="pt-1">
              <button
                onClick={() => {
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] font-sans font-medium tracking-[1.5px] uppercase text-[#B08D57] hover:text-[#292820] transition-colors cursor-pointer group"
              >
                <span>ABOUT GEO GEMS CRYSTALS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust cards removed — same info shown in TrustStrip above hero */}
      </div>

      {/* Subtle partial outline ring in bottom-right corner */}
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -right-20 pointer-events-none select-none hidden lg:block z-0"
      >
        <EditorialOutlineRing size={220} color="#B7AEA2" opacity={0.12} />
      </div>
    </section>
  );
};
