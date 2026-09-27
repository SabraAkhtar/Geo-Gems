import React from 'react';
import { Gem, Eye, FlaskConical, Globe } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { EditorialOutlineRing, EditorialSmallDots } from './DecorativeElements';

// Image assets for Why Us Section
import whyUsCrystalsImg from '../assets/images/why_us_crystals_1790183910255.jpg';
import specQuartzImg from '../assets/images/spec_clear_quartz_1790184002357.jpg';
import specAmethystImg from '../assets/images/spec_amethyst_1790184023726.jpg';
import specRoseQuartzImg from '../assets/images/spec_rose_quartz_1790184041671.jpg';
import specLapisImg from '../assets/images/spec_lapis_stone_1790184060910.jpg';

interface TrustCard {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  specimenImage: string;
  specimenAlt: string;
}

const TRUST_CARDS: TrustCard[] = [
  {
    number: '01',
    title: 'Natural Stones',
    description:
      'We focus on natural gemstones and crystals selected for their authentic color, form, and character.',
    icon: Gem,
    specimenImage: specQuartzImg,
    specimenAlt: 'Pure faceted clear quartz crystal point',
  },
  {
    number: '02',
    title: 'Clear Product Details',
    description:
      'Each listing includes clear photos, weight, dimensions, origin, and treatment information where available.',
    icon: Eye,
    specimenImage: specAmethystImg,
    specimenAlt: 'Natural deep purple amethyst cluster',
  },
  {
    number: '03',
    title: 'Helpful Guidance',
    description:
      'Whether you are buying your first crystal or choosing a fine gemstone, we help answer your questions clearly.',
    icon: FlaskConical,
    specimenImage: specRoseQuartzImg,
    specimenAlt: 'Raw natural pink rose quartz stone',
  },
  {
    number: '04',
    title: 'Direct WhatsApp Support',
    description:
      'Message us directly on WhatsApp to ask about availability, pricing, or additional photos of any stone.',
    icon: Globe,
    specimenImage: specLapisImg,
    specimenAlt: 'Natural royal blue lapis lazuli stone with golden flecks',
  },
];

export const WhyUsSection: React.FC = () => {
  const { setCurrentView } = useEcommerce();

  return (
    <section className="relative w-full bg-[#F8F5EE] border-b border-[#E5DED2] py-16 sm:py-20 lg:py-24 overflow-hidden select-none">
      {/* Centered Content Container matching 1440px viewport specification */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Two-Column Editorial Layout: Left ~46%, Right ~54%, Column gap 48px to 64px */}
        <div className="flex flex-col lg:flex-row items-stretch gap-10 sm:gap-12 lg:gap-14 xl:gap-16">
          
          {/* LEFT COLUMN: ONE LARGE, DOMINANT GEMSTONE PHOTOGRAPH (~46% on desktop) */}
          <div className="w-full lg:w-[46%] flex flex-col justify-center">
            <div className="relative w-full h-[480px] sm:h-[580px] lg:h-[630px] xl:h-[660px] rounded-[14px] sm:rounded-[16px] overflow-hidden border border-[#E5DED2] shadow-[0_4px_24px_rgba(37,34,29,0.05)] bg-[#FAF8F3] group">
              <img
                src={whyUsCrystalsImg}
                alt="Exquisite natural crystals, amethyst cluster, rose quartz, lapis lazuli and quartz on warm sunlit stone"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Natural gentle vignette at the bottom */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

              {/* Bottom-left inside caption: Nature's Beauty in Every Stone */}
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

          {/* RIGHT COLUMN: EXACT CONTENT HIERARCHY (~54% on desktop) */}
          <div className="w-full lg:w-[54%] flex flex-col justify-center">
            
            {/* A. Eyebrow Label with thin gold horizontal line */}
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#B08D57] inline-block flex-shrink-0" />
              <span className="text-[12px] sm:text-[13px] font-sans font-medium tracking-[3px] text-[#B08D57] uppercase">
                WHY GEO GEMS CRYSTALS
              </span>
            </div>

            {/* B. Main Heading with subtle decorative motif */}
            <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-normal text-[#292820] leading-[1.12] tracking-tight">
                A World of Natural Beauty
              </h2>
              <div aria-hidden="true" className="hidden sm:flex items-center gap-2.5 flex-shrink-0 pointer-events-none select-none">
                <span className="w-8 h-[1px] bg-[#B7AEA2]" style={{ opacity: 0.25 }} />
                <EditorialSmallDots variant="pair-horizontal" color="#B7AEA2" accentColor="#B08D57" opacity={0.28} />
              </div>
            </div>

            {/* C. Supporting Paragraph */}
            <p className="font-body text-[#4A453D] mb-7 sm:mb-8 max-reading-section">
              At Geo Gems Crystals, we celebrate the natural beauty of gemstones and crystals, carefully selected for their unique character, color, and lasting appeal. Discover distinctive natural stones with clear product details and a personal, trustworthy buying experience.
            </p>

            {/* D. Four Trust Cards — Premium 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-4.5 mb-7 sm:mb-8">
              {TRUST_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.number}
                    className="relative bg-white rounded-[16px] border border-[#E5DED2] hover:border-[#B08D57]/50 transition-all duration-300 group overflow-hidden shadow-[0_2px_14px_rgba(37,34,29,0.04)] hover:shadow-[0_4px_20px_rgba(176,141,87,0.08)]"
                  >
                    {/* Top gold accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#B08D57]/0 via-[#B08D57]/50 to-[#B08D57]/0 pointer-events-none" />

                    <div className="p-4 sm:p-5 flex flex-col gap-3.5">
                      {/* Header row: Arc image cutout LEFT + Number label RIGHT */}
                      <div className="flex items-start justify-between gap-3">

                        {/* Asymmetric arc-cut specimen image */}
                        <div className="relative flex-shrink-0">
                          {/* Decorative gold partial ring arc around image */}
                          <svg
                            className="absolute -top-1.5 -left-1.5 pointer-events-none z-10"
                            width="64" height="64"
                            viewBox="0 0 64 64"
                            aria-hidden="true"
                          >
                            <path
                              d="M10,54 A34,34 0 0,1 54,10"
                              fill="none"
                              stroke="#B08D57"
                              strokeWidth="1"
                              strokeOpacity="0.5"
                              strokeLinecap="round"
                            />
                          </svg>

                          {/* Image with asymmetric arc cutout — tall rounded left, arc bottom-right */}
                          <div
                            className="w-[58px] h-[72px] sm:w-[64px] sm:h-[80px] overflow-hidden bg-[#F5F0E6] border border-[#E5DED2]/80 shadow-sm"
                            style={{
                              borderRadius: '32px 14px 28px 16px',
                            }}
                          >
                            <img
                              src={card.specimenImage}
                              alt={card.specimenAlt}
                              className="w-full h-full object-cover object-center group-hover:scale-[1.06] transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        {/* Right side: Icon + Number stacked */}
                        <div className="flex flex-col items-end gap-1">
                          {/* Numbered label — prominent */}
                          <span
                            className="font-serif text-[28px] sm:text-[32px] leading-none font-normal tracking-tight"
                            style={{ color: '#B08D57', opacity: 0.22 }}
                          >
                            {card.number}
                          </span>
                          {/* Icon circle */}
                          <div className="w-7 h-7 rounded-full border border-[#B08D57]/30 flex items-center justify-center text-[#B08D57] bg-[#FAF8F3]">
                            <Icon className="w-3.5 h-3.5 stroke-[1.6]" />
                          </div>
                        </div>
                      </div>

                      {/* Thin decorative gold divider */}
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-[1px] bg-[#B08D57]/40 inline-block" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]/30 inline-block" />
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-serif text-[16px] sm:text-[17px] font-normal text-[#292820] mb-1.5 leading-snug tracking-tight">
                          {card.title}
                        </h4>
                        <p className="font-sans text-[12px] sm:text-[12.5px] text-[#716B60] font-light leading-[1.58]">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom-right subtle gold corner accent */}
                    <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                        <path d="M48,48 L48,20 Q36,36 20,48 Z" fill="#B08D57" fillOpacity="0.04" />
                        <path d="M48,20 Q36,36 20,48" stroke="#B08D57" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* E. About Geo Gems Link */}
            <div className="pt-1">
              <button
                onClick={() => {
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] font-sans font-medium tracking-[1.5px] uppercase text-[#B08D57] hover:text-[#292820] transition-colors cursor-pointer group"
              >
                <span>ABOUT GEO GEMS CRYSTALS</span>
                <span className="transition-transform group-hover:translate-x-1.5 text-sm sm:text-base">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
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
