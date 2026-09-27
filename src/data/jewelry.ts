import { JewelryItem, Gemstone } from '../types';

export const JEWELRY_PIECES: JewelryItem[] = [
  {
    id: 'jw-ruby-royal-ring',
    name: 'Sovereign Cushion Ruby Royal Filigree Ring',
    category: 'Rings',
    gemstone: 'Pigeon Blood Burmese Ruby',
    metal: '18K Yellow Gold',
    carat: '3.85 ct',
    origin: 'Mogok, Myanmar (Burma)',
    priceUSD: 16500,
    image: '/jewelry/ruby-royal-ring.jpg',
    specs: 'Cushion Cut • 18K Yellow Gold & Pavé Diamonds',
    description:
      'An imperial royal cocktail ring crafted in solid 18K yellow gold with architectural floral filigree prongs, centering a glowing natural unheated cushion-cut Burma ruby accented with sparkling diamonds.',
    isOneOfOne: true,
  },
  {
    id: 'jw-coral-gold-ring',
    name: 'Vintage Botanical Red Coral Heritage Ring',
    category: 'Rings',
    gemstone: 'Natural Mediterranean Red Coral',
    metal: '18K Hand-Engraved Gold',
    carat: '8.40 ct',
    origin: 'Sardinia, Mediterranean Sea',
    priceUSD: 7200,
    image: '/jewelry/coral-gold-ring.jpg',
    specs: 'Oval Cabochon • 18K Yellow Gold Artisan Bezel',
    description:
      'A masterfully sculpted heirloom ring showcasing a vivid natural red Mediterranean coral oval cabochon, embraced by hand-engraved gold leaves and delicate botanical filigree flourishes.',
    isOneOfOne: true,
  },
  {
    id: 'jw-peridot-garland-necklace',
    name: 'Verdant Peridot & Diamond Leaf Garland Necklace',
    category: 'Necklaces',
    gemstone: 'Marquise & Pear Cut Peridot',
    metal: '18K Solid Yellow Gold',
    carat: '14.50 ct tw',
    origin: 'Kohistan Mountains, Pakistan',
    priceUSD: 11800,
    image: '/jewelry/peridot-garland-necklace.jpg',
    specs: 'Botanical Vine Choker • Marquise & Pear Cut',
    description:
      'A poetic botanical garland choker necklace handcrafted in 18K gold, featuring articulated branches set with marquise-cut lime green peridots, fine brilliant diamonds, and a central pear drop.',
    isOneOfOne: true,
  },
  {
    id: 'jw-sapphire-wave-bracelet',
    name: 'Ceylon Sapphire & Diamond S-Wave Tennis Bracelet',
    category: 'Bracelets',
    gemstone: 'Royal Blue Ceylon Sapphires',
    metal: '18K White Gold / Platinum',
    carat: '9.20 ct tw',
    origin: 'Ratnapura, Sri Lanka',
    priceUSD: 13400,
    image: '/jewelry/sapphire-wave-bracelet.jpg',
    specs: 'Fluid S-Curve Setting • Ceylon Sapphires & VS Diamonds',
    description:
      'A high-jewelry ribbon tennis bracelet articulated in a fluid S-wave rhythm, alternating intense royal blue Ceylon round sapphires with micro-pavé diamonds and a double-safety concealed clasp.',
    isOneOfOne: true,
  },
  {
    id: 'jw-peridot-baguette-choker',
    name: 'Architectural Peridot Baguette Floating Choker',
    category: 'Necklaces',
    gemstone: 'Emerald-Cut Radiant Peridot',
    metal: '18K Yellow Gold Tension Wire',
    carat: '12.00 ct tw',
    origin: 'Zabargad Heritage Deposit',
    priceUSD: 8900,
    image: '/jewelry/peridot-baguette-choker.jpg',
    specs: 'Minimalist Torque Collar • Bezel-Set Baguette Cut',
    description:
      'A contemporary fine jewelry collar featuring suspended bezel-set baguette peridots evenly positioned along a flexible 18K gold wire torque, offering effortless modern sophistication.',
    isOneOfOne: true,
  },
  {
    id: 'jw-ruby-blossom-ring',
    name: 'Bespoke Oval Ruby Blossom Bypass Ring',
    category: 'Rings',
    gemstone: 'Vivid Oval Pigeon Blood Ruby',
    metal: '18K Polished Yellow Gold',
    carat: '2.95 ct',
    origin: 'Mogok, Myanmar (Burma)',
    priceUSD: 14200,
    image: '/jewelry/ruby-blossom-ring.jpg',
    specs: 'Oval Brilliant Cut • Sculptural Bypass Band',
    description:
      'Graceful organic curves wrap smoothly around the finger in polished 18K yellow gold, framing a luminous oval pigeon blood ruby flanked by sculpted petals and marquise ruby side accents.',
    isOneOfOne: true,
  },
];

// Helper to bridge a JewelryItem to a Gemstone object for the universal cart/wishlist/inquiry modals
export function jewelryToGemstone(item: JewelryItem): Gemstone {
  const gemType = item.gemstone.includes('Ruby')
    ? 'Ruby'
    : item.gemstone.includes('Sapphire')
    ? 'Sapphire'
    : item.gemstone.includes('Coral')
    ? 'Agate'
    : 'Peridot';

  return {
    id: item.id,
    stoneId: item.id.toUpperCase().startsWith('GGC-') ? item.id.toUpperCase() : `GGC-${item.id.toUpperCase()}`,
    slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.id.toLowerCase()}`,
    name: item.name,
    type: gemType,
    tagline: item.specs,
    carat: parseFloat(item.carat) || 5.0,
    dimensions: 'Custom Atelier Setting',
    color: item.gemstone,
    cut: item.specs.split('•')[0]?.trim() || 'Custom Handcrafted Cut',
    clarity: 'Fine Gem Grade / Eye Clean',
    origin: item.origin,
    naturalStatus: '100% Natural Earth-Mined',
    treatment: 'Completely Natural / Hand-Fabricated Precious Metal',
    certificate: {
      issuer: 'GIA / Atelier Report',
      reportNumber: `JW-${item.id.slice(-6).toUpperCase()}`,
      verified: true,
    },
    priceUSD: item.priceUSD,
    images: [item.image],
    description: item.description,
    loreAndProperties:
      'A bespoke piece from our High Fine Jewelry Atelier, created using certified natural gemstones and ethical recycled 18k precious gold.',
    collectionId: 'bespoke-jewelry',
    isFeatured: true,
    stockStatus: 'rare_1_of_1',
    stockCount: 1,
  };
}
