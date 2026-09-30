import React, { useState } from 'react';
import { Search, Menu, X, ShoppingCart } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { useCart } from '../context/CartContext';
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
  const { cartCount, openCart } = useCart();

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
      <header className="sticky top-0 z-40 border-b select-none transition-colors" style={{ backgroundColor: '#1A1712', borderColor: '#2E2A24' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
          {/* LEFT — Official Brand Logo */}
          <div
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
            title="GEO GEMS CRYSTALS — Natural Stones"
          >
            {/* Mobile: smaller logo, Desktop: medium with more height */}
            <Logo size="sm" variant="light" className="sm:hidden" />
            <Logo size="sm" variant="light" className="hidden sm:block" />
          </div>

          {/* CENTER — Primary Navigation Links (Home, Gemstones, Crystals, About, Contact) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center justify-center gap-8 lg:gap-11 xl:gap-12">
            {navLinks.map((item) => {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`font-nav transition-all relative py-1.5 cursor-pointer whitespace-nowrap ${
                    item.isActive
                      ? 'text-[#D4B06A]'
                      : 'text-[#E8D5A8] hover:text-[#D4B06A]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4B06A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT — Search + WhatsApp CTA + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Cart icon */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#E8D5A8] hover:text-[#D4B06A] transition-colors cursor-pointer flex-shrink-0"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#B08D57] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Search icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#E8D5A8] hover:text-[#D4B06A] transition-colors cursor-pointer flex-shrink-0"
              title="Search gemstones & crystals"
              aria-label="Search gemstones and crystals"
            >
              <Search className="w-[20px] h-[20px] stroke-[1.75]" />
            </button>

            {/* sm–md: compact WhatsApp icon */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex lg:hidden p-2 rounded-xl bg-[#B08D57]/20 hover:bg-[#B08D57]/30 transition-colors items-center justify-center"
              title="WhatsApp Inquiry"
              aria-label="WhatsApp Inquiry"
            >
              <WhatsAppIcon className="w-5 h-5" style={{ color: '#D4B06A' }} />
            </a>

            {/* Desktop WhatsApp CTA */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button hidden lg:inline-flex text-white font-medium"
              style={{ padding: '0.85em 1.7em', fontSize: '12px', letterSpacing: '1.8px' }}
              title="Inquire on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
              <span>Inquire on WhatsApp</span>
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#E8D5A8] hover:text-[#D4B06A] lg:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Drawer (shown below lg) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs border-l p-6 flex flex-col justify-between overflow-y-auto z-50 shadow-2xl" style={{ backgroundColor: '#1A1712', borderColor: '#2E2A24' }}>
            <div>
              <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: '#2E2A24' }}>
                <Logo size="sm" variant="light" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#E8D5A8] hover:text-[#D4B06A]"
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
                      link.isActive ? 'text-[#D4B06A] font-semibold' : 'text-[#E8D5A8] hover:text-[#D4B06A]'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                <div className="pt-3 border-t" style={{ borderColor: 'rgba(46,42,36,0.8)' }}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 py-2.5 text-left font-nav text-[15px] text-[#E8D5A8] hover:text-[#D4B06A] transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[#D4B06A]" />
                    <span>Search Stones</span>
                  </button>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: '#2E2A24' }}>
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

            <div className="pt-6 border-t text-xs" style={{ borderColor: '#2E2A24', color: '#E8D5A8' }}>
              <p className="font-eyebrow text-[10px]" style={{ color: '#B08D57' }}>NATURAL STONES • TIMELESS BEAUTY</p>
              <p className="text-[11px] mt-1" style={{ color: '#A89880' }}>Geo Gems Crystals</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
