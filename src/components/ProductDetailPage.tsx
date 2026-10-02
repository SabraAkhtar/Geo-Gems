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
  Instagram,
  Music2,
  ShoppingBag,
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
  OFFICIAL_INSTAGRAM_URL,
  OFFICIAL_TIKTOK_URL,
  OFFICIAL_ETSY_URL,
} from '../utils/gemstoneHelpers';
import { ProductCard } from './ProductCard';
import { SecondaryButton } from './SecondaryButton';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductDetailPageProps {
  gemstone: Gemstone;
  onBack?: () => void;
}

// ── Spec row — only renders if value is truthy ──────────────────────────────
function SpecRow({ label, value, highlight }: { label: string; value?: string | null; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#F0EAE1] last:border-0">
      <span className="font-spec-label flex-shrink-0 leading-snug">{label}</span>
      <span className={`font-spec-val text-right min-w-0 break-words ${highlight ? 'text-[#B08D57] font-semibold' : ''}`}>
        {value}
      </span>
    </div>
  );
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

  // ── spec rows data ─────────────────────────────────────────────────────────
  const leftSpecs = [
    { label: 'Stone Name', value: gemstone.name },
    { label: 'Product ID', value: stoneId },
    { label: 'Category', value: gemstone.type },
    { label: 'Form / Cut', value: gemstone.cut },
    { label: 'Weight', value: weightText },
    { label: 'Size', value: gemstone.dimensions },
  ];
  const rightSpecs = [
    { label: 'Color', value: gemstone.color },
    { label: 'Clarity', value: gemstone.clarity },
    { label: 'Origin', value: gemstone.origin },
    { label: 'Treatment', value: gemstone.treatment },
    { label: 'Availability', value: isSold ? 'Sold' : isReserved ? 'Reserved' : 'Available' },
    {
      label: 'Report / Certificate',
      value:
        gemstone.certificate?.issuer
          ? `${gemstone.certificate.issuer} #${gemstone.certificate.reportNumber}`
          : null,
      highlight: true,
    },
  ];

  return (
    <article className="min-h-screen bg-[#FAF8F3] text-[#292820] py-4 sm:py-6 lg:py-10 pb-24 sm:pb-6 lg:pb-10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-breadcrumb">
            <button onClick={() => { if (onBack) onBack(); else setCurrentView('home'); }} className="hover:text-[#B08D57] transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#B7AEA2]" />
            <button onClick={() => navigateToCategory(gemstone.type)} className="hover:text-[#B08D57] transition-colors cursor-pointer">{gemstone.type || 'Gemstones'}</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#B7AEA2]" />
            <span className="text-[#121212] font-medium">{stoneId}</span>
          </div>
          <button
            onClick={() => { if (onBack) onBack(); else setCurrentView('collection'); }}
            className="inline-flex items-center gap-1.5 text-[#716B60] hover:text-[#121212] font-sans font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </button>
        </nav>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION A — Image (left) + Product Details (right)
            Both columns match height via items-start; image uses aspect-ratio
            so it never stretches. Right side scrolls naturally if taller.
        ══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-10 lg:mb-14">

          {/* ── LEFT: Image gallery ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-[#F3EFE8] rounded-2xl overflow-hidden border border-[#E5DED2] shadow-sm">
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
                  alt={`${gemstone.name} — view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Status badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                {isSold ? (
                  <span className="px-3 py-1 bg-[#121212]/90 backdrop-blur-md text-[#E8C86A] text-[11px] font-sans font-semibold tracking-wider uppercase rounded-md border border-[#E8C86A]/40">Sold</span>
                ) : isReserved ? (
                  <span className="px-3 py-1 bg-[#2C2416]/90 backdrop-blur-md text-[#E5C07B] text-[11px] font-sans font-semibold tracking-wider uppercase rounded-md border border-[#E5C07B]/40">Reserved</span>
                ) : (
                  <span className="px-3 py-1 bg-[#142318]/85 backdrop-blur-md text-[#85E0A3] text-[11px] font-sans font-semibold tracking-wider uppercase rounded-md border border-[#85E0A3]/30">Available</span>
                )}
              </div>

              {/* Bookmark */}
              <button
                onClick={() => toggleSavedStone(gemstone.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  isSaved ? 'bg-[#B08D57] text-white border-[#B08D57]' : 'bg-[#121212]/60 text-white/90 hover:bg-[#121212]/80 border-white/20'
                }`}
                aria-label={isSaved ? 'Remove from Saved Stones' : 'Save Stone'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              {/* Video toggle */}
              {hasVideo && activeMediaType === 'image' && (
                <button
                  type="button"
                  onClick={() => setActiveMediaType('video')}
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3.5 py-2 bg-[#121212]/75 hover:bg-[#121212]/90 backdrop-blur-md text-[#FAF8F3] text-xs font-sans font-medium tracking-wider uppercase rounded-full border border-white/20 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#B08D57] fill-current" />
                  <span>Watch Video</span>
                </button>
              )}
            </div>

            {/* Thumbnails */}
            {(images.length > 1 || hasVideo) && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setActiveMediaType('image'); setActiveImageIndex(idx); }}
                    className={`dot-btn relative w-16 h-14 sm:w-20 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeMediaType === 'image' && activeImageIndex === idx
                        ? 'border-[#B08D57] ring-1 ring-[#B08D57]/40'
                        : 'border-[#E5DED2] opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaType('video')}
                    className={`dot-btn relative w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#181614] ${
                      activeMediaType === 'video' ? 'border-[#B08D57] ring-1 ring-[#B08D57]/40' : 'border-[#E5DED2] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={images[0]} alt="Video thumbnail" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-white">
                      <div className="w-6 h-6 rounded-full bg-[#B08D57] flex items-center justify-center">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </div>
                      <span className="text-[9px] font-sans font-semibold uppercase tracking-wide flex items-center gap-0.5">
                        <Film className="w-2.5 h-2.5" /><span>Video</span>
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product details + price + CTA ───────────────────────── */}
          <div className="flex flex-col">
            {/* Eyebrow — type & origin */}
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <span className="font-eyebrow">
                {gemstone.type}{gemstone.origin ? ` • ${gemstone.origin.split(',')[0]}` : ''}
              </span>
              <span className="font-stone-id text-[#8C8578]">{stoneId}</span>
            </div>

            {/* Name */}
            <h1 className="font-h1 text-[#121212] tracking-tight mb-2 leading-tight">{gemstone.name}</h1>

            {/* Tagline */}
            {gemstone.tagline && (
              <p className="text-[14px] sm:text-[15px] font-sans text-[#5A544A] mb-5 leading-relaxed">{gemstone.tagline}</p>
            )}

            {/* Price + Weight card */}
            <div className="rounded-2xl bg-white border border-[#E1D9CD] shadow-xs p-4 sm:p-5 mb-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[11px] font-sans font-semibold text-[#5A544A] uppercase tracking-wider block mb-1">Price</span>
                  {priceInfo.isPriceOnRequest ? (
                    <span className="font-price-request text-[18px]">Price on Request</span>
                  ) : (
                    <span className="font-price text-[20px] sm:text-[24px]">{priceInfo.label}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-sans font-semibold text-[#5A544A] uppercase tracking-wider block mb-1">Weight</span>
                  <span className="font-sans text-[16px] font-semibold text-[#121212]">{weightShort}</span>
                </div>
              </div>

              {isSold && (
                <div className="mb-4 p-3 bg-[#FAF8F3] rounded-xl border border-[#E1D9CD] text-xs text-[#5A544A] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#B08D57] flex-shrink-0 mt-px" />
                  <span><strong>This stone has been sold.</strong> Contact us on WhatsApp to ask about similar available stones.</span>
                </div>
              )}

              {/* WhatsApp + Share */}
              <div className="flex items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button flex flex-1 items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white flex-shrink-0" />
                  <span>{getInquiryButtonLabel(gemstone)}</span>
                </a>
                <SecondaryButton
                  onClick={handleCopyLink}
                  icon={copiedLink ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
                  text={copiedLink ? 'Copied' : 'Share'}
                  title="Copy product link"
                  ariaLabel="Share product link"
                />
              </div>
              <p className="mt-3 text-[11.5px] text-[#5A544A] text-center font-normal">
                Direct WhatsApp inquiry • Request additional photos or videos
              </p>
            </div>

            {/* Trust note */}
            <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E1D9CD] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#B08D57] flex-shrink-0 mt-0.5" />
              <p className="text-[12.5px] sm:text-[13px] text-[#4A453D] leading-relaxed">
                <span className="font-semibold text-[#121212]">Clear Stone Details: </span>
                Every stone is listed with available weight, size, origin, and treatment details.{' '}
                <button
                  type="button"
                  onClick={() => { setCurrentView('education'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-[#B08D57] hover:text-[#121212] font-medium underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Read our Gemstone Guides
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION B — STONE INFORMATION (full-width, spans both columns)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-[#E1D9CD] bg-white overflow-hidden mb-8">
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 bg-[#FAF8F3] border-b border-[#E1D9CD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-[13px] font-sans font-bold tracking-wider text-[#121212] uppercase">
                Stone Information
              </h2>
            </div>
            <span className="font-stone-id text-[#8C8578] text-[11px]">{stoneId}</span>
          </div>

          {/* Two-column specs grid on desktop, single column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#F0EAE1]">
            {/* Left column */}
            <div className="px-5 sm:px-6 py-2">
              {leftSpecs.map((s) => (
                <SpecRow key={s.label} label={s.label} value={s.value as string | null} />
              ))}
            </div>
            {/* Right column */}
            <div className="px-5 sm:px-6 py-2">
              {rightSpecs.map((s) => (
                <SpecRow key={s.label} label={s.label} value={s.value as string | null} highlight={s.highlight} />
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION C — ABOUT THIS STONE
        ══════════════════════════════════════════════════════════════════ */}
        {(gemstone.description || gemstone.loreAndProperties) && (
          <div className="rounded-2xl border border-[#E1D9CD] bg-white p-5 sm:p-7 mb-8">
            <h2 className="text-xs sm:text-[13px] font-sans font-bold tracking-wider text-[#121212] uppercase mb-4">
              About This Stone
            </h2>
            <div className="space-y-4 text-[14.5px] sm:text-[15px] leading-[1.72] text-[#3D3933]">
              {gemstone.description && <p>{gemstone.description}</p>}
              {gemstone.loreAndProperties && (
                <p className="italic text-[#5A544A] border-l-2 border-[#B08D57]/40 pl-4">
                  "{gemstone.loreAndProperties}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SECTION D — SOCIAL MEDIA / FOLLOW US
        ══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-[#E1D9CD] bg-[#FAF8F3] p-5 sm:p-7 mb-10 sm:mb-14">
          <div className="text-center mb-6">
            <span className="font-eyebrow block mb-1">Stay Connected</span>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#121212]">
              Follow Us for More Natural Beauty
            </h2>
            <p className="text-[13px] font-sans text-[#716B60] mt-2">
              New gemstones, crystals, and rare finds — follow our journey.
            </p>
          </div>

          <div className="flex flex-wrap items-stretch justify-center gap-4">
            {/* TikTok */}
            <a
              href={OFFICIAL_TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2.5 px-6 py-5 bg-white rounded-2xl border border-[#E5DED2] hover:border-[#B08D57] transition-colors group min-w-[120px] text-center"
              aria-label="Follow us on TikTok"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F1E9] border border-[#E5DED2] flex items-center justify-center group-hover:bg-[#B08D57] group-hover:border-[#B08D57] transition-all">
                <Music2 className="w-4.5 h-4.5 text-[#B08D57] group-hover:text-white transition-colors" />
              </div>
              <div>
                <span className="block text-[13px] font-sans font-semibold text-[#121212] group-hover:text-[#B08D57] transition-colors">TikTok</span>
                <span className="block text-[11px] font-sans text-[#8C8578]">@crystalgirl212</span>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={OFFICIAL_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2.5 px-6 py-5 bg-white rounded-2xl border border-[#E5DED2] hover:border-[#B08D57] transition-colors group min-w-[120px] text-center"
              aria-label="Follow us on Instagram"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F1E9] border border-[#E5DED2] flex items-center justify-center group-hover:bg-[#B08D57] group-hover:border-[#B08D57] transition-all">
                <Instagram className="w-4.5 h-4.5 text-[#B08D57] group-hover:text-white transition-colors" />
              </div>
              <div>
                <span className="block text-[13px] font-sans font-semibold text-[#121212] group-hover:text-[#B08D57] transition-colors">Instagram</span>
                <span className="block text-[11px] font-sans text-[#8C8578]">@geo_gems_crystals</span>
              </div>
            </a>

            {/* Etsy — only shown when URL is configured */}
            {OFFICIAL_ETSY_URL && (
              <a
                href={OFFICIAL_ETSY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2.5 px-6 py-5 bg-white rounded-2xl border border-[#E5DED2] hover:border-[#B08D57] transition-colors group min-w-[120px] text-center"
                aria-label="Visit our Etsy shop"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5F1E9] border border-[#E5DED2] flex items-center justify-center group-hover:bg-[#B08D57] group-hover:border-[#B08D57] transition-all">
                  <ShoppingBag className="w-4.5 h-4.5 text-[#B08D57] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="block text-[13px] font-sans font-semibold text-[#121212] group-hover:text-[#B08D57] transition-colors">Etsy Shop</span>
                  <span className="block text-[11px] font-sans text-[#8C8578]">Geo Gems Crystals</span>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* ── Similar Stones ─────────────────────────────────────────────────── */}
        {similarStones.length > 0 && (
          <section className="pt-10 sm:pt-12 border-t border-[#E5DED2]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="font-eyebrow block mb-1">Similar Stones</span>
                <h2 className="font-h2 text-[#121212]">You May Also Like</h2>
              </div>
              <button
                onClick={() => navigateToCategory(gemstone.type)}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#B08D57] hover:text-[#121212] tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>View All {gemstone.type}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
              {similarStones.map((s) => (
                <ProductCard key={s.id} gemstone={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Sticky mobile WA bar ────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-t border-[#E5DED2] px-4 py-3 shadow-[0_-4px_20px_rgba(37,34,29,0.08)]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-sans text-[#716B60] truncate">{gemstone.name}</p>
            <p className="text-[13px] font-serif font-medium text-[#121212]">
              {priceInfo.isPriceOnRequest ? 'Price on Request' : priceInfo.label}
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-[#B08D57] hover:bg-[#9E7B47] text-white font-sans font-medium transition-colors"
            style={{ padding: '0.75em 1.4em', fontSize: '12px', letterSpacing: '1.4px', textTransform: 'uppercase' }}
          >
            <WhatsAppIcon className="w-4 h-4 text-white flex-shrink-0" />
            <span>{getInquiryButtonLabel(gemstone)}</span>
          </a>
        </div>
      </div>
    </article>
  );
};
