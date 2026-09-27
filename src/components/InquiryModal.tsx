import React, { useState, useEffect } from 'react';
import { X, Send, Check } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { SecondaryButton } from './SecondaryButton';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  getStoneId,
  getWeightDisplay,
  getWhatsAppInquiryUrl,
  getGeneralWhatsAppUrl,
  openExternalLink,
} from '../utils/gemstoneHelpers';

export const InquiryModal: React.FC = () => {
  const { isInquiryOpen, inquiryGemstone, closeInquiry, showNotification, submitInquiry } =
    useEcommerce();

  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Update default message whenever the modal opens or a stone is selected
  useEffect(() => {
    if (inquiryGemstone) {
      const stoneId = getStoneId(inquiryGemstone);
      const weight = getWeightDisplay(inquiryGemstone, false);
      setMessage(
        `Hello Geo Gems Crystals,\n\nI am interested in ${inquiryGemstone.name} (${stoneId}, ${weight}). Please share more details and availability.`
      );
    } else {
      setMessage(
        'Hello Geo Gems Crystals,\n\nI would like to ask about your natural gemstones and crystals.'
      );
    }
  }, [inquiryGemstone, isInquiryOpen]);

  // Handle ESC key to close modal & prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeInquiry();
      }
    };

    if (isInquiryOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInquiryOpen, closeInquiry]);

  if (!isInquiryOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contact.trim() || !message.trim()) {
      showNotification('Please enter your name, contact details, and message.');
      return;
    }

    setIsSubmitting(true);
    const res = await submitInquiry({
      customerName: fullName.trim(),
      contact: contact.trim(),
      message: message.trim(),
      stoneId: inquiryGemstone ? getStoneId(inquiryGemstone) : undefined,
      stoneName: inquiryGemstone ? inquiryGemstone.name : 'General Inquiry',
    });
    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        closeInquiry();
      }, 2400);
    } else {
      showNotification(res.error || 'Could not send inquiry. Please try again.');
    }
  };

  const handleWhatsAppDirect = () => {
    if (inquiryGemstone) {
      const url = getWhatsAppInquiryUrl(inquiryGemstone);
      openExternalLink(url);
    } else {
      openExternalLink(getGeneralWhatsAppUrl());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-[#121212]/70 backdrop-blur-xs transition-opacity"
        onClick={closeInquiry}
        aria-hidden="true"
      />

      <div
        className="min-h-screen px-4 py-8 flex items-center justify-center relative"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeInquiry();
          }
        }}
      >
        <div
          className="relative bg-[#FAF8F3] rounded-2xl max-w-lg w-full shadow-2xl border border-[#E5DED2] p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DED2] mb-5">
            <div>
              <span className="font-eyebrow block mb-1">
                Stone Inquiry
              </span>
              <h2 id="inquiry-modal-title" className="font-serif text-2xl font-medium text-[#121212]">
                {inquiryGemstone ? inquiryGemstone.name : 'Ask About a Stone'}
              </h2>
            </div>
            <button
              onClick={closeInquiry}
              className="p-2 text-[#5A544A] hover:text-[#121212] transition-colors rounded-lg hover:bg-white cursor-pointer"
              aria-label="Close inquiry"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick WhatsApp Handoff Option */}
          <div className="mb-5 p-3.5 bg-white rounded-xl border border-[#E5DED2] flex items-center justify-between gap-3">
            <div className="text-xs text-[#5A544A] leading-relaxed">
              <span className="font-semibold text-[#121212]">Inquire on WhatsApp: </span>
              Message us directly on WhatsApp for quick answers, photos, or videos.
            </div>
            <SecondaryButton
              onClick={handleWhatsAppDirect}
              icon={<WhatsAppIcon className="w-4 h-4 text-white" />}
              text="Inquire"
              title="Inquire on WhatsApp"
              ariaLabel="Inquire on WhatsApp"
            />
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#142318] border border-[#85E0A3]/40 text-[#85E0A3] flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#121212]">Inquiry Sent</h3>
              <p className="font-body-small text-[#5A544A] max-w-sm mx-auto">
                Thank you. We have received your inquiry and will reply to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-spec-label mb-1.5">
                  Your Name <span className="text-[#B08D57]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5DED2] rounded-xl text-xs sm:text-[13.5px] text-[#121212] placeholder-[#716B60] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block font-spec-label mb-1.5">
                  Your Email or Phone Number <span className="text-[#B08D57]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@example.com or +1 555 000 0000"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5DED2] rounded-xl text-xs sm:text-[13.5px] text-[#121212] placeholder-[#716B60] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block font-spec-label mb-1.5">
                  Your Message <span className="text-[#B08D57]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you are looking for"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5DED2] rounded-xl text-xs sm:text-[13.5px] text-[#121212] placeholder-[#716B60] focus:outline-none focus:border-[#B08D57] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={closeInquiry}
                  className="px-4 py-2.5 border border-[#E5DED2] hover:border-[#121212] text-[#5A544A] hover:text-[#121212] text-xs font-btn rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-button flex-1"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>{isSubmitting ? 'Sending…' : 'Send Inquiry'}</span>
                </button>
              </div>

              <p className="text-[11.5px] text-[#5A544A] text-center font-normal pt-1">
                Your contact details are kept private.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
