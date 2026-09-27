import React from 'react';
import { CURATED_COLLECTIONS } from '../data/collections';
import { useEcommerce } from '../context/EcommerceContext';
import { EditorialOutlineRing } from './DecorativeElements';

export const FeaturedCollections: React.FC = () => {
  const { navigateToCollection } = useEcommerce();

  return (
    <section className="relative py-12 lg:py-20 bg-[#FAF8F3] border-b border-[#E1D9CD] overflow-hidden">
      {/* Subtle tiny hollow ring near a far corner of the section */}
      <div
        aria-hidden="true"
        className="hidden sm:block pointer-events-none select-none absolute top-10 right-10 lg:top-12 lg:right-16 z-0"
      >
        <EditorialOutlineRing size={68} color="#B7AEA2" opacity={0.13} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with thin editorial line */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-3 mb-2.5 justify-center">
            <span
              aria-hidden="true"
              className="w-8 sm:w-10 h-[1px] bg-[#B08D57] inline-block"
              style={{ opacity: 0.28 }}
            />
            <span className="font-eyebrow">
              Our Collections
            </span>
            <span
              aria-hidden="true"
              className="w-8 sm:w-10 h-[1px] bg-[#B08D57] inline-block"
              style={{ opacity: 0.28 }}
            />
          </div>
          <h2 className="font-h2 text-[#121212]">
            Explore the Collection
          </h2>
          <p className="font-body-small text-[#5A544A] mt-2.5 max-reading-section mx-auto">
            Carefully selected groups of natural gemstones and crystals organized by stone type and character.
          </p>
        </div>

        {/* Collections Grid - Equal Height Editorial Cards with Prominent Gemstone Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Item 1 - The Ruby Collection (Equal Height to Sapphire Selections) */}
          <div
            onClick={() => navigateToCollection(CURATED_COLLECTIONS[0].id)}
            className="col-span-1 md:col-span-1 lg:col-span-6 group cursor-pointer relative overflow-hidden rounded-2xl bg-[#EAE3D8] h-[340px] sm:h-[380px] lg:h-[420px] shadow-md hover:shadow-xl border border-[#D8CFC2] transition-all duration-300"
          >
            <img
              src={CURATED_COLLECTIONS[0].image}
              alt={CURATED_COLLECTIONS[0].title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            />
            {/* Darker gradient overlay, gets slightly darker on hover to ensure text pops */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/80 via-[#1B1916]/30 via-40% to-transparent group-hover:from-[#0D0B09]/90 transition-all duration-300 pointer-events-none" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end pointer-events-none">
              <div className="inline-block bg-[#0D0B09]/40 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 self-start group-hover:border-[#D4B06A]/40 transition-colors duration-300">
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-white drop-shadow-md font-normal tracking-wide group-hover:text-[#D4B06A] transition-colors duration-300">
                  {CURATED_COLLECTIONS[0].title}
                </h3>
              </div>
            </div>
          </div>

          {/* Item 2 - Sapphire Selections (Identical Height to The Ruby Collection) */}
          <div
            onClick={() => navigateToCollection(CURATED_COLLECTIONS[1].id)}
            className="col-span-1 md:col-span-1 lg:col-span-6 group cursor-pointer relative overflow-hidden rounded-2xl bg-[#EAE3D8] h-[340px] sm:h-[380px] lg:h-[420px] shadow-md hover:shadow-xl border border-[#D8CFC2] transition-all duration-300"
          >
            <img
              src={CURATED_COLLECTIONS[1].image}
              alt={CURATED_COLLECTIONS[1].title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/80 via-[#1B1916]/30 via-40% to-transparent group-hover:from-[#0D0B09]/90 transition-all duration-300 pointer-events-none" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end pointer-events-none">
              <div className="inline-block bg-[#0D0B09]/40 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 self-start group-hover:border-[#D4B06A]/40 transition-colors duration-300">
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-white drop-shadow-md font-normal tracking-wide group-hover:text-[#D4B06A] transition-colors duration-300">
                  {CURATED_COLLECTIONS[1].title}
                </h3>
              </div>
            </div>
          </div>

          {/* 3 Columns for remaining collections */}
          {CURATED_COLLECTIONS.slice(2).map((col) => (
            <div
              key={col.id}
              onClick={() => navigateToCollection(col.id)}
              className="col-span-1 md:col-span-1 lg:col-span-4 group cursor-pointer relative overflow-hidden rounded-2xl bg-[#EAE3D8] h-[260px] sm:h-[300px] lg:h-[320px] shadow-md hover:shadow-xl border border-[#D8CFC2] transition-all duration-300"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/80 via-[#1B1916]/30 via-40% to-transparent group-hover:from-[#0D0B09]/90 transition-all duration-300 pointer-events-none" />
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end pointer-events-none">
                <div className="inline-block bg-[#0D0B09]/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 self-start group-hover:border-[#D4B06A]/40 transition-colors duration-300">
                  <h3 className="font-serif text-xl sm:text-2xl text-white drop-shadow-md font-normal tracking-wide group-hover:text-[#D4B06A] transition-colors duration-300">
                    {col.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
