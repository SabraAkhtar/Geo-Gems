import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { Logo } from './Logo';
import { getGeneralWhatsAppUrl } from '../utils/gemstoneHelpers';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsSearchOpen,
    navigateToCatalogMode,
    filters,
  } = useEcommerce();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  // Primary business inquiry WhatsApp URL
  const whatsAppUrl = getGeneralWhatsAppUrl(
    'Hello Geo Gems Crystals,\n\nI am exploring your gemstone and crystal collection and would like to ask a question.\n\nThank you.'
  );

  const isCrystalsActive =
    currentView === 'collection' && filters.selectedCategory === 'Crystal';

  const isGemstonesActive =
    currentView === 'collection' && !isCrystalsActive;

  const navLinks = [
    {
      label: 'Home',
      isActive: currentView === 'home',
      onClick: () => {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      label: 'Gemstones',
      isActive: isGemstonesActive,
      onClick: () => {
        navigateToCatalogMode('Gemstone');
      },
    },
    {
      label: 'Crystals',
      isActive: isCrystalsActive,
      onClick: () => {
        navigateToCatalogMode('Crystal');
      },
    },
    {
      label: 'About',
      isActive: currentView === 'about',
      onClick: () => {
        setCurrentView('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      label: 'Contact',
      isActive: currentView === 'contact',
      onClick: () => {
        setCurrentView('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  ];

  return (
    <>
      {/* Full-width Luxury Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F3] border-b border-[#D8CFC2] shadow-xs select-none transition-colors">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* LEFT — Official Brand Logo */}
          <div
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer transition-transform hover:opacity-95 flex-shrink-0"
            title="GEO GEMS CRYSTALS — Natural Stones"
          >
            <Logo size="sm" variant="light" layout="stacked" showTagline={false} className="sm:hidden" />
            <Logo size="md" variant="light" layout="stacked" showTagline={true} className="hidden sm:block" />
          </div>

          {/* CENTER — Primary Navigation Links (Home, Gemstones, Crystals, About, Contact) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center justify-center gap-8 lg:gap-11 xl:gap-12">
            {navLinks.map((item) => {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`font-nav transition-all relative py-1.5 cursor-pointer whitespace-nowrap ${
                    item.isActive
                      ? 'text-[#B08D57]'
                      : 'text-[#25221D] hover:text-[#B08D57]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B08D57] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT — Search Icon + INQUIRE ON WHATSAPP */}
          <div className="flex items-center gap-3.5 sm:gap-5 flex-shrink-0">
            {/* Expandable Search Bar on Hover / Focus */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setIsSearchHovered(true)}
              onMouseLeave={() => {
                if (!isSearchFocused && !searchInputValue) {
                  setIsSearchHovered(false);
                }
              }}
            >
              <div
                className={`flex items-center rounded-xl transition-all duration-300 ease-out bg-[#FAF8F3] overflow-hidden ${
                  isSearchHovered || isSearchFocused || searchInputValue
                    ? 'w-44 sm:w-56 border border-[#B08D57] shadow-xs px-2.5 py-1.5'
                    : 'w-9 h-9 border border-transparent hover:border-[#D8CFC2] justify-center'
                }`}
              >
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-[#25221D] hover:text-[#B08D57] transition-colors cursor-pointer flex-shrink-0 flex items-center justify-center"
                  title="Search gemstones & crystals"
                  aria-label="Search gemstones and crystals"
                >
                  <Search className="w-[18px] h-[18px] stroke-[1.75]" />
                </button>

                <input
                  type="text"
                  placeholder="Search stones, origins, cuts…"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setIsSearchHovered(true);
                  }}
                  onBlur={() => {
                    setIsSearchFocused(false);
                    if (!searchInputValue) setIsSearchHovered(false);
                  }}
                  onClick={() => setIsSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsSearchOpen(true);
                    }
                  }}
                  className={`bg-transparent text-xs text-[#25221D] placeholder-[#8C8578] outline-none ml-2 transition-all duration-300 ${
                    isSearchHovered || isSearchFocused || searchInputValue
                      ? 'w-full opacity-100'
                      : 'w-0 opacity-0 pointer-events-none'
                  }`}
                />
              </div>
            </div>

            {/* Direct WhatsApp Inquiry CTA Button */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button hidden sm:inline-flex text-white font-medium"
              style={{ padding: '0.85em 1.7em', fontSize: '12px', letterSpacing: '1.8px' }}
              title="Inquire on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
              <span>Inquire on WhatsApp</span>
            </a>

            {/* Mobile-only: icon-only WhatsApp quick access */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
              title="WhatsApp Inquiry"
              aria-label="WhatsApp Inquiry"
            >
              <WhatsAppIcon className="w-5 h-5" style={{ color: '#25D366' }} />
            </a>

            {/* Desktop WhatsApp CTA */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button hidden sm:inline-flex text-white font-medium"
              style={{ padding: '0.85em 1.7em', fontSize: '12px', letterSpacing: '1.8px' }}
              title="Inquire on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
              <span>Inquire on WhatsApp</span>
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#25221D] hover:text-[#B08D57] md:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FAF8F3] border-l border-[#D8CFC2] p-6 flex flex-col justify-between overflow-y-auto z-50 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#D8CFC2]">
                <Logo size="sm" variant="light" layout="stacked" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#25221D] hover:text-[#B08D57]"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      link.onClick();
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left py-2.5 font-nav text-[16px] transition-colors cursor-pointer ${
                      link.isActive ? 'text-[#B08D57] font-semibold' : 'text-[#25221D] hover:text-[#B08D57]'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                {/* Mobile Search Action */}
                <div className="pt-3 border-t border-[#D8CFC2]/70">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 py-2.5 text-left font-nav text-[15px] text-[#25221D] hover:text-[#B08D57] transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[#B08D57]" />
                    <span>Search Stones</span>
                  </button>
                </div>

                {/* Direct WhatsApp Mobile CTA */}
                <div className="pt-4 border-t border-[#D8CFC2]">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-button w-full text-white"
                    style={{ padding: '0.9em 1.5em', fontSize: '12px', letterSpacing: '1.8px' }}
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#D8CFC2] text-xs text-[#6F6A63]">
              <p className="font-eyebrow text-[10px]">NATURAL STONES • TIMELESS BEAUTY</p>
              <p className="text-[11px] text-[#5A544A] mt-1">Geo Gems Crystals</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
