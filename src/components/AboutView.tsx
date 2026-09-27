import React from 'react';
import { ArrowRight, Sparkles, Check, ShieldCheck, Compass, Globe, Star } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';

// Authentic project gemstone & crystal photography assets
import heroEmeraldImg from '../assets/images/hero_emerald_crystals_1790182903377.jpg';
import whyUsCrystalsImg from '../assets/images/why_us_crystals_1790183910255.jpg';
import magnifierGemImg from '../assets/images/feat_magnifier_gem_1790183949412.jpg';
import gemSapphireImg from '../assets/images/gem_sapphire_oval_1790186313327.jpg';
import gemEmeraldImg from '../assets/images/gem_emerald_oct_1790186331677.jpg';
import gemRubyImg from '../assets/images/gem_ruby_oval_1790186397653.jpg';
import gemDiamondImg from '../assets/images/gem_diamond_round_1790186471386.jpg';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useEcommerce();

  const handleExploreClick = () => {
    setCurrentView('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const commitments = [
    {
      number: '01',
      title: 'Natural Gemstones & Crystals',
      description:
        'We focus on natural gemstones and crystals selected for their authentic color, character, and geological form.',
      icon: Check,
    },
    {
      number: '02',
      title: 'Clear Stone Details',
      description:
        'Every stone is presented with clear photography, weight, size, origin, and supporting documentation where available.',
      icon: ShieldCheck,
    },
    {
      number: '03',
      title: 'Honest Descriptions',
      description:
        'From natural internal inclusions to known treatments, we describe each stone clearly so you can make an informed choice.',
      icon: Compass,
    },
    {
      number: '04',
      title: 'Personal WhatsApp Support',
      description:
        'Have a question about a specific stone or looking for a custom size? Message us directly on WhatsApp for personal assistance.',
      icon: Globe,
    },
  ];

  return (
    <div className="bg-[#FAF8F3] text-[#292820] select-none min-h-screen">
      {/* Subtle Breadcrumb Bar */}
      <div className="border-b border-[#E5DED2]/80 bg-[#F5F1E9]/60">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 py-3.5 flex items-center gap-2 text-[11px] sm:text-xs text-[#716B60] uppercase tracking-[0.16em]">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#B08D57] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-[#B08D57]/60">/</span>
          <span className="text-[#292820] font-semibold">About Us</span>
        </div>
      </div>

      {/* PRIMARY ABOUT SECTION — Asymmetric 2-Column Luxury Composition */}
      <section className="py-14 sm:py-20 lg:py-28 overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-20 items-center">
            
            {/* LEFT SIDE — Creative Gemstone Visual Composition */}
            <div className="lg:col-span-6 xl:col-span-7 relative">
              <div className="relative mx-auto max-w-[560px] lg:max-w-none h-[410px] sm:h-[480px] lg:h-[530px]">
                
                {/* Secondary Card (Upper-Left): Raw Natural Crystals */}
                <div className="absolute left-0 top-3 sm:top-4 w-[54%] sm:w-[50%] h-[240px] sm:h-[300px] lg:h-[330px] rounded-[20px] sm:rounded-[26px] overflow-hidden shadow-[0_14px_35px_rgba(41,40,32,0.09)] border border-[#E5DED2]/70 bg-[#F3EFE8] group">
                  <img
                    src={whyUsCrystalsImg}
                    alt="Natural mineral formations and untreated crystals"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Main Card (Center-Right): Vivid Emerald on Mother Matrix */}
                <div className="absolute right-0 bottom-4 sm:bottom-4 w-[62%] sm:w-[58%] h-[280px] sm:h-[350px] lg:h-[390px] rounded-[22px] sm:rounded-[30px] overflow-hidden shadow-[0_20px_48px_rgba(41,40,32,0.12)] border border-[#E5DED2]/80 bg-[#F3EFE8] group z-10">
                  <img
                    src={heroEmeraldImg}
                    alt="Exceptional Colombian Emerald crystals on quartz matrix"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Card 1 (Top-Right above Main Card) */}
                <div className="absolute right-1 sm:right-6 top-0 z-20 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4.5 shadow-[0_12px_32px_rgba(41,40,32,0.12)] border border-[#E5DED2] max-w-[195px] sm:max-w-[240px]">
                  <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-1.5">
                    <span className="font-serif text-base sm:text-xl font-normal text-[#121212] tracking-tight">
                      Natural Stones
                    </span>
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B08D57] flex-shrink-0" />
                  </div>
                  <p className="text-[11px] sm:text-[12px] text-[#5A544A] leading-snug font-normal mb-2 sm:mb-2.5">
                    Carefully selected gemstones and crystals with clear details.
                  </p>
                  {/* Miniature Faceted Gem Avatars */}
                  <div className="flex items-center -space-x-1 sm:-space-x-1.5 pt-1 border-t border-[#E5DED2]/60">
                    <img
                      src={gemSapphireImg}
                      alt="Sapphire"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-contain bg-[#FAF8F3] border border-white shadow-2xs"
                    />
                    <img
                      src={gemEmeraldImg}
                      alt="Emerald"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-contain bg-[#FAF8F3] border border-white shadow-2xs"
                    />
                    <img
                      src={gemRubyImg}
                      alt="Ruby"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-contain bg-[#FAF8F3] border border-white shadow-2xs"
                    />
                    <img
                      src={gemDiamondImg}
                      alt="Diamond"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-contain bg-[#FAF8F3] border border-white shadow-2xs"
                    />
                    <span className="text-[10px] sm:text-[11px] font-sans font-medium text-[#B08D57] pl-1.5 sm:pl-2.5">
                      Selected Stones
                    </span>
                  </div>
                </div>

                {/* Floating Card 2 (Bottom-Left) */}
                <div className="absolute left-1 sm:left-4 bottom-0 z-20 bg-white/95 backdrop-blur-md rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-md border border-[#E5DED2] flex items-center gap-2.5 max-w-[210px]">
                  <ShieldCheck className="w-5 h-5 text-[#B08D57] flex-shrink-0" />
                  <div>
                    <span className="text-[12px] font-sans font-semibold text-[#121212] block">
                      Authentic Origin
                    </span>
                    <span className="text-[11px] text-[#5A544A] font-sans block">
                      Natural Gemstones &amp; Crystals
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE — About Geo Gems Content */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center relative">
              {/* ONE thin vertical editorial divider line between image area and text area on desktop, with a tiny hollow circle at the end */}
              <div
                aria-hidden="true"
                className="hidden lg:flex flex-col items-center pointer-events-none select-none absolute -left-7 xl:-left-10 top-1/2 -translate-y-1/2"
              >
                <span
                  className="w-[1px] h-64 xl:h-72 bg-[#B7AEA2] block"
                  style={{ opacity: 0.25 }}
                />
                <span
                  className="w-2 h-2 rounded-full border border-[#B08D57] block mt-1.5"
                  style={{ opacity: 0.30 }}
                />
              </div>

              {/* Eyebrow Label */}
              <div className="flex items-center gap-3 mb-2.5">
                <span className="font-eyebrow">
                  About Us
                </span>
                <span className="w-7 h-[1px] bg-[#B08D57]/60 inline-block" />
              </div>

              {/* Main Heading in Cormorant Garamond */}
              <h1 className="font-h1 text-[#121212] mb-5">
                About Geo Gems Crystals
              </h1>

              {/* Short Readable Descriptive Text */}
              <div className="space-y-4 font-body text-[#3D3933] max-reading-article mb-7">
                <p>
                  At Geo Gems Crystals, we celebrate the natural beauty, rich colors, and lasting
                  character of natural gemstones and crystals. Every stone has its own look and
                  natural form, shaped over time inside the Earth.
                </p>
                <p>
                  We believe buying a gemstone or crystal should be simple, clear, and trustworthy.
                  Each stone is presented with clear photography, accurate weight and size
                  measurements, and available origin and treatment details.
                </p>
                <p>
                  Whether you are a collector, a jewelry business, or discovering gemstones for the
                  first time, we are here to help you find the right stone.
                </p>
              </div>

              {/* Optional Visual Details with Minimal Separators */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-5 py-4 border-y border-[#E5DED2] mb-8 text-xs sm:text-[13.5px] text-[#292820]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
                  <span className="font-medium tracking-wide">Natural Gemstones</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
                  <span className="font-medium tracking-wide">Clear Stone Details</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
                  <span className="font-medium tracking-wide">Direct WhatsApp Inquiry</span>
                </div>
              </div>

              {/* Primary Stylish CTA Button */}
              <div>
                <button
                  onClick={handleExploreClick}
                  className="primary-button"
                >
                  <span>Explore Our Gemstones</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* OUR STANDARDS & COMMITMENTS — Premium Asymmetric Split Layout */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F1E9] border-t border-[#E5DED2]">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-18 items-start">
            
            {/* Left Side: Editorial Introduction & Gemological Visual */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <div>
                {/* Eyebrow label */}
                <div className="flex items-center gap-3 mb-3.5">
                  <span className="w-7 h-[1px] bg-[#B08D57] inline-block" />
                  <span className="font-eyebrow">
                    OUR PROMISE
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="font-h2 text-[#121212] mb-4">
                  Every Stone.
                  <br />
                  <span className="italic font-normal">A Standard of Trust.</span>
                </h2>

                <div className="w-12 h-[1.5px] bg-[#B08D57]/70 my-5" />

                {/* Supporting Text */}
                <p className="font-body-small text-[#4A453D] max-w-md">
                  From selecting stones to answering your questions, our focus is on clear
                  information, authentic quality, and a helpful experience at every step.
                </p>
              </div>

              {/* Supporting Image Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E5DED2] shadow-[0_12px_28px_rgba(41,40,32,0.06)] bg-[#FAF8F3] max-w-md group">
                <div className="h-[170px] sm:h-[190px] overflow-hidden">
                  <img
                    src={magnifierGemImg}
                    alt="Close-up gemstone inspection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="px-4.5 py-3 bg-[#FAF8F3] flex items-center justify-between border-t border-[#E5DED2]/80 text-xs text-[#5A544A]">
                  <span className="font-medium text-[#292820]">Careful Inspection</span>
                  <span className="text-[#B08D57] font-serif italic text-xs">Natural Stones</span>
                </div>
              </div>
            </div>

            {/* Right Side: Four Commitment Points in Editorial Composition */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-10 gap-y-10 sm:gap-y-12">
                {commitments.map((c) => {
                  const IconComp = c.icon;
                  return (
                    <div
                      key={c.number}
                      className="group flex flex-col justify-start relative pt-2"
                    >
                      {/* Top Separator with Number and Minimal Line Icon */}
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#E5DED2] group-hover:border-[#B08D57]/60 transition-colors duration-300">
                        <span className="font-serif text-sm font-semibold tracking-[0.2em] text-[#B08D57]">
                          {c.number}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#E5DED2] flex items-center justify-center text-[#B08D57] group-hover:border-[#B08D57] transition-colors duration-300 shadow-2xs">
                          <IconComp className="w-4 h-4 stroke-[1.75]" />
                        </div>
                      </div>

                      {/* Commitment Heading */}
                      <h3 className="font-serif text-lg sm:text-[19px] text-[#121212] font-normal tracking-tight mb-2.5 group-hover:text-[#B08D57] transition-colors duration-200">
                        {c.title}
                      </h3>

                      {/* Supporting Description */}
                      <p className="text-xs sm:text-[13px] text-[#716B60] font-light leading-[1.72]">
                        {c.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
