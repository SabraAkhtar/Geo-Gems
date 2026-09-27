import { Gemstone } from '../types';
import { ViewType } from '../context/EcommerceContext';
import { getPriceDisplay, getStoneId, getWeightDisplay } from './gemstoneHelpers';

const SITE_NAME = 'Geo Gems Crystals';
const DEFAULT_TITLE = 'Geo Gems Crystals — Natural Gemstones & Crystals';
const DEFAULT_DESCRIPTION =
  'Discover natural gemstones and crystals with clear details on weight, origin, and availability. Inquire directly on WhatsApp for worldwide delivery.';

function setOrCreateMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setProductJsonLd(gemstone: Gemstone | null, originUrl: string) {
  if (typeof document === 'undefined') return;
  const scriptId = 'dynamic-product-jsonld';
  const existing = document.getElementById(scriptId);

  if (!gemstone) {
    if (existing) existing.remove();
    return;
  }

  const stoneId = getStoneId(gemstone);
  const weightDisplay = getWeightDisplay(gemstone);
  const priceInfo = getPriceDisplay(gemstone);
  const imageUrl = gemstone.images?.[0]
    ? gemstone.images[0].startsWith('http')
      ? gemstone.images[0]
      : `${originUrl}${gemstone.images[0]}`
    : `${originUrl}/logo.png`;

  const isAvailable =
    gemstone.status !== 'sold' &&
    gemstone.status !== 'sold_out' &&
    gemstone.status !== 'reserved' &&
    gemstone.stockStatus !== 'reserved';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: gemstone.name,
    sku: stoneId,
    productID: stoneId,
    image: [imageUrl],
    description: `${gemstone.description} Weight: ${weightDisplay}. Origin: ${gemstone.origin || 'Natural'}.`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: gemstone.category || 'Natural Gemstone',
    url: `${originUrl}/stone/${encodeURIComponent(stoneId)}`,
    offers: {
      '@type': 'Offer',
      url: `${originUrl}/stone/${encodeURIComponent(stoneId)}`,
      priceCurrency: gemstone.currency || 'USD',
      price: !priceInfo.isPriceOnRequest && gemstone.priceAmount ? gemstone.priceAmount : undefined,
      availability: isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}

export function updatePageSeo(
  view: ViewType,
  activeGemstone: Gemstone | null,
  selectedCategory?: 'All' | 'Gemstone' | 'Crystal' | null,
  selectedType?: string | null
) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const canonicalUrl = `${origin}${pathname}`;

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let ogImage = `${origin}/logo.png`;
  let robots = 'index, follow';

  switch (view) {
    case 'home':
      title = DEFAULT_TITLE;
      description = DEFAULT_DESCRIPTION;
      break;
    case 'collection':
      if (selectedType) {
        title = `Natural ${selectedType} Collection | ${SITE_NAME}`;
        description = `Browse natural ${selectedType} stones with verified weight, origin, and direct WhatsApp inquiry at ${SITE_NAME}.`;
      } else if (selectedCategory === 'Crystal' || pathname === '/crystals') {
        title = `Natural Crystals & Mineral Formations | ${SITE_NAME}`;
        description = `Explore natural quartz, amethyst, citrine, peridot, and crystal stones carefully selected by ${SITE_NAME}.`;
      } else if (selectedCategory === 'Gemstone' || pathname === '/gemstones') {
        title = `Natural Gemstones — Ruby, Sapphire, Emerald & More | ${SITE_NAME}`;
        description = `Explore fine natural gemstones including ruby, sapphire, emerald, aquamarine, tourmaline, and opal at ${SITE_NAME}.`;
      } else {
        title = `Gemstone & Crystal Catalog | ${SITE_NAME}`;
        description = DEFAULT_DESCRIPTION;
      }
      break;
    case 'stone':
      if (activeGemstone) {
        const stoneId = getStoneId(activeGemstone);
        const weightDisplay = getWeightDisplay(activeGemstone);
        title = `${activeGemstone.name} (${stoneId}) | ${SITE_NAME}`;
        description = `${activeGemstone.name} — ${weightDisplay}, Origin: ${
          activeGemstone.origin || 'Natural'
        }. ${activeGemstone.description.slice(0, 140)}`;
        if (activeGemstone.images?.[0]) {
          ogImage = activeGemstone.images[0].startsWith('http')
            ? activeGemstone.images[0]
            : `${origin}${activeGemstone.images[0]}`;
        }
      }
      break;
    case 'education':
      title = `Gemstone & Crystal Guides | ${SITE_NAME}`;
      description =
        'Learn how to evaluate natural gemstones and crystals, understand stone origins, clarity, and care guides.';
      break;
    case 'about':
      title = `About Us — Direct Natural Stone Sourcing | ${SITE_NAME}`;
      description =
        'Learn how Geo Gems Crystals selects natural gemstones and crystals with clear disclosures and personal WhatsApp support.';
      break;
    case 'contact':
      title = `Contact Us — Direct WhatsApp & Stone Inquiries | ${SITE_NAME}`;
      description =
        'Contact Geo Gems Crystals on WhatsApp (+92 327 5315493) or send an inquiry for photos, videos, and stone availability.';
      break;
    case 'privacy':
      title = `Privacy Policy | ${SITE_NAME}`;
      description = 'How Geo Gems Crystals protects your privacy and personal inquiry information.';
      break;
    case 'terms':
      title = `Shipping, Delivery & Terms | ${SITE_NAME}`;
      description =
        'Worldwide shipping, safe packaging, stone verification, and customer service policies at Geo Gems Crystals.';
      break;
    case 'admin':
      title = `Admin Portal | ${SITE_NAME}`;
      description = 'Authorized inventory management portal.';
      robots = 'noindex, nofollow';
      break;
    case 'not-found':
      title = `Page Not Found | ${SITE_NAME}`;
      robots = 'noindex, follow';
      break;
    default:
      break;
  }

  document.title = title;
  setOrCreateMeta('name', 'description', description);
  setOrCreateMeta('name', 'robots', robots);
  setOrCreateMeta('property', 'og:title', title);
  setOrCreateMeta('property', 'og:description', description);
  setOrCreateMeta('property', 'og:url', canonicalUrl);
  setOrCreateMeta('property', 'og:site_name', SITE_NAME);
  setOrCreateMeta('property', 'og:image', ogImage);
  setOrCreateMeta('name', 'twitter:title', title);
  setOrCreateMeta('name', 'twitter:description', description);
  setOrCreateMeta('name', 'twitter:image', ogImage);
  setCanonicalUrl(canonicalUrl);

  setProductJsonLd(view === 'stone' ? activeGemstone : null, origin);
}
