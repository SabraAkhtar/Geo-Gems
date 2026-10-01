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
    /*
      Footer colour palette — warm deep taupe/charcoal with gold accents.
      Matches the brand's warm ivory + champagne gold identity.
      Background: #2C2416  (deep warm charcoal — feels like aged wood / dark stone)
      Border:     #3D3020  (slightly lighter warm divider)
      Headings:   #E8D5A8  (warm parchment)
      Body text:  #B5A48A  (muted warm sand)
      Hover:      #D4B06A  (champagne gold hover)
      Gold accent: #B08D57 (existing brand gold)
    */
    <footer
      className="select-none"
      style={{ backgroundColor: '#1A1712', borderTop: '1px solid #2E2A24' }}
    >
      <div className="max-w-[1300px] mx-auto px-5 sm:px-10 lg:px-12">

        {/* TOP GOLD LINE ACCENT */}
        <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#B08D57] to-transparent opacity-50" />

        {/*
          MOBILE  (< sm):  2-col grid
            Row 1: Brand (col-span-2, full width)
            Row 2: Explore | Customer Support  (1 col each)
            Row 3: Follow Us (col-span-2, full width, horizontal layout)
          TABLET  (sm):    2-col grid (same)
          DESKTOP (lg):    12-col editorial grid
        */}
        <div className="py-8 sm:py-14 lg:py-16 grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-start">

          {/* Brand — always full width (col-span-2) */}
          <div className="col-span-2 lg:col-span-5 space-y-3">
            <div onClick={() => handleNavigate('home')} className="cursor-pointer inline-block" title="Geo Gems Crystals">
              <Logo size="md" variant="light" showTagline={false} />
            </div>
            <p className="font-sans text-[12.5px] sm:text-[13.5px] leading-[1.65]" style={{ color: '#A89880' }}>
              Natural gemstones and crystals, carefully selected for collectors and jewelry businesses worldwide.
            </p>
          </div>

          {/* Explore — col 1 */}
          <div className="col-span-1 lg:col-span-2 space-y-2.5">
            <h4 className="font-sans text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#FFFFFF' }}>
              Explore
            </h4>
            <ul className="space-y-1.5 font-sans text-[12.5px] sm:text-[13.5px]" style={{ color: '#B5A48A' }}>
              {[
                { label: 'Gemstones', action: () => navigateToCatalogMode('Gemstone') },
                { label: 'Crystals', action: () => navigateToCatalogMode('Crystal') },
                { label: 'Gem Guides', action: () => handleNavigate('education') },
                { label: `Saved Stones${savedStonesCount > 0 ? ` (${savedStonesCount})` : ''}`, action: () => setIsSavedStonesOpen(true) },
                { label: 'About Us', action: () => handleNavigate('about') },
              ].map((item) => (
                <li key={item.label}>
                  <button onClick={item.action} className="cursor-pointer text-left leading-[1.7] transition-colors hover:text-[#D4B06A]" style={{ color: 'inherit' }}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support — col 2 */}
          <div className="col-span-1 lg:col-span-3 space-y-2.5">
            <h4 className="font-sans text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#E8D5A8' }}>
              Support
            </h4>
            <ul className="space-y-1.5 font-sans text-[12.5px] sm:text-[13.5px]" style={{ color: '#B5A48A' }}>
              <li><button onClick={() => handleNavigate('contact')} className="cursor-pointer text-left leading-[1.7] transition-colors hover:text-[#D4B06A]" style={{ color: 'inherit' }}>Contact Us</button></li>
              <li><a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="inline-block leading-[1.7] transition-colors hover:text-[#D4B06A]" style={{ color: 'inherit' }}>WhatsApp</a></li>
              <li><button onClick={() => handleNavigate('privacy')} className="cursor-pointer text-left leading-[1.7] transition-colors hover:text-[#D4B06A]" style={{ color: 'inherit' }}>Privacy Policy</button></li>
              <li><button onClick={() => handleNavigate('terms')} className="cursor-pointer text-left leading-[1.7] transition-colors hover:text-[#D4B06A]" style={{ color: 'inherit' }}>Shipping</button></li>
            </ul>
          </div>

          {/* Follow Us — full width on mobile, 2 cols on lg */}
          <div className="col-span-2 lg:col-span-2 space-y-2.5">
            <h4 className="font-sans text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#E8D5A8' }}>
              Follow Us
            </h4>
            <div className="flex flex-row flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:space-y-2 font-sans text-[12.5px] sm:text-[13.5px]" style={{ color: '#B5A48A' }}>
              <a href={OFFICIAL_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[#D4B06A]" style={{ color: 'inherit' }}>
                <Instagram className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#B08D57' }} />
                <span>Instagram</span>
              </a>
              <a href={OFFICIAL_TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[#D4B06A]" style={{ color: 'inherit' }}>
                <Music2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#B08D57' }} />
                <span>TikTok</span>
              </a>
              <a href="mailto:concierge@geogemscrystals.com" className="inline-flex items-center gap-2 transition-colors hover:text-[#D4B06A] text-[11.5px]" style={{ color: 'inherit' }}>
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#B08D57' }} />
                <span className="break-all">concierge@geogemscrystals.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div
          className="py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-[12px]"
          style={{ borderTop: '1px solid #2E2A24', color: '#6B6055' }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© 2026 GEO GEMS CRYSTALS. Natural gemstones &amp; crystals.</span>
            <button
              onClick={() => handleNavigate('admin')}
              className="transition-colors hover:text-[#B08D57] cursor-pointer text-[11px]"
              style={{ color: '#4A4540' }}
              title="Admin Dashboard"
            >
              Admin
            </button>
          </div>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <button onClick={() => handleNavigate('privacy')} className="transition-colors hover:text-[#D4B06A] cursor-pointer" style={{ color: 'inherit' }}>Privacy Policy</button>
            <button onClick={() => handleNavigate('terms')} className="transition-colors hover:text-[#D4B06A] cursor-pointer" style={{ color: 'inherit' }}>Shipping &amp; Delivery</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
