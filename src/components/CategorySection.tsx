import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GEMSTONE_CATEGORIES } from '../data/categories';
import { useEcommerce } from '../context/EcommerceContext';
import { EditorialDotGrid, EditorialOutlineRing } from './DecorativeElements';

export const CategorySection: React.FC = () => {
  const { navigateToCategory } = useEcommerce();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Handle scroll progress to update pagination dots and button states
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = scrollLeft / maxScroll;
      const pages = Math.max(2, totalPages);
      const pageIndex = Math.min(pages - 1, Math.round(progress * (pages - 1)));
      setActivePageIndex(pageIndex);
    }
  };

  const [isInteracting, setIsInteracting] = useState(false);

  // Compute dynamic page count whenever the container resizes
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const computePages = () => {
      const { scrollWidth, clientWidth } = el;
      if (clientWidth > 0) {
        setTotalPages(Math.max(2, Math.ceil(scrollWidth / clientWidth)));
      }
    };
    computePages();
    const ro = new ResizeObserver(computePages);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      // Pause auto-scroll on touch as well as mouse hover
      const onTouchStart = () => setIsInteracting(true);
      const onTouchEnd = () => setTimeout(() => setIsInteracting(false), 1500);
      el.addEventListener('touchstart', onTouchStart, { passive: true });
      el.addEventListener('touchend', onTouchEnd, { passive: true });

      let autoScrollInterval: ReturnType<typeof setInterval>;

      if (!isInteracting) {
        autoScrollInterval = setInterval(() => {
          if (el) {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            const maxScroll = scrollWidth - clientWidth;

            if (scrollLeft >= maxScroll - 10) {
              el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              el.scrollTo({ left: scrollLeft + clientWidth * 0.7, behavior: 'smooth' });
            }
          }
        }, 3500);
      }

      return () => {
        el.removeEventListener('scroll', handleScroll);
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchend', onTouchEnd);
        if (autoScrollInterval) clearInterval(autoScrollInterval);
      };
    }
  }, [isInteracting]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.7;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToPage = (pageIndex: number) => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const pages = Math.max(2, totalPages);
      const targetScroll = pageIndex === 0 ? 0 : pageIndex >= pages - 1 ? maxScroll : (maxScroll / (pages - 1)) * pageIndex;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
      setActivePageIndex(pageIndex);
    }
  };

  return (
    <section id="gemstones-categories" className="relative py-10 sm:py-14 lg:py-20 bg-[#F5F1E9] border-b border-[#D8CFC2] overflow-hidden select-none">
      {/* Subtle Decorative Elements — Strictly in background corners away from images & titles */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Top-Right Subtle Dot Grid fading toward the edge */}
        <div className="hidden md:block absolute top-6 right-8 lg:top-8 lg:right-14">
          <EditorialDotGrid
            rows={5}
            cols={7}
            gap={20}
            dotSize={3}
            color="#B7AEA2"
            opacity={0.17}
            fadeDirection="top-right"
          />
        </div>

        {/* One very small outline ring partially outside the section boundary */}
        <div className="hidden sm:block absolute -bottom-10 -left-10">
          <EditorialOutlineRing size={108} color="#B7AEA2" opacity={0.12} />
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-2 justify-center">
            <span className="font-eyebrow">
              Natural Gemstones
            </span>
          </div>
          <h2 className="font-h2 text-[#121212]">
            Discover Our Gemstones
          </h2>
          <p className="font-body-small text-[#5A544A] mt-2.5 max-reading-section mx-auto">
            Browse natural gemstones and crystals by stone type, color, and natural form.
          </p>
        </div>

        {/* Carousel Container with Side Navigation Chevrons */}
        <div 
          className="relative group/carousel overflow-hidden"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
        >
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-2 sm:left-1 lg:left-2 top-1/3 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF8F3] hover:bg-[#B08D57] text-[#151515] border border-[#D8CFC2] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-2 sm:right-1 lg:right-2 top-1/3 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF8F3] hover:bg-[#B08D57] text-[#151515] border border-[#D8CFC2] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Circular Category Cards Row */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-5 sm:gap-7 lg:gap-8 overflow-x-auto pb-4 pt-2 px-2 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {GEMSTONE_CATEGORIES.map((category) => (
              <div
                key={category.id}
                onClick={() => navigateToCategory(category.id)}
                className="flex-shrink-0 flex flex-col items-center group cursor-pointer w-[110px] sm:w-[140px] md:w-[160px] lg:w-[185px]"
              >
                {/* Perfect Circle Container for the Stone Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden aspect-square bg-[#EAE3D8] relative shadow-md border-2 border-[#D8CFC2] group-hover:border-[#B08D57] group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-115"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Stone Name Underneath */}
                <h3 className="font-serif text-sm sm:text-base lg:text-[17px] font-medium text-[#151515] group-hover:text-[#B08D57] transition-colors mt-3 sm:mt-4 text-center tracking-wide">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Pagination Dots — dynamic count based on scroll width */}
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
            {Array.from({ length: totalPages }).map((_, pageIdx) => (
              <button
                key={pageIdx}
                onClick={() => scrollToPage(pageIdx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activePageIndex === pageIdx
                    ? 'bg-[#B08D57] w-6'
                    : 'bg-[#D8CFC2] w-2.5 hover:bg-[#B08D57]'
                }`}
                aria-label={`Go to page ${pageIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
