import React from 'react';
import { Gem, FileText, ShieldCheck, Globe } from 'lucide-react';
import { EditorialSmallDots } from './DecorativeElements';

// Decorative visuals for the 4 feature cards
import featEmeraldImg from '../assets/images/feat_emerald_crys_1790183930790.jpg';
import featMagnifierImg from '../assets/images/feat_magnifier_gem_1790183949412.jpg';
import featGiftboxImg from '../assets/images/feat_luxury_giftbox_1790183966430.jpg';
import featAirplaneImg from '../assets/images/feat_courier_plane_1790183982101.jpg';

interface FeatureCardItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  imageAlt: string;
}

const FEATURE_CARDS: FeatureCardItem[] = [
  {
    number: '01',
    title: 'Natural Gemstones & Crystals',
    description: 'Carefully selected natural stones and crystals with clear product photography.',
    icon: Gem,
    image: featEmeraldImg,
    imageAlt: 'Natural hexagonal emerald crystal with delicate green leaves',
  },
  {
    number: '02',
    title: 'Clear Stone Details',
    description: 'Honest information on weight, origin, cut, color, and known treatments.',
    icon: FileText,
    image: featMagnifierImg,
    imageAlt: 'Gemstone viewed through a jeweler magnifying loupe',
  },
  {
    number: '03',
    title: 'Direct WhatsApp Inquiry',
    description: 'Ask questions directly on WhatsApp and request additional photos or videos.',
    icon: ShieldCheck,
    image: featGiftboxImg,
    imageAlt: 'Luxury kraft paper gemstone gift box with refined ribbon',
  },
  {
    number: '04',
    title: 'Careful Packaging & Delivery',
    description: 'Every stone is securely packed and prepared with care for safe delivery.',
    icon: Globe,
    image: featAirplaneImg,
    imageAlt: 'Commercial delivery aircraft flying above white clouds',
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <section className="relative bg-transparent py-0 select-none overflow-hidden" style={{ marginTop: '-50px', zIndex: 20 }}>
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="relative bg-[#FFFFFF] rounded-2xl border border-[#E5DED2] overflow-hidden p-4 sm:p-5 lg:p-6 shadow-[0_4px_24px_rgba(37,34,29,0.06)] hover:border-[#B08D57]/50 transition-all duration-500 min-h-[180px] sm:min-h-[200px] lg:min-h-[240px] flex flex-col justify-between group"
              >
                {/* Top Area: Circular Icon & Number */}
                <div className="flex items-center justify-between z-10 relative">
                  <div className="w-11 h-11 rounded-full border border-[#B08D57]/40 bg-[#FAF8F3] flex items-center justify-center text-[#B08D57] shadow-sm group-hover:bg-[#B08D57] group-hover:text-white transition-all duration-300">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <span className="font-serif text-[15px] font-medium tracking-wider text-[#B08D57]/70">
                    {card.number}
                  </span>
                </div>

                {/* Middle Area: Heading & Gold Divider */}
                <div className="relative z-20 mt-4 sm:mt-6 pr-4 sm:pr-6">
                  <h3 className="font-serif text-[16px] sm:text-[18px] font-normal text-[#292820] leading-snug tracking-tight group-hover:text-[#B08D57] transition-colors duration-300">
                    {card.title}
                  </h3>
                  <div className="w-6 h-[1px] bg-[#B08D57] my-2.5 sm:my-3.5 opacity-70" />
                  <p className="font-sans text-[12px] sm:text-[13px] text-[#716B60] font-light leading-relaxed max-w-[85%]">
                    {card.description}
                  </p>
                </div>

                {/* Clean Elegant Image Inset */}
                <div className="absolute -bottom-2 -right-2 w-28 h-28 sm:w-32 sm:h-32 pointer-events-none select-none z-10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:-translate-x-1">
                  <div className="w-full h-full rounded-tl-[40px] rounded-br-[14px] overflow-hidden shadow-sm border-l border-t border-[#E5DED2]/80">
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="eager"
                    />
                    {/* Soft gradient blend for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FFFFFF] via-[#FFFFFF]/40 to-transparent opacity-80" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
