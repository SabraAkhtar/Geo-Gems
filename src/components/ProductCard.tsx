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
      className="group bg-white rounded-2xl border border-[#E5DED2] hover:border-[#B08D57]/70 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-[#F3EFE8]">
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
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-xs cursor-pointer ${
            isSaved
              ? 'bg-[#B08D57] text-white border border-[#B08D57]'
              : 'bg-[#121212]/50 text-white/90 hover:bg-[#121212]/80 border border-white/20'
          }`}
          title={isSaved ? 'Remove from Saved Stones' : 'Save Stone'}
          aria-label={isSaved ? 'Remove from Saved Stones' : 'Save Stone'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Overlay — Single simple button only on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1B1916]/45 via-[#1B1916]/15 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 flex items-center justify-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openGemstoneDetail(gemstone);
            }}
            className="w-full py-2.5 px-4 bg-[#B08D57] hover:bg-[#7D8976] text-white text-xs font-sans font-medium tracking-wider uppercase rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span>View Stone</span>
          </button>
        </div>
      </div>

      {/* Product Content Details: Title, Specs, Stone ID, Price */}
      <div className="p-4 sm:p-5 flex flex-grow flex-col justify-between bg-white">
        <div>
          {/* Eyebrow & Product ID */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-eyebrow text-[12px]">
              {gemstone.type}
            </span>
            <span className="font-stone-id text-[12px]">
              {stoneId}
            </span>
          </div>

          {/* Stone Name in Cormorant Garamond (18–22px) */}
          <h3 className="font-card-title text-[#121212] group-hover:text-[#B08D57] transition-colors line-clamp-1 leading-snug">
            {gemstone.name}
          </h3>

          {/* Important Product Details: Weight & Origin/Cut (14–15px) */}
          <p className="font-sans text-[14px] text-[#5A544A] font-normal mt-1 line-clamp-1">
            {weightDisplay} • {gemstone.origin ? gemstone.origin.split(',')[0] : gemstone.cut}
          </p>
        </div>

        {/* Price & Secondary Expandable WhatsApp Button Footer */}
        <div className="mt-4 pt-3 border-t border-[#E5DED2] flex items-center justify-between">
          <div>
            {isSold ? (
              <span className="font-sans text-[14px] font-medium text-[#5A544A]">
                Sold
              </span>
            ) : priceInfo.isPriceOnRequest ? (
              <span className="font-price-request text-[15px]">
                Price on Request
              </span>
            ) : (
              <span className="font-price text-[17px] sm:text-[19px]">
                {priceInfo.label}
              </span>
            )}
          </div>

          <SecondaryButton
            size="sm"
            href={cardWhatsAppUrl}
            target="_blank"
            icon={<WhatsAppIcon className="w-4 h-4 text-white" />}
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
