import React, { useState } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useCart, CartFormData } from '../context/CartContext';
import { useEcommerce } from '../context/EcommerceContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getPriceDisplay, getStoneId, BUSINESS_WHATSAPP_NUMBER } from '../utils/gemstoneHelpers';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    buildWhatsAppMessage,
  } = useCart();

  const { setCurrentView } = useEcommerce();

  const [formData, setFormData] = useState<CartFormData>({
    name: '',
    phone: '',
    country: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<CartFormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<CartFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone / WhatsApp number';
    if (!formData.country.trim()) newErrors.country = 'Please enter your country';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const message = buildWhatsAppMessage(formData);
    const url = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  // Calculate totals (only for fixed-price items)
  const fixedItems = cartItems.filter(
    (item) => item.gemstone.priceDisplayType !== 'on_request' && item.gemstone.priceUSD
  );
  const hasOnRequest = cartItems.some(
    (item) => item.gemstone.priceDisplayType === 'on_request'
  );
  const subtotal = fixedItems.reduce(
    (sum, item) => sum + (item.gemstone.priceUSD || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* ── Page Header ── */}
      <div style={{ backgroundColor: '#1A1712', borderBottom: '1px solid #2E2A24' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-[#B5A48A] hover:text-[#D4B06A] transition-colors cursor-pointer text-sm font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-[#B08D57]" />
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#E8D5A8]">
              Inquiry Cart
            </h1>
            {cartCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-[#B08D57] text-white text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          <div className="w-32" /> {/* spacer */}
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      {cartItems.length === 0 && (
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#F0EAE1] flex items-center justify-center mx-auto mb-6">
            <Package className="w-9 h-9 text-[#B08D57]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] mb-3">
            Your Cart is Empty
          </h2>
          <p className="font-sans text-[14px] text-[#716B60] leading-relaxed mb-8">
            Add natural gemstones and crystals to your cart to inquire about multiple stones at once via WhatsApp.
          </p>
          <button
            onClick={() => {
              setCurrentView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="primary-button"
          >
            <span>Browse Our Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      {cartItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ════════════════════════════════════════
                LEFT — Cart Items
                ════════════════════════════════════════ */}
            <div className="lg:col-span-7">

              {/* Section label + clear */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-[22px] sm:text-2xl font-medium text-[#121212]">
                  Selected Stones
                  <span className="font-sans text-[14px] font-normal text-[#716B60] ml-2">
                    ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                  </span>
                </h2>
                <button
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 text-[12px] font-sans text-[#B7AEA2] hover:text-[#E57373] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Cart items */}
              <div className="space-y-4">
                {cartItems.map((item, idx) => {
                  const stoneId = getStoneId(item.gemstone);
                  const priceInfo = getPriceDisplay(item.gemstone);

                  return (
                    <div
                      key={item.gemstone.id}
                      className="bg-white rounded-2xl border border-[#E5DED2] p-4 sm:p-5 flex gap-4 hover:border-[#B08D57]/40 transition-colors"
                    >
                      {/* Number badge */}
                      <div className="hidden sm:flex w-7 h-7 rounded-full bg-[#F5F1E9] border border-[#E5DED2] items-center justify-center flex-shrink-0 mt-1">
                        <span className="font-serif text-[12px] font-medium text-[#B08D57]">{idx + 1}</span>
                      </div>

                      {/* Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F3EFE8] flex-shrink-0 border border-[#E5DED2]">
                        <img
                          src={item.gemstone.images?.[0] || '/stones/ruby.jpg'}
                          alt={item.gemstone.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {/* Type + ID */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[9px] font-sans font-bold tracking-[0.16em] text-[#B08D57] uppercase">
                            {item.gemstone.type}
                          </span>
                          <span className="text-[9px] font-sans text-[#B7AEA2] tracking-wide uppercase">
                            {stoneId}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="font-serif text-[15px] sm:text-[17px] font-medium text-[#121212] leading-snug mb-1">
                          {item.gemstone.name}
                        </h3>

                        {/* Specs */}
                        <p className="text-[12px] font-sans text-[#716B60] mb-3">
                          {item.gemstone.weight} {item.gemstone.weightUnit || 'ct'}
                          {item.gemstone.origin ? ` · ${item.gemstone.origin.split(',')[0]}` : ''}
                          {item.gemstone.cut ? ` · ${item.gemstone.cut}` : ''}
                        </p>

                        {/* Price + Quantity + Remove row */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          {/* Price */}
                          <div>
                            <span className="font-serif text-[16px] sm:text-[18px] font-semibold text-[#121212]">
                              {priceInfo.label}
                            </span>
                            {item.quantity > 1 && priceInfo.isFixed && (
                              <span className="text-[11px] font-sans text-[#B7AEA2] ml-2">
                                × {item.quantity}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Quantity control */}
                            <div className="flex items-center bg-[#F5F1E9] rounded-xl border border-[#E5DED2] overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.gemstone.id, item.quantity - 1)}
                                className="w-9 h-9 flex items-center justify-center text-[#5A544A] hover:bg-[#E5DED2] hover:text-[#121212] transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center font-sans text-[14px] font-semibold text-[#121212] select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.gemstone.id, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center text-[#5A544A] hover:bg-[#E5DED2] hover:text-[#121212] transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => removeFromCart(item.gemstone.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5DED2] text-[#B7AEA2] hover:border-red-300 hover:text-red-400 transition-colors cursor-pointer"
                              aria-label="Remove stone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order summary box */}
              <div className="mt-6 bg-white rounded-2xl border border-[#E5DED2] p-5">
                <h3 className="font-serif text-[16px] font-medium text-[#121212] mb-4">
                  Order Summary
                </h3>

                {cartItems.map((item) => {
                  const priceInfo = getPriceDisplay(item.gemstone);
                  return (
                    <div key={item.gemstone.id} className="flex items-center justify-between py-2 border-b border-[#F0EAE1] last:border-0">
                      <span className="text-[13px] font-sans text-[#5A544A] truncate pr-4 flex-1">
                        {item.gemstone.name}
                        {item.quantity > 1 && (
                          <span className="text-[#B08D57] ml-1">×{item.quantity}</span>
                        )}
                      </span>
                      <span className="font-sans text-[13px] font-semibold text-[#121212] flex-shrink-0">
                        {priceInfo.isPriceOnRequest ? (
                          <span className="text-[#B08D57]">On Request</span>
                        ) : (
                          `$${((item.gemstone.priceUSD || 0) * item.quantity).toLocaleString()}`
                        )}
                      </span>
                    </div>
                  );
                })}

                {/* Subtotal */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5DED2]">
                  <span className="font-sans text-[14px] font-semibold text-[#121212] uppercase tracking-wide">
                    Estimated Total
                  </span>
                  <div className="text-right">
                    {hasOnRequest && fixedItems.length === 0 ? (
                      <span className="font-serif text-[17px] font-semibold text-[#B08D57]">Price on Request</span>
                    ) : (
                      <>
                        <span className="font-serif text-[20px] font-semibold text-[#121212]">
                          ${subtotal.toLocaleString()}
                        </span>
                        {hasOnRequest && (
                          <p className="text-[11px] font-sans text-[#B7AEA2] mt-0.5">
                            + price on request items
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Trust note */}
                <div className="mt-4 flex items-start gap-2.5 p-3 bg-[#F5F1E9] rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#B08D57] flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] font-sans text-[#5A544A] leading-relaxed">
                    No payment required here. Your inquiry goes directly to our WhatsApp — we will confirm availability, pricing, and payment details personally.
                  </p>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════
                RIGHT — Inquiry Form
                ════════════════════════════════════════ */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-[#E5DED2] shadow-sm overflow-hidden sticky top-24">

                {/* Form header */}
                <div className="px-6 py-5 border-b border-[#E5DED2]" style={{ backgroundColor: '#1A1712' }}>
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-[#B08D57]" />
                    <h2 className="font-serif text-xl font-medium text-[#E8D5A8]">
                      Send Your Inquiry
                    </h2>
                  </div>
                  <p className="text-[12px] font-sans mt-1.5" style={{ color: '#A89880' }}>
                    Fill in your details — all {cartCount} stone{cartCount !== 1 ? 's' : ''} will be sent via WhatsApp
                  </p>
                </div>

                {/* Success state */}
                {submitted && (
                  <div className="px-6 py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
                      <WhatsAppIcon className="w-7 h-7 text-green-500" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-[#121212] mb-2">
                      Inquiry Sent!
                    </h3>
                    <p className="text-[13px] font-sans text-[#716B60] leading-relaxed mb-6">
                      WhatsApp should have opened with your complete inquiry. We will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-[12px] font-sans text-[#B08D57] hover:text-[#121212] transition-colors cursor-pointer underline underline-offset-2"
                    >
                      Send another inquiry
                    </button>
                  </div>
                )}

                {/* Form */}
                {!submitted && (
                  <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[12px] font-sans font-semibold text-[#292820] mb-1.5 uppercase tracking-wide">
                        Full Name <span className="text-[#B08D57]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 rounded-xl border text-[14px] bg-[#FAF8F3] text-[#292820] placeholder-[#B7AEA2] focus:outline-none focus:border-[#B08D57] transition-colors ${
                          errors.name ? 'border-red-400 bg-red-50/20' : 'border-[#E5DED2]'
                        }`}
                      />
                      {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[12px] font-sans font-semibold text-[#292820] mb-1.5 uppercase tracking-wide">
                        Phone / WhatsApp <span className="text-[#B08D57]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        placeholder="+1 555 000 0000"
                        className={`w-full px-4 py-3 rounded-xl border text-[14px] bg-[#FAF8F3] text-[#292820] placeholder-[#B7AEA2] focus:outline-none focus:border-[#B08D57] transition-colors ${
                          errors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#E5DED2]'
                        }`}
                      />
                      {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-[12px] font-sans font-semibold text-[#292820] mb-1.5 uppercase tracking-wide">
                        Country <span className="text-[#B08D57]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => {
                          setFormData({ ...formData, country: e.target.value });
                          if (errors.country) setErrors({ ...errors, country: '' });
                        }}
                        placeholder="e.g. United States, Pakistan, UAE"
                        className={`w-full px-4 py-3 rounded-xl border text-[14px] bg-[#FAF8F3] text-[#292820] placeholder-[#B7AEA2] focus:outline-none focus:border-[#B08D57] transition-colors ${
                          errors.country ? 'border-red-400 bg-red-50/20' : 'border-[#E5DED2]'
                        }`}
                      />
                      {errors.country && <p className="text-[11px] text-red-500 mt-1">{errors.country}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[12px] font-sans font-semibold text-[#292820] mb-1.5 uppercase tracking-wide">
                        Additional Message
                        <span className="text-[#B7AEA2] font-normal ml-1">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Any special requirements, preferred shipping method, or questions..."
                        className="w-full px-4 py-3 rounded-xl border border-[#E5DED2] text-[14px] bg-[#FAF8F3] text-[#292820] placeholder-[#B7AEA2] focus:outline-none focus:border-[#B08D57] transition-colors resize-none"
                      />
                    </div>

                    {/* Stones summary preview */}
                    <div className="p-3.5 bg-[#F5F1E9] rounded-xl border border-[#E5DED2]">
                      <p className="text-[11px] font-sans font-semibold text-[#5A544A] uppercase tracking-wide mb-2">
                        Sending inquiry for:
                      </p>
                      <div className="space-y-1">
                        {cartItems.map((item) => (
                          <div key={item.gemstone.id} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] flex-shrink-0" />
                            <span className="text-[12px] font-sans text-[#5A544A] truncate">
                              {item.gemstone.name}
                              {item.quantity > 1 && (
                                <span className="text-[#B08D57] ml-1">×{item.quantity}</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      className="primary-button w-full justify-center"
                      style={{ fontSize: '13px', letterSpacing: '1.6px', padding: '1em 1.5em' }}
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                      <span>Send Inquiry on WhatsApp</span>
                    </button>

                    <p className="text-[11px] text-[#B7AEA2] text-center font-sans">
                      Opens WhatsApp with all stone details pre-filled
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
