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
    <section className="relative w-full bg-[#F8F5EE] border-b border-[#E5DED2] py-12 sm:py-16 lg:py-20 overflow-hidden select-none">
      {/* Centered Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Two-Column Editorial Layout */}
        <div className="flex flex-col lg:flex-row items-stretch gap-10 sm:gap-12 lg:gap-14 xl:gap-16">
          
          {/* LEFT COLUMN: LARGE GEMSTONE PHOTOGRAPH */}
          <div className="w-full lg:w-[46%] flex flex-col justify-center">
            <div className="relative w-full h-[480px] sm:h-[580px] lg:h-[630px] xl:h-[660px] rounded-[14px] sm:rounded-[16px] overflow-hidden border border-[#E5DED2] shadow-[0_4px_24px_rgba(37,34,29,0.05)] bg-[#FAF8F3] group">
              <img
                src={whyUsCrystalsImg}
                alt="Exquisite natural crystals, amethyst cluster, rose quartz, lapis lazuli and quartz on warm sunlit stone"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
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
                <span className="transition-transform group-hover:translate-x-1.5 text-sm sm:text-base">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            FOUR TRUST CARDS — Full-width horizontal row
            Reference style: icon+number top, title+desc, curved dome image bottom
            ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-14 sm:mt-16 lg:mt-20">
          {TRUST_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="relative bg-[#FAF8F3] rounded-[18px] border border-[#E5DED2] hover:border-[#B08D57]/50 transition-all duration-300 group overflow-hidden shadow-[0_2px_14px_rgba(37,34,29,0.04)] hover:shadow-[0_6px_24px_rgba(176,141,87,0.10)] min-h-[230px] flex flex-col"
              >
                {/* ── Background Image with Elliptical Top-Left Curve ── */}
                <div 
                  className="absolute right-0 bottom-0 w-[72%] h-[68%] overflow-hidden z-0"
                  style={{ borderTopLeftRadius: '100%' }}
                >
                  <img
                    src={card.specimenImage}
                    alt={card.specimenAlt}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle dark overlay for contrast, fades on hover */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                </div>

                {/* ── Thin Gold Accent Line following the curve ── */}
                <div 
                  className="absolute right-0 bottom-0 z-10 pointer-events-none"
                  style={{ 
                    width: 'calc(72% + 5px)', 
                    height: 'calc(68% + 5px)', 
                    borderTopLeftRadius: '100%',
                    borderTop: '1px solid rgba(176,141,87,0.45)',
                    borderLeft: '1px solid rgba(176,141,87,0.45)'
                  }}
                />

                {/* ── Botanical Leaf Flourish at the bottom intersection ── */}
                <div className="absolute bottom-0 z-20 pointer-events-none" style={{ left: 'calc(28% - 14px)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-70 text-[#B08D57]">
                    {/* Small leaf left */}
                    <path d="M10,22 C10,16 6,12 2,12 C6,12 10,16 10,22 Z" fill="currentColor" />
                    {/* Tall leaf middle */}
                    <path d="M10,22 C10,12 15,6 22,6 C15,6 10,12 10,22 Z" fill="currentColor" />
                    {/* Medium leaf right */}
                    <path d="M10,22 C10,17 14,13 18,14 C14,13 10,17 10,22 Z" fill="currentColor" />
                  </svg>
                </div>

                {/* ── Text Content Area ── */}
                <div className="relative z-20 p-5 sm:p-6 flex-1 flex flex-col pointer-events-none">
                  {/* Top Row: Icon circle + Number */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-full border border-[#B08D57]/40 flex items-center justify-center text-[#B08D57] bg-[#FAF8F3]/50 backdrop-blur-sm">
                      <Icon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <span className="font-serif text-[13px] font-medium tracking-wide text-[#B08D57]/70">
                      {card.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-serif text-[16px] sm:text-[17px] font-normal text-[#292820] leading-snug tracking-tight mb-2.5 pr-2">
                    {card.title}
                  </h4>

                  {/* Divider */}
                  <div className="mb-3.5">
                    <span className="w-7 h-[1.5px] bg-[#B08D57]/40 inline-block" />
                  </div>

                  {/* Description - restricted width to avoid image overlap */}
                  <p className="font-sans text-[11px] sm:text-[12px] text-[#716B60] font-light leading-[1.6] w-[65%] sm:w-[60%]">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
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
