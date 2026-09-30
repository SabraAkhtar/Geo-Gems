import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CURATED_COLLECTIONS } from '../data/collections';
import { useEcommerce } from '../context/EcommerceContext';

export const FeaturedCollections: React.FC = () => {
  const { navigateToCollection, setCurrentView } = useEcommerce();

  return (
    <section className="relative py-10 sm:py-14 lg:py-20 bg-[#FAF8F3] border-b border-[#E1D9CD] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 mb-2.5 justify-center">
            <span className="w-8 sm:w-10 h-[1px] bg-[#B08D57] inline-block opacity-30" />
            <span className="font-eyebrow">Our Collections</span>
            <span className="w-8 sm:w-10 h-[1px] bg-[#B08D57] inline-block opacity-30" />
          </div>
          <h2 className="font-h2 text-[#121212]">Explore the Collection</h2>
          <p className="font-body-small text-[#5A544A] mt-2.5 max-reading-section mx-auto">
            Carefully selected groups of natural gemstones and crystals organized by stone type and character.
          </p>
        </div>

        {/* Top row: 2 equal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-4 sm:mb-5 lg:mb-6">
          {[CURATED_COLLECTIONS[0], CURATED_COLLECTIONS[1]].map((col) => (
            <div
              key={col.id}
              onClick={() => navigateToCollection(col.id)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-[#EAE3D8] aspect-[4/3] sm:aspect-[3/2] shadow-md hover:shadow-xl border border-[#D8CFC2] transition-all duration-300"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/80 via-[#1B1916]/30 via-40% to-transparent group-hover:from-[#0D0B09]/90 transition-all duration-300 pointer-events-none" />
              <div className="absolute inset-0 p-5 sm:p-7 lg:p-8 flex flex-col justify-end pointer-events-none">
                <div className="inline-block bg-[#0D0B09]/40 backdrop-blur-md rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 border border-white/10 self-start group-hover:border-[#D4B06A]/40 transition-colors duration-300">
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-[28px] xl:text-[32px] text-white drop-shadow-md font-normal tracking-wide group-hover:text-[#D4B06A] transition-colors duration-300">
                    {col.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row: 3 equal columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {CURATED_COLLECTIONS.slice(2).map((col) => (
            <div
              key={col.id}
              onClick={() => navigateToCollection(col.id)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-[#EAE3D8] aspect-[4/3] sm:aspect-[3/2] shadow-md hover:shadow-xl border border-[#D8CFC2] transition-all duration-300"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/80 via-[#1B1916]/30 via-40% to-transparent group-hover:from-[#0D0B09]/90 transition-all duration-300 pointer-events-none" />
              <div className="absolute inset-0 p-4 sm:p-5 lg:p-6 flex flex-col justify-end pointer-events-none">
                <div className="inline-block bg-[#0D0B09]/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 self-start group-hover:border-[#D4B06A]/40 transition-colors duration-300">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-white drop-shadow-md font-normal tracking-wide group-hover:text-[#D4B06A] transition-colors duration-300">
                    {col.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VIEW ALL CTA */}
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={() => {
              setCurrentView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="primary-button"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
