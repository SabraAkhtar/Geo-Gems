import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GEMSTONES } from '../data/gemstones';
import { ProductCard } from './ProductCard';
import { useEcommerce } from '../context/EcommerceContext';

export const ProductGrid: React.FC = () => {
  const { setCurrentView, allProducts } = useEcommerce();
  const [activeTab, setActiveTab] = useState<'all' | 'bestsellers' | 'rare' | 'untreated'>('all');

  const sourceGemstones = allProducts && allProducts.length > 0 ? allProducts : GEMSTONES;

  const filteredGemstones = sourceGemstones.filter((gem) => {
    if (gem.status === 'draft') return false;

    if (activeTab === 'bestsellers') return gem.isFeatured || gem.isBestseller;
    if (activeTab === 'rare') return gem.stockStatus === 'rare_1_of_1';
    if (activeTab === 'untreated')
      return (
        gem.treatment?.toLowerCase().includes('untreated') ||
        gem.treatment?.toLowerCase().includes('none') ||
        gem.treatment?.toLowerCase().includes('no heat') ||
        gem.treatment?.toLowerCase().includes('completely natural') ||
        gem.treatment?.toLowerCase().includes('natural formation') ||
        gem.treatment?.toLowerCase().includes('natural specimen')
      );
    return true;
  });

  // Show a clean complete set — always 8 (2 complete rows of 4 on desktop, 4 rows of 2 on mobile)
  // If fewer than 8, show what exists but ensure divisible count per row
  const total = filteredGemstones.length;
  // On desktop we do 4-col → show multiples of 4 up to 8
  // On tablet 2-col → any even count is fine
  // Pick up to 8, but if total < 8 just show all
  const displayCount = total <= 8 ? total : 8;
  const displayStones = filteredGemstones.slice(0, displayCount);
  const hasMore = total > displayCount;

  return (
    <section className="py-10 sm:py-14 lg:py-20 bg-[#FAF8F3] border-b border-[#E1D9CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="font-eyebrow block mb-2">Carefully Selected</span>
          <h2 className="font-h2 text-[#121212]">Featured Stones</h2>
          <p className="font-body-small text-[#5A544A] mt-2 max-reading-section mx-auto">
            Natural gemstones and crystals selected for collectors, jewelry makers, and stone lovers.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Stones' },
            { id: 'bestsellers', label: 'Featured' },
            { id: 'rare', label: 'Unique Stones' },
            { id: 'untreated', label: 'Untreated' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                  : 'bg-white text-[#5A544A] border border-[#E5DED2] hover:border-[#B08D57] hover:text-[#121212]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid — always 2-col on mobile, 3-col md, 4-col lg */}
        {displayStones.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
            {displayStones.map((gemstone) => (
              <ProductCard key={gemstone.id} gemstone={gemstone} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-[#F5F1E9] rounded-2xl border border-[#E1D9CD] max-w-sm mx-auto">
            <p className="font-serif text-lg text-[#292820] mb-2">No Stones Available</p>
            <p className="text-xs text-[#5A544A]">
              Please check back soon or explore our full collection.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <button
            onClick={() => {
              setCurrentView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="primary-button"
          >
            <span>{hasMore ? 'View All Stones' : 'Explore Collection'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
