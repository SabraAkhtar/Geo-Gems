import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  LogOut,
  ArrowLeft,
  Layers,
  CheckCircle2,
  FileText,
  Archive,
  MessageSquare,
  Eye,
  RefreshCw,
  Inbox,
  Mail,
  Clock,
  ShieldCheck,
  Film,
} from 'lucide-react';
import { Gemstone, ProductStatus } from '../../types';
import { useEcommerce, inferStoneCategory } from '../../context/EcommerceContext';
import { ProductFormModal } from './ProductFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  getPriceDisplay,
  getWeightDisplay,
  getWhatsAppInquiryUrl,
} from '../../utils/gemstoneHelpers';
import { Logo } from '../Logo';

interface CustomerInquiry {
  id: string;
  stoneId?: string | null;
  stoneName?: string | null;
  customerName: string;
  contact: string;
  message: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface AdminAuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  productName: string;
  stoneId: string;
  details: string;
}

export const AdminDashboard: React.FC = () => {
  const {
    allProducts,
    adminToken,
    adminUser,
    adminLogout,
    setCurrentView,
    refreshProducts,
    updateProductStatus,
    openGemstoneDetail,
    showNotification,
  } = useEcommerce();

  // Active Admin Tab: 'inventory' | 'inquiries' | 'audit'
  const [activeTab, setActiveTab] = useState<'inventory' | 'inquiries' | 'audit'>('inventory');

  // Inquiries State
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Gemstone' | 'Crystal'>('All');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Gemstone | null>(null);
  const [productToDelete, setProductToDelete] = useState<Gemstone | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setIsLoadingInquiries(true);
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      if (!token) return;
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.inquiries)) {
          setInquiries(
            [...data.inquiries].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          );
          return;
        }
      }
    } catch {
      // Ignore network errors
    } finally {
      setIsLoadingInquiries(false);
    }

    // Read stored inquiries from local storage
    try {
      const saved = localStorage.getItem('geo_gems_inquiries');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          setInquiries(list);
        }
      }
    } catch {
      // Ignore
    }
  }, [adminToken]);

  const fetchAuditLogs = useCallback(async () => {
    setIsLoadingAudit(true);
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      if (!token) return;
      const res = await fetch('/api/admin/audit', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.logs)) {
          setAuditLogs(
            [...data.logs].sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
          );
        }
      }
    } catch {
      // Ignore network errors
    } finally {
      setIsLoadingAudit(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchInquiries();
    fetchAuditLogs();
  }, [fetchInquiries, fetchAuditLogs]);

  const handleInquiryStatusChange = async (inquiryId: string, nextStatus: string) => {
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      if (!token) return;
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(inquiryId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, status: nextStatus } : item))
        );
        showNotification('Inquiry status updated.');
      }
    } catch {
      showNotification('Could not update inquiry status.');
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    try {
      const token = adminToken || localStorage.getItem('geo_gems_admin_token');
      if (!token) return;
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(inquiryId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== inquiryId));
        showNotification('Inquiry removed.');
      }
    } catch {
      showNotification('Could not remove inquiry.');
    }
  };

  // Compute stats
  const totalCount = allProducts.length;
  const publishedCount = allProducts.filter((p) => (p.status || 'published') === 'published').length;
  const draftCount = allProducts.filter((p) => p.status === 'draft').length;
  const soldOutCount = allProducts.filter(
    (p) => p.status === 'sold_out' || p.status === 'sold' || p.status === 'reserved'
  ).length;
  const newInquiriesCount = inquiries.filter((i) => (i.status || 'new') === 'new').length;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (categoryFilter !== 'All') {
        const cat = inferStoneCategory(product);
        if (cat !== categoryFilter) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const prodStatus = product.status || 'published';
        if (statusFilter === 'sold_out') {
          if (prodStatus !== 'sold_out' && prodStatus !== 'sold') return false;
        } else if (prodStatus !== statusFilter) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          product.name.toLowerCase().includes(q) ||
          (product.stoneId && product.stoneId.toLowerCase().includes(q)) ||
          (product.type && product.type.toLowerCase().includes(q)) ||
          (product.origin && product.origin.toLowerCase().includes(q)) ||
          (product.cut && product.cut.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [allProducts, categoryFilter, statusFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Gemstone) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshProducts(), fetchInquiries(), fetchAuditLogs()]);
    setIsRefreshing(false);
  };

  const handleQuickStatusChange = async (product: Gemstone, newStatus: ProductStatus) => {
    await updateProductStatus(product.id, newStatus);
    await fetchAuditLogs();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#151515] flex flex-col font-sans">
      {/* Top Luxury Admin Header */}
      <header className="bg-white border-b border-[#E1D9CD] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">

          {/* LEFT — Logo + title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Logo size="xs" layout="badge_only" className="flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-[15px] sm:text-lg font-medium tracking-tight text-[#151515] whitespace-nowrap">
                  Geo Gems
                </h1>
                <span className="px-1.5 py-0.5 bg-[#B08D57]/15 text-[#8F6F3A] text-[9px] sm:text-[10px] font-mono uppercase tracking-widest font-semibold rounded whitespace-nowrap">
                  Admin CMS
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleManualRefresh}
              title="Refresh"
              className="p-2 text-[#716B60] hover:text-[#151515] hover:bg-[#FAF8F3] rounded-lg border border-transparent hover:border-[#E1D9CD] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#B08D57]' : ''}`} />
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="p-2 sm:px-3 sm:py-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#716B60] hover:text-[#151515] hover:bg-[#FAF8F3] rounded-lg border border-[#E1D9CD] transition-colors cursor-pointer"
              title="View Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline uppercase tracking-wider">View Website</span>
            </button>

            <button
              onClick={adminLogout}
              className="p-2 sm:px-3 sm:py-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A14B38] hover:bg-[#A14B38]/10 rounded-lg border border-[#A14B38]/30 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline uppercase tracking-wider">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* PRIMARY NAVIGATION TABS */}
        <div className="flex items-stretch gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-shrink-0 px-3 sm:px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                : 'bg-white text-[#5A544A] border border-[#E1D9CD] hover:border-[#B08D57]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#B08D57] flex-shrink-0" />
            <span>Inventory ({totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex-shrink-0 px-3 sm:px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                : 'bg-white text-[#5A544A] border border-[#E1D9CD] hover:border-[#B08D57]'
            }`}
          >
            <Inbox className="w-4 h-4 text-[#B08D57] flex-shrink-0" />
            <span>Inquiries ({inquiries.length})</span>
            {newInquiriesCount > 0 && (
              <span className="px-1.5 py-0.5 bg-[#B08D57] text-[#151515] rounded-full text-[10px] font-bold">
                {newInquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-shrink-0 px-3 sm:px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#121212] text-[#FAF8F3] shadow-xs'
                : 'bg-white text-[#5A544A] border border-[#E1D9CD] hover:border-[#B08D57]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#B08D57] flex-shrink-0" />
            <span>Activity ({auditLogs.length})</span>
          </button>
        </div>

        {activeTab === 'audit' ? (
          /* AUDIT LOGS TAB */
          <div className="bg-white rounded-2xl border border-[#E1D9CD] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E1D9CD] bg-[#FAF8F3] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#151515]">
                  Administrative Activity Log ({auditLogs.length})
                </h3>
                <p className="text-[11px] text-[#716B60]">
                  Audit trail of stone additions, updates, status changes, and removals
                </p>
              </div>
              <button
                onClick={fetchAuditLogs}
                className="px-3 py-1.5 bg-white border border-[#E1D9CD] hover:border-[#B08D57] rounded-lg text-xs font-medium text-[#292820] cursor-pointer"
              >
                {isLoadingAudit ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {auditLogs.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F3] border border-[#E1D9CD] flex items-center justify-center text-[#B08D57] mx-auto mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-[#151515]">
                  No Administrative Actions Logged Yet
                </h4>
                <p className="text-xs text-[#716B60] mt-1 max-w-md mx-auto">
                  Every stone addition, price update, status change, or deletion is recorded here
                  with a timestamp and administrator identity.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E1D9CD]">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 sm:p-5 hover:bg-[#FAF8F3]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#B08D57]/15 text-[#8F6F3A] rounded text-[10px] font-mono uppercase tracking-wider font-semibold">
                          {log.action}
                        </span>
                        <span className="font-serif text-sm font-semibold text-[#151515]">
                          {log.productName}
                        </span>
                        {log.stoneId && (
                          <span className="text-[11px] font-mono text-[#716B60]">
                            ({log.stoneId})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5A544A]">{log.details}</p>
                    </div>
                    <div className="text-left sm:text-right text-[11px] text-[#716B60] flex-shrink-0">
                      <div className="font-medium text-[#292820]">{log.admin}</div>
                      <div>{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'inquiries' ? (
          /* CUSTOMER INQUIRIES TAB */
          <div className="bg-white rounded-2xl border border-[#E1D9CD] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E1D9CD] bg-[#FAF8F3] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#151515]">
                  Customer Inquiries ({inquiries.length})
                </h3>
                <p className="text-[11px] text-[#716B60]">
                  Messages submitted by customers through the website inquiry &amp; contact forms
                </p>
              </div>
              <button
                onClick={fetchInquiries}
                className="px-3 py-1.5 bg-white border border-[#E1D9CD] hover:border-[#B08D57] rounded-lg text-xs font-medium text-[#292820] cursor-pointer"
              >
                {isLoadingInquiries ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F3] border border-[#E1D9CD] flex items-center justify-center text-[#B08D57] mx-auto mb-3">
                  <Inbox className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-[#151515]">No Website Form Inquiries Yet</h4>
                <p className="text-xs text-[#716B60] mt-1 max-w-md mx-auto">
                  When a visitor fills out the &ldquo;Send Inquiry&rdquo; or &ldquo;Contact Us&rdquo;
                  form on the website, their name, phone/email, stone ID, and message will appear
                  here. Direct WhatsApp clicks go straight to your WhatsApp (+92 327 5315493).
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E1D9CD]">
                {inquiries.map((inq) => {
                  const dateLabel = inq.createdAt
                    ? new Date(inq.createdAt).toLocaleString()
                    : 'Recent';
                  const isEmail = inq.contact.includes('@');
                  const currentInqStatus = inq.status || 'new';

                  return (
                    <div
                      key={inq.id}
                      className="p-5 sm:p-6 hover:bg-[#FAF8F3]/60 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-2 max-w-3xl flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-serif text-base font-semibold text-[#151515]">
                            {inq.customerName}
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#FAF8F3] border border-[#E1D9CD] rounded-md text-xs font-mono text-[#5A544A]">
                            {inq.contact}
                          </span>
                          {inq.stoneName && (
                            <span className="px-2.5 py-0.5 bg-[#B08D57]/15 text-[#8F6F3A] rounded-md text-[11px] font-semibold">
                              {inq.stoneName} {inq.stoneId ? `(${inq.stoneId})` : ''}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-[#292820] whitespace-pre-line bg-[#FAF8F3] p-3.5 rounded-xl border border-[#E1D9CD]">
                          {inq.message}
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-[#716B60]">
                          <Clock className="w-3.5 h-3.5 text-[#B08D57]" />
                          <span>Received: {dateLabel}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                        <select
                          value={currentInqStatus}
                          onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider border cursor-pointer ${
                            currentInqStatus === 'new'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : currentInqStatus === 'contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : currentInqStatus === 'follow_up'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="follow_up">Follow Up</option>
                          <option value="closed">Closed</option>
                        </select>

                        {isEmail && (
                          <a
                            href={`mailto:${inq.contact.split('|')[0].trim()}?subject=${encodeURIComponent(
                              `Re: Your Inquiry at Geo Gems Crystals (${inq.stoneName || 'Natural Stones'})`
                            )}`}
                            className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#E1D9CD] rounded-lg text-xs font-semibold text-[#151515] inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#B08D57]" />
                            <span>Reply</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          title="Delete inquiry"
                          className="p-1.5 text-[#A14B38] hover:bg-[#A14B38]/10 rounded-lg border border-transparent hover:border-[#A14B38]/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* SECTION 1: OVERVIEW STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Card 1: Total */}
              <div
                onClick={() => setStatusFilter('all')}
                className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white border-[#B08D57] shadow-sm ring-1 ring-[#B08D57]'
                    : 'bg-white border-[#E1D9CD] hover:border-[#B08D57]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#716B60]">
                    Total Catalog
                  </span>
                  <Layers className="w-4 h-4 text-[#B08D57]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#151515] mt-2">
                  {totalCount}
                </div>
                <p className="text-[11px] text-[#716B60] mt-1">All registered stones</p>
              </div>

              {/* Card 2: Published */}
              <div
                onClick={() => setStatusFilter('published')}
                className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'published'
                    ? 'bg-emerald-50/50 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                    : 'bg-white border-[#E1D9CD] hover:border-emerald-500/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Published
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-emerald-900 mt-2">
                  {publishedCount}
                </div>
                <p className="text-[11px] text-emerald-700/80 mt-1">Live on public website</p>
              </div>

              {/* Card 3: Draft */}
              <div
                onClick={() => setStatusFilter('draft')}
                className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'draft'
                    ? 'bg-slate-100 border-slate-600 shadow-sm ring-1 ring-slate-600'
                    : 'bg-white border-[#E1D9CD] hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Drafts
                  </span>
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">
                  {draftCount}
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Private &amp; unpublished</p>
              </div>

              {/* Card 4: Sold Out / Reserved */}
              <div
                onClick={() => setStatusFilter('sold_out')}
                className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'sold_out'
                    ? 'bg-amber-50/70 border-amber-600 shadow-sm ring-1 ring-amber-600'
                    : 'bg-white border-[#E1D9CD] hover:border-amber-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                    Sold Out / Reserved
                  </span>
                  <Archive className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-amber-900 mt-2">
                  {soldOutCount}
                </div>
                <p className="text-[11px] text-amber-700/80 mt-1">Sold &amp; reserved stones</p>
              </div>
            </div>

            {/* SECTION 2: ACTIONS & SEARCH CONTROLS */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E1D9CD] shadow-xs mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Left: Add New Product Button + Category Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleOpenAddModal} className="primary-button flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4 text-white" />
                  <span>Add New Stone</span>
                </button>

                {/* Export products.json — updates the static file used by homepage */}
                <button
                  onClick={() => {
                    const json = JSON.stringify(allProducts, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'products.json';
                    a.click();
                    URL.revokeObjectURL(url);
                    showNotification('products.json downloaded. Replace data/products.json in your project and redeploy to show new products on homepage.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#B08D57] border border-[#B08D57]/40 hover:bg-[#B08D57]/10 rounded-xl transition-colors cursor-pointer"
                  title="Download products.json to update homepage"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Export Products</span>
                </button>

                <div className="flex items-center gap-1 bg-[#FAF8F3] p-1 rounded-xl border border-[#E1D9CD]">
                  {(['All', 'Gemstone', 'Crystal'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-white text-[#151515] shadow-2xs border border-[#E1D9CD]'
                          : 'text-[#716B60] hover:text-[#151515]'
                      }`}
                    >
                      {cat === 'All' ? 'All Stones' : `${cat}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Search & Status Filters */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 flex-grow lg:justify-end">
                {/* Search Input */}
                <div className="relative w-full sm:w-68">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#716B60]">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID, type, origin..."
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF8F3] border border-[#E1D9CD] rounded-lg text-xs text-[#151515] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'published', label: 'Published' },
                    { id: 'draft', label: 'Draft' },
                    { id: 'reserved', label: 'Reserved' },
                    { id: 'sold_out', label: 'Sold Out' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                        statusFilter === tab.id
                          ? 'bg-[#B08D57] text-[#25221D]'
                          : 'bg-[#FAF8F3] text-[#716B60] hover:text-[#151515]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: PRODUCT MANAGEMENT LIST */}
            <div className="bg-white rounded-2xl border border-[#E1D9CD] shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E1D9CD] bg-[#FAF8F3] flex items-center justify-between">
                <h3 className="font-serif text-lg font-medium text-[#151515]">
                  Stone Inventory ({filteredProducts.length})
                </h3>
                <span className="text-[11px] text-[#716B60]">
                  Sorted by newest additions first
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F3] border border-[#E1D9CD] flex items-center justify-center text-[#716B60] mx-auto mb-3">
                    <Filter className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg text-[#151515]">No Stones Found</h4>
                  <p className="text-xs text-[#716B60] mt-1 max-w-sm mx-auto">
                    No products currently match your search query or filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCategoryFilter('All');
                    }}
                    className="mt-4 px-4 py-2 bg-[#FAF8F3] hover:bg-[#F5F1E9] border border-[#E1D9CD] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#292820] cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E1D9CD] bg-[#FAF8F3]/60 text-[#716B60] uppercase tracking-wider font-semibold text-[10px]">
                        <th className="py-3.5 px-4 sm:px-6">Stone</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Weight</th>
                        <th className="py-3.5 px-4">Price Display</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E1D9CD]">
                      {filteredProducts.map((product) => {
                        const priceInfo = getPriceDisplay(product);
                        const weightDisplay = getWeightDisplay(product);
                        const currentStatus = product.status || 'published';
                        const waUrl = getWhatsAppInquiryUrl(product);
                        const cat = inferStoneCategory(product);

                        return (
                          <tr
                            key={product.id}
                            className="hover:bg-[#FAF8F3]/50 transition-colors group"
                          >
                            {/* Gemstone Image & Name */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#FAF8F3] border border-[#E1D9CD] flex-shrink-0 relative">
                                  <img
                                    src={product.images[0] || '/stones/emerald.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {product.videoUrl && (
                                    <span
                                      title="Product video attached"
                                      className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-[#151515]/80 text-[#B08D57] flex items-center justify-center"
                                    >
                                      <Film className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-serif text-sm font-semibold text-[#151515] group-hover:text-[#B08D57] transition-colors line-clamp-1">
                                    {product.name}
                                  </p>
                                  <p className="text-[11px] text-[#716B60] mt-0.5 line-clamp-1">
                                    {product.stoneId ? `${product.stoneId} • ` : ''}
                                    {product.type} • {product.origin || product.cut || 'Earth-Mined'}
                                    {product.videoUrl ? ' • Video Attached' : ''}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-4 px-4">
                              <span className="px-2 py-0.5 bg-[#FAF8F3] border border-[#E1D9CD] rounded text-[10px] font-semibold uppercase tracking-wider text-[#5A544A]">
                                {cat}
                              </span>
                            </td>

                            {/* Weight */}
                            <td className="py-4 px-4 font-mono font-medium text-[#292820]">
                              {weightDisplay}
                            </td>

                            {/* Price Display */}
                            <td className="py-4 px-4">
                              <div>
                                <span
                                  className={`font-medium ${
                                    priceInfo.isPriceOnRequest
                                      ? 'text-[#B08D57]'
                                      : 'text-[#151515]'
                                  }`}
                                >
                                  {priceInfo.label}
                                </span>
                                <div className="text-[10px] text-[#716B60] capitalize">
                                  {product.priceDisplayType === 'on_request'
                                    ? 'WhatsApp Inquiry'
                                    : product.priceDisplayType === 'starting_from'
                                    ? 'Starting price'
                                    : 'Confirmed price'}
                                </div>
                              </div>
                            </td>

                            {/* Status + Quick toggle */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <select
                                  value={currentStatus === 'sold' ? 'sold_out' : currentStatus}
                                  onChange={(e) =>
                                    handleQuickStatusChange(product, e.target.value as ProductStatus)
                                  }
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border cursor-pointer ${
                                    currentStatus === 'published'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : currentStatus === 'draft'
                                      ? 'bg-slate-100 text-slate-800 border-slate-300'
                                      : currentStatus === 'reserved'
                                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-300'
                                  }`}
                                >
                                  <option value="published">Published</option>
                                  <option value="draft">Draft</option>
                                  <option value="reserved">Reserved</option>
                                  <option value="sold_out">Sold Out</option>
                                </select>
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* WhatsApp test link */}
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Test pre-filled WhatsApp message"
                                  className="p-1.5 text-[#7D8976] hover:bg-[#7D8976]/10 rounded-lg transition-colors cursor-pointer"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>

                                {/* View Details page */}
                                <button
                                  type="button"
                                  onClick={() => openGemstoneDetail(product)}
                                  title="Preview public page"
                                  className="p-1.5 text-[#716B60] hover:text-[#151515] hover:bg-[#FAF8F3] rounded-lg transition-colors cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(product)}
                                  title="Edit stone"
                                  className="p-1.5 text-[#B08D57] hover:bg-[#B08D57]/10 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => setProductToDelete(product)}
                                  title="Delete stone"
                                  className="p-1.5 text-[#A14B38] hover:bg-[#A14B38]/10 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          fetchAuditLogs();
        }}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!productToDelete}
        onClose={() => {
          setProductToDelete(null);
          fetchAuditLogs();
        }}
        product={productToDelete}
      />
    </div>
  );
};
