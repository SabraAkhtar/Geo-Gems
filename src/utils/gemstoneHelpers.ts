import { Gemstone } from '../types';

export const BUSINESS_WHATSAPP_NUMBER = '923275315493'; // +92 327 5315493
export const BUSINESS_WHATSAPP_DISPLAY = '+92 327 5315493';
export const OFFICIAL_INSTAGRAM_URL = 'https://www.instagram.com/geogemscrystals';
export const OFFICIAL_TIKTOK_URL = 'https://www.tiktok.com/@geogemscrystals';

export interface FormattedPriceInfo {
  type: 'fixed' | 'on_request' | 'starting_from';
  label: string;
  isPriceOnRequest: boolean;
  isStartingFrom: boolean;
  isFixed: boolean;
}

/**
 * Safely triggers an external link navigation without window.open (iframe friendly)
 */
export function openExternalLink(url: string): void {
  if (typeof window === 'undefined') return;
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Returns formatted stone ID e.g. "GGC-RB-001"
 */
export function getStoneId(gemstone: Gemstone): string {
  if (gemstone.stoneId) return gemstone.stoneId;
  // Fallback to clean ID
  const clean = gemstone.id.toUpperCase().replace(/^GEO-/, 'GGC-');
  return clean.includes('GGC-') ? clean : `GGC-${clean}`;
}

/**
 * Returns clean shareable deep-link URL for a stone
 */
export function getProductUrl(gemstone: Gemstone): string {
  const stoneId = getStoneId(gemstone);
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/stone/${encodeURIComponent(stoneId)}`;
  }
  return `/stone/${encodeURIComponent(stoneId)}`;
}

/**
 * Returns formatted weight string, e.g. "3.42 ct" or "12.5 g"
 */
export function getWeightDisplay(gemstone: Gemstone, full = false): string {
  const value = gemstone.weight !== undefined && gemstone.weight !== null ? gemstone.weight : gemstone.carat;
  const unit = gemstone.weightUnit || 'ct';
  if (!full) {
    return `${value} ${unit}`;
  }
  const numericVal = Number(value);
  if (unit === 'g') {
    return `${value} ${numericVal === 1 ? 'Gram' : 'Grams'}`;
  }
  return `${value} ${numericVal === 1 ? 'Carat' : 'Carats'}`;
}

/**
 * Returns price display info respecting 'Price on Request', 'Starting from', and 'Fixed Price'
 * Strictly guarantees NEVER inventing or assigning fake prices.
 */
export function getPriceDisplay(
  gemstone: Gemstone,
  formatPriceUSD?: (usd: number) => string
): FormattedPriceInfo {
  const displayType = gemstone.priceDisplayType || 'fixed';

  if (displayType === 'on_request') {
    return {
      type: 'on_request',
      label: 'Price on Request',
      isPriceOnRequest: true,
      isStartingFrom: false,
      isFixed: false,
    };
  }

  const currency = gemstone.currency || 'USD';
  const amount =
    gemstone.priceAmount !== undefined && gemstone.priceAmount !== null
      ? gemstone.priceAmount
      : gemstone.priceUSD;

  if (displayType === 'starting_from') {
    const formattedAmount =
      amount !== undefined && amount !== null
        ? Number(amount).toLocaleString('en-US')
        : '';
    return {
      type: 'starting_from',
      label: `Starting from ${currency} ${formattedAmount}`,
      isPriceOnRequest: false,
      isStartingFrom: true,
      isFixed: false,
    };
  }

  // Fixed Price
  if (currency !== 'USD' && amount !== undefined && amount !== null) {
    return {
      type: 'fixed',
      label: `${currency} ${Number(amount).toLocaleString('en-US')}`,
      isPriceOnRequest: false,
      isStartingFrom: false,
      isFixed: true,
    };
  }

  if (formatPriceUSD && gemstone.priceUSD) {
    return {
      type: 'fixed',
      label: formatPriceUSD(gemstone.priceUSD),
      isPriceOnRequest: false,
      isStartingFrom: false,
      isFixed: true,
    };
  }

  const formattedAmount =
    amount !== undefined && amount !== null
      ? Number(amount).toLocaleString('en-US')
      : '0';

  return {
    type: 'fixed',
    label: `$${formattedAmount}`,
    isPriceOnRequest: false,
    isStartingFrom: false,
    isFixed: true,
  };
}

/**
 * Creates a clean, easy-to-read WhatsApp inquiry message using available product data.
 */
export function createWhatsAppMessage(
  gemstone: Gemstone,
  customProductUrl?: string,
  isSimilarInquiry = false
): string {
  const stoneId = getStoneId(gemstone);
  const weightText = getWeightDisplay(gemstone, false);
  const priceInfo = getPriceDisplay(gemstone);
  const resolvedUrl = customProductUrl || getProductUrl(gemstone);

  const detailsLines: string[] = [
    `Stone: ${gemstone.name}`,
    stoneId ? `Product ID: ${stoneId}` : '',
    weightText ? `Weight: ${weightText}` : '',
    !isSimilarInquiry && priceInfo?.label ? `Price: ${priceInfo.label}` : '',
    resolvedUrl ? `Product Link: ${resolvedUrl}` : '',
  ].filter(Boolean);

  if (isSimilarInquiry || gemstone.status === 'sold' || gemstone.status === 'sold_out') {
    return `Hello Geo Gems Crystals,

I saw this stone on your website and would like to ask about similar available stones:

${detailsLines.join('\n')}

Please share more details and availability.`;
  }

  return `Hello Geo Gems Crystals,

I am interested in this stone:

${detailsLines.join('\n')}

Please share more details and availability.`;
}

/**
 * Builds pre-filled WhatsApp inquiry URL for a specific product
 */
export function getWhatsAppInquiryUrl(
  gemstone: Gemstone,
  phoneNumber: string = BUSINESS_WHATSAPP_NUMBER,
  customProductUrl?: string,
  isSimilarInquiry = false
): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '') || BUSINESS_WHATSAPP_NUMBER;
  const message = createWhatsAppMessage(gemstone, customProductUrl, isSimilarInquiry);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds pre-filled WhatsApp URL for general inquiries across the website
 */
export function getGeneralWhatsAppUrl(customMessage?: string): string {
  const defaultMsg =
    customMessage ||
    'Hello Geo Gems Crystals,\n\nI would like to inquire about your gemstones and crystals.\n\nPlease share more details.';
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMsg)}`;
}

/**
 * Generates clear, simple button label based on gemstone availability status
 */
export function getInquiryButtonLabel(gemstone: Gemstone): string {
  if (gemstone.status === 'sold' || gemstone.status === 'sold_out') {
    return 'Ask About Similar Stones';
  }
  if (gemstone.status === 'reserved') {
    return 'Ask About This Stone';
  }
  return 'Inquire on WhatsApp';
}

