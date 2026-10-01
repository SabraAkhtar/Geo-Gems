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
  const { cartCount } = useCart();

  const whatsAppUrl = getGeneralWhatsAppUrl(
    'Hello Geo Gems Crystals,\n\nI am exploring your gemstone and crystal collection and would like to ask a question.\n\nThank you.'
  );

  const isCrystalsActive = currentView === 'collection' && filters.selectedCategory === 'Crystal';
  const isGemstonesActive = currentView === 'collection' && !isCrystalsActive;

  const navLinks = [
    { label: 'Home', isActive: currentView === 'home', onClick: () => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { label: 'Gemstones', isActive: isGemstonesActive, onClick: () => navigateToCatalogMode('Gemstone') },
    { label: 'Crystals', isActive: isCrystalsActive, onClick: () => navigateToCatalogMode('Crystal') },
    { label: 'About', isActive: currentView === 'about', onClick: () => { setCurrentView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { label: 'Contact', isActive: currentView === 'contact', onClick: () => { setCurrentView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b select-none"
        style={{ backgroundColor: '#1A1712', borderColor: '#2E2A24' }}
      >
        {/*
          MOBILE (< lg):  [LOGO]  ...flex-1...  [CART] [SEARCH] [MENU]
          DESKTOP (≥ lg): [LOGO]  [NAV LINKS]   [CART] [SEARCH] [WA PILL]
          
          Container: w-full, max-w capped, px-4 on mobile.
          All children are flex-shrink-0 or flex-1 — nothing extends beyond viewport.
        */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex items-center gap-2 sm:gap-3 lg:gap-6">

          {/* LEFT — Logo (flex-shrink-0 so it never collapses) */}
          <div
            onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
            title="GEO GEMS CRYSTALS"
          >
            {/* Mobile: 40px tall; Tablet+: 48px; Desktop: 52px */}
            <Logo size="xs" className="sm:hidden" />
            <Logo size="sm" className="hidden sm:block lg:hidden" />
            <Logo size="md" className="hidden lg:block" />
          </div>

          {/* CENTER — Desktop navigation (hidden below lg) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex flex-1 items-center justify-center gap-8 xl:gap-12"
          >
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`font-nav transition-all relative py-1.5 cursor-pointer whitespace-nowrap ${
                  item.isActive ? 'text-[#D4B06A]' : 'text-[#E8D5A8] hover:text-[#D4B06A]'
                }`}
              >
                <span>{item.label}</span>
                {item.isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4B06A] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* RIGHT — actions (flex-shrink-0 so they never get pushed off) */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">

            {/* Cart icon — always visible */}
            <button
              onClick={() => { setCurrentView('cart' as any); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="relative p-2 text-[#E8D5A8] hover:text-[#D4B06A] transition-colors cursor-pointer flex-shrink-0"
              aria-label="View cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#B08D57] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Search icon — always visible */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#E8D5A8] hover:text-[#D4B06A] transition-colors cursor-pointer flex-shrink-0"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/*
              Desktop WhatsApp pill (lg+).
              Uses inline-flex directly — NOT primary-button class on <a> —
              to avoid the CSS display conflict. Styled to match primary-button visually.
            */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Inquire on WhatsApp"
              title="Inquire on WhatsApp"
              className="hidden lg:inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#B08D57] hover:bg-[#9E7B47] text-white font-sans font-medium transition-colors"
              style={{ padding: '0.7em 1.5em', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase' }}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white flex-shrink-0" />
              <span>Inquire on WhatsApp</span>
            </a>

            {/* Hamburger — visible below lg only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#E8D5A8] hover:text-[#D4B06A] lg:hidden cursor-pointer flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed inset-y-0 right-0 w-full max-w-[320px] flex flex-col overflow-y-auto z-50 shadow-2xl border-l"
            style={{ backgroundColor: '#1A1712', borderColor: '#2E2A24' }}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
              style={{ borderColor: '#2E2A24' }}
            >
              <Logo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#E8D5A8] hover:text-[#D4B06A] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-5 py-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { link.onClick(); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-3 rounded-xl font-sans text-[15px] font-medium transition-colors cursor-pointer ${
                    link.isActive
                      ? 'text-[#D4B06A] bg-[#B08D57]/10'
                      : 'text-[#E8D5A8] hover:text-[#D4B06A] hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-2 border-t" style={{ borderColor: '#2E2A24' }}>
                <button
                  onClick={() => { setMobileMenuOpen(false); setIsSearchOpen(true); }}
                  className="block w-full text-left px-3 py-3 rounded-xl font-sans text-[15px] font-medium text-[#E8D5A8] hover:text-[#D4B06A] hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-[#B08D57]" />
                  <span>Search Stones</span>
                </button>
              </div>
            </nav>

            {/* WhatsApp CTA in drawer */}
            <div className="px-5 py-5 border-t flex-shrink-0" style={{ borderColor: '#2E2A24' }}>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full bg-[#B08D57] hover:bg-[#9E7B47] text-white font-sans font-medium transition-colors"
                style={{ padding: '0.85em 1.5em', fontSize: '13px', letterSpacing: '1.4px', textTransform: 'uppercase' }}
              >
                <WhatsAppIcon className="w-4 h-4 text-white flex-shrink-0" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>

            {/* Footer note */}
            <div className="px-5 pb-6 flex-shrink-0">
              <p className="font-eyebrow text-[10px]" style={{ color: '#B08D57' }}>NATURAL STONES • TIMELESS BEAUTY</p>
              <p className="text-[11px] mt-1" style={{ color: '#A89880' }}>Geo Gems Crystals</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
