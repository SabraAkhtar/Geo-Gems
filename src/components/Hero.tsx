import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { SecondaryButton } from './SecondaryButton';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getGeneralWhatsAppUrl } from '../utils/gemstoneHelpers';
import { EditorialOutlineRing, EditorialSmallDots } from './DecorativeElements';

// Import high-resolution luxury hero gemstone photos
import heroEmeraldImg from '../assets/images/hero_emerald_crystals_1790182903377.jpg';
import heroSapphireImg from '../assets/images/hero_sapphire_crystals_1790182927424.jpg';
import heroRubyImg from '../assets/images/hero_ruby_crystals_1790182949294.jpg';

interface HeroSlide {
  id: string;
  phrase: string;
  tagline: string;
  footerTag: string;
  specimen: string;
  image: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'amethyst',
    phrase: 'Timeless Beauty.',
    tagline: 'Discover natural gemstones and crystals, carefully selected for their rich color, unique character, and natural form.',
    footerTag: 'NATURAL GEMSTONES • CRYSTALS • CLEAR DETAILS',
    specimen: 'Amethyst Cluster & Raw Quartz',
    image: '/amethyst-crystal-hero.jpg',
    alt: 'Natural purple amethyst cluster, clear quartz, rose quartz, lapis lazuli and ruby on slate',
  },
  {
    id: 'emerald',
    phrase: 'Pure Natural Color.',
    tagline: 'Explore natural emerald crystals, green tourmalines, and mineral formations with clear details on weight, size, and origin.',
    footerTag: 'NATURAL EMERALDS • TOURMALINE • AUTHENTIC STONES',
    specimen: 'Natural Emerald & Tourmaline',
    image: heroEmeraldImg,
    alt: 'Raw natural emerald crystals and rough tourmaline on dark slate',
  },
  {
    id: 'sapphire',
    phrase: 'Distinctive Stones.',
    tagline: 'Natural blue sapphire crystals, aquamarine points, and polished gemstones ready for collectors and custom jewelry.',
    footerTag: 'BLUE SAPPHIRES • NATURAL AQUAMARINE • FINE STONES',
    specimen: 'Blue Sapphire & Aquamarine',
    image: heroSapphireImg,
    alt: 'Natural blue sapphire crystals and aquamarine points on dark volcanic stone',
  },
  {
    id: 'ruby',
    phrase: 'Lasting Elegance.',
    tagline: 'From deep red rubies to golden citrine clusters, explore carefully selected stones with direct WhatsApp assistance.',
    footerTag: 'NATURAL RUBIES • CITRINE CLUSTERS • DIRECT INQUIRY',
    specimen: 'Natural Ruby & Citrine Cluster',
    image: heroRubyImg,
    alt: 'Natural red ruby crystal and golden citrine clusters on textured basalt',
  },
];

export const Hero: React.FC = () => {
  const { setCurrentView } = useEcommerce();
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string>('Timeless Beauty.');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Typewriter effect with dynamic sentence removal & image switching
  useEffect(() => {
    const currentSlide = HERO_SLIDES[slideIndex];
    const fullPhrase = currentSlide.phrase;

    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      // Typing phase: add characters one by one
      if (displayText.length < fullPhrase.length) {
        timer = setTimeout(() => {
          setDisplayText(fullPhrase.slice(0, displayText.length + 1));
        }, 70);
      } else {
        // Finished typing: pause so user can read before erasing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2800);
      }
    } else {
      // Deleting phase: backspace character-by-character with cursor
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(fullPhrase.slice(0, displayText.length - 1));
        }, 38);
      } else {
        // Sentence completely removed! Now switch to next slide & new image
        timer = setTimeout(() => {
          setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
          setIsDeleting(false);
        }, 320);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, slideIndex]);

  // Centralized WhatsApp inquiry link
  const whatsAppUrl = getGeneralWhatsAppUrl(
    'Hello Geo Gems Crystals,\n\nI would like to inquire about your natural gemstones and crystals.'
  );

  const activeSlide = HERO_SLIDES[slideIndex];

  return (
    <section className="relative w-full bg-[#F5F1E9] text-[#25221D] overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[800px] flex flex-col justify-between select-none" style={{ paddingBottom: '110px' }}>
      {/* Subtle Editorial Decorative System — Strictly Behind Gemstone Composition */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-[2] overflow-hidden"
      >
        {/* A. ONE large thin outline ring behind the gemstone/image area (partially visible, slightly offset) */}
        <div
          className="hidden sm:block absolute right-[18%] lg:right-[22%] top-1/2 -translate-y-[54%]"
          style={{
            WebkitMaskImage:
              'linear-gradient(105deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 44%, rgba(0,0,0,0) 68%)',
            maskImage:
              'linear-gradient(105deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 44%, rgba(0,0,0,0) 68%)',
          }}
        >
          <EditorialOutlineRing
            size={540}
            color="#B08D57"
            opacity={0.14}
          />
        </div>

        {/* C. ONE very thin diagonal line near the image composition */}
        <div
          className="hidden lg:block absolute right-[42%] top-[22%] w-24 h-[1px] bg-[#B7AEA2] -rotate-[18deg]"
          style={{ opacity: 0.22 }}
        />

        {/* B. 3 very small irregularly spaced dots near the lower/right area of the hero */}
        <div className="hidden sm:block absolute bottom-20 right-10 lg:bottom-22 lg:right-14">
          <EditorialSmallDots
            variant="trio-irregular"
            color="#B7AEA2"
            accentColor="#B08D57"
            opacity={0.28}
          />
        </div>
      </div>

      {/* Cinematic Right-Side Gemstone Photography Container with Smooth Crossfade */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] pointer-events-none z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              slideIndex === idx
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-[center_right] lg:object-right"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* ─── PREMIUM CURVED EDGE: SVG clip-path wave flowing into cream left ─── */}
        {/* This SVG sits over the image and "cuts" the left edge into an elegant organic curve */}
        <svg
          className="hidden lg:block absolute inset-y-0 left-0 h-full pointer-events-none z-25"
          style={{ width: '220px', overflow: 'visible' }}
          viewBox="0 0 220 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Cream fill that creates the curved boundary — mirrors the hero bg */}
          <path
            d="M0,0 L0,800 C40,800 55,750 52,680 C50,640 38,600 44,540 C52,460 90,420 88,340 C86,260 42,220 46,140 C50,70 30,30 0,0 Z"
            fill="#F5F1E9"
          />
        </svg>

        {/* ─── THIN GOLD ACCENT LINE following the curve contour ─── */}
        <svg
          className="hidden lg:block absolute inset-y-0 left-0 h-full pointer-events-none z-26"
          style={{ width: '220px', overflow: 'visible' }}
          viewBox="0 0 220 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M52,800 C40,800 28,750 30,680 C32,640 46,600 52,540 C60,460 98,420 96,340 C94,260 50,220 54,140 C58,70 38,30 8,0"
            fill="none"
            stroke="#B08D57"
            strokeWidth="1"
            strokeOpacity="0.45"
          />
        </svg>

        {/* Soft Left-Edge Gradient Blend into #F5F1E9 (warm ivory) */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#F5F1E9] via-[#F5F1E9]/85 via-30% to-transparent pointer-events-none z-20" />

        {/* Mobile/Tablet Atmospheric Overlay so text remains crisp and readable */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-r from-[#F5F1E9] via-[#F5F1E9]/90 via-50% to-[#F5F1E9]/40 pointer-events-none z-20" />

        {/* Subtle Top & Bottom Seamless Blends into #F5F1E9 */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F5F1E9] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F5F1E9] to-transparent pointer-events-none z-20" />

        {/* Active Specimen Badge in bottom-right corner — sm and above */}
        <div className="hidden sm:flex absolute bottom-6 right-6 z-30 items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F3]/90 backdrop-blur-md border border-[#D8CFC2] shadow-sm text-xs pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#B08D57] animate-pulse" />
          <span className="text-[11px] font-medium text-[#6F6A63] tracking-wide">
            {activeSlide.specimen}
          </span>
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-[#D8CFC2]">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setSlideIndex(i);
                  setDisplayText('');
                  setIsDeleting(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  slideIndex === i ? 'bg-[#B08D57] w-4' : 'bg-[#D8CFC2] hover:bg-[#6F6A63]'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile-only slide dots — bottom-center, below specimen badge threshold */}
        <div className="sm:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setSlideIndex(i);
                setDisplayText('');
                setIsDeleting(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                slideIndex === i ? 'bg-[#B08D57] w-5' : 'bg-[#D8CFC2]/80 w-2 hover:bg-[#B08D57]/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ─── HERO BOTTOM WAVE TRANSITION into the section below ─── */}
      <div className="absolute inset-x-0 bottom-0 z-[5] pointer-events-none" aria-hidden="true" style={{ height: '80px' }}>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ display: 'block' }}
        >
          {/* Cream wave that softly transitions the hero bottom edge */}
          <path
            d="M0,80 L0,50 C180,20 360,5 540,15 C720,25 900,55 1080,50 C1260,45 1350,30 1440,20 L1440,80 Z"
            fill="#F8F5EE"
          />
          {/* Thin gold accent line along the wave */}
          <path
            d="M0,50 C180,20 360,5 540,15 C720,25 900,55 1080,50 C1260,45 1350,30 1440,20"
            fill="none"
            stroke="#B08D57"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {/* Main Two-Column Editorial Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 sm:px-8 lg:px-12 pt-14 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 flex-grow flex flex-col justify-between">
        <div className="w-full lg:max-w-[52%] xl:max-w-[50%] flex flex-col justify-center my-auto">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <span className="font-eyebrow text-xs sm:text-[12.5px] text-[#B08D57]">
              GEO GEMS CRYSTALS
            </span>
            <span className="w-8 sm:w-10 h-[1px] bg-[#B08D57]/60 inline-block" />
          </div>

          {/* Main Editorial Headline with Animated Rotating Text & Blinking Cursor */}
          <h1 className="font-display-xl text-left mb-6 sm:mb-7">
            <span className="block text-[#121212]">Natural Stones.</span>
            <span className="flex items-center text-[#B08D57] min-h-[1.12em] overflow-visible">
              <span>{displayText || '\u00A0'}</span>
              {/* Typewriter Blinking Cursor */}
              <span
                className="inline-block w-[3px] sm:w-[4px] lg:w-[4.5px] h-[0.76em] bg-[#B08D57] ml-1.5 sm:ml-2 rounded-xs animate-pulse flex-shrink-0"
                aria-hidden="true"
              />
            </span>
          </h1>

          {/* Supporting Paragraph with fixed reserve height to eliminate layout shifting across slides */}
          <div className="min-h-[64px] sm:min-h-[70px] lg:min-h-[76px] flex items-start max-reading-hero mb-8 sm:mb-9">
            <p className="font-hero-subtitle transition-opacity duration-300">
              {activeSlide.tagline}
            </p>
          </div>

          {/* Two Refined Understated CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary Button — Explore Collection */}
            <button
              onClick={() => {
                setCurrentView('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="primary-button"
            >
              <span>Explore Collection</span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>

            {/* Secondary Button — Inquire on WhatsApp */}
            <SecondaryButton
              href={whatsAppUrl}
              target="_blank"
              icon={<WhatsAppIcon className="w-4 h-4 text-white" />}
              text="Inquire"
              title="Inquire on WhatsApp"
              ariaLabel="Inquire on WhatsApp"
            />
          </div>
        </div>

        {/* Bottom Editorial Detail synced with current slide */}
        <div className="pt-14 sm:pt-20 lg:pt-24 pb-2 flex items-center gap-3 sm:gap-4">
          <span className="w-8 sm:w-10 h-[1px] bg-[#B08D57] inline-block flex-shrink-0" />
          <span className="text-[10px] sm:text-xs font-sans tracking-[0.22em] text-[#6F6A63] uppercase font-light truncate transition-all duration-500">
            {activeSlide.footerTag}
          </span>
        </div>
      </div>
    </section>
  );
};
