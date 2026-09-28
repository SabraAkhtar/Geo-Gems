import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  ShieldCheck,
  Play,
  Film,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Gemstone } from '../types';
import { useEcommerce } from '../context/EcommerceContext';
import {
  getStoneId,
  getWeightDisplay,
  getPriceDisplay,
  getWhatsAppInquiryUrl,
  getInquiryButtonLabel,
  getProductUrl,
} from '../utils/gemstoneHelpers';
import { ProductCard } from './ProductCard';
import { SecondaryButton } from './SecondaryButton';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductDetailPageProps {
  gemstone: Gemstone;
  onBack?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ gemstone, onBack }) => {
  const { allProducts, navigateToCategory, setCurrentView, isStoneSaved, toggleSavedStone, showNotification } =
    useEcommerce();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveMediaType('image');
  }, [gemstone.id]);

  const stoneId = getStoneId(gemstone);
  const priceInfo = getPriceDisplay(gemstone);
  const weightText = getWeightDisplay(gemstone, true);
  const weightShort = getWeightDisplay(gemstone, false);
  const isSaved = isStoneSaved(gemstone.id);
  const isSold = gemstone.status === 'sold' || gemstone.status === 'sold_out';
  const isReserved = gemstone.status === 'reserved';
  const productUrl = getProductUrl(gemstone);
  const whatsappUrl = getWhatsAppInquiryUrl(gemstone, undefined, productUrl, isSold);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productUrl);
      setCopiedLink(true);
      showNotification('Product link copied to clipboard.');
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  // Find similar stones: same type or origin, excluding current stone
  const similarStones = allProducts
    .filter(
      (s) =>
        s.id !== gemstone.id &&
        (s.status || 'published') !== 'draft' &&
        (s.type === gemstone.type || s.origin === gemstone.origin || s.collectionId === gemstone.collectionId)
    )
    .slice(0, 3);

  const images = gemstone.images && gemstone.images.length > 0 ? gemstone.images : ['/stones/ruby.jpg'];
  const hasVideo = Boolean(gemstone.videoUrl && gemstone.videoUrl.trim());

  return (
    <article className="min-h-screen bg-[#FAF8F3] text-[#292820] py-6 sm:py-10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Return Bar */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-breadcrumb">
            <button
              onClick={() => {
                if (onBack) onBack();
                else setCurrentView('home');
              }}
              className="hover:text-[#B08D57] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#B7AEA2]" />
            <button
              onClick={() => {
                navigateToCategory(gemstone.type);
              }}
              className="hover:text-[#B08D57] transition-colors cursor-pointer"
            >
              {gemstone.type || 'Gemstones'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#B7AEA2]" />
            <span className="text-[#121212] font-medium">{stoneId}</span>
          </div>

          <button
            onClick={() => {
              if (onBack) onBack();
              else setCurrentView('collection');
            }}
            className="inline-flex items-center gap-1.5 text-[#716B60] hover:text-[#121212] font-sans font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </button>
        </nav>

        {/* Main Grid: Gallery on Left (7 cols), Specifications & Inquire on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT: Image & Video Media Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary High-Resolution Display Viewport */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-[#F3EFE8] rounded-2xl overflow-hidden border border-[#E5DED2] shadow-sm flex items-center justify-center">
              {activeMediaType === 'video' && hasVideo ? (
                <video
                  key={gemstone.videoUrl!}
                  src={gemstone.videoUrl!}
                  poster={images[0]}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain bg-[#181614]"
                />
              ) : (
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={`${gemstone.name} - View ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Status Badge Over Media */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                {isSold ? (
                  <span className="px-3 py-1 bg-[#121212]/90 backdrop-blur-md text-[#E8C86A] text-[11px] font-sans font-semibold tracking-wider uppercase rounded-md border border-[#E8C86A]/40">
                    Sold
                  </span>
                ) : isReserved ? (
                  <span className="px-3 py-1 bg-[#2C2416]/90 backdrop-blur-md text-[#E5C07B] text-[11px] font-sans font-semibold tracking-wider uppercase rounded-md border border-[#E5C07B]/40">
                    Reserved
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#142318]/85 backdrop-blur-md text-[#85E0A3] text-[11px] font-sans font-semibold tracking-wider uppercase rounded-md border border-[#85E0A3]/30">
                    Available
                  </span>
                )}
              </div>

              {/* Bookmark / Save Button */}
              <button
                onClick={() => toggleSavedStone(gemstone.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#B08D57] text-white border-[#B08D57]'
                    : 'bg-[#121212]/60 text-white/90 hover:bg-[#121212]/80 border-white/20'
                }`}
                title={isSaved ? 'Remove from Saved Stones' : 'Save Stone'}
                aria-label={isSaved ? 'Remove from Saved Stones' : 'Save Stone'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              {/* Quick Toggle to Video when viewing Images */}
              {hasVideo && activeMediaType === 'image' && (
                <button
                  type="button"
                  onClick={() => setActiveMediaType('video')}
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3.5 py-2 bg-[#121212]/75 hover:bg-[#121212]/90 backdrop-blur-md text-[#FAF8F3] text-xs font-sans font-medium tracking-wider uppercase rounded-full border border-white/20 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#B08D57] fill-current" />
                  <span>Watch Stone Video</span>
                </button>
              )}
            </div>

            {/* Thumbnail Navigation (Images + Video) */}
            {(images.length > 1 || hasVideo) && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveMediaType('image');
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-20 h-16 sm:w-24 sm:h-18 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeMediaType === 'image' && activeImageIndex === idx
                        ? 'border-[#B08D57] ring-1 ring-[#B08D57]/50 shadow-xs'
                        : 'border-[#E5DED2] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}

                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaType('video')}
                    className={`relative w-24 h-16 sm:w-28 sm:h-18 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#181614] ${
                      activeMediaType === 'video'
                        ? 'border-[#B08D57] ring-1 ring-[#B08D57]/50 shadow-xs'
                        : 'border-[#E5DED2] opacity-80 hover:opacity-100'
                    }`}
                    title="Watch Product Video"
                  >
                    <img
                      src={images[0]}
                      alt={`${gemstone.name} Video Thumbnail`}
                      className="w-full h-full object-cover opacity-55"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35 text-white">
                      <div className="w-7 h-7 rounded-full bg-[#B08D57] flex items-center justify-center shadow-xs">
                        <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5" />
                      </div>
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-wider inline-flex items-center gap-1">
                        <Film className="w-2.5 h-2.5" />
                        <span>Video</span>
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Clear Stone Information Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EFE6] border border-[#E1D9CD] flex items-start gap-3.5 mt-2">
              <ShieldCheck className="w-5 h-5 text-[#B08D57] flex-shrink-0 mt-0.5" />
              <div className="text-[13px] sm:text-[14px] text-[#4A453D] leading-relaxed">
                <span className="font-semibold text-[#121212]">Clear Stone Details: </span>
                Every stone is listed with its available weight, size, origin, and known treatment details so you can review and inquire with confidence.{' '}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('education');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#B08D57] hover:text-[#121212] font-medium underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Read our Gemstone Guides
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Typography, Specifications & Inquiry Action */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Editorial Eyebrow */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-eyebrow">
                {gemstone.type} • {gemstone.origin ? gemstone.origin.split(',')[0] : 'Natural'}
              </span>
              <span className="font-stone-id">Product ID: {stoneId}</span>
            </div>

            {/* Product Title in Cormorant Garamond */}
            <h1 className="font-h1 text-[#121212] tracking-tight mb-2">{gemstone.name}</h1>

            {/* Tagline / Subtitle */}
            <p className="text-[15px] font-sans text-[#5A544A] mb-5 leading-relaxed">{gemstone.tagline}</p>

            {/* Price & Availability Status */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E1D9CD] shadow-xs mb-6">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <span className="text-[12px] font-sans font-medium text-[#5A544A] uppercase tracking-wider block mb-1">
                    Price
                  </span>
                  {priceInfo.isPriceOnRequest ? (
                    <div className="font-price-request">Price on Request</div>
                  ) : (
                    <div className="font-price text-[20px] sm:text-[24px]">{priceInfo.label}</div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[12px] font-sans font-medium text-[#5A544A] uppercase tracking-wider block mb-1">
                    Weight
                  </span>
                  <span className="font-sans text-base font-semibold text-[#121212]">{weightShort}</span>
                </div>
              </div>

              {/* Status Notice if Sold or Reserved */}
              {isSold && (
                <div className="mt-4 p-3 bg-[#FAF8F3] rounded-xl border border-[#E1D9CD] text-xs text-[#5A544A] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#B08D57] flex-shrink-0" />
                  <span>
                    <strong>This stone has been sold.</strong> Contact us on WhatsApp if you would like to ask about similar available stones.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button flex-1 text-center font-medium"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>{getInquiryButtonLabel(gemstone)}</span>
                </a>

                <SecondaryButton
                  onClick={handleCopyLink}
                  icon={copiedLink ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
                  text={copiedLink ? 'Copied' : 'Share'}
                  title="Share stone link"
                  ariaLabel="Share stone link"
                />
              </div>

              <p className="mt-3 text-[12px] text-[#5A544A] text-center font-normal">
                Direct WhatsApp inquiry • Request additional photos or videos
              </p>
            </div>

            {/* Key Specifications Table */}
            <div className="rounded-2xl border border-[#E1D9CD] bg-white overflow-hidden mb-6">
              <div className="px-5 py-3.5 bg-[#FAF8F3] border-b border-[#E1D9CD] flex items-center justify-between">
                <h3 className="text-xs font-sans font-semibold tracking-wider text-[#121212] uppercase">
                  Stone Information
                </h3>
                <span className="text-[12px] font-sans text-[#5A544A]">{stoneId}</span>
              </div>

              <div className="divide-y divide-[#F0EAE1] text-xs sm:text-[13.5px]">
                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Stone Name</span>
                  <span className="font-spec-val text-right min-w-0 truncate">{gemstone.name}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Product ID</span>
                  <span className="font-spec-val min-w-0 truncate">{stoneId}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Category</span>
                  <span className="font-spec-val min-w-0 truncate">{gemstone.type}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Form / Cut</span>
                  <span className="font-spec-val min-w-0 truncate">{gemstone.cut}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Weight</span>
                  <span className="font-spec-val min-w-0 truncate">{weightText}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Size</span>
                  <span className="font-spec-val min-w-0 truncate">{gemstone.dimensions}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Color</span>
                  <span className="font-spec-val min-w-0 truncate">{gemstone.color}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Clarity</span>
                  <span className="font-spec-val min-w-0 truncate">{gemstone.clarity}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Origin</span>
                  <span className="font-spec-val min-w-0 truncate">{gemstone.origin || 'Natural Origin'}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Treatment</span>
                  <span className="font-spec-val font-medium text-[#121212] min-w-0 truncate">{gemstone.treatment}</span>
                </div>

                <div className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="font-spec-label flex-shrink-0">Availability</span>
                  <span className="font-spec-val text-[#7D8976] font-medium min-w-0 truncate">
                    {isSold ? 'Sold' : isReserved ? 'Reserved' : 'Available'}
                  </span>
                </div>

                {gemstone.certificate && gemstone.certificate.issuer && (
                  <div className="px-5 py-3 flex items-center justify-between gap-3 bg-[#FAF8F3]/60">
                    <span className="font-spec-label flex-shrink-0">Report / Certificate</span>
                    <span className="font-spec-val text-[#B08D57] font-semibold min-w-0 truncate">
                      {gemstone.certificate.issuer} #{gemstone.certificate.reportNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description & Notes */}
            <div className="space-y-3 text-[15px] leading-[1.7] text-[#3D3933] max-reading-section">
              <h4 className="text-xs font-sans font-semibold tracking-wider text-[#121212] uppercase mb-1">
                About This Stone
              </h4>
              <p>{gemstone.description}</p>
              {gemstone.loreAndProperties && (
                <p className="italic text-[#5A544A] border-l-2 border-[#B08D57]/40 pl-3">
                  "{gemstone.loreAndProperties}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Similar Stones Section */}
        {similarStones.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-[#E5DED2]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="w-6 h-[1px] bg-[#B08D57] inline-block"
                    style={{ opacity: 0.28 }}
                  />
                  <span className="font-eyebrow">Similar Stones</span>
                </div>
                <h2 className="font-h2 text-[#121212] mt-1">You May Also Like</h2>
              </div>
              <button
                onClick={() => navigateToCategory(gemstone.type)}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#B08D57] hover:text-[#121212] tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>View All {gemstone.type}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {similarStones.map((simStone) => (
                <ProductCard key={simStone.id} gemstone={simStone} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
