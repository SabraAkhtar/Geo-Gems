import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { BespokeInquiryCTA } from './BespokeInquiryCTA';
import { EditorialOutlineRing } from './DecorativeElements';

export const InspirationSection: React.FC = () => {
  const { setCurrentView, setFilters } = useEcommerce();

  const inspirationItems = [
    {
      title: 'Bespoke Sapphire Solitaires',
      concept: 'Ring Commission Concept',
      category: 'ROYAL CEYLON SAPPHIRE',
      gemstoneFilter: 'Sapphire',
      image: '/inspiration/sapphire-solitaire.jpg',
      description: 'Cushion and oval cuts set in unplated white gold or platinum bezels.',
    },
    {
      title: 'Heirloom Ruby Pendants',
      concept: 'Necklace Architecture',
      category: 'MOGOK PIGEON BLOOD RUBY',
      gemstoneFilter: 'Ruby',
      image: '/inspiration/ruby-pendant.jpg',
      description: 'Intense red luminescence complemented by delicate golden halos.',
    },
    {
      title: 'Verdant Emerald Cocktail Designs',
      concept: 'High-Jewellery Setting',
      category: 'COLOMBIAN MUZO EMERALD',
      gemstoneFilter: 'Emerald',
      image: '/inspiration/emerald-setting.jpg',
      description: 'Step-cut silhouettes harmonized with sculptural geometric claws.',
    },
    {
      title: 'Violet Amethyst Statement Accents',
      concept: 'Earrings & Brooch Inspiration',
      category: 'SIBERIAN DEEP AMETHYST',
      gemstoneFilter: 'Amethyst',
      image: '/inspiration/amethyst-accents.jpg',
      description: 'Large-carat concave facets creating dynamic flashes of internal fire.',
    },
  ];

  const handleCardClick = (gemstoneFilter: string) => {
    setFilters((prev) => ({ ...prev, selectedType: gemstoneFilter }));
    setCurrentView('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section className="relative py-10 sm:py-14 lg:py-20 bg-[#F8F5EE] border-b border-[#E5DFD5] overflow-hidden">
        {/* ONE large thin outline ring behind the gemstone image composition, partially cropped by the section boundary */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-28 -right-20 sm:-bottom-32 sm:right-[4%] z-0"
        >
          <EditorialOutlineRing size={480} color="#B08D57" opacity={0.13} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Area */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            {/* Small uppercase gold eyebrow text */}
            <div className="inline-flex items-center gap-2 mb-2 justify-center">
              <span className="text-[10.5px] sm:text-[11px] font-sans font-semibold tracking-[0.24em] text-[#B08D57] uppercase">
                NATURAL CHARACTER &amp; FORM
              </span>
            </div>

            {/* Small decorative gold divider underneath: horizontal line with center diamond */}
            <div className="flex items-center justify-center gap-3 my-2.5">
              <span className="w-12 sm:w-16 h-[1px] bg-[#B08D57]/40" />
              <span className="w-1.5 h-1.5 rotate-45 border border-[#B08D57]/60" />
              <span className="w-12 sm:w-16 h-[1px] bg-[#B08D57]/40" />
            </div>

            {/* Elegant high-contrast serif heading with gold highlight on 'Character' */}
            <h2 className="font-h2 font-normal tracking-tight mt-2 text-[#292820]">
              Every Stone Has Its Own <span className="text-[#B08D57]">Character</span>
            </h2>

            {/* Short centered supporting paragraph */}
            <p className="font-body-small text-[#5A544A] mt-3 sm:mt-4 max-reading-section mx-auto">
              See how different natural gemstone cuts and colors can be used in rings, pendants, earrings, and custom jewelry designs.
            </p>
          </div>

          {/* Four equal-width gemstone cards in one row on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {inspirationItems.map((item) => (
              <div
                key={item.title}
                onClick={() => handleCardClick(item.gemstoneFilter)}
                className="group bg-[#FAF8F3] rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-[#B08D57]/70 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Large photography area at top of each card */}
                <div className="aspect-[4/3.2] overflow-hidden bg-[#F3EFE8] relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
                    loading="lazy"
                  />
                  {/* Strong gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/80 via-[#1B1916]/30 via-45% to-transparent pointer-events-none" />

                  {/* Overlaid category label and concept with frosted backdrop */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3.5 pointer-events-none">
                    <div className="inline-block bg-[#0D0B09]/40 backdrop-blur-sm rounded-lg px-3 py-2">
                      {/* Small uppercase gold gemstone category label */}
                      <div className="text-[10px] sm:text-[11px] uppercase font-sans font-bold tracking-[0.18em] text-[#D4B06A] leading-none">
                        {item.category}
                      </div>
                      {/* Small white concept/subtitle underneath */}
                      <div className="text-[12px] sm:text-[13px] font-serif font-light text-white mt-1.5 tracking-wide leading-tight">
                        {item.concept}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cream/off-white content area underneath each image */}
                <div className="p-3 sm:p-5 flex flex-col justify-between flex-grow bg-[#FAF8F3]">
                  <div>
                    <h3 className="font-serif text-[14px] sm:text-[17px] font-normal text-[#292820] leading-snug group-hover:text-[#B08D57] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="hidden sm:block text-[12px] sm:text-[13px] text-[#716B60] font-light leading-relaxed mt-1.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-[#E5DFD5] flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(item.gemstoneFilter);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-[#B08D57] bg-transparent text-[#B08D57] text-[11px] font-sans font-semibold uppercase tracking-[0.13em] hover:bg-[#B08D57] hover:text-white transition-all duration-200 cursor-pointer group-hover:border-[#967543] group-hover:shadow-sm"
                    >
                      <span>View Stones</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Centered Luxury Inquiry CTA Section */}
      <BespokeInquiryCTA />
    </>
  );
};
