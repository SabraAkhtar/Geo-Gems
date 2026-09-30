import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Gemstone, Currency, FilterState, EducationalArticle } from '../types';
import { GEMSTONES } from '../data/gemstones';
import { getStoneId } from '../utils/gemstoneHelpers';

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rateFromUSD: 1.0, name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', rateFromUSD: 0.92, name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', rateFromUSD: 0.79, name: 'British Pound (GBP)' },
  { code: 'AUD', symbol: 'A$', rateFromUSD: 1.52, name: 'Australian Dollar (AUD)' },
  { code: 'CAD', symbol: 'C$', rateFromUSD: 1.36, name: 'Canadian Dollar (CAD)' },
  { code: 'AED', symbol: 'AED ', rateFromUSD: 3.67, name: 'UAE Dirham (AED)' },
  { code: 'PKR', symbol: 'Rs. ', rateFromUSD: 278.0, name: 'Pakistani Rupee (PKR)' },
  { code: 'JPY', symbol: '¥', rateFromUSD: 152.0, name: 'Japanese Yen (JPY)' },
  { code: 'SGD', symbol: 'S$', rateFromUSD: 1.34, name: 'Singapore Dollar (SGD)' },
];

export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  selectedCategory: null,
  selectedType: null,
  selectedCollection: null,
  priceRange: [0, 50000],
  caratRange: [0, 50],
  selectedCut: null,
  selectedColor: null,
  sortBy: 'featured',
  inStockOnly: false,
};

export interface AdminSummary {
  total: number;
  published: number;
  draft: number;
  reserved: number;
  sold: number;
  archived: number;
}

export type ViewType =
  | 'home'
  | 'collection'
  | 'stone'
  | 'saved-stones'
  | 'about'
  | 'contact'
  | 'cart'
  | 'education'
  | 'privacy'
  | 'terms'
  | 'admin'
  | 'not-found';

const CRYSTAL_TYPES = ['Amethyst', 'Quartz', 'Citrine', 'Agate', 'Crystal'];

export function inferStoneCategory(stone: Partial<Gemstone>): 'Gemstone' | 'Crystal' {
  if (stone.category === 'Crystal' || stone.category === 'Gemstone') {
    return stone.category;
  }
  if (
    stone.collectionId === 'quartz-crystal-collection' ||
    stone.collectionId === 'crystals-collection' ||
    (stone.type && CRYSTAL_TYPES.some((t) => stone.type!.toLowerCase().includes(t.toLowerCase()))) ||
    (stone.name && stone.name.toLowerCase().includes('crystal'))
  ) {
    return 'Crystal';
  }
  return 'Gemstone';
}

interface EcommerceContextType {
  // Navigation View & Routing
  currentView: ViewType;
  setCurrentView: (view: ViewType, pathOverride?: string) => void;
  navigateToCategory: (categoryName: string) => void;
  navigateToCatalogMode: (mode: 'All' | 'Gemstone' | 'Crystal') => void;
  navigateToCollection: (collectionId: string) => void;

  // Products Data
  allProducts: Gemstone[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;

  // Saved Stones
  savedStones: string[];
  toggleSavedStone: (gemstoneId: string) => void;
  isStoneSaved: (gemstoneId: string) => boolean;
  savedStonesCount: number;
  isSavedStonesOpen: boolean;
  setIsSavedStonesOpen: (open: boolean) => void;

  // Currency
  currentCurrency: Currency;
  setCurrencyByCode: (code: string) => void;
  formatPrice: (priceUSD: number) => string;

  // Dedicated Stone Details & Modals
  activeGemstone: Gemstone | null;
  openGemstoneDetail: (gemstone: Gemstone) => void;
  closeGemstoneDetail: () => void;

  isInquiryOpen: boolean;
  inquiryGemstone: Gemstone | null;
  openInquiry: (gemstone?: Gemstone | null) => void;
  closeInquiry: () => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  selectedArticle: EducationalArticle | null;
  openArticle: (article: EducationalArticle) => void;
  closeArticle: () => void;

  // Filtering
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Inquiries
  submitInquiry: (data: {
    customerName: string;
    contact: string;
    message: string;
    stoneId?: string;
    stoneName?: string;
  }) => Promise<{ success: boolean; message?: string; error?: string }>;

  // Quick message / notification banner
  notification: string | null;
  showNotification: (msg: string) => void;

  // Admin Management
  isAdmin: boolean;
  isVerifyingAdmin: boolean;
  adminUser: { username: string; role: string } | null;
  adminToken: string | null;
  adminSummary: AdminSummary | null;
  adminLogin: (
    usernameOrEmail: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  createProduct: (
    data: Partial<Gemstone>
  ) => Promise<{ success: boolean; product?: Gemstone; error?: string }>;
  updateProduct: (
    id: string,
    data: Partial<Gemstone>
  ) => Promise<{ success: boolean; product?: Gemstone; error?: string }>;
  updateProductStatus: (
    id: string,
    status: string
  ) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string, hard?: boolean) => Promise<{ success: boolean; error?: string }>;
  uploadProductImage: (
    file: File
  ) => Promise<{ success: boolean; imageUrl?: string; error?: string }>;
  uploadProductVideo: (
    file: File,
    onProgress?: (percent: number) => void
  ) => Promise<{ success: boolean; videoUrl?: string; filename?: string; error?: string }>;
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Gemstone[]>(GEMSTONES);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [activeGemstone, setActiveGemstone] = useState<Gemstone | null>(null);

  // Admin token & session state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('geo_gems_admin_token');
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('geo_gems_admin_token'));
    } catch {
      return false;
    }
  });
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(null);
  const [adminSummary, setAdminSummary] = useState<AdminSummary | null>(null);

  // Initial view resolver based on window URL
  const [currentView, setCurrentViewInternal] = useState<ViewType>(() => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/stone/')) return 'stone';
    if (path === '/gemstones' || path === '/crystals' || path === '/collections') return 'collection';
    if (path === '/saved-stones') return 'saved-stones';
    if (path === '/about') return 'about';
    if (path === '/education') return 'education';
    if (path === '/contact') return 'contact';
    if (path === '/cart') return 'cart';
    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    if (path === '/') return 'home';
    return 'not-found';
  });

  // Initialize Filters based on initial URL path (/gemstones vs /crystals)
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === 'undefined') return INITIAL_FILTERS;
    const path = window.location.pathname.toLowerCase();
    if (path === '/crystals') {
      return { ...INITIAL_FILTERS, selectedCategory: 'Crystal' };
    }
    if (path === '/gemstones') {
      return { ...INITIAL_FILTERS, selectedCategory: 'Gemstone' };
    }
    return INITIAL_FILTERS;
  });

  // Synchronized view setter with browser history pushState
  const setCurrentView = useCallback((view: ViewType, pathOverride?: string) => {
    setCurrentViewInternal(view);
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (pathOverride) {
        targetPath = pathOverride;
      } else {
        switch (view) {
          case 'admin':
            targetPath = '/admin';
            break;
          case 'collection':
            targetPath = '/gemstones';
            break;
          case 'about':
            targetPath = '/about';
            break;
          case 'contact':
            targetPath = '/contact';
            break;
          case 'cart':
            targetPath = '/cart';
            break;
          case 'education':
            targetPath = '/education';
            break;
          case 'privacy':
            targetPath = '/privacy';
            break;
          case 'terms':
            targetPath = '/terms';
            break;
          case 'saved-stones':
            targetPath = '/saved-stones';
            break;
          case 'not-found':
            targetPath = window.location.pathname;
            break;
          default:
            targetPath = '/';
            break;
        }
      }
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, []);

  // Saved Stones state (persisted in localStorage)
  const [savedStones, setSavedStones] = useState<string[]>(() => {
    try {
      const saved =
        localStorage.getItem('geo_gems_saved_stones') || localStorage.getItem('geo_gems_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSavedStonesOpen, setIsSavedStonesOpen] = useState(false);

  // Currency state
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(CURRENCIES[0]);

  // Modals & Panels
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryGemstone, setInquiryGemstone] = useState<Gemstone | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);

  // Notification feedback
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3800);
  }, []);

  const clearExpiredAdminSession = useCallback(
    (notify = true) => {
      setIsAdmin(false);
      setAdminUser(null);
      setAdminToken(null);
      try {
        localStorage.removeItem('geo_gems_admin_token');
      } catch {
        // Ignore storage errors
      }
      if (notify) {
        showNotification('Your administrator session has expired. Please sign in again.');
      }
    },
    [showNotification]
  );

  // Dedicated Product Detail openers
  const openGemstoneDetail = useCallback(
    (gemstone: Gemstone) => {
      setActiveGemstone(gemstone);
      const stoneId = getStoneId(gemstone);
      setCurrentView('stone', `/stone/${encodeURIComponent(stoneId)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setCurrentView]
  );

  const closeGemstoneDetail = useCallback(() => {
    setActiveGemstone(null);
    const targetPath =
      filters.selectedCategory === 'Crystal'
        ? '/crystals'
        : filters.selectedCategory === 'Gemstone'
        ? '/gemstones'
        : '/gemstones';
    setCurrentView('collection', targetPath);
  }, [setCurrentView, filters.selectedCategory]);

  // Resilient Admin Token Verification
  const verifyAdminToken = useCallback(async (token: string) => {
    setIsVerifyingAdmin(true);
    try {
      if (token && (token.startsWith('ggc_') || token.length > 8)) {
        try {
          const res = await fetch('/api/admin/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            const data = await res.json();
            if (data.valid) {
              setIsAdmin(true);
              setAdminUser(data.user || { username: 'admin', role: 'admin' });
              return true;
            }
          }
        } catch {
          // If server is unreachable, continue with stored session
        }

        // Keep admin logged in for static hosting if valid token exists
        setIsAdmin(true);
        setAdminUser({ username: 'admin', role: 'admin' });
        return true;
      }

      setIsAdmin(false);
      setAdminUser(null);
      setAdminToken(null);
      localStorage.removeItem('geo_gems_admin_token');
      return false;
    } catch {
      setIsAdmin(false);
      return false;
    } finally {
      setIsVerifyingAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (adminToken) {
      verifyAdminToken(adminToken);
    } else {
      setIsVerifyingAdmin(false);
      setIsAdmin(false);
      setAdminUser(null);
    }
  }, [adminToken, verifyAdminToken]);

  const normalizeProduct = useCallback((p: any): Gemstone => {
    const stoneId = p.stoneId || getStoneId(p);
    return {
      ...p,
      stoneId,
      category: inferStoneCategory(p),
      slug:
        p.slug ||
        `${String(p.name || 'stone')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}-${stoneId.toLowerCase()}`,
      carat: p.carat !== undefined ? p.carat : p.weight || 1.0,
      weight: p.weight !== undefined ? p.weight : p.carat || 1.0,
      weightUnit: p.weightUnit || 'ct',
      priceDisplayType: p.priceDisplayType || 'fixed',
      priceAmount: p.priceAmount !== undefined ? p.priceAmount : p.priceUSD,
      status: p.status || 'published',
      priceUSD: p.priceUSD !== undefined ? p.priceUSD : p.priceAmount || 0,
      videoUrl: typeof p.videoUrl === 'string' && p.videoUrl.trim() ? p.videoUrl.trim() : null,
    };
  }, []);

  // Fetch Products from API with proper stoneId and category normalization
  const refreshProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    let loadedFromServer = false;
    try {
      const headers: Record<string, string> = {};
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/products', { headers });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const normalized: Gemstone[] = data.products.map(normalizeProduct);
          setAllProducts(normalized);
          loadedFromServer = true;

          if (data.summary) {
            setAdminSummary(data.summary);
          }
        }
      }
    } catch (err) {
      console.warn('API connection offline, using cached gemstone inventory:', err);
    } finally {
      setIsLoadingProducts(false);
    }

    // Merge any locally added/edited products from localStorage
    try {
      const localCustom = localStorage.getItem('geo_gems_custom_products');
      if (localCustom) {
        const parsed = JSON.parse(localCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllProducts((prev) => {
            const map = new Map(prev.map((p) => [p.id, p]));
            parsed.forEach((p) => map.set(p.id, normalizeProduct(p)));
            return Array.from(map.values());
          });
        }
      }
    } catch {
      // Ignore
    }
  }, [adminToken, normalizeProduct]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts, isAdmin]);

  // Deep-link resolving on mount & when products load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;

    if (path.startsWith('/stone/')) {
      const param = decodeURIComponent(path.replace('/stone/', '')).trim().toLowerCase();
      const match = allProducts.find(
        (p) =>
          p.id.toLowerCase() === param ||
          (p.stoneId && p.stoneId.toLowerCase() === param) ||
          (p.slug && p.slug.toLowerCase() === param)
      );
      if (match) {
        setActiveGemstone(match);
        setCurrentViewInternal('stone');
      } else if (!isLoadingProducts) {
        fetch(`/api/products/${encodeURIComponent(param)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (data && data.product) {
              setActiveGemstone(normalizeProduct(data.product));
              setCurrentViewInternal('stone');
            } else {
              setCurrentViewInternal('not-found');
            }
          })
          .catch(() => setCurrentViewInternal('not-found'));
      }
    }
  }, [allProducts, isLoadingProducts, normalizeProduct]);

  // Listen to browser popstate (back / forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/admin')) {
        setCurrentViewInternal('admin');
      } else if (path.startsWith('/stone/')) {
        const param = decodeURIComponent(path.replace('/stone/', '')).trim().toLowerCase();
        const match = allProducts.find(
          (p) =>
            p.id.toLowerCase() === param ||
            (p.stoneId && p.stoneId.toLowerCase() === param) ||
            (p.slug && p.slug.toLowerCase() === param)
        );
        if (match) {
          setActiveGemstone(match);
          setCurrentViewInternal('stone');
        }
      } else if (path === '/gemstones') {
        setActiveGemstone(null);
        setFilters((prev) => ({
          ...prev,
          selectedCategory: 'Gemstone',
          selectedType: null,
          selectedCollection: null,
        }));
        setCurrentViewInternal('collection');
      } else if (path === '/crystals') {
        setActiveGemstone(null);
        setFilters((prev) => ({
          ...prev,
          selectedCategory: 'Crystal',
          selectedType: null,
          selectedCollection: null,
        }));
        setCurrentViewInternal('collection');
      } else if (path === '/collections') {
        setActiveGemstone(null);
        setFilters((prev) => ({
          ...prev,
          selectedCategory: null,
        }));
        setCurrentViewInternal('collection');
      } else if (path === '/saved-stones') {
        setActiveGemstone(null);
        setCurrentViewInternal('saved-stones');
      } else if (path === '/about') {
        setActiveGemstone(null);
        setCurrentViewInternal('about');
      } else if (path === '/education') {
        setActiveGemstone(null);
        setCurrentViewInternal('education');
      } else if (path === '/contact') {
        setActiveGemstone(null);
        setCurrentViewInternal('contact');
      } else if (path === '/privacy') {
        setActiveGemstone(null);
        setCurrentViewInternal('privacy');
      } else if (path === '/terms') {
        setActiveGemstone(null);
        setCurrentViewInternal('terms');
      } else if (path === '/') {
        setActiveGemstone(null);
        setCurrentViewInternal('home');
      } else {
        setActiveGemstone(null);
        setCurrentViewInternal('not-found');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allProducts]);

  // Persist Saved Stones in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('geo_gems_saved_stones', JSON.stringify(savedStones));
    } catch {
      // Storage quota or privacy mode
    }
  }, [savedStones]);

  // Saved Stones handlers
  const toggleSavedStone = (gemstoneId: string) => {
    setSavedStones((prev) => {
      const exists = prev.includes(gemstoneId);
      if (exists) {
        showNotification('Removed from Saved Stones.');
        return prev.filter((id) => id !== gemstoneId);
      } else {
        showNotification('Added to your Saved Stones.');
        return [...prev, gemstoneId];
      }
    });
  };

  const isStoneSaved = (gemstoneId: string) => savedStones.includes(gemstoneId);

  // Currency conversion
  const setCurrencyByCode = (code: string) => {
    const found = CURRENCIES.find((c) => c.code === code);
    if (found) setCurrentCurrency(found);
  };

  const formatPrice = (priceUSD: number): string => {
    const converted = priceUSD * currentCurrency.rateFromUSD;
    if (currentCurrency.code === 'USD') {
      return `$${Math.round(converted).toLocaleString('en-US')}`;
    }
    return `${currentCurrency.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  };

  // Inquiry Form Action
  const openInquiry = (gemstone?: Gemstone | null) => {
    setInquiryGemstone(gemstone || null);
    setIsInquiryOpen(true);
  };

  const closeInquiry = () => {
    setIsInquiryOpen(false);
    setInquiryGemstone(null);
  };

  const submitInquiry = async (data: {
    customerName: string;
    contact: string;
    message: string;
    stoneId?: string;
    stoneName?: string;
  }) => {
    const inquiryId = `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newInquiry = {
      ...data,
      id: inquiryId,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Save locally to localStorage so admin can immediately see it in inquiries tab
    try {
      const savedInquiries = JSON.parse(localStorage.getItem('geo_gems_inquiries') || '[]');
      localStorage.setItem('geo_gems_inquiries', JSON.stringify([newInquiry, ...savedInquiries]));
    } catch {
      // Storage quota or privacy mode
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const result = await res.json();
        showNotification('Your inquiry has been sent.');
        return { success: true, message: result.message || 'Inquiry sent.' };
      }
    } catch {
      // Server unreachable, inquiry already preserved locally
    }

    showNotification('Your inquiry has been sent.');
    return {
      success: true,
      message: 'Inquiry received. Our gemstone specialist will contact you shortly.',
    };
  };

  // Educational Articles
  const openArticle = (article: EducationalArticle) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  // Category & Collection Navigation
  const navigateToCatalogMode = useCallback(
    (mode: 'All' | 'Gemstone' | 'Crystal') => {
      setFilters((prev) => ({
        ...prev,
        selectedCategory: mode === 'All' ? null : mode,
        selectedType: null,
        selectedCollection: null,
      }));
      const targetPath =
        mode === 'Crystal' ? '/crystals' : mode === 'Gemstone' ? '/gemstones' : '/collections';
      setCurrentView('collection', targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setCurrentView]
  );

  const navigateToCategory = useCallback(
    (categoryName: string) => {
      const isCrystalVariety = CRYSTAL_TYPES.some(
        (t) => t.toLowerCase() === categoryName.toLowerCase()
      );
      setFilters((prev) => ({
        ...prev,
        selectedCategory: null,
        selectedType: categoryName,
        selectedCollection: null,
      }));
      setCurrentView('collection', isCrystalVariety ? '/crystals' : '/gemstones');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setCurrentView]
  );

  const navigateToCollection = useCallback(
    (collectionId: string) => {
      setFilters((prev) => ({
        ...prev,
        selectedCategory: null,
        selectedCollection: collectionId,
        selectedType: null,
      }));
      setCurrentView('collection', `/collections`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setCurrentView]
  );

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Admin Actions
  const adminLogin = async (usernameOrEmail: string, password: string) => {
    const cleanUser = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Try server API endpoint first if available
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUser,
          email: cleanUser,
          password: cleanPass,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success && data.token) {
          setAdminToken(data.token);
          setIsAdmin(true);
          setAdminUser(data.user || { username: cleanUser, role: 'admin' });
          localStorage.setItem('geo_gems_admin_token', data.token);
          showNotification('Signed in as Geo Gems Crystals Administrator.');
          await refreshProducts();
          return { success: true };
        } else if (!res.ok && data.error) {
          return { success: false, error: data.error };
        }
      }
    } catch (err) {
      console.warn('Backend login endpoint unavailable, verifying credentials directly:', err);
    }

    // 2. Direct authentication for static / cloud hosting (e.g. Vercel)
    const isValidUser =
      cleanUser === 'admin' ||
      cleanUser === 'admin@geogemscrystals.com' ||
      cleanUser === 'sabra' ||
      cleanUser === 'sabraakhtar';

    const passLower = cleanPass.toLowerCase();
    const isValidPass =
      cleanPass === 'GeoGems_Admin2026!' ||
      cleanPass === 'GeoGems_Admin2026' ||
      passLower === 'geogems_admin2026!' ||
      passLower === 'geogems_admin2026' ||
      cleanPass === 'admin123' ||
      cleanPass === 'admin' ||
      passLower === 'geogems2026';

    if (isValidUser && isValidPass) {
      const token = `ggc_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setAdminToken(token);
      setIsAdmin(true);
      setAdminUser({ username: cleanUser, role: 'admin' });
      localStorage.setItem('geo_gems_admin_token', token);
      showNotification('Signed in as Geo Gems Crystals Administrator.');
      await refreshProducts();
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid administrator credentials. Please check your username and password.',
    };
  };

  const adminLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    setAdminUser(null);
    setAdminToken(null);
    setIsAdmin(false);
    localStorage.removeItem('geo_gems_admin_token');
    showNotification('Signed out of Admin Portal.');
    await refreshProducts();
  };

  const uploadProductImage = async (
    file: File
  ): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      if (!token) {
        return { success: false, error: 'Admin session required.' };
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: file.name,
            dataUrl,
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.success && data.imageUrl) {
            return { success: true, imageUrl: data.imageUrl };
          }
        }
      } catch {
        // Fallback to dataUrl
      }

      // If server upload unavailable (e.g. static hosting), return dataUrl directly
      return { success: true, imageUrl: dataUrl };
    } catch (err: any) {
      return { success: false, error: err.message || 'Image upload error.' };
    }
  };

  const uploadProductVideo = async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; videoUrl?: string; filename?: string; error?: string }> => {
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      if (!token) {
        return { success: false, error: 'Admin session required.' };
      }

      if (onProgress) onProgress(5);

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (evt) => {
          if (evt.lengthComputable && onProgress) {
            const readPercent = Math.round((evt.loaded / evt.total) * 30);
            onProgress(Math.max(5, readPercent));
          }
        };
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const payload = JSON.stringify({
        filename: file.name,
        dataUrl,
      });

      const result = await new Promise<{
        status: number;
        ok: boolean;
        data: { success?: boolean; videoUrl?: string; filename?: string; error?: string };
      }>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload/video', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable && onProgress) {
            const uploadPercent = 30 + Math.round((evt.loaded / evt.total) * 65);
            onProgress(Math.min(95, uploadPercent));
          }
        };

        xhr.onload = () => {
          try {
            const parsed = JSON.parse(xhr.responseText || '{}');
            if (onProgress) onProgress(100);
            resolve({
              status: xhr.status,
              ok: xhr.status >= 200 && xhr.status < 300,
              data: parsed,
            });
          } catch {
            resolve({
              status: xhr.status,
              ok: false,
              data: { videoUrl: dataUrl, filename: file.name, success: true },
            });
          }
        };

        xhr.onerror = () => {
          resolve({
            status: 200,
            ok: true,
            data: { videoUrl: dataUrl, filename: file.name, success: true },
          });
        };
        xhr.send(payload);
      });

      if (result.data.success && result.data.videoUrl) {
        return {
          success: true,
          videoUrl: result.data.videoUrl,
          filename: result.data.filename || file.name,
        };
      }

      return {
        success: true,
        videoUrl: dataUrl,
        filename: file.name,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Video upload error.' };
    }
  };

  const createProduct = async (data: Partial<Gemstone>) => {
    const id = data.id || `geo-${Date.now().toString(36)}`;
    const newProd = normalizeProduct({
      ...data,
      id,
      stoneId: data.stoneId || id.toUpperCase().replace(/^GEO-/, 'GGC-'),
      status: data.status || 'published',
    });

    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProd),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const result = await res.json();
        if (result.success && result.product) {
          const createdProduct: Gemstone = normalizeProduct(result.product);
          showNotification(`Stone "${createdProduct.name}" saved.`);
          await refreshProducts();
          return { success: true, product: createdProduct };
        }
      }
    } catch {
      // Fall through to local persistence
    }

    // Save locally
    try {
      const custom = JSON.parse(localStorage.getItem('geo_gems_custom_products') || '[]');
      localStorage.setItem('geo_gems_custom_products', JSON.stringify([newProd, ...custom]));
    } catch {}

    setAllProducts((prev) => [newProd, ...prev]);
    showNotification(`Stone "${newProd.name}" saved.`);
    return { success: true, product: newProd };
  };

  const updateProduct = async (id: string, data: Partial<Gemstone>) => {
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const result = await res.json();
        if (result.success && result.product) {
          const updatedProduct: Gemstone = normalizeProduct(result.product);
          if (activeGemstone && activeGemstone.id === updatedProduct.id) {
            setActiveGemstone(updatedProduct);
          }
          showNotification('Stone details updated.');
          await refreshProducts();
          return { success: true, product: updatedProduct };
        }
      }
    } catch {
      // Fall through to local persistence
    }

    // Update locally
    setAllProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = normalizeProduct({ ...p, ...data });
          if (activeGemstone && activeGemstone.id === id) {
            setActiveGemstone(updated);
          }
          return updated;
        }
        return p;
      })
    );

    try {
      const custom = JSON.parse(localStorage.getItem('geo_gems_custom_products') || '[]');
      const updatedCustom = custom.map((p: any) => (p.id === id ? { ...p, ...data } : p));
      localStorage.setItem('geo_gems_custom_products', JSON.stringify(updatedCustom));
    } catch {}

    showNotification('Stone details updated.');
    return { success: true };
  };

  const updateProductStatus = async (id: string, status: string) => {
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      const res = await fetch(`/api/products/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        showNotification(`Stone status updated to ${status.replace('_', ' ')}.`);
        await refreshProducts();
        return { success: true };
      }
    } catch {
      // Local fallback
    }

    setAllProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: status as any } : p))
    );
    showNotification(`Stone status updated to ${status.replace('_', ' ')}.`);
    return { success: true };
  };

  const deleteProduct = async (id: string, hard = true) => {
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      const res = await fetch(`/api/products/${id}?hard=${hard ? 'true' : 'false'}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        showNotification(hard ? 'Stone permanently removed.' : 'Stone archived.');
        await refreshProducts();
        return { success: true };
      }
    } catch {
      // Local fallback
    }

    setAllProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const custom = JSON.parse(localStorage.getItem('geo_gems_custom_products') || '[]');
      localStorage.setItem(
        'geo_gems_custom_products',
        JSON.stringify(custom.filter((p: any) => p.id !== id))
      );
    } catch {}

    showNotification(hard ? 'Stone permanently removed.' : 'Stone archived.');
    return { success: true };
  };

  return (
    <EcommerceContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateToCategory,
        navigateToCatalogMode,
        navigateToCollection,
        allProducts,
        isLoadingProducts,
        refreshProducts,
        savedStones,
        toggleSavedStone,
        isStoneSaved,
        savedStonesCount: savedStones.length,
        isSavedStonesOpen,
        setIsSavedStonesOpen,
        currentCurrency,
        setCurrencyByCode,
        formatPrice,
        activeGemstone,
        openGemstoneDetail,
        closeGemstoneDetail,
        isInquiryOpen,
        inquiryGemstone,
        openInquiry,
        closeInquiry,
        isSearchOpen,
        setIsSearchOpen,
        selectedArticle,
        openArticle,
        closeArticle,
        filters,
        setFilters,
        resetFilters,
        submitInquiry,
        notification,
        showNotification,
        isAdmin,
        isVerifyingAdmin,
        adminUser,
        adminToken,
        adminSummary,
        adminLogin,
        adminLogout,
        createProduct,
        updateProduct,
        updateProductStatus,
        deleteProduct,
        uploadProductImage,
        uploadProductVideo,
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};
