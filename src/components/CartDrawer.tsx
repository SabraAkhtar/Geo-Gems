import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useCart, CartFormData } from '../context/CartContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getPriceDisplay, getStoneId, BUSINESS_WHATSAPP_NUMBER } from '../utils/gemstoneHelpers';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    cartCount,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    buildWhatsAppMessage,
  } = useCart();

  const [formData, setFormData] = useState<CartFormData>({
    name: '',
    phone: '',
    country: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<CartFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<CartFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number';
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
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Cart">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#121212]/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-lg flex flex-col bg-[#FAF8F3] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5DED2] bg-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-[#B08D57]" />
            <h2 className="font-serif text-xl font-medium text-[#121212]">
              Inquiry Cart
            </h2>
            {cartCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-[#B08D57] text-white text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#5A544A] hover:text-[#121212] transition-colors rounded-lg cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {cartItems.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <Package className="w-14 h-14 text-[#D8CFC2] mb-4" />
              <h3 className="font-serif text-xl text-[#121212] mb-2">Cart is Empty</h3>
              <p className="text-[13px] font-sans text-[#716B60] max-w-[260px] leading-relaxed">
                Add stones from the collection to inquire about multiple products at once.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 primary-button"
                style={{ fontSize: '12px', letterSpacing: '1.4px' }}
              >
                <span>Browse Stones</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="px-5 py-4">

              {/* Cart Items List */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => {
                  const stoneId = getStoneId(item.gemstone);
                  const priceInfo = getPriceDisplay(item.gemstone);

                  return (
                    <div
                      key={item.gemstone.id}
                      className="flex gap-3 bg-white rounded-xl border border-[#E5DED2] p-3"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F3EFE8] flex-shrink-0">
                        <img
                          src={item.gemstone.images?.[0] || '/stones/ruby.jpg'}
                          alt={item.gemstone.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[9px] font-sans font-semibold tracking-widest text-[#B08D57] uppercase block">
                              {stoneId}
                            </span>
                            <h4 className="font-serif text-[13px] font-medium text-[#121212] leading-snug truncate">
                              {item.gemstone.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.gemstone.id)}
                            className="text-[#D8CFC2] hover:text-[#E57373] transition-colors flex-shrink-0 cursor-pointer p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] font-sans text-[#716B60] mt-0.5">
                          {item.gemstone.weight} {item.gemstone.weightUnit || 'ct'} · {item.gemstone.origin?.split(',')[0] || item.gemstone.type}
                        </p>

                        {/* Price + Quantity row */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-serif text-[13px] font-semibold text-[#121212]">
                            {priceInfo.label}
                          </span>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-1 bg-[#F5F1E9] rounded-lg border border-[#E5DED2] overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.gemstone.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#5A544A] hover:bg-[#E5DED2] hover:text-[#121212] transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-[13px] font-sans font-semibold text-[#121212]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.gemstone.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#5A544A] hover:bg-[#E5DED2] hover:text-[#121212] transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="text-[11px] font-sans text-[#B7AEA2] hover:text-[#E57373] transition-colors cursor-pointer mb-6 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear all items</span>
              </button>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#E5DED2] mb-6" />

              {/* Inquiry Form */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <WhatsAppIcon className="w-4 h-4 text-[#B08D57]" />
                  <h3 className="font-serif text-[16px] font-medium text-[#121212]">
                    Your Details
                  </h3>
                </div>
                <p className="text-[12px] font-sans text-[#716B60] mb-4 leading-relaxed">
                  Fill in your details and tap <strong>Send Inquiry on WhatsApp</strong> — all selected stones will be sent together.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className="block text-[12px] font-sans font-medium text-[#292820] mb-1">
                      Your Name <span className="text-[#B08D57]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Enter your full name"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-[13px] bg-white text-[#292820] placeholder-[#B7AEA2] focus:outline-none focus:border-[#B08D57] transition-colors ${
                        errors.name ? 'border-red-400' : 'border-[#E5DED2]'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[12px] font-sans font-medium text-[#292820] mb-1">
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
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-[13px] bg-white text-[#292820] placeholder-[#B7AEA2] focus:outline-none focus:border-[#B08D57] transition-colors ${
                        errors.phone ? 'border-red-400' : 'border-[#E5DED2]'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-[12px] font-sans font-medium text-[#292820] mb-1">
                      Country <span className="text-[#B08D57]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => {
                        setFormData({ ...formData, country: e.target.value });
                        if (errors.country) setErrors({ ...errors, country: '' });
                      }}
                      placeholder="e.g. United States"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-[13px] bg-white text-[#292820] placeholder-[#B7AEA2] focus:outline-none focus:border-[#B08D57] transition-colors ${
                        errors.country ? 'border-red-400' : 'border-[#E5DED2]'
                      }`}
                    />
                    {errors.country && <p className="text-[11px] text-red-500 mt-1">{errors.country}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[12px] font-sans font-medium text-[#292820] mb-1">
                      Additional Message <span className="text-[#716B60] font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any special requirements or questions..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED2] text-[13px] bg-white text-[#292820] placeholder-[#B7AEA2] focus:outline-none focus:border-[#B08D57] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="primary-button w-full justify-center mt-2"
                    style={{ fontSize: '13px', letterSpacing: '1.6px', padding: '0.95em 1.5em' }}
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Send Inquiry on WhatsApp</span>
                  </button>

                  <p className="text-[11px] text-[#B7AEA2] text-center font-sans mt-2">
                    {cartCount} stone{cartCount !== 1 ? 's' : ''} · Details sent directly via WhatsApp
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
