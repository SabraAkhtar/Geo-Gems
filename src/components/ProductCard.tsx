import React from 'react';
import { Bookmark } from 'lucide-react';
import { Gemstone } from '../types';
import { useEcommerce } from '../context/EcommerceContext';
import { SecondaryButton } from './SecondaryButton';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  getStoneId,
  getWeightDisplay,
  getPriceDisplay,
  getWhatsAppInquiryUrl,
} from '../utils/gemstoneHelpers';

interface ProductCardProps {
  gemstone: Gemstone;
}

export const ProductCard: React.FC<ProductCardProps> = ({ gemstone }) => {
  const { openGemstoneDetail, toggleSavedStone, isStoneSaved, formatPrice } = useEcommerce();

  const isSaved = isStoneSaved(gemstone.id);
  const isSold = gemstone.status === 'sold' || gemstone.status === 'sold_out';
  const stoneId = getStoneId(gemstone);
  const priceInfo = getPriceDisplay(gemstone, formatPrice);
  const weightDisplay = getWeightDisplay(gemstone, false);
  const cardWhatsAppUrl = getWhatsAppInquiryUrl(gemstone, undefined, undefined, isSold);

  return (
    <div
      onClick={() => openGemstoneDetail(gemstone)}
      className="group bg-white rounded-xl border border-[#E5DED2] hover:border-[#B08D57]/60 transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-md cursor-pointer"
    >
      {/* Image — consistent square aspect ratio */}
      <div className="relative aspect-square overflow-hidden bg-[#F3EFE8] flex-shrink-0">
        <img
          src={gemstone.images?.[0] || '/stones/ruby.jpg'}
          alt={gemstone.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavedStone(gemstone.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all z-10 shadow-xs cursor-pointer ${
            isSaved
              ? 'bg-[#B08D57] text-white border border-[#B08D57]'
              : 'bg-[#121212]/50 text-white/90 hover:bg-[#121212]/80 border border-white/20'
          }`}
          aria-label={isSaved ? 'Remove from Saved Stones' : 'Save Stone'}
        >
          <Bookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Sold badge */}
        {isSold && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#121212]/70 text-white text-[9px] sm:text-[10px] font-sans font-medium tracking-wide backdrop-blur-sm">
            Sold
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Type + ID row */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-eyebrow text-[9px] sm:text-[10px] text-[#B08D57] leading-none truncate">
            {gemstone.type}
          </span>
          <span className="text-[8px] sm:text-[9px] font-sans font-medium text-[#9E9590] flex-shrink-0 tracking-wide">
            {stoneId}
          </span>
        </div>

        {/* Stone name */}
        <h3 className="font-serif text-[13px] sm:text-[15px] font-medium text-[#121212] group-hover:text-[#B08D57] transition-colors line-clamp-2 leading-snug mb-1 flex-grow">
          {gemstone.name}
        </h3>

        {/* Weight & origin */}
        <p className="text-[10px] sm:text-[12px] font-sans text-[#716B60] line-clamp-1 mb-3">
          {weightDisplay}{gemstone.origin ? ` · ${gemstone.origin.split(',')[0]}` : gemstone.cut ? ` · ${gemstone.cut}` : ''}
        </p>

        {/* Price row */}
        <div className="mt-auto pt-2.5 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
          <div className="min-w-0">
            {isSold ? (
              <span className="text-[11px] sm:text-[12px] font-sans font-medium text-[#9E9590]">Sold</span>
            ) : priceInfo.isPriceOnRequest ? (
              <span className="text-[10px] sm:text-[12px] font-sans font-medium text-[#B08D57] leading-tight">
                Price on<br className="sm:hidden" /> Request
              </span>
            ) : (
              <span className="font-serif text-[14px] sm:text-[16px] font-medium text-[#121212]">
                {priceInfo.label}
              </span>
            )}
          </div>

          <SecondaryButton
            size="sm"
            href={cardWhatsAppUrl}
            target="_blank"
            icon={<WhatsAppIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
            text={isSold ? 'Similar' : 'Inquire'}
            title={isSold ? 'Ask About Similar Stones' : 'Inquire on WhatsApp'}
            ariaLabel={isSold ? 'Ask About Similar Stones' : 'Inquire on WhatsApp'}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};
