import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getGeneralWhatsAppUrl } from '../utils/gemstoneHelpers';

// Import high-resolution luxury hero gemstone photos
import heroEmeraldImg from '../assets/images/hero_emerald_crystals_1790182903377.jpg';
import heroSapphireImg from '../assets/images/hero_sapphire_crystals_1790182927424.jpg';
import heroRubyImg from '../assets/images/hero_ruby_crystals_1790182949294.jpg';

interface HeroSlide {
  id: string;
  phrase: string;
  tagline: string;
  image: string;
  alt: string;
  specimen: string;
  footerTag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'amethyst',
    phrase: 'Timeless Beauty.',
    tagline: 'Natural gemstones and crystals, carefully selected for collectors worldwide.',
    image: '/amethyst-crystal-hero.jpg',
    alt: 'Natural purple amethyst cluster, clear quartz, rose quartz and ruby on slate',
    specimen: 'Amethyst Cluster & Raw Quartz',
    footerTag: 'NATURAL GEMSTONES • CRYSTALS • CLEAR DETAILS',
  },
  {
    id: 'emerald',
    phrase: 'Pure Natural Color.',
    tagline: 'Natural emeralds, tourmalines, and mineral formations with clear details on weight and origin.',
    image: heroEmeraldImg,
    alt: 'Raw natural emerald crystals and rough tourmaline on dark slate',
    specimen: 'Natural Emerald & Tourmaline',
    footerTag: 'NATURAL EMERALDS • TOURMALINE • AUTHENTIC STONES',
  },
  {
    id: 'sapphire',
    phrase: 'Distinctive Stones.',
    tagline: 'Natural blue sapphire crystals and polished gemstones for collectors and custom jewelry.',
    image: heroSapphireImg,
    alt: 'Natural blue sapphire crystals and aquamarine points on dark volcanic stone',
    specimen: 'Blue Sapphire & Aquamarine',
    footerTag: 'BLUE SAPPHIRES • NATURAL AQUAMARINE • FINE STONES',
  },
  {
    id: 'ruby',
    phrase: 'Lasting Elegance.',
    tagline: 'From deep red rubies to golden citrine clusters, explore stones with direct WhatsApp assistance.',
    image: heroRubyImg,
    alt: 'Natural red ruby crystal and golden citrine clusters on textured basalt',
    specimen: 'Natural Ruby & Citrine Cluster',
    footerTag: 'NATURAL RUBIES • CITRINE CLUSTERS • DIRECT INQUIRY',
  },
];

export const Hero: React.FC = () => {
  const { setCurrentView } = useEcommerce();
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string>('Timeless Beauty.');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const currentSlide = HERO_SLIDES[slideIndex];
    const fullPhrase = currentSlide.phrase;
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < fullPhrase.length) {
        timer = setTimeout(() => setDisplayText(fullPhrase.slice(0, displayText.length + 1)), 70);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2800);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => setDisplayText(fullPhrase.slice(0, displayText.length - 1)), 38);
      } else {
        timer = setTimeout(() => {
          setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
          setIsDeleting(false);
        }, 320);
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, slideIndex]);

  const whatsAppUrl = getGeneralWhatsAppUrl(
    'Hello Geo Gems Crystals,\n\nI would like to inquire about your natural gemstones and crystals.'
  );
  const activeSlide = HERO_SLIDES[slideIndex];

  const goToSlide = (i: number) => {
    setSlideIndex(i);
    setDisplayText('');
    setIsDeleting(false);
  };

  return (
    <section className="w-full bg-[#F5F1E9] text-[#25221D] select-none overflow-hidden">

      {/* ═══════════════════════════════════════════════════════
          MOBILE LAYOUT (below lg) — Stacked: Text → Image
          ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Text block */}
        <div className="px-5 pt-8 pb-6 sm:px-8 sm:pt-12">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-eyebrow text-[10px] sm:text-[11px] text-[#B08D57] tracking-widest">
              GEO GEMS CRYSTALS
            </span>
            <span className="flex-1 h-[1px] bg-[#B08D57]/40 max-w-[40px]" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-[2rem] sm:text-[2.5rem] font-medium text-[#121212] leading-[1.1] tracking-tight mb-2">
            Natural Stones.
          </h1>
          <div className="flex items-center mb-5">
            <span className="font-serif text-[2rem] sm:text-[2.5rem] font-medium text-[#B08D57] leading-[1.1] tracking-tight min-h-[1.12em]">
              {displayText || '\u00A0'}
            </span>
            <span
              className="inline-block w-[3px] h-[1.6rem] sm:h-[2rem] bg-[#B08D57] ml-1.5 rounded-sm animate-pulse flex-shrink-0"
              aria-hidden="true"
            />
          </div>

          {/* Tagline */}
          <p className="text-[14px] sm:text-[15px] font-sans text-[#4A453D] leading-[1.65] mb-7 max-w-[480px]">
            {activeSlide.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setCurrentView('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="primary-button flex-1 sm:flex-none justify-center"
              style={{ fontSize: '12px', letterSpacing: '1.6px' }}
            >
              <span>Explore Collection</span>
              <span>→</span>
            </button>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-[#B08D57]/50 text-[#B08D57] text-[12px] font-sans font-medium tracking-wide hover:bg-[#B08D57]/10 transition-colors"
              style={{ letterSpacing: '1.4px' }}
            >
              <WhatsAppIcon className="w-4 h-4 text-[#B08D57]" />
              <span>Inquire</span>
            </a>
          </div>
        </div>

        {/* Gemstone image — full width, tall, prominent */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                slideIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Soft bottom fade into background */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F5F1E9] to-transparent pointer-events-none z-20" />

          {/* Slide dots bottom-center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  slideIndex === i ? 'bg-[#B08D57] w-6' : 'bg-[#D8CFC2]/90 w-2'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Specimen label bottom-right */}
          <div className="absolute bottom-4 right-4 z-30 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F3]/90 backdrop-blur-md border border-[#D8CFC2] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] animate-pulse flex-shrink-0" />
            <span className="text-[10px] font-medium text-[#6F6A63] tracking-wide">{activeSlide.specimen}</span>
          </div>
        </div>

        {/* Footer tag row */}
        <div className="px-5 sm:px-8 py-3 flex items-center gap-3">
          <span className="w-6 h-[1px] bg-[#B08D57]/60 inline-block flex-shrink-0" />
          <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] text-[#6F6A63] uppercase truncate">
            {activeSlide.footerTag}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP LAYOUT (lg+) — Side by side: Text LEFT, Image RIGHT
          ═══════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex relative min-h-[800px] flex-col justify-between overflow-hidden"
        style={{ paddingBottom: '60px' }}
      >
        {/* Background image on right */}
        <div className="absolute inset-y-0 right-0 w-[58%] pointer-events-none z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                slideIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-right"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Curved left edge */}
          <svg
            className="absolute inset-y-0 left-0 h-full pointer-events-none z-10"
            style={{ width: '220px', overflow: 'visible' }}
            viewBox="0 0 220 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,0 L0,800 C40,800 55,750 52,680 C50,640 38,600 44,540 C52,460 90,420 88,340 C86,260 42,220 46,140 C50,70 30,30 0,0 Z"
              fill="#F5F1E9"
            />
            <path
              d="M52,800 C40,800 28,750 30,680 C32,640 46,600 52,540 C60,460 98,420 96,340 C94,260 50,220 54,140 C58,70 38,30 8,0"
              fill="none"
              stroke="#B08D57"
              strokeWidth="0.9"
              strokeOpacity="0.4"
            />
          </svg>

          {/* Left-edge gradient */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#F5F1E9] via-[#F5F1E9]/80 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F5F1E9] to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F5F1E9] to-transparent pointer-events-none z-20" />

          {/* Specimen badge desktop */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F3]/90 backdrop-blur-md border border-[#D8CFC2] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#B08D57] animate-pulse" />
            <span className="text-[11px] font-medium text-[#6F6A63] tracking-wide">{activeSlide.specimen}</span>
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-[#D8CFC2]">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    slideIndex === i ? 'bg-[#B08D57] w-4' : 'bg-[#D8CFC2] w-2 hover:bg-[#6F6A63]'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div
          className="absolute inset-x-0 bottom-0 z-[5] pointer-events-none"
          aria-hidden="true"
          style={{ height: '80px' }}
        >
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full" style={{ display: 'block' }}>
            <path
              d="M0,80 L0,50 C180,20 360,5 540,15 C720,25 900,55 1080,50 C1260,45 1350,30 1440,20 L1440,80 Z"
              fill="#F8F5EE"
            />
            <path
              d="M0,50 C180,20 360,5 540,15 C720,25 900,55 1080,50 C1260,45 1350,30 1440,20"
              fill="none"
              stroke="#B08D57"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />
          </svg>
        </div>

        {/* Text content */}
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-12 pt-28 pb-10 flex-grow flex flex-col justify-between">
          <div className="w-full max-w-[52%] xl:max-w-[50%] flex flex-col justify-center my-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-eyebrow text-[12.5px] text-[#B08D57]">GEO GEMS CRYSTALS</span>
              <span className="w-10 h-[1px] bg-[#B08D57]/60 inline-block" />
            </div>

            <h1 className="font-display-xl text-left mb-6">
              <span className="block text-[#121212]">Natural Stones.</span>
              <span className="flex items-center text-[#B08D57] min-h-[1.12em]">
                <span>{displayText || '\u00A0'}</span>
                <span
                  className="inline-block w-[4px] h-[0.76em] bg-[#B08D57] ml-2 rounded-sm animate-pulse flex-shrink-0"
                  aria-hidden="true"
                />
              </span>
            </h1>

            <div className="min-h-[76px] flex items-start mb-9">
              <p className="font-hero-subtitle text-[17px] leading-[1.7] text-[#3D3933] max-w-[540px] transition-opacity duration-300">
                {activeSlide.tagline}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setCurrentView('collection');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="primary-button"
              >
                <span>Explore Collection</span>
                <span>→</span>
              </button>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#B08D57]/40 text-[#B08D57] text-[12px] font-sans font-medium tracking-[1.4px] hover:bg-[#B08D57]/10 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#B08D57]" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="pt-20 pb-2 flex items-center gap-4">
            <span className="w-10 h-[1px] bg-[#B08D57] inline-block flex-shrink-0" />
            <span className="text-xs font-sans tracking-[0.22em] text-[#6F6A63] uppercase font-light truncate">
              {activeSlide.footerTag}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
