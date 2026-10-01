import React, { useState } from 'react';
import { Bookmark, Eye } from 'lucide-react';
import { JEWELRY_PIECES, jewelryToGemstone } from '../data/jewelry';
import { useEcommerce } from '../context/EcommerceContext';
import { SecondaryButton } from './SecondaryButton';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getWhatsAppInquiryUrl } from '../utils/gemstoneHelpers';

export const JewelrySection: React.FC = () => {
  const {
    formatPrice,
    openGemstoneDetail,
    toggleSavedStone,
    isStoneSaved,
  } = useEcommerce();

  const [activeTab, setActiveTab] = useState<'All' | 'Rings' | 'Necklaces' | 'Bracelets'>('All');

  const filteredPieces =
    activeTab === 'All'
      ? JEWELRY_PIECES
      : JEWELRY_PIECES.filter((item) => item.category === activeTab);

  return (
    <section id="jewelry" className="relative py-10 sm:py-14 lg:py-20 bg-[#FAF8F3] border-b border-[#E1D9CD] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-3 mb-2 justify-center">
            <span
              aria-hidden="true"
              className="w-7 h-[1px] bg-[#B7AEA2] inline-block"
              style={{ opacity: 0.25 }}
            />
            <span className="font-eyebrow">
              Fine Jewelry
            </span>
            <span
              aria-hidden="true"
              className="w-7 h-[1px] bg-[#B7AEA2] inline-block"
              style={{ opacity: 0.25 }}
            />
          </div>
          <h2 className="font-h2 text-[#121212]">
            Gemstone Jewelry Collection
          </h2>
          <p className="font-body-small text-[#5A544A] mt-2.5 max-reading-section mx-auto">
            Explore finished rings, necklaces, and bracelets set with natural gemstones in 18K gold.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {(['All', 'Rings', 'Necklaces', 'Bracelets'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-sans tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#121212] text-[#FAF8F3] font-medium shadow-xs'
                    : 'bg-white text-[#5A544A] border border-[#E5DED2] hover:border-[#B08D57] hover:text-[#121212]'
                }`}
              >
                {tab === 'All' ? 'All Jewelry (6)' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid: 2-col mobile, 2-col md, 3-col lg */}
        <div className="relative grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {filteredPieces.map((piece, idx) => {
            const stoneObj = jewelryToGemstone(piece);
            const isSaved = isStoneSaved(piece.id);
            const whatsappUrl = getWhatsAppInquiryUrl(stoneObj);

            return (
              <div key={piece.id} className="relative overflow-hidden rounded-2xl">
                {/* ONE thin open rectangular editorial frame slightly offset behind the main jewelry image (ONLY used here) */}
                {idx === 0 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute -top-3.5 -left-3.5 sm:-top-4 sm:-left-4 w-[82%] h-[60%] border border-[#B08D57] rounded-[2px] z-0"
                    style={{ opacity: 0.16 }}
                  />
                )}

                <div
                  onClick={() => openGemstoneDetail(stoneObj)}
                  className="relative z-10 h-full group bg-white rounded-2xl border border-[#E5DED2] hover:border-[#B08D57]/70 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer"
                >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F3EFE8]">
                  <img
                    src={piece.image}
                    alt={piece.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    loading="lazy"
                  />

                  {/* Saved Stones Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedStone(piece.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 shadow-xs cursor-pointer ${
                      isSaved
                        ? 'bg-[#B08D57] text-white border-[#B08D57]'
                        : 'bg-[#121212]/50 text-white/90 hover:bg-[#121212]/80 border-white/20'
                    }`}
                    title={isSaved ? 'Remove from Saved Stones' : 'Save piece'}
                    aria-label={isSaved ? 'Remove from Saved Stones' : 'Save piece'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  {/* Hover Quick Action Overlay — Single simple button only on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1B1916]/45 via-[#1B1916]/15 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 flex items-center justify-center z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openGemstoneDetail(stoneObj);
                      }}
                      className="w-full py-2.5 px-4 bg-[#B08D57] hover:bg-[#7D8976] text-white text-xs font-sans font-medium tracking-wider uppercase rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-white" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-2.5 sm:p-4 lg:p-5 flex flex-col flex-grow justify-between bg-white min-w-0">
                  <div>
                    {/* Metal & Category */}
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#B08D57] font-sans font-medium mb-1">
                      <span>{piece.category}</span>
                      <span className="text-[#716B60] font-normal">{piece.metal}</span>
                    </div>

                    {/* Title in Cormorant Garamond */}
                    <h3 className="min-w-0 font-serif text-[12px] sm:text-[15px] text-[#121212] group-hover:text-[#B08D57] transition-colors leading-snug line-clamp-2 mb-1">
                      {piece.name}
                    </h3>

                    {/* Specs / Origin */}
                    <p className="hidden sm:block font-sans text-[11px] sm:text-[13px] text-[#716B60] font-normal line-clamp-1 mb-2">
                      {piece.specs}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[#E5DED2] flex items-center justify-between">
                    <div>
                      <span className="font-serif text-[15px] sm:text-[17px] font-semibold text-[#121212]">
                        {formatPrice(piece.priceUSD)}
                      </span>
                    </div>

                    <SecondaryButton
                      size="sm"
                      href={whatsappUrl}
                      target="_blank"
                      icon={<WhatsAppIcon className="w-4 h-4 text-white" />}
                      text="Inquire"
                      title="Inquire on WhatsApp"
                      ariaLabel="Inquire on WhatsApp"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
