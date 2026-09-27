import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GEMSTONES } from '../data/gemstones';
import { ProductCard } from './ProductCard';
import { useEcommerce } from '../context/EcommerceContext';
import { EditorialSmallDots } from './DecorativeElements';

export const ProductGrid: React.FC = () => {
  const { setCurrentView, allProducts } = useEcommerce();
  const [activeTab, setActiveTab] = useState<'all' | 'bestsellers' | 'rare' | 'untreated'>('all');

  const sourceGemstones = allProducts && allProducts.length > 0 ? allProducts : GEMSTONES;

  const filteredGemstones = sourceGemstones.filter((gem) => {
    // Strict requirement: Draft products must NEVER appear publicly
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

  return (
    <section className="py-12 lg:py-20 bg-[#FAF8F3] border-b border-[#E1D9CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 relative">
          <div className="inline-flex items-center gap-3 mb-2 justify-center">
            <span
              aria-hidden="true"
              className="w-7 h-[1px] bg-[#B7AEA2] inline-block"
              style={{ opacity: 0.28 }}
            />
            <span className="font-eyebrow">
              Carefully Selected
            </span>
            <EditorialSmallDots
              variant="trio-editorial"
              color="#B7AEA2"
              accentColor="#B08D57"
              opacity={0.28}
            />
          </div>
          <h2 className="font-h2 text-[#121212]">
            Featured Stones
          </h2>
          <p className="font-body-small text-[#5A544A] mt-2.5 max-reading-section mx-auto">
            Explore natural gemstones and crystals selected for collectors, jewelry makers, and stone lovers.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10">
          {[
            { id: 'all', label: 'All Stones' },
            { id: 'bestsellers', label: 'Featured Stones' },
            { id: 'rare', label: 'Unique Stones' },
            { id: 'untreated', label: 'Untreated / No Heat' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-sans font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                  : 'bg-white text-[#5A544A] border border-[#E5DED2] hover:border-[#B08D57] hover:text-[#121212]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4-Column Grid on Desktop, 1 on Mobile, 2 on Small Tablet */}
        {filteredGemstones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGemstones.slice(0, 8).map((gemstone) => (
              <ProductCard key={gemstone.id} gemstone={gemstone} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#F5F1E9] rounded-2xl border border-[#E1D9CD] max-w-md mx-auto">
            <p className="font-serif text-xl text-[#292820] mb-2">No Stones Available</p>
            <p className="text-xs text-[#5A544A]">
              Please check back soon or explore our full collection.
            </p>
          </div>
        )}

        {/* Bottom CTA to Full Catalog */}
        <div className="mt-14 text-center">
          <button
            onClick={() => {
              setCurrentView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="primary-button"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
