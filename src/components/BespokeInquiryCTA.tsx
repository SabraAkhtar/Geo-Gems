import React from 'react';
import { getGeneralWhatsAppUrl } from '../utils/gemstoneHelpers';
import { WhatsAppIcon } from './WhatsAppIcon';
import { EditorialOutlineRing, EditorialSmallDots } from './DecorativeElements';

export const BespokeInquiryCTA: React.FC = () => {
  const whatsAppUrl = getGeneralWhatsAppUrl(
    'Hello Geo Gems Crystals,\n\nI am looking for a specific stone or size and would like to ask about available options.'
  );

  return (
    <section className="relative w-full bg-[#F8F5EE] border-b border-[#E5DED2] py-16 sm:py-20 lg:py-24 overflow-hidden select-none">
      {/* ONE large partial outline ring behind the composition + 3 tiny subtle dots */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="hidden sm:block absolute -top-32 -right-28">
          <EditorialOutlineRing size={460} color="#B7AEA2" opacity={0.13} />
        </div>
        <div className="hidden sm:block absolute bottom-10 left-[18%]">
          <EditorialSmallDots
            variant="trio-irregular"
            color="#B7AEA2"
            accentColor="#B08D57"
            opacity={0.26}
          />
        </div>
      </div>

      {/* Main Centered Content Container */}
      <div className="relative z-10 max-w-[880px] mx-auto px-6 sm:px-10 text-center flex flex-col items-center">
        {/* Top Decorative Gemstone/Diamond Icon with Two Delicate Gold Lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <span className="w-10 sm:w-16 h-[1px] bg-[#B08D57] inline-block" />
          <div className="w-8 h-8 rounded-full border border-[#B08D57]/40 bg-[#FAF8F3] flex items-center justify-center text-[#B08D57] shadow-2xs">
            {/* Elegant Diamond Outline SVG matching reference */}
            <svg
              className="w-4 h-4 stroke-[#B08D57]"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="6 3 18 3 22 9 12 22 2 9" />
              <line x1="12" y1="22" x2="12" y2="9" />
              <line x1="2" y1="9" x2="22" y2="9" />
              <line x1="6" y1="3" x2="9" y2="9" />
              <line x1="18" y1="3" x2="15" y2="9" />
            </svg>
          </div>
          <span className="w-10 sm:w-16 h-[1px] bg-[#B08D57] inline-block" />
        </div>

        {/* Eyebrow Label */}
        <p className="font-eyebrow mb-3">
          CUSTOM STONE INQUIRY
        </p>

        {/* Main Serif Headline */}
        <h2 className="font-h2 text-[#292820] mb-5 max-w-2xl">
          Looking for a Specific Stone or Size?
        </h2>

        {/* Supporting Paragraph */}
        <p className="font-body-large text-[#5A544A] max-reading-section mb-8 sm:mb-10">
          Tell us what gemstone, crystal, shape, or size you are looking for. We will gladly check our
          available stones and share details directly on WhatsApp.
        </p>

        {/* Primary CTA Button — Inquire on WhatsApp */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="primary-button"
        >
          <WhatsAppIcon className="w-4 h-4 text-white" />
          <span>Inquire on WhatsApp</span>
        </a>
      </div>
    </section>
  );
};
