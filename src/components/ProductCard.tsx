import React from 'react';
import { Bookmark, ShoppingCart, Check } from 'lucide-react';
import { Gemstone } from '../types';
import { useEcommerce } from '../context/EcommerceContext';
import { useCart } from '../context/CartContext';
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
  const { addToCart, cartItems } = useCart();

  const isSaved = isStoneSaved(gemstone.id);
  const isSold = gemstone.status === 'sold' || gemstone.status === 'sold_out';
  const stoneId = getStoneId(gemstone);
  const priceInfo = getPriceDisplay(gemstone, formatPrice);
  const weightDisplay = getWeightDisplay(gemstone, false);
  const cardWhatsAppUrl = getWhatsAppInquiryUrl(gemstone, undefined, undefined, isSold);
  const isInCart = cartItems.some((item) => item.gemstone.id === gemstone.id);

  return (
    <div
      onClick={() => openGemstoneDetail(gemstone)}
      className="group bg-white rounded-xl border border-[#E5DED2] hover:border-[#B08D57]/60 transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-md cursor-pointer"
    >
      {/* Square image */}
      <div className="relative aspect-square overflow-hidden bg-[#F3EFE8] flex-shrink-0">
        <img
          src={gemstone.images?.[0] || '/stones/ruby.jpg'}
          alt={gemstone.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSavedStone(gemstone.id); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 shadow-xs cursor-pointer ${
            isSaved
              ? 'bg-[#B08D57] text-white border border-[#B08D57]'
              : 'bg-[#121212]/50 text-white/90 hover:bg-[#121212]/80 border border-white/20'
          }`}
          aria-label={isSaved ? 'Remove from Saved' : 'Save Stone'}
        >
          <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Sold badge */}
        {isSold && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#121212]/75 text-white text-[9px] font-sans font-medium tracking-wide backdrop-blur-sm">
            Sold
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-grow">
        {/* Type badge */}
        <span className="font-sans text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] text-[#B08D57] uppercase mb-1 truncate block">
          {gemstone.type}
        </span>

        {/* Stone name */}
        <h3 className="font-serif text-[13px] sm:text-[15px] font-medium text-[#121212] group-hover:text-[#B08D57] transition-colors line-clamp-2 leading-snug mb-1 flex-grow">
          {gemstone.name}
        </h3>

        {/* Weight + origin */}
        <p className="text-[10px] sm:text-[11px] font-sans text-[#8C8578] line-clamp-1 mb-2.5 leading-relaxed">
          {weightDisplay}
          {gemstone.origin ? ` · ${gemstone.origin.split(',')[0]}` : gemstone.cut ? ` · ${gemstone.cut}` : ''}
        </p>

        {/* Price row */}
        <div className="mt-auto pt-2 border-t border-[#F0EAE1]">
          {/* Price */}
          <div className="mb-2">
            {isSold ? (
              <span className="text-[11px] sm:text-[12px] font-sans font-medium text-[#9E9590]">Sold</span>
            ) : priceInfo.isPriceOnRequest ? (
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#B08D57] leading-tight">
                Price on Request
              </span>
            ) : (
              <span className="font-serif text-[13px] sm:text-[15px] font-semibold text-[#121212]">
                {priceInfo.label}
              </span>
            )}
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-1.5">
            {/* Add to Cart button */}
            {!isSold && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(gemstone);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-sans font-semibold tracking-wide transition-all duration-200 cursor-pointer border ${
                  isInCart
                    ? 'bg-[#B08D57] text-white border-[#B08D57]'
                    : 'bg-[#FAF8F3] text-[#5A544A] border-[#E5DED2] hover:border-[#B08D57] hover:text-[#B08D57]'
                }`}
                aria-label={isInCart ? 'Added to cart' : 'Add to cart'}
              >
                {isInCart ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}

            {/* WhatsApp quick inquiry icon */}
            <a
              href={cardWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg bg-[#7D8976] hover:bg-[#687362] flex items-center justify-center flex-shrink-0 transition-colors shadow-xs"
              aria-label={isSold ? 'Ask About Similar Stones' : 'Inquire on WhatsApp'}
              title={isSold ? 'Ask About Similar Stones' : 'Inquire on WhatsApp'}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
