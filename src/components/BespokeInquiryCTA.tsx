import React from 'react';
import { getGeneralWhatsAppUrl } from '../utils/gemstoneHelpers';
import { WhatsAppIcon } from './WhatsAppIcon';
import { EditorialOutlineRing, EditorialSmallDots } from './DecorativeElements';

export const BespokeInquiryCTA: React.FC = () => {
  const whatsAppUrl = getGeneralWhatsAppUrl(
    'Hello Geo Gems Crystals,\n\nI am looking for a specific stone or size and would like to ask about available options.'
  );

  return (
    <section className="relative w-full bg-[#F8F5EE] border-b border-[#E5DED2] py-12 sm:py-16 lg:py-24 overflow-hidden select-none">
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

      <div className="relative z-10 max-w-[880px] mx-auto px-5 sm:px-10 text-center flex flex-col items-center">
        {/* Diamond icon row */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <span className="w-8 sm:w-16 h-[1px] bg-[#B08D57] inline-block" />
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#B08D57]/40 bg-[#FAF8F3] flex items-center justify-center text-[#B08D57]">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[#B08D57]" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 18 3 22 9 12 22 2 9" />
              <line x1="12" y1="22" x2="12" y2="9" />
              <line x1="2" y1="9" x2="22" y2="9" />
              <line x1="6" y1="3" x2="9" y2="9" />
              <line x1="18" y1="3" x2="15" y2="9" />
            </svg>
          </div>
          <span className="w-8 sm:w-16 h-[1px] bg-[#B08D57] inline-block" />
        </div>

        <p className="font-eyebrow mb-2 sm:mb-3">CUSTOM STONE INQUIRY</p>
        <h2 className="font-h2 text-[#292820] mb-4 sm:mb-5">Looking for a Specific Stone?</h2>
        <p className="font-body-small text-[#5A544A] max-reading-section mb-7 sm:mb-10 px-1">
          Tell us what gemstone, crystal, shape, or size you are looking for. We will check our
          available stones and share details directly on WhatsApp.
        </p>
        <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="primary-button inline-flex w-full sm:w-auto items-center justify-center gap-2">
          <WhatsAppIcon className="w-4 h-4 text-white" />
          <span>Inquire on WhatsApp</span>
        </a>
      </div>
    </section>
  );
};
