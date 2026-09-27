import React from 'react';
import { Bookmark, Eye } from 'lucide-react';
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
      className="group bg-white rounded-xl sm:rounded-2xl border border-[#E5DED2] hover:border-[#B08D57]/70 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[1/1] overflow-hidden bg-[#F3EFE8]">
        <img
          src={gemstone.images[0] || '/stones/ruby.jpg'}
          alt={gemstone.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Bookmark / Saved Stone Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavedStone(gemstone.id);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-xs cursor-pointer ${
            isSaved
              ? 'bg-[#B08D57] text-white border border-[#B08D57]'
              : 'bg-[#121212]/50 text-white/90 hover:bg-[#121212]/80 border border-white/20'
          }`}
          title={isSaved ? 'Remove from Saved Stones' : 'Save Stone'}
          aria-label={isSaved ? 'Remove from Saved Stones' : 'Save Stone'}
        >
          <Bookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-[#1B1916]/45 via-[#1B1916]/15 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 flex items-center justify-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openGemstoneDetail(gemstone);
            }}
            className="w-full py-2 px-3 bg-[#B08D57] hover:bg-[#7D8976] text-white text-[10px] sm:text-xs font-sans font-medium tracking-wider uppercase rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3 text-white" />
            <span>View Stone</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-grow flex-col justify-between bg-white">
        <div>
          {/* Eyebrow & Product ID — stacked on mobile */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <span className="font-eyebrow text-[10px] sm:text-[12px] leading-tight">
              {gemstone.type}
            </span>
            <span className="font-stone-id text-[9px] sm:text-[11px] text-right shrink-0 leading-tight">
              {stoneId}
            </span>
          </div>

          {/* Stone Name */}
          <h3 className="font-card-title text-[14px] sm:text-[17px] text-[#121212] group-hover:text-[#B08D57] transition-colors line-clamp-1 leading-snug mt-0.5">
            {gemstone.name}
          </h3>

          {/* Weight & Origin */}
          <p className="font-sans text-[11px] sm:text-[13px] text-[#5A544A] font-normal mt-0.5 line-clamp-1">
            {weightDisplay} • {gemstone.origin ? gemstone.origin.split(',')[0] : gemstone.cut}
          </p>
        </div>

        {/* Price & WhatsApp */}
        <div className="mt-3 pt-2.5 border-t border-[#E5DED2] flex items-center justify-between">
          <div>
            {isSold ? (
              <span className="font-sans text-[11px] sm:text-[13px] font-medium text-[#5A544A]">
                Sold
              </span>
            ) : priceInfo.isPriceOnRequest ? (
              <span className="font-price-request text-[11px] sm:text-[14px]">
                Price on Request
              </span>
            ) : (
              <span className="font-price text-[13px] sm:text-[17px]">
                {priceInfo.label}
              </span>
            )}
          </div>

          <SecondaryButton
            size="sm"
            href={cardWhatsAppUrl}
            target="_blank"
            icon={<WhatsAppIcon className="w-3.5 h-3.5 text-white" />}
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
