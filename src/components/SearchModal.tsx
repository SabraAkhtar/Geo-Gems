import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { GEMSTONES } from '../data/gemstones';
import { getPriceDisplay, getWeightDisplay } from '../utils/gemstoneHelpers';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openGemstoneDetail, formatPrice, allProducts } = useEcommerce();
  const [query, setQuery] = useState('');

  const sourceGemstones = allProducts && allProducts.length > 0 ? allProducts : GEMSTONES;

  // ESC key to close search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, setIsSearchOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return sourceGemstones.filter((gem) => {
      if (gem.status === 'draft' || gem.status === 'archived') return false;
      const stoneId = gem.stoneId || '';
      const certIssuer = gem.certificate?.issuer || '';
      const certReport = gem.certificate?.reportNumber || '';
      return (
        gem.name.toLowerCase().includes(q) ||
        stoneId.toLowerCase().includes(q) ||
        gem.type.toLowerCase().includes(q) ||
        (gem.treatment && gem.treatment.toLowerCase().includes(q)) ||
        (gem.origin && gem.origin.toLowerCase().includes(q)) ||
        (gem.color && gem.color.toLowerCase().includes(q)) ||
        (gem.cut && gem.cut.toLowerCase().includes(q)) ||
        (gem.collectionId && gem.collectionId.toLowerCase().includes(q)) ||
        certIssuer.toLowerCase().includes(q) ||
        certReport.toLowerCase().includes(q) ||
        (gem.description && gem.description.toLowerCase().includes(q))
      );
    });
  }, [query, sourceGemstones]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div
        className="min-h-screen px-4 pt-16 pb-12 flex justify-center relative"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsSearchOpen(false);
        }}
      >
        <div
          className="relative bg-[#FAF8F3] rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E5DED2] p-6 z-10 animate-in fade-in zoom-in-95 duration-200 h-fit max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="relative pb-4 border-b border-[#E5DED2] flex items-center gap-3">
            <Search className="w-4.5 h-4.5 text-[#B08D57] flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search gemstones, origins, cuts, stone IDs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full font-sans text-sm sm:text-[15px] font-normal sm:font-medium bg-transparent text-[#121212] placeholder-[#716B60] focus:outline-none"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 rounded-full hover:bg-white text-[#716B60] hover:text-[#121212] transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Tags when empty */}
          {!query && (
            <div className="py-6">
              <span className="font-spec-label block mb-3">
                Suggested Gemstone Searches:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Burma Ruby',
                  'Ceylon Sapphire',
                  'Muzo Emerald',
                  'Paraíba Tourmaline',
                  'Unheated',
                  'GGC-RB',
                  'GGC-SP',
                  'Imperial Topaz',
                  'Aquamarine',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E5DED2] hover:border-[#B08D57] text-xs font-sans text-[#5A544A] hover:text-[#121212] transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query && (
            <div className="py-4 overflow-y-auto flex-grow space-y-3">
              <div className="text-xs font-sans text-[#5A544A] font-medium">
                Found {searchResults.length} matching stone{searchResults.length === 1 ? '' : 's'}:
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-10 text-[#5A544A] font-sans">
                  <p className="text-sm text-[#121212] font-medium">No stones match "{query}".</p>
                  <p className="text-xs text-[#5A544A] mt-1 font-normal">
                    Try searching for "Ruby", "Sapphire", "Emerald", "GGC-RB", or "Untreated".
                  </p>
                </div>
              ) : (
                searchResults.map((gem) => (
                  <div
                    key={gem.id}
                    onClick={() => {
                      openGemstoneDetail(gem);
                      setIsSearchOpen(false);
                    }}
                    className="p-3 bg-white rounded-xl border border-[#E5DED2] hover:border-[#B08D57] transition-all flex items-center justify-between gap-4 cursor-pointer group shadow-xs hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#161514] flex-shrink-0">
                        <img
                          src={gem.images[0] || '/stones/ruby.jpg'}
                          alt={gem.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#B08D57] font-sans font-semibold tracking-wider uppercase">
                          <span>{gem.stoneId || gem.type}</span>
                          <span>•</span>
                          <span>{getWeightDisplay(gem, false)}</span>
                        </div>
                        <h4 className="font-card-title text-[15px] sm:text-[16px] text-[#121212] group-hover:text-[#B08D57] transition-colors leading-snug">
                          {gem.name}
                        </h4>
                        <div className="text-[12.5px] font-sans text-[#5A544A] font-normal">
                          {gem.cut} • {gem.origin ? gem.origin.split(',')[0] : 'Natural'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-sans text-xs sm:text-[13.5px] font-semibold text-[#121212]">
                          {getPriceDisplay(gem, formatPrice).label}
                        </div>
                        <div className="text-[11px] font-sans text-[#5A544A] uppercase tracking-wider">
                          {gem.status === 'sold' || gem.status === 'sold_out'
                            ? 'Sold'
                            : gem.status === 'reserved'
                            ? 'Reserved'
                            : 'Available'}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#5A544A] group-hover:text-[#B08D57] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
