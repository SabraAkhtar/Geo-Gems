export type GemstoneType =
  | 'Ruby'
  | 'Sapphire'
  | 'Emerald'
  | 'Amethyst'
  | 'Peridot'
  | 'Aquamarine'
  | 'Garnet'
  | 'Tourmaline'
  | 'Topaz'
  | 'Citrine'
  | 'Opal'
  | 'Quartz'
  | 'Agate';

export type StockStatus = 'in_stock' | 'rare_1_of_1' | 'reserved';

export type WeightUnit = 'ct' | 'g';
export type PriceDisplayType = 'fixed' | 'on_request' | 'starting_from';
export type ProductStatus = 'draft' | 'published' | 'reserved' | 'sold' | 'archived' | 'sold_out';

export interface GemstoneCertificate {
  issuer: string; // e.g. "GIA" | "GRS" | "Gübelin" | "SSEF" | "CDTEC" | "IGI" | "Gemological Report"
  reportNumber: string;
  reportUrl?: string;
  reportImage?: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface Gemstone {
  id: string;
  stoneId: string; // Unique professional stone code, e.g. "GGC-RB-001"
  slug: string; // URL-safe slug, e.g. "natural-burmese-ruby-ggc-rb-001"
  name: string;
  category?: 'Gemstone' | 'Crystal';
  type: GemstoneType | string;
  tagline: string;
  carat: number; // Retained for backward compatibility
  weight?: number; // Stone weight in selected unit
  weightUnit?: WeightUnit; // 'ct' (Carats) or 'g' (Grams)
  priceDisplayType?: PriceDisplayType; // 'fixed' | 'on_request' | 'starting_from'
  priceAmount?: number | null; // Confirmed price or starting price amount
  currency?: string; // 'USD', 'PKR', 'EUR', 'GBP', 'AED', etc.
  status?: ProductStatus; // 'draft' | 'published' | 'reserved' | 'sold' | 'archived'
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  dimensions: string; // e.g. "8.4 x 6.2 x 4.1 mm"
  color: string; // e.g. "Vivid Pigeon Blood Red"
  cut: string; // e.g. "Cushion Brilliant / Step Cut"
  clarity: string; // e.g. "Eye Clean / VS"
  origin: string; // e.g. "Mogok, Myanmar (Burma)"
  naturalStatus: string;
  treatment: string; // e.g. "No Heat / Completely Untreated"
  certificate: GemstoneCertificate;
  priceUSD: number; // Computed or legacy price in USD
  images: string[];
  videoUrl?: string | null;
  description: string;
  shortDescription?: string;
  loreAndProperties?: string;
  collectionId: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  stockStatus: StockStatus;
  stockCount: number;
}

export interface Inquiry {
  id: string;
  stoneId?: string;
  stoneName?: string;
  customerName: string;
  contact: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'follow_up' | 'closed';
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  admin: string;
  action: 'create' | 'update' | 'archive' | 'status_change' | 'price_update';
  productName: string;
  stoneId: string;
  timestamp: string;
  details: string;
}

export interface CategoryInfo {
  id: GemstoneType;
  name: string;
  tagline: string;
  image: string;
  colorFamily: string;
  mohsHardness: string;
  rarity: 'Exceptional' | 'Rare' | 'Select Collector' | 'Classic Treasure';
  primaryOrigins: string[];
}

export interface CuratedCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gemstoneFilter?: GemstoneType;
  itemCount: number;
}

export interface CartItem {
  gemstone: Gemstone;
  quantity: number;
}

export interface Currency {
  code: string;
  symbol: string;
  rateFromUSD: number;
  name: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory?: 'All' | 'Gemstone' | 'Crystal' | null;
  selectedType: string | null;
  selectedCollection: string | null;
  priceRange: [number, number];
  caratRange: [number, number];
  selectedCut: string | null;
  selectedColor: string | null;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'carat-low' | 'carat-high' | 'name';
  inStockOnly: boolean;
}

export interface EducationalArticle {
  id: string;
  title: string;
  subtitle: string;
  gemstone: string;
  readingTime: string;
  heroImage: string;
  summary: string;
  contentSections: {
    heading: string;
    body: string;
  }[];
}

export interface JewelryItem {
  id: string;
  name: string;
  category: 'Rings' | 'Necklaces' | 'Bracelets';
  gemstone: string;
  metal: string;
  carat: string;
  origin: string;
  priceUSD: number;
  image: string;
  description: string;
  specs: string;
  isOneOfOne?: boolean;
}
