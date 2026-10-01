import React from 'react';
import { Gem, FileText, ShieldCheck, Globe } from 'lucide-react';

import featEmeraldImg from '../assets/images/feat_emerald_crys_1790183930790.jpg';
import featMagnifierImg from '../assets/images/feat_magnifier_gem_1790183949412.jpg';
import featGiftboxImg from '../assets/images/feat_luxury_giftbox_1790183966430.jpg';
import featAirplaneImg from '../assets/images/feat_courier_plane_1790183982101.jpg';

const FEATURE_CARDS = [
  { number: '01', title: 'Natural Gemstones & Crystals', description: 'Carefully selected natural stones and crystals with clear product photography.', icon: Gem, image: featEmeraldImg, imageAlt: 'Natural hexagonal emerald crystal' },
  { number: '02', title: 'Clear Stone Details', description: 'Honest information on weight, origin, cut, color, and known treatments.', icon: FileText, image: featMagnifierImg, imageAlt: 'Gemstone magnifying loupe' },
  { number: '03', title: 'Direct WhatsApp Inquiry', description: 'Ask questions on WhatsApp and request additional photos or videos.', icon: ShieldCheck, image: featGiftboxImg, imageAlt: 'Luxury gemstone gift box' },
  { number: '04', title: 'Careful Packaging & Delivery', description: 'Every stone is securely packed and prepared with care for safe delivery.', icon: Globe, image: featAirplaneImg, imageAlt: 'Courier delivery aircraft' },
];

export const TrustStrip: React.FC = () => {
  return (
    /*
      Negative margin overlaps the Hero section below it.
      Reduced on mobile (-40px) to avoid excessive overlap with the shorter mobile hero.
    */
    <section
      className="relative bg-transparent py-0 select-none overflow-hidden"
      style={{ marginTop: '-40px', zIndex: 20 }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/*
          Mobile:  1 column — tall enough to read, compact enough to not feel heavy
          Tablet:  2 columns
          Desktop: 4 columns
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="relative bg-white rounded-2xl border border-[#E5DED2] overflow-hidden p-4 sm:p-5 lg:p-6 shadow-[0_4px_24px_rgba(37,34,29,0.06)] hover:border-[#B08D57]/50 transition-all duration-500 flex flex-col justify-between group"
                style={{ minHeight: '150px' }}
              >
                {/* Top: icon + number */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-10 h-10 rounded-full border border-[#B08D57]/40 bg-[#FAF8F3] flex items-center justify-center text-[#B08D57] shadow-sm group-hover:bg-[#B08D57] group-hover:text-white transition-all duration-300">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <span className="font-serif text-[14px] font-medium tracking-wider text-[#B08D57]/70">
                    {card.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-20 mt-3">
                  <h3 className="font-serif text-[15px] sm:text-[17px] font-normal text-[#292820] leading-snug tracking-tight group-hover:text-[#B08D57] transition-colors duration-300">
                    {card.title}
                  </h3>
                  <div className="w-5 h-px bg-[#B08D57] my-2 opacity-70" />
                  {/*
                    On mobile: text runs full width — no right padding needed because
                    the decorative image is positioned absolute at bottom-right and
                    only shown at sm+.
                  */}
                  <p className="font-sans text-[12px] sm:text-[12.5px] text-[#716B60] font-light leading-relaxed sm:pr-20">
                    {card.description}
                  </p>
                </div>

                {/*
                  Decorative image — absolute bottom-right.
                  Hidden on xs (< sm) to prevent text overlap on 320px.
                  Shown at sm+ where cards are wider.
                */}
                <div className="hidden sm:block absolute -bottom-2 -right-2 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none z-10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:-translate-x-1">
                  <div className="w-full h-full rounded-tl-[36px] rounded-br-[12px] overflow-hidden shadow-sm border-l border-t border-[#E5DED2]/80">
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/30 to-transparent opacity-75 pointer-events-none" />
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
