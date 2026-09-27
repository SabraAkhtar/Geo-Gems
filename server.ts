import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GEMSTONES } from './src/data/gemstones.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PRODUCTS_FILE = path.resolve(DATA_DIR, 'products.json');
const INQUIRIES_FILE = path.resolve(DATA_DIR, 'inquiries.json');
const AUDIT_LOG_FILE = path.resolve(DATA_DIR, 'audit_log.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

// Always ensure local storage directories exist (zero-config setup)
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Directory creation notice:', err);
}

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Middleware (80MB limit to support base64-encoded video uploads up to 50MB)
app.use(express.json({ limit: '80mb' }));
app.use(express.urlencoded({ extended: true, limit: '80mb' }));

// Static uploads serving for uploaded images and videos
app.use('/uploads', express.static(UPLOADS_DIR));

// ----------------------------------------------------
// ZERO-CONFIG ADMIN AUTHENTICATION
// ----------------------------------------------------
// Works immediately out of the box without requiring secret keys or env vars.
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@geogemscrystals.com').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_SECRET =
  process.env.TOKEN_SECRET || 'geo-gems-crystals-built-in-session-secret-key-2026';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function safeTimingEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function generateToken(username: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `${username}|${expiresAt}`;
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}|${signature}`).toString('base64');
  return { token, expiresAt };
}

function verifyToken(token: string): { valid: boolean; username?: string; expiresAt?: number } {
  if (!token) return { valid: false };
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split('|');
    if (parts.length !== 3) return { valid: false };
    const [username, expiresAtStr, signature] = parts;
    if (!username || !expiresAtStr || !signature) return { valid: false };

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return { valid: false };

    const expectedSig = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(`${username}|${expiresAtStr}`)
      .digest('hex');

    if (safeTimingEqual(signature, expectedSig)) {
      return { valid: true, username, expiresAt };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

// Auth Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const { valid, username } = verifyToken(token);
  if (!valid || !username) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired admin session' });
  }

  (req as any).adminUser = username;
  next();
}

function checkAdminAuth(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  return verifyToken(token).valid;
}

// ----------------------------------------------------
// LOCAL & SAMPLE GEMSTONE DATA STORE
// ----------------------------------------------------
let productsCache: any[] = [];
let inquiriesCache: any[] = [];
let auditLogsCache: any[] = [];
const mediaMemoryStore = new Map<string, { buffer: Buffer; contentType: string }>();

function sanitizeProductDocument(product: any): Record<string, any> {
  const id = String(product.id || `geo-${Date.now().toString(36)}`)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 128);
  const stoneId = String(
    product.stoneId || product.stone_id || id.toUpperCase().replace(/^GEO-/, 'GGC-')
  ).slice(0, 64);
  const weight = Number(product.weight ?? product.carat ?? 1);
  const weightUnit = (product.weightUnit || product.weight_unit) === 'g' ? 'g' : 'ct';
  const validStatuses = ['draft', 'published', 'reserved', 'sold', 'archived', 'sold_out'];
  const status = validStatuses.includes(product.status) ? product.status : 'published';
  const rawPriceType = product.priceDisplayType || product.price_display_type;
  const validPriceTypes = ['fixed', 'on_request', 'starting_from'];
  const priceDisplayType = validPriceTypes.includes(rawPriceType) ? rawPriceType : 'fixed';

  const rawImages = Array.isArray(product.images) ? product.images : [];
  const safeImages = rawImages
    .filter((img: unknown) => typeof img === 'string' && img.length > 0 && img.length <= 2048)
    .slice(0, 10);
  if (safeImages.length === 0) safeImages.push('/stones/emerald.jpg');

  const rawPriceAmount =
    product.priceAmount !== undefined ? product.priceAmount : product.price_amount;
  const rawPriceUSD = product.priceUSD !== undefined ? product.priceUSD : product.price_usd;

  const docData: Record<string, any> = {
    id,
    stoneId,
    slug: String(
      product.slug ||
        `${String(product.name || 'stone')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}-${stoneId.toLowerCase()}`
    ).slice(0, 200),
    name: String(product.name || 'Natural Stone').slice(0, 200),
    category: product.category === 'Crystal' ? 'Crystal' : 'Gemstone',
    type: String(product.type || 'Gemstone').slice(0, 100),
    tagline: String(product.tagline || 'Natural Stone').slice(0, 250),
    carat: Number(product.carat ?? (weightUnit === 'ct' ? weight : weight * 5)),
    weight: weight > 0 ? weight : 1,
    weightUnit,
    priceDisplayType,
    priceAmount:
      priceDisplayType === 'on_request'
        ? null
        : typeof rawPriceAmount === 'number'
        ? rawPriceAmount
        : rawPriceAmount !== null && rawPriceAmount !== undefined && !isNaN(Number(rawPriceAmount))
        ? Number(rawPriceAmount)
        : Number(rawPriceUSD || 0),
    priceUSD: Number(rawPriceUSD ?? rawPriceAmount ?? 0),
    currency: String(product.currency || 'USD').slice(0, 10),
    status,
    createdAt: String(
      product.createdAt || product.created_at || new Date().toISOString()
    ).slice(0, 64),
    updatedAt: String(
      product.updatedAt || product.updated_at || new Date().toISOString()
    ).slice(0, 64),
    dimensions: String(product.dimensions || 'Precision Calibrated').slice(0, 120),
    color: String(product.color || 'Natural Hue').slice(0, 120),
    cut: String(product.cut || 'Faceted Stone').slice(0, 120),
    clarity: String(product.clarity || 'Fine Gem Grade').slice(0, 120),
    origin: String(product.origin || 'Natural Origin').slice(0, 150),
    naturalStatus: String(
      product.naturalStatus || product.natural_status || '100% Natural Earth-Mined'
    ).slice(0, 120),
    treatment: String(product.treatment || 'Untreated / Natural State').slice(0, 200),
    certificate:
      product.certificate && typeof product.certificate === 'object'
        ? product.certificate
        : {
            issuer: 'Gemological Inspection Report',
            reportNumber: `GEO-${stoneId}`,
            verified: true,
          },
    images: safeImages,
    description: String(product.description || 'Natural gemstone or crystal.').slice(0, 4000),
    loreAndProperties: String(
      product.loreAndProperties ||
        product.lore_and_properties ||
        'A natural stone from Geo Gems Crystals, carefully selected for authentic character and beauty.'
    ).slice(0, 2000),
    collectionId: String(
      product.collectionId || product.collection_id || 'latest-arrivals'
    ).slice(0, 100),
    isFeatured: Boolean(product.isFeatured ?? product.is_featured),
    isBestseller: Boolean(product.isBestseller ?? product.is_bestseller),
    stockStatus:
      status === 'sold_out' || status === 'sold'
        ? 'reserved'
        : product.stockStatus || product.stock_status || 'rare_1_of_1',
    stockCount:
      status === 'sold_out' || status === 'sold'
        ? 0
        : typeof (product.stockCount ?? product.stock_count) === 'number'
        ? Number(product.stockCount ?? product.stock_count)
        : 1,
  };

  const pubAt = product.publishedAt || product.published_at;
  if (pubAt) {
    docData.publishedAt = String(pubAt).slice(0, 64);
  }
  const shortDesc = product.shortDescription || product.short_description;
  if (shortDesc) {
    docData.shortDescription = String(shortDesc).slice(0, 500);
  }
  const vidUrl = product.videoUrl !== undefined ? product.videoUrl : product.video_url;
  docData.videoUrl =
    typeof vidUrl === 'string' && vidUrl.trim().length > 0 ? vidUrl.trim().slice(0, 2048) : null;

  return docData;
}

function readLocalJsonSeed(filePath: string): any[] {
  try {
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn(`Could not read file ${filePath}:`, err);
  }
  return [];
}

function writeLocalJson(filePath: string, data: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Local write notice (${filePath}):`, err);
  }
}

async function initializeStore() {
  const localProducts = readLocalJsonSeed(PRODUCTS_FILE);
  const baseProducts = localProducts.length > 0 ? localProducts : GEMSTONES;
  const productMap = new Map<string, any>();

  for (const item of baseProducts) {
    const clean = sanitizeProductDocument(item);
    productMap.set(clean.id, clean);
  }

  productsCache = Array.from(productMap.values());
  inquiriesCache = readLocalJsonSeed(INQUIRIES_FILE);
  auditLogsCache = readLocalJsonSeed(AUDIT_LOG_FILE);

  writeLocalJson(PRODUCTS_FILE, productsCache);
}

async function getProductsFromStore(includePrivate = false): Promise<any[]> {
  if (includePrivate) {
    return productsCache;
  }
  return productsCache.filter((p) => {
    const s = p.status || 'published';
    return s !== 'draft' && s !== 'archived';
  });
}

async function upsertProductInStore(product: any): Promise<any> {
  const clean = sanitizeProductDocument(product);
  const idx = productsCache.findIndex((p) => p.id === clean.id);
  if (idx >= 0) {
    productsCache[idx] = clean;
  } else {
    productsCache.unshift(clean);
  }
  writeLocalJson(PRODUCTS_FILE, productsCache);
  return clean;
}

async function removeProductFromStore(productId: string): Promise<void> {
  productsCache = productsCache.filter((p) => p.id !== productId);
  writeLocalJson(PRODUCTS_FILE, productsCache);
}

async function getInquiriesFromStore(): Promise<any[]> {
  return inquiriesCache;
}

async function addInquiryToStore(inquiry: {
  id: string;
  stoneId: string | null;
  stoneName: string;
  customerName: string;
  contact: string;
  message: string;
  createdAt: string;
  status: string;
  notes?: string;
}): Promise<any> {
  const safeId = String(inquiry.id)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 128);

  const cleanInquiry = {
    id: safeId,
    stoneId: inquiry.stoneId ? String(inquiry.stoneId).slice(0, 64) : null,
    stoneName: inquiry.stoneName ? String(inquiry.stoneName).slice(0, 200) : 'General Inquiry',
    customerName: inquiry.customerName.trim().slice(0, 150),
    contact: inquiry.contact.trim().slice(0, 200),
    message: inquiry.message.trim().slice(0, 3000),
    status: inquiry.status || 'new',
    notes: inquiry.notes ? String(inquiry.notes).slice(0, 2000) : '',
    createdAt: inquiry.createdAt.slice(0, 64),
  };

  inquiriesCache = [cleanInquiry, ...inquiriesCache.filter((item) => item.id !== safeId)];
  writeLocalJson(INQUIRIES_FILE, inquiriesCache);
  return cleanInquiry;
}

async function updateInquiryInStore(
  inquiryId: string,
  updates: { status?: string; notes?: string }
): Promise<any | null> {
  const existing = inquiriesCache.find((i) => i.id === inquiryId);
  if (!existing) return null;

  const validStatuses = ['new', 'contacted', 'follow_up', 'closed'];
  const nextStatus =
    updates.status && validStatuses.includes(updates.status) ? updates.status : existing.status;
  const nextNotes =
    updates.notes !== undefined ? String(updates.notes).slice(0, 2000) : existing.notes || '';

  const updated = {
    ...existing,
    status: nextStatus,
    notes: nextNotes,
  };

  inquiriesCache = inquiriesCache.map((item) => (item.id === inquiryId ? updated : item));
  writeLocalJson(INQUIRIES_FILE, inquiriesCache);
  return updated;
}

async function deleteInquiryFromStore(inquiryId: string): Promise<boolean> {
  const beforeLen = inquiriesCache.length;
  inquiriesCache = inquiriesCache.filter((item) => item.id !== inquiryId);
  writeLocalJson(INQUIRIES_FILE, inquiriesCache);
  return inquiriesCache.length < beforeLen;
}

async function getAuditLogsFromStore(): Promise<any[]> {
  return auditLogsCache;
}

async function addAuditLogToStore(entry: {
  admin: string;
  action: string;
  productName: string;
  stoneId: string;
  details: string;
}): Promise<void> {
  const logEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    admin: String(entry.admin || 'admin').slice(0, 120),
    action: String(entry.action).slice(0, 64),
    productName: String(entry.productName || '').slice(0, 200),
    stoneId: String(entry.stoneId || '').slice(0, 64),
    details: String(entry.details || '').slice(0, 1000),
    timestamp: new Date().toISOString(),
  };

  auditLogsCache.unshift(logEntry);
  if (auditLogsCache.length > 500) auditLogsCache.length = 500;
  writeLocalJson(AUDIT_LOG_FILE, auditLogsCache);
}

// Helper to resolve canonical base URL
function getCanonicalBaseUrl(req: Request): string {
  const configuredUrl = process.env.PUBLIC_SITE_URL || process.env.APP_URL;
  if (configuredUrl && configuredUrl.startsWith('http') && !configuredUrl.includes('MY_APP_URL')) {
    return configuredUrl.replace(/\/+$/, '');
  }
  const host = req.get('host') || 'geogemscrystals.com';
  const protocol = req.headers['x-forwarded-proto']
    ? String(req.headers['x-forwarded-proto']).split(',')[0]
    : req.protocol || 'https';
  return `${protocol}://${host}`;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Admin Login (Simple Built-in Credentials — No Secret Keys Required)
app.post('/api/admin/login', (req, res) => {
  const rawIdentifier = req.body.username || req.body.email || '';
  const { password } = req.body;

  if (
    !rawIdentifier ||
    !password ||
    typeof rawIdentifier !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({ error: 'Email/Username and password are required.' });
  }

  const identifier = rawIdentifier.trim();
  const identifierLower = identifier.toLowerCase();

  const validIdentifiers = new Set([
    ADMIN_USERNAME.toLowerCase(),
    ADMIN_EMAIL.toLowerCase(),
  ]);

  const passwordMatch = safeTimingEqual(password, ADMIN_PASSWORD);

  if (validIdentifiers.has(identifierLower) && passwordMatch) {
    const issued = generateToken(identifier);
    return res.json({
      success: true,
      token: issued.token,
      expiresAt: issued.expiresAt,
      user: { username: identifier, role: 'admin' },
      message: 'Authentication successful',
    });
  }

  return res.status(401).json({
    error: 'Invalid username or password.',
  });
});

// Admin Verify Token
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.split(' ')[1];
  const { valid, username, expiresAt } = verifyToken(token);
  if (valid && username) {
    return res.json({
      valid: true,
      expiresAt,
      user: { username, role: 'admin' },
    });
  }
  return res.status(401).json({ valid: false });
});

// Admin Logout
app.post('/api/admin/logout', (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/products
app.get('/api/products', async (req, res) => {
  const isAdmin = checkAdminAuth(req);
  const products = await getProductsFromStore(true);

  const total = products.length;
  const published = products.filter((p) => (p.status || 'published') === 'published').length;
  const draft = products.filter((p) => p.status === 'draft').length;
  const reserved = products.filter((p) => p.status === 'reserved').length;
  const sold = products.filter((p) => p.status === 'sold' || p.status === 'sold_out').length;
  const archived = products.filter((p) => p.status === 'archived').length;

  if (isAdmin) {
    const sorted = [...products].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return res.json({
      products: sorted,
      summary: { total, published, draft, reserved, sold, archived },
    });
  }

  const publicProducts = products
    .filter((p) => {
      const s = p.status || 'published';
      return s !== 'draft' && s !== 'archived';
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  return res.json({
    products: publicProducts,
  });
});

// GET /api/products/:identifier (Lookup by ID, Stone ID, or Slug)
app.get('/api/products/:identifier', async (req, res) => {
  const products = await getProductsFromStore(true);
  const rawId = req.params.identifier.toLowerCase().trim();

  const product = products.find(
    (p) =>
      p.id.toLowerCase() === rawId ||
      (p.stoneId && p.stoneId.toLowerCase() === rawId) ||
      (p.slug && p.slug.toLowerCase() === rawId)
  );

  if (!product) {
    return res.status(404).json({ error: 'Stone not found' });
  }

  const isAdmin = checkAdminAuth(req);
  if (!isAdmin && (product.status === 'draft' || product.status === 'archived')) {
    return res.status(404).json({ error: 'Stone not found' });
  }

  res.json({ product });
});

// PATCH /api/products/:id/status (Quick status update) - Protected
app.patch('/api/products/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'published', 'reserved', 'sold', 'archived', 'sold_out'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status "${status}".` });
    }

    const products = await getProductsFromStore(true);
    const current = products.find((p) => p.id === req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const prevStatus = current.status || 'published';
    const updated = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
      publishedAt:
        status === 'published' && !current.publishedAt
          ? new Date().toISOString()
          : current.publishedAt,
    };

    const saved = await upsertProductInStore(updated);

    await addAuditLogToStore({
      admin: (req as any).adminUser || 'admin',
      action: 'status_change',
      productName: saved.name,
      stoneId: saved.stoneId || saved.id,
      details: `Status changed from "${prevStatus}" to "${status}"`,
    });

    res.json({ success: true, product: saved });
  } catch (err: any) {
    console.error('Error changing product status:', err);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// POST /api/products (Add New Gemstone/Crystal Product) - Protected
app.post('/api/products', requireAdminAuth, async (req, res) => {
  try {
    const {
      id: providedId,
      stoneId: providedStoneId,
      category,
      name,
      images,
      videoUrl,
      weight,
      weightUnit,
      priceDisplayType,
      priceAmount,
      currency,
      description,
      shortDescription,
      loreAndProperties,
      status,
      type,
      tagline,
      origin,
      cut,
      color,
      clarity,
      dimensions,
      treatment,
      certificate,
      collectionId,
      isFeatured,
      isBestseller,
    } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Product Name is required.' });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'At least one product image is required.' });
    }

    if (weight === undefined || weight === null || isNaN(Number(weight)) || Number(weight) <= 0) {
      return res.status(400).json({ error: 'Valid Stone Weight is required.' });
    }

    const validUnits = ['ct', 'g'];
    const resolvedUnit = validUnits.includes(weightUnit) ? weightUnit : 'ct';

    const validPriceTypes = ['fixed', 'on_request', 'starting_from'];
    if (!validPriceTypes.includes(priceDisplayType)) {
      return res.status(400).json({ error: 'Valid Price Display Type must be selected.' });
    }

    let parsedPriceAmount: number | null = null;
    if (priceDisplayType === 'fixed' || priceDisplayType === 'starting_from') {
      if (
        priceAmount === undefined ||
        priceAmount === null ||
        isNaN(Number(priceAmount)) ||
        Number(priceAmount) <= 0
      ) {
        return res.status(400).json({
          error: `Price amount is required and must be greater than 0 for "${
            priceDisplayType === 'fixed' ? 'Fixed Price' : 'Starting From'
          }".`,
        });
      }
      parsedPriceAmount = Number(priceAmount);
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Product Description is required.' });
    }

    const validStatuses = ['draft', 'published', 'reserved', 'sold', 'sold_out', 'archived'];
    const resolvedStatus = validStatuses.includes(status) ? status : 'published';

    const now = new Date().toISOString();
    const id =
      providedId ||
      `geo-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const typePrefix = (type || 'GM').slice(0, 2).toUpperCase();
    const stoneId =
      providedStoneId && String(providedStoneId).trim()
        ? String(providedStoneId).trim()
        : `GGC-${typePrefix}-${Date.now().toString().slice(-3)}`;
    const resolvedCategory =
      category === 'Crystal' ||
      ['Amethyst', 'Quartz', 'Citrine', 'Agate', 'Crystal', 'Natural Crystal'].includes(type)
        ? 'Crystal'
        : 'Gemstone';

    const newProduct = await upsertProductInStore({
      id,
      stoneId,
      slug: `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${stoneId.toLowerCase()}`,
      name: name.trim(),
      category: resolvedCategory,
      type: type || 'Gemstone',
      tagline:
        tagline ||
        `${resolvedUnit === 'g' ? 'Natural Crystal' : 'Natural Stone'} • ${origin || 'Earth-Mined'}`,
      carat: resolvedUnit === 'ct' ? Number(weight) : Number(weight) * 5,
      weight: Number(weight),
      weightUnit: resolvedUnit,
      priceDisplayType,
      priceAmount: parsedPriceAmount,
      currency: currency || 'USD',
      status: resolvedStatus,
      createdAt: now,
      updatedAt: now,
      publishedAt: resolvedStatus === 'published' ? now : undefined,
      dimensions: dimensions || 'Precision Calibrated',
      color: color || 'Natural Hue',
      cut: cut || 'Faceted Stone',
      clarity: clarity || 'Fine Gem Grade',
      origin: origin || 'Natural Origin',
      naturalStatus: '100% Natural Earth-Mined',
      treatment: treatment || 'Untreated / Natural State',
      certificate: certificate || {
        issuer: 'Gemological Inspection Report',
        reportNumber: `GEO-${Date.now().toString().slice(-6)}`,
        verified: true,
      },
      priceUSD: parsedPriceAmount || 0,
      images,
      videoUrl: typeof videoUrl === 'string' && videoUrl.trim() ? videoUrl.trim() : null,
      description: description.trim(),
      shortDescription: shortDescription ? String(shortDescription).trim() : undefined,
      loreAndProperties:
        loreAndProperties ||
        'A natural stone from Geo Gems Crystals, carefully selected for authentic character and beauty.',
      collectionId: collectionId || 'latest-arrivals',
      isFeatured: Boolean(isFeatured),
      isBestseller: Boolean(isBestseller),
      stockStatus:
        resolvedStatus === 'sold_out' || resolvedStatus === 'sold' ? 'reserved' : 'rare_1_of_1',
      stockCount: resolvedStatus === 'sold_out' || resolvedStatus === 'sold' ? 0 : 1,
    });

    await addAuditLogToStore({
      admin: (req as any).adminUser || 'admin',
      action: 'create',
      productName: newProduct.name,
      stoneId: newProduct.stoneId,
      details: `Created product (${newProduct.status})`,
    });

    res.status(201).json({
      success: true,
      product: newProduct,
      message: 'Product created successfully.',
    });
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Server error while saving product.' });
  }
});

// PUT /api/products/:id (Edit Product) - Protected
app.put('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const products = await getProductsFromStore(true);
    const current = products.find((p) => p.id === req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const updateData = req.body;

    if (updateData.name !== undefined && (!updateData.name || !updateData.name.trim())) {
      return res.status(400).json({ error: 'Product Name cannot be empty.' });
    }

    if (
      updateData.images !== undefined &&
      (!Array.isArray(updateData.images) || updateData.images.length === 0)
    ) {
      return res.status(400).json({ error: 'At least one product image is required.' });
    }

    if (
      updateData.weight !== undefined &&
      (isNaN(Number(updateData.weight)) || Number(updateData.weight) <= 0)
    ) {
      return res.status(400).json({ error: 'Valid Stone Weight is required.' });
    }

    const priceDisplayType =
      updateData.priceDisplayType || current.priceDisplayType || 'fixed';
    let priceAmount =
      updateData.priceAmount !== undefined ? updateData.priceAmount : current.priceAmount;

    if (priceDisplayType === 'fixed' || priceDisplayType === 'starting_from') {
      if (
        priceAmount === undefined ||
        priceAmount === null ||
        isNaN(Number(priceAmount)) ||
        Number(priceAmount) <= 0
      ) {
        return res.status(400).json({
          error: `Price amount is required and must be greater than 0 for "${
            priceDisplayType === 'fixed' ? 'Fixed Price' : 'Starting From'
          }".`,
        });
      }
      priceAmount = Number(priceAmount);
    } else if (priceDisplayType === 'on_request') {
      priceAmount = null;
    }

    const updatedWeight =
      updateData.weight !== undefined ? Number(updateData.weight) : current.weight;
    const updatedUnit = updateData.weightUnit || current.weightUnit || 'ct';

    const updatedProduct = await upsertProductInStore({
      ...current,
      ...updateData,
      id: current.id,
      weight: updatedWeight,
      carat: updatedUnit === 'ct' ? updatedWeight : updatedWeight * 5,
      weightUnit: updatedUnit,
      priceDisplayType,
      priceAmount,
      priceUSD: priceAmount || current.priceUSD || 0,
      videoUrl:
        updateData.videoUrl !== undefined
          ? typeof updateData.videoUrl === 'string' && updateData.videoUrl.trim()
            ? updateData.videoUrl.trim()
            : null
          : current.videoUrl || null,
      stockStatus:
        updateData.status === 'sold_out' || updateData.status === 'sold'
          ? 'reserved'
          : current.stockStatus || 'in_stock',
      stockCount:
        updateData.status === 'sold_out' || updateData.status === 'sold'
          ? 0
          : current.stockCount || 1,
      updatedAt: new Date().toISOString(),
    });

    await addAuditLogToStore({
      admin: (req as any).adminUser || 'admin',
      action: 'update',
      productName: updatedProduct.name,
      stoneId: updatedProduct.stoneId || updatedProduct.id,
      details: `Updated product details (${updatedProduct.status})`,
    });

    res.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully.',
    });
  } catch (err: any) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Server error while updating product.' });
  }
});

// DELETE /api/products/:id (Delete/Archive Product) - Protected
app.delete('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const products = await getProductsFromStore(true);
    const current = products.find((p) => p.id === req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const isHard = req.query.hard !== 'false';

    if (isHard) {
      await removeProductFromStore(current.id);
    } else {
      await upsertProductInStore({
        ...current,
        status: 'archived',
        updatedAt: new Date().toISOString(),
      });
    }

    await addAuditLogToStore({
      admin: (req as any).adminUser || 'admin',
      action: isHard ? 'delete' : 'archive',
      productName: current.name,
      stoneId: current.stoneId || current.id,
      details: isHard ? 'Permanently deleted from catalog' : 'Archived (soft deleted)',
    });

    res.json({
      success: true,
      message: `Product "${current.name}" ${
        isHard ? 'permanently deleted' : 'archived'
      } successfully.`,
    });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error while deleting product.' });
  }
});

// POST /api/inquiries (Public Customer Inquiry)
app.post('/api/inquiries', async (req, res) => {
  try {
    const { id: providedId, stoneId, stoneName, customerName, contact, message } = req.body;
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return res.status(400).json({ error: 'Your name is required.' });
    }
    if (!contact || typeof contact !== 'string' || !contact.trim()) {
      return res.status(400).json({ error: 'Email or phone/WhatsApp number is required.' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Inquiry message cannot be empty.' });
    }

    const newInquiry = {
      id: providedId || `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stoneId: stoneId || null,
      stoneName: stoneName || 'General Inquiry',
      customerName: customerName.trim(),
      contact: contact.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    await addInquiryToStore(newInquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry received. Our team will reply to you shortly.',
      inquiryId: newInquiry.id,
    });
  } catch (err: any) {
    console.error('Error handling inquiry:', err);
    res.status(500).json({ error: 'Failed to record inquiry.' });
  }
});

// GET /api/admin/inquiries - Protected
app.get('/api/admin/inquiries', requireAdminAuth, async (_req, res) => {
  const inquiries = await getInquiriesFromStore();
  res.json({ inquiries });
});

// PATCH /api/admin/inquiries/:id - Protected
app.patch('/api/admin/inquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updated = await updateInquiryInStore(req.params.id, { status, notes });
    if (!updated) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    res.json({ success: true, inquiry: updated });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    res.status(500).json({ error: 'Failed to update inquiry.' });
  }
});

// DELETE /api/admin/inquiries/:id - Protected
app.delete('/api/admin/inquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    await deleteInquiryFromStore(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

// GET /api/admin/audit-log & /api/admin/audit - Protected
app.get(['/api/admin/audit-log', '/api/admin/audit'], requireAdminAuth, async (_req, res) => {
  const logs = await getAuditLogsFromStore();
  res.json({ logs });
});

// GET /sitemap.xml (SEO Sitemap)
app.get('/sitemap.xml', async (req, res) => {
  const baseUrl = getCanonicalBaseUrl(req);
  const products = (await getProductsFromStore(false)).filter(
    (p) => (p.status || 'published') === 'published'
  );

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/gemstones`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/crystals`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/collections`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/education`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/about`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy`, priority: '0.4', changefreq: 'yearly' },
    { loc: `${baseUrl}/terms`, priority: '0.4', changefreq: 'yearly' },
  ];

  const productUrls = products.map((p) => ({
    loc: `${baseUrl}/stone/${encodeURIComponent(p.stoneId || p.id)}`,
    lastmod: (p.updatedAt || p.createdAt || new Date().toISOString()).split('T')[0],
    priority: '0.85',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${(u as any).lastmod ? `<lastmod>${(u as any).lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// GET /robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = getCanonicalBaseUrl(req);

  const content = `User-agent: *
Allow: /
Allow: /gemstones
Allow: /crystals
Allow: /collections
Allow: /education
Allow: /about
Allow: /contact
Allow: /stone/

Disallow: /admin
Disallow: /api/admin/
Disallow: /private

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  res.send(content);
});

// ----------------------------------------------------
// LOCAL IMAGE + VIDEO UPLOADS & MEDIA DELIVERY
// ----------------------------------------------------
const ALLOWED_IMAGE_MIMES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB dedicated image limit

const ALLOWED_VIDEO_MIMES: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

const ALLOWED_VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov']);
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB dedicated video limit

function hasValidImageMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 12) return false;
  if (ext === 'jpg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (ext === 'png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (ext === 'webp') {
    const riff = buffer.subarray(0, 4).toString('ascii');
    const webp = buffer.subarray(8, 12).toString('ascii');
    return riff === 'RIFF' && webp === 'WEBP';
  }
  return false;
}

function hasValidVideoMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 12) return false;
  if (ext === 'webm') {
    return (
      buffer[0] === 0x1a &&
      buffer[1] === 0x45 &&
      buffer[2] === 0xdf &&
      buffer[3] === 0xa3
    );
  }
  if (ext === 'mp4' || ext === 'mov') {
    const boxType = buffer.subarray(4, 8).toString('ascii');
    const validAtoms = new Set([
      'ftyp',
      'moov',
      'mdat',
      'wide',
      'free',
      'skip',
      'pnot',
      'pict',
      'udta',
      'uuid',
    ]);
    return validAtoms.has(boxType);
  }
  return false;
}

function getMediaContentType(ext: string): string {
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'application/octet-stream';
  }
}

// Serve uploaded gemstone images and videos
app.get('/api/media/:filename', async (req, res) => {
  try {
    const rawName = path.basename(String(req.params.filename || ''));
    const isValidImageName = /^gem_[0-9]+_[a-f0-9]+\.(jpg|png|webp)$/.test(rawName);
    const isValidVideoName = /^vid_[0-9]+_[a-f0-9]+\.(mp4|webm|mov)$/.test(rawName);

    if (!isValidImageName && !isValidVideoName) {
      return res.status(400).json({ error: 'Invalid media filename.' });
    }

    const ext = path.extname(rawName).slice(1).toLowerCase();
    const contentType = getMediaContentType(ext);

    const localPath = path.join(UPLOADS_DIR, rawName);
    if (fs.existsSync(localPath)) {
      res.setHeader('Content-Type', contentType);
      res.sendFile(localPath);
      return;
    }

    const memItem = mediaMemoryStore.get(rawName);
    if (memItem) {
      res.setHeader('Content-Type', memItem.contentType);
      res.setHeader('Content-Length', String(memItem.buffer.length));
      res.send(memItem.buffer);
      return;
    }

    return res.status(404).json({ error: 'Media file not found.' });
  } catch (err) {
    console.error('Error serving media file:', err);
    return res.status(500).json({ error: 'Failed to load media file.' });
  }
});

// POST /api/upload (Image Upload) - Protected
app.post('/api/upload', requireAdminAuth, async (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    if (filename && typeof filename === 'string') {
      const providedExt = path.extname(filename).toLowerCase();
      if (!ALLOWED_IMAGE_EXTENSIONS.has(providedExt)) {
        return res.status(400).json({
          error: 'Image must be JPG, JPEG, PNG, or WEBP format.',
        });
      }
    }

    const matches = dataUrl.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data URL.' });
    }

    const mimeType = matches[1].toLowerCase().trim();
    const base64Data = matches[2];

    const ext = ALLOWED_IMAGE_MIMES[mimeType];
    if (!ext) {
      return res.status(400).json({
        error: 'Only verified raster image files (JPG, JPEG, PNG, WEBP) are allowed.',
      });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
      return res.status(400).json({ error: 'Image size exceeds maximum allowed size (15MB).' });
    }

    if (!hasValidImageMagicBytes(buffer, ext)) {
      return res.status(400).json({
        error: 'Uploaded file failed binary image signature validation.',
      });
    }

    const safeFilename = `gem_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;
    mediaMemoryStore.set(safeFilename, { buffer, contentType: mimeType });

    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      const targetPath = path.join(UPLOADS_DIR, safeFilename);
      fs.writeFileSync(targetPath, buffer);
    } catch {
      // Served from mediaMemoryStore via /api/media/:filename if disk is read-only
    }

    return res.json({
      success: true,
      imageUrl: `/api/media/${safeFilename}`,
      filename: safeFilename,
      storage: 'local',
    });
  } catch (err: any) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Server error while storing uploaded image.' });
  }
});

// POST /api/upload/video (Product Video Upload) - Protected
app.post('/api/upload/video', requireAdminAuth, async (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Video file data is required.' });
    }

    if (filename && typeof filename === 'string') {
      const providedExt = path.extname(filename).toLowerCase();
      if (!ALLOWED_VIDEO_EXTENSIONS.has(providedExt)) {
        return res.status(400).json({
          error: 'Video must be MP4, WEBM, or MOV format and under 50MB.',
        });
      }
    }

    const matches = dataUrl.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        error: 'Invalid video data format. Video must be MP4, WEBM, or MOV format.',
      });
    }

    const mimeType = matches[1].toLowerCase().trim();
    const base64Data = matches[2];

    const ext = ALLOWED_VIDEO_MIMES[mimeType];
    if (!ext) {
      return res.status(400).json({
        error:
          'Video must be MP4, WEBM, or MOV format (video/mp4, video/webm, or video/quicktime).',
      });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > MAX_VIDEO_SIZE_BYTES) {
      return res.status(400).json({
        error:
          'Video size exceeds maximum allowed size (50MB). Please upload an MP4, WEBM, or MOV video under 50MB.',
      });
    }

    if (!hasValidVideoMagicBytes(buffer, ext)) {
      return res.status(400).json({
        error:
          'Uploaded file failed binary video container signature validation. Video must be a valid MP4, WEBM, or MOV file.',
      });
    }

    const safeFilename = `vid_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;
    mediaMemoryStore.set(safeFilename, { buffer, contentType: mimeType });

    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      const targetPath = path.join(UPLOADS_DIR, safeFilename);
      fs.writeFileSync(targetPath, buffer);
    } catch {
      // Served from mediaMemoryStore via /api/media/:filename if disk is read-only
    }

    return res.json({
      success: true,
      videoUrl: `/api/media/${safeFilename}`,
      filename: safeFilename,
      storage: 'local',
    });
  } catch (err: any) {
    console.error('Error uploading video:', err);
    res.status(500).json({ error: 'Server error while storing uploaded video.' });
  }
});

// ----------------------------------------------------
// FRONTEND MIDDLEWARE / STATIC ASSETS
// ----------------------------------------------------

async function startServer() {
  await initializeStore();

  if (IS_PRODUCTION) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GEO GEMS CRYSTALS Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
