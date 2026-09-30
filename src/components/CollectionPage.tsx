import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, RotateCcw, Sparkles, Bookmark, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { GEMSTONES } from '../data/gemstones';
import { GEMSTONE_CATEGORIES } from '../data/categories';
import { CURATED_COLLECTIONS } from '../data/collections';
import { ProductCard } from './ProductCard';
import { useEcommerce, inferStoneCategory } from '../context/EcommerceContext';
import { EditorialSmallDots } from './DecorativeElements';

export const CollectionPage: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    formatPrice,
    setCurrentView,
    navigateToCatalogMode,
    allProducts,
    savedStonesCount,
    setIsSavedStonesOpen,
  } = useEcommerce();

  const cuts = ['All Cuts', 'Oval', 'Cushion', 'Emerald Cut', 'Round Brilliant', 'Pear', 'Octagon'];
  const colors = ['All Colors', 'Red', 'Blue', 'Green', 'Purple', 'Teal / Seafoam', 'Yellow / Honey'];

  const sourceGemstones = allProducts && allProducts.length > 0 ? allProducts : GEMSTONES;
  const publicStones = useMemo(
    () => sourceGemstones.filter((g) => g.status !== 'draft' && g.status !== 'archived'),
    [sourceGemstones]
  );

  // Filter logic
  const filteredGemstones = useMemo(() => {
    return publicStones
      .filter((gem) => {
        // Primary Category filter (Gemstone vs Crystal)
        if (filters.selectedCategory && filters.selectedCategory !== 'All') {
          const cat = inferStoneCategory(gem);
          if (cat !== filters.selectedCategory) return false;
        }

        // Variety / Type filter
        if (filters.selectedType && filters.selectedType !== 'All') {
          if (gem.type.toLowerCase() !== filters.selectedType.toLowerCase()) return false;
        }

        // Collection filter
        if (filters.selectedCollection) {
          if (filters.selectedCollection === 'ruby' && gem.type !== 'Ruby') return false;
          if (filters.selectedCollection === 'sapphire' && gem.type !== 'Sapphire') return false;
          if (filters.selectedCollection === 'emerald' && gem.type !== 'Emerald') return false;
          if (filters.selectedCollection === 'amethyst' && gem.type !== 'Amethyst') return false;
          if (filters.selectedCollection === 'rare' && gem.stockStatus !== 'rare_1_of_1') return false;
        }

        // Price (only filter by price if priceUSD is set and not on request)
        if (
          gem.priceDisplayType !== 'on_request' &&
          gem.priceUSD &&
          (gem.priceUSD < filters.priceRange[0] || gem.priceUSD > filters.priceRange[1])
        ) {
          return false;
        }

        // Carat / Weight
        const stoneWeight = gem.weight !== undefined ? gem.weight : gem.carat;
        if (stoneWeight < filters.caratRange[0] || stoneWeight > filters.caratRange[1]) {
          return false;
        }

        // Cut
        if (filters.selectedCut && filters.selectedCut !== 'All Cuts') {
          if (!gem.cut?.toLowerCase().includes(filters.selectedCut.toLowerCase())) return false;
        }

        // Color
        if (filters.selectedColor && filters.selectedColor !== 'All Colors') {
          if (!gem.color?.toLowerCase().includes(filters.selectedColor.toLowerCase())) return false;
        }

        // Search Query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matches =
            gem.name.toLowerCase().includes(q) ||
            gem.type.toLowerCase().includes(q) ||
            (gem.stoneId && gem.stoneId.toLowerCase().includes(q)) ||
            (gem.origin && gem.origin.toLowerCase().includes(q)) ||
            (gem.cut && gem.cut.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // In stock
        if (
          filters.inStockOnly &&
          (gem.stockStatus === 'reserved' || gem.status === 'sold_out' || gem.status === 'sold')
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') return (a.priceUSD || 0) - (b.priceUSD || 0);
        if (filters.sortBy === 'price-high') return (b.priceUSD || 0) - (a.priceUSD || 0);
        const weightA = a.weight !== undefined ? a.weight : a.carat;
        const weightB = b.weight !== undefined ? b.weight : b.carat;
        if (filters.sortBy === 'carat-high') return weightB - weightA;
        return 0; // default order preserves newest first
      });
  }, [filters, publicStones]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.selectedCategory && filters.selectedCategory !== 'All') count++;
    if (filters.selectedType) count++;
    if (filters.selectedCollection) count++;
    if (filters.selectedCut && filters.selectedCut !== 'All Cuts') count++;
    if (filters.selectedColor && filters.selectedColor !== 'All Colors') count++;
    if (filters.priceRange[1] < 50000 || filters.priceRange[0] > 0) count++;
    if (filters.caratRange[1] < 50 || filters.caratRange[0] > 0) count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters]);

  const isCrystalView = filters.selectedCategory === 'Crystal';
  const isGemstoneView = filters.selectedCategory === 'Gemstone';

  const headingTitle = filters.selectedType
    ? `Natural ${filters.selectedType} Collection`
    : isCrystalView
    ? 'Explore Our Crystals'
    : isGemstoneView
    ? 'Explore Our Gemstones'
    : 'Explore Gemstones & Crystals';

  const breadcrumbPrimary = isCrystalView ? 'Crystals' : 'Gemstones';

  return (
    <div className="py-8 sm:py-10 lg:py-16 bg-[#FAF8F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6 sm:mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-breadcrumb mb-3 text-xs">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#B08D57] transition-colors cursor-pointer">Home</button>
            <span className="text-[#B7AEA2]">/</span>
            <span className="text-[#121212] font-medium">{breadcrumbPrimary}</span>
            {filters.selectedType && (
              <>
                <span className="text-[#B7AEA2]">/</span>
                <span className="text-[#B08D57] font-medium">{filters.selectedType}</span>
              </>
            )}
          </nav>

          <h1 className="font-h1 text-[#121212] mb-1">{headingTitle}</h1>
          <p className="font-body-small text-[#5A544A]">
            {filteredGemstones.length} stone{filteredGemstones.length === 1 ? '' : 's'} available
          </p>

          {/* Sort + filter controls — compact on mobile */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {savedStonesCount > 0 && (
              <button
                onClick={() => setIsSavedStonesOpen(true)}
                className="px-3 py-2 bg-white border border-[#E5DED2] hover:border-[#B08D57] rounded-xl text-xs font-medium text-[#121212] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#B08D57] fill-current" />
                <span>Saved ({savedStonesCount})</span>
              </button>
            )}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-3 py-2 bg-white border border-[#E5DED2] rounded-xl text-xs text-[#121212] focus:outline-none focus:border-[#B08D57] cursor-pointer ml-auto"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="carat-high">Weight: Largest</option>
            </select>
          </div>
        </div>

        {/* Primary Category Mode + Stone Variety Filter Pills — with right fade indicator */}
        <div className="relative mb-8">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            <button
              onClick={() => navigateToCatalogMode('All')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                !filters.selectedCategory && !filters.selectedType && !filters.selectedCollection
                  ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                  : 'bg-white text-[#5A544A] border border-[#E5DED2] hover:border-[#B08D57] hover:text-[#121212]'
              }`}
            >
              All Stones ({publicStones.length})
            </button>

            <button
              onClick={() => navigateToCatalogMode('Gemstone')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                filters.selectedCategory === 'Gemstone' && !filters.selectedType
                  ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                  : 'bg-white text-[#5A544A] border border-[#E5DED2] hover:border-[#B08D57] hover:text-[#121212]'
              }`}
            >
              Gemstones ({publicStones.filter((g) => inferStoneCategory(g) === 'Gemstone').length})
            </button>

            <button
              onClick={() => navigateToCatalogMode('Crystal')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                filters.selectedCategory === 'Crystal' && !filters.selectedType
                  ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                  : 'bg-white text-[#5A544A] border border-[#E5DED2] hover:border-[#B08D57] hover:text-[#121212]'
              }`}
            >
              Crystals ({publicStones.filter((g) => inferStoneCategory(g) === 'Crystal').length})
            </button>

            {GEMSTONE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedCategory: null,
                    selectedType: cat.name,
                    selectedCollection: null,
                  }))
                }
                className={`px-4 py-2 rounded-xl text-xs font-sans font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  filters.selectedType?.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                    : 'bg-white text-[#5A544A] border border-[#E5DED2] hover:border-[#B08D57] hover:text-[#121212]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {/* Right fade indicator — hints there are more pills */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#FAF8F3] to-transparent pointer-events-none" />
        </div>

        {/* Main Section: Filters Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Filter Sidebar — collapsible on mobile */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            activeFiltersCount={activeFiltersCount}
            formatPrice={formatPrice}
            cuts={cuts}
            colors={colors}
          />


          {/* Right Column: Gemstones Grid */}
          <div className="lg:col-span-9">
            {filteredGemstones.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#E5DED2] p-8 max-w-lg mx-auto">
                <Sparkles className="w-10 h-10 text-[#B08D57] mx-auto mb-3 opacity-60" />
                <h3 className="font-h3 text-[#121212] mb-2">
                  No Stones Match Your Filters
                </h3>
                <p className="font-body-small text-[#5A544A] max-w-sm mx-auto mb-6">
                  Try adjusting your weight or price range, or reset the filters to view all stones.
                </p>
                <button
                  onClick={resetFilters}
                  className="primary-button"
                >
                  <span>Reset Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {filteredGemstones.map((gem) => (
                  <ProductCard key={gem.id} gemstone={gem} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------
// Collapsible Filter Sidebar Component
// -------------------------------------------------------
function FilterSidebar({ filters, setFilters, resetFilters, activeFiltersCount, formatPrice, cuts, colors }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:col-span-3">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden w-full flex items-center justify-between bg-white border border-[#E5DED2] rounded-2xl px-4 py-3.5 shadow-xs cursor-pointer mb-2"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#B08D57]" />
          <span className="font-sans text-[13px] font-semibold text-[#121212] uppercase tracking-[0.08em]">Filter Stones</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-[#B08D57] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#5A544A]" /> : <ChevronDown className="w-4 h-4 text-[#5A544A]" />}
      </button>

      {/* Filter panel — always visible on desktop, toggleable on mobile */}
      <div className={`bg-white p-5 rounded-2xl border border-[#E5DED2] shadow-xs space-y-6 ${open ? 'block' : 'hidden'} lg:block`}>
        {/* Header */}
        <div className="hidden lg:flex items-center justify-between pb-3 border-b border-[#E5DED2]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#B08D57]" />
            <span className="font-sans text-[13px] font-semibold text-[#121212] uppercase tracking-[0.08em]">Filter Stones</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-[#B08D57] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#B08D57] hover:text-[#121212] flex items-center gap-1 font-sans font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Reset on mobile */}
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="lg:hidden text-xs text-[#B08D57] flex items-center gap-1 font-sans font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}

        {/* Cut / Shape */}
        <div>
          <label className="block font-spec-label mb-2">Cut &amp; Shape</label>
          <div className="space-y-1.5 font-sans">
            {cuts.map((cut: string) => (
              <label key={cut} className="flex items-center gap-2 text-[13px] text-[#5A544A] cursor-pointer hover:text-[#121212] transition-colors">
                <input
                  type="radio"
                  name="cutFilter"
                  checked={cut === 'All Cuts' ? !filters.selectedCut || filters.selectedCut === 'All Cuts' : filters.selectedCut === cut}
                  onChange={() => setFilters((prev: any) => ({ ...prev, selectedCut: cut === 'All Cuts' ? null : cut }))}
                  className="accent-[#B08D57]"
                />
                <span>{cut}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex items-center justify-between font-spec-label mb-2">
            <span>Maximum Price</span>
            <span className="text-[#B08D57] font-sans font-semibold">{formatPrice(filters.priceRange[1])}</span>
          </div>
          <input type="range" min="500" max="50000" step="500" value={filters.priceRange[1]}
            onChange={(e) => setFilters((prev: any) => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
            className="w-full accent-[#B08D57] cursor-pointer" />
          <div className="flex justify-between text-[11px] font-sans text-[#5A544A] mt-1">
            <span>{formatPrice(500)}</span>
            <span>{formatPrice(50000)}+</span>
          </div>
        </div>

        {/* Carat Weight */}
        <div>
          <div className="flex items-center justify-between font-spec-label mb-2">
            <span>Maximum Weight</span>
            <span className="text-[#B08D57] font-sans font-semibold">{filters.caratRange[1]} ct</span>
          </div>
          <input type="range" min="1" max="50" step="0.5" value={filters.caratRange[1]}
            onChange={(e) => setFilters((prev: any) => ({ ...prev, caratRange: [prev.caratRange[0], Number(e.target.value)] }))}
            className="w-full accent-[#B08D57] cursor-pointer" />
          <div className="flex justify-between text-[11px] font-sans text-[#5A544A] mt-1">
            <span>1.0 ct</span>
            <span>50.0 ct</span>
          </div>
        </div>

        {/* In stock only */}
        <div className="pt-2 border-t border-[#E5DED2]">
          <label className="flex items-center gap-2 text-xs font-sans text-[#121212] cursor-pointer font-medium">
            <input type="checkbox" checked={filters.inStockOnly}
              onChange={(e) => setFilters((prev: any) => ({ ...prev, inStockOnly: e.target.checked }))}
              className="rounded text-[#B08D57] focus:ring-0 accent-[#B08D57]" />
            <span>Available Stones Only</span>
          </label>
        </div>

        {/* Collections */}
        <div className="pt-4 border-t border-[#E5DED2]">
          <label className="block font-spec-label mb-2">Collections</label>
          <div className="space-y-1.5 font-sans">
            {CURATED_COLLECTIONS.map((col) => (
              <button key={col.id} type="button"
                onClick={() => setFilters((prev: any) => ({ ...prev, selectedCategory: null, selectedCollection: prev.selectedCollection === col.id ? null : col.id, selectedType: null }))}
                className={`block w-full text-left text-[13px] py-1 transition-colors cursor-pointer ${
                  filters.selectedCollection === col.id ? 'text-[#B08D57] font-semibold' : 'text-[#5A544A] hover:text-[#121212]'
                }`}>
                {col.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
