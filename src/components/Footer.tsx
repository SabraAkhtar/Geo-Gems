import React from 'react';
import { Instagram, Music2, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { useEcommerce } from '../context/EcommerceContext';
import {
  getGeneralWhatsAppUrl,
  OFFICIAL_INSTAGRAM_URL,
  OFFICIAL_TIKTOK_URL,
} from '../utils/gemstoneHelpers';

export const Footer: React.FC = () => {
  const {
    setCurrentView,
    navigateToCatalogMode,
    savedStonesCount,
    setIsSavedStonesOpen,
  } = useEcommerce();

  const whatsAppUrl = getGeneralWhatsAppUrl(
    'Hello Geo Gems Crystals,\n\nI would like to inquire about your natural gemstone and crystal collection.\n\nThank you.'
  );

  const handleNavigate = (
    view: 'home' | 'collection' | 'about' | 'contact' | 'education' | 'privacy' | 'terms' | 'admin'
  ) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] text-[#F5F1E9] border-t border-[#2A2A2A] select-none">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-12">
        {/* ROW 1 — Main Footer Content */}
        <div className="py-12 sm:py-14 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Brand Identity Area — Left Column (5 columns on desktop) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div
              onClick={() => handleNavigate('home')}
              className="cursor-pointer inline-block"
              title="Geo Gems Crystals Home"
            >
              <Logo size="md" variant="light" showTagline={false} />
            </div>

            {/* Tagline with subtle editorial line */}
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-6 h-[1px] bg-[#B08D57] inline-block"
                style={{ opacity: 0.5 }}
              />
              <p className="font-eyebrow text-xs text-[#B08D57]">
                NATURAL STONES • TIMELESS BEAUTY
              </p>
            </div>

            {/* Short Brand Description */}
            <p className="font-sans text-[14.5px] text-[#A39B8F] leading-[1.7] max-w-[380px]">
              Discover natural gemstones and crystals, carefully selected for collectors, jewelry
              businesses, and crystal buyers worldwide.
            </p>
          </div>

          {/* Explore Column (2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#F5F1E9]">
              Explore
            </h4>
            <ul className="space-y-1.5 font-sans text-[14px] text-[#A39B8F]">
              <li>
                <button
                  onClick={() => navigateToCatalogMode('Gemstone')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left leading-[1.8]"
                >
                  Gemstones
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCatalogMode('Crystal')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left leading-[1.8]"
                >
                  Crystals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('education')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left leading-[1.8]"
                >
                  Gemstone Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSavedStonesOpen(true)}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left leading-[1.8]"
                >
                  Saved Stones{savedStonesCount > 0 ? ` (${savedStonesCount})` : ''}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('about')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left leading-[1.8]"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Contact Column (3 columns on desktop) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#F5F1E9]">
              Customer Support
            </h4>
            <ul className="space-y-1.5 font-sans text-[14px] text-[#A39B8F]">
              <li>
                <button
                  onClick={() => handleNavigate('contact')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left leading-[1.8]"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer inline-block text-left leading-[1.8]"
                >
                  Inquire on WhatsApp
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('privacy')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left leading-[1.8]"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('terms')}
                  className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left leading-[1.8]"
                >
                  Shipping &amp; Delivery
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media Column (2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#F5F1E9]">
              Follow Us
            </h4>
            <div className="space-y-2 font-sans text-[14px] text-[#A39B8F]">
              <div>
                <a
                  href={OFFICIAL_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#FFFFFF] transition-colors group leading-[1.8]"
                >
                  <Instagram className="w-4 h-4 text-[#B08D57] group-hover:scale-110 transition-transform" />
                  <span>Instagram</span>
                </a>
              </div>
              <div>
                <a
                  href={OFFICIAL_TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#FFFFFF] transition-colors group leading-[1.8]"
                >
                  <Music2 className="w-4 h-4 text-[#B08D57] group-hover:scale-110 transition-transform" />
                  <span>TikTok</span>
                </a>
              </div>
              <div className="pt-1">
                <a
                  href="mailto:concierge@geogemscrystals.com"
                  className="inline-flex items-center gap-2 hover:text-[#FFFFFF] transition-colors group text-xs text-[#A39B8F]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#B08D57]" />
                  <span>concierge@geogemscrystals.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 — Simple Copyright Bar */}
        <div className="border-t border-[#2A2A2A] py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[12.5px] text-[#A39B8F]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span>© 2026 GEO GEMS CRYSTALS. Natural gemstones &amp; crystals.</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#3D3A35]" />
            <button
              onClick={() => handleNavigate('admin')}
              className="hover:text-[#B08D57] transition-colors cursor-pointer text-[#6B655D]"
              title="Admin Dashboard Login"
            >
              Admin Dashboard
            </button>
          </div>

          <div className="flex items-center gap-6 text-center sm:text-right">
            <button
              onClick={() => handleNavigate('privacy')}
              className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavigate('terms')}
              className="hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              Shipping &amp; Delivery
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
