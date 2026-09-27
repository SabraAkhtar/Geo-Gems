import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  Instagram,
  Music2,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import {
  BUSINESS_WHATSAPP_NUMBER,
  BUSINESS_WHATSAPP_DISPLAY,
  getGeneralWhatsAppUrl,
  openExternalLink,
  OFFICIAL_INSTAGRAM_URL,
  OFFICIAL_TIKTOK_URL,
} from '../utils/gemstoneHelpers';
import { WhatsAppIcon } from './WhatsAppIcon';
import { EditorialOutlineRing, EditorialSmallDots } from './DecorativeElements';

// Existing local project gemstone photography assets
import whyUsCrystalsImg from '../assets/images/why_us_crystals_1790183910255.jpg';
import magnifierGemImg from '../assets/images/feat_magnifier_gem_1790183949412.jpg';

interface FormState {
  fullName: string;
  email: string;
  whatsappNumber: string;
  inquiryType: string;
  gemstoneInterest: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  inquiryType?: string;
  subject?: string;
  message?: string;
}

export const ContactView: React.FC = () => {
  const { setCurrentView, showNotification, submitInquiry } = useEcommerce();

  // WhatsApp concierge direct link configuration
  const baseWhatsAppUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`;

  // Contact form state
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    whatsappNumber: '',
    inquiryType: 'General Inquiry',
    gemstoneInterest: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedHandled, setSubmittedHandled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const inquiryTypes = [
    'General Inquiry',
    'Stone Availability',
    'Custom Stone Sourcing',
    'Stone Size & Details',
    'Custom Jewelry Setting',
    'Wholesale / Business Inquiry',
    'Order or Shipping Question',
    'Other',
  ];

  const faqs = [
    {
      question: 'Can I ask about a specific gemstone or crystal?',
      answer:
        'Yes. You can contact us with the stone name, Product ID, preferred size, color, or any other details. We will gladly share availability and suitable options.',
    },
    {
      question: 'Can you help find a stone in a specific size or shape?',
      answer:
        'Yes. Share your required dimensions, shape, or stone type through our inquiry form or on WhatsApp, and we will check our available inventory for you.',
    },
    {
      question: 'Can I request additional photos, videos, or stone details?',
      answer:
        'Of course. When you inquire on WhatsApp or through our contact form, you can ask for extra close-up photos, videos, and any available report details for a stone.',
    },
    {
      question: 'How can I contact Geo Gems Crystals directly?',
      answer:
        'You can message us directly on WhatsApp, use the inquiry form on this page, or reach out via email and our social media channels.',
    },
    {
      question: 'Do you help with stones for custom jewelry settings?',
      answer:
        'Yes. If you are looking for a center stone or matching stones for a ring, pendant, or custom jewelry piece, tell us what you have in mind and we will help you find suitable stones.',
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter a valid email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification('Please fill in the required fields before sending.');
      return;
    }

    // Save inquiry to database / Admin Portal
    await submitInquiry({
      customerName: formData.fullName.trim(),
      contact: formData.whatsappNumber.trim()
        ? `${formData.email.trim()} | WhatsApp: ${formData.whatsappNumber.trim()}`
        : formData.email.trim(),
      message: `[${formData.inquiryType}] ${formData.subject.trim()} — ${formData.message.trim()}`,
      stoneName: formData.gemstoneInterest.trim() || formData.inquiryType,
    });

    // Prepare encoded transmission text
    const textLines = [
      `Hello Geo Gems Crystals,`,
      ``,
      `Name: ${formData.fullName.trim()}`,
      `Email: ${formData.email.trim()}`,
      formData.whatsappNumber.trim() ? `Phone / WhatsApp: ${formData.whatsappNumber.trim()}` : null,
      `Inquiry Type: ${formData.inquiryType}`,
      formData.gemstoneInterest.trim() ? `Stone of Interest: ${formData.gemstoneInterest.trim()}` : null,
      `Subject: ${formData.subject.trim()}`,
      ``,
      `Message:`,
      `${formData.message.trim()}`,
    ].filter((line) => line !== null);

    const fullMessageText = textLines.join('\n');
    const waUrl = `${baseWhatsAppUrl}?text=${encodeURIComponent(fullMessageText)}`;

    // Open WhatsApp in a new tab safely
    openExternalLink(waUrl);

    setSubmittedHandled(true);
    showNotification('Inquiry saved and opening WhatsApp with your details.');
  };

  const handleSourcingCtaClick = () => {
    setFormData((prev) => ({ ...prev, inquiryType: 'Custom Stone Sourcing' }));
    const formElement = document.getElementById('inquiry-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-[#FAF8F3] text-[#292820] select-none min-h-screen">
      {/* Subtle Breadcrumb Bar */}
      <div className="border-b border-[#E5DED2]/80 bg-[#F8F5EE]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-3.5 flex items-center gap-2 text-[12px] text-[#5A544A] uppercase tracking-[0.14em]">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#B08D57] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-[#B08D57]/60">/</span>
          <span className="text-[#292820] font-semibold">Contact Us</span>
        </div>
      </div>

      {/* SECTION 01 — CONTACT HERO */}
      <section className="relative py-14 sm:py-20 lg:py-24 bg-[#F8F5EE] border-b border-[#E5DED2]/80 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-24 -right-20 hidden sm:block z-0"
        >
          <EditorialOutlineRing size={320} color="#B7AEA2" opacity={0.12} />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <div className="inline-flex items-center gap-3 mb-3 justify-center">
            <span
              aria-hidden="true"
              className="w-7 h-[1px] bg-[#B08D57] inline-block"
              style={{ opacity: 0.26 }}
            />
            <span className="font-eyebrow">
              Get in Touch
            </span>
            <EditorialSmallDots
              variant="pair-horizontal"
              color="#B7AEA2"
              accentColor="#B08D57"
              opacity={0.28}
            />
          </div>

          <h1 className="font-h1 text-[#121212] mb-4 max-w-2xl mx-auto">
            Contact Us
          </h1>

          <p className="font-hero-subtitle text-[#4A453D] max-w-2xl mx-auto">
            Have a question about a gemstone or crystal, or looking for a specific stone? Send us a
            message below or chat with us directly on WhatsApp.
          </p>
        </div>
      </section>

      {/* SECTION 02 — MAIN CONTACT FORM + CONTACT INFORMATION */}
      <section id="inquiry-form-section" className="py-12 sm:py-16 lg:py-20 bg-[#FAF8F3]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-start">
            
            {/* LEFT COLUMN — CONTACT FORM (58% on Desktop) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E5DED2] shadow-xs">
              <div className="mb-8">
                <span className="font-eyebrow block mb-1">
                  Send a Message
                </span>
                <h2 className="font-h2 text-[#121212] mb-2">
                  Ask About a Stone
                </h2>
                <p className="font-body-small text-[#4A453D]">
                  Share the stone or details you are looking for, and we will get back to you
                  promptly with availability and information.
                </p>
              </div>

              {submittedHandled && (
                <div className="mb-6 p-4 rounded-xl bg-[#F8F5EE] border border-[#B08D57]/40 flex items-start gap-3 text-xs sm:text-[13.5px] text-[#292820]">
                  <Check className="w-4 h-4 text-[#B08D57] mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-[#292820]">
                      Your inquiry details are ready to send on WhatsApp.
                    </p>
                    <p className="text-[#5A544A] font-normal">
                      If WhatsApp did not open automatically, you can also email us at{' '}
                      <a
                        href={`mailto:concierge@geogemscrystals.com?subject=${encodeURIComponent(
                          formData.subject || 'Gemstone Inquiry'
                        )}&body=${encodeURIComponent(formData.message)}`}
                        className="text-[#B08D57] underline hover:text-[#9E7B47]"
                      >
                        concierge@geogemscrystals.com
                      </a>
                      .
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Row 1: Your Name & Your Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-[13px] font-medium text-[#292820] mb-1.5">
                      Your Name <span className="text-[#B08D57]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                      }}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-3 rounded-lg border text-xs sm:text-[13.5px] bg-[#FAF8F3] text-[#292820] placeholder-[#716B60]/60 transition-colors focus:outline-none focus:border-[#B08D57] ${
                        errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-[#E5DED2]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[12px] text-red-600 mt-1 font-normal">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[13px] font-medium text-[#292820] mb-1.5">
                      Your Email <span className="text-[#B08D57]">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-lg border text-xs sm:text-[13.5px] bg-[#FAF8F3] text-[#292820] placeholder-[#716B60]/60 transition-colors focus:outline-none focus:border-[#B08D57] ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#E5DED2]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[12px] text-red-600 mt-1 font-normal">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone Number & Inquiry Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-[13px] font-medium text-[#292820] mb-1.5">
                      Phone Number <span className="text-[#5A544A] font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      placeholder="+1 555 000 0000"
                      className="w-full px-4 py-3 rounded-lg border border-[#E5DED2] text-xs sm:text-[13.5px] bg-[#FAF8F3] text-[#292820] placeholder-[#716B60]/60 transition-colors focus:outline-none focus:border-[#B08D57]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[13px] font-medium text-[#292820] mb-1.5">
                      Inquiry Type <span className="text-[#B08D57]">*</span>
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#E5DED2] text-xs sm:text-[13.5px] bg-[#FAF8F3] text-[#292820] transition-colors focus:outline-none focus:border-[#B08D57] cursor-pointer"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Stone You're Interested In & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-[13px] font-medium text-[#292820] mb-1.5">
                      Stone You&apos;re Interested In{' '}
                      <span className="text-[#5A544A] font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.gemstoneInterest}
                      onChange={(e) => setFormData({ ...formData, gemstoneInterest: e.target.value })}
                      placeholder="e.g. Blue Sapphire, Emerald, Amethyst"
                      className="w-full px-4 py-3 rounded-lg border border-[#E5DED2] text-xs sm:text-[13.5px] bg-[#FAF8F3] text-[#292820] placeholder-[#716B60]/60 transition-colors focus:outline-none focus:border-[#B08D57]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[13px] font-medium text-[#292820] mb-1.5">
                      Subject <span className="text-[#B08D57]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: undefined });
                      }}
                      placeholder="e.g. Question about Oval Emerald"
                      className={`w-full px-4 py-3 rounded-lg border text-xs sm:text-[13.5px] bg-[#FAF8F3] text-[#292820] placeholder-[#716B60]/60 transition-colors focus:outline-none focus:border-[#B08D57] ${
                        errors.subject ? 'border-red-400 bg-red-50/20' : 'border-[#E5DED2]'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-[12px] text-red-600 mt-1 font-normal">{errors.subject}</p>
                    )}
                  </div>
                </div>

                {/* Your Message Field */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-medium text-[#292820] mb-1.5">
                    Your Message <span className="text-[#B08D57]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="Tell us what you are looking for"
                    className={`w-full px-4 py-3 rounded-lg border text-xs sm:text-[13.5px] bg-[#FAF8F3] text-[#292820] placeholder-[#716B60]/60 transition-colors focus:outline-none focus:border-[#B08D57] leading-relaxed resize-y ${
                      errors.message ? 'border-red-400 bg-red-50/20' : 'border-[#E5DED2]'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[12px] text-red-600 mt-1 font-normal">{errors.message}</p>
                  )}
                </div>

                {/* Submit Action & Privacy Reassurance */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="primary-button w-full sm:w-auto min-w-[220px]"
                  >
                    <span>Send Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11.5px] text-[#716B60] font-light mt-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
                    Your inquiry is handled with care.
                  </p>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN — CONTACT INFORMATION (42% on Desktop) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-[11px] font-sans font-semibold tracking-[0.22em] text-[#B08D57] uppercase block mb-1.5">
                  CONTACT DETAILS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#292820] font-normal tracking-tight mb-3">
                  We're Just a Message Away
                </h2>
                <p className="text-xs sm:text-[13.5px] text-[#716B60] font-light leading-relaxed">
                  Whether you're exploring a particular gemstone or have a unique request, we're here
                  to help.
                </p>
              </div>

              {/* Contact Methods List */}
              <div className="space-y-6">
                {/* Method 01: WhatsApp */}
                <div className="p-5 rounded-xl bg-white border border-[#E5DED2] shadow-2xs hover:border-[#B08D57]/60 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#F8F5EE] border border-[#E5DED2] flex items-center justify-center text-[#B08D57] flex-shrink-0">
                      <WhatsAppIcon className="w-4.5 h-4.5 text-[#B08D57]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg text-[#292820] font-normal">
                        WhatsApp ({BUSINESS_WHATSAPP_DISPLAY})
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#5A544A] font-normal leading-relaxed">
                        Message us directly on WhatsApp for stone questions, availability, and photos.
                      </p>
                      <div className="pt-2">
                        <a
                          href={getGeneralWhatsAppUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B08D57] hover:text-[#9E7B47] transition-colors"
                        >
                          <span>Inquire on WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method 02: Email Us */}
                <div className="p-5 rounded-xl bg-white border border-[#E5DED2] shadow-2xs hover:border-[#B08D57]/60 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#F8F5EE] border border-[#E5DED2] flex items-center justify-center text-[#B08D57] flex-shrink-0">
                      <Mail className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-base text-[#292820] font-normal">Email Us</h3>
                      <p className="text-xs text-[#716B60] font-light leading-relaxed">
                        Send us your questions or detailed gemstone requirements.
                      </p>
                      <div className="pt-2">
                        <a
                          href="mailto:concierge@geogemscrystals.com"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B08D57] hover:text-[#9E7B47] transition-colors"
                        >
                          <span>concierge@geogemscrystals.com</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method 03: Social Media */}
                <div className="p-5 rounded-xl bg-white border border-[#E5DED2] shadow-2xs hover:border-[#B08D57]/60 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#F8F5EE] border border-[#E5DED2] flex items-center justify-center text-[#B08D57] flex-shrink-0">
                      <Sparkles className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-base text-[#292820] font-normal">
                        Social Media
                      </h3>
                      <p className="text-xs text-[#716B60] font-light leading-relaxed">
                        Explore our gemstones, latest updates, and brand highlights.
                      </p>
                      <div className="flex items-center gap-4 pt-2 text-xs">
                        <a
                          href={OFFICIAL_INSTAGRAM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#716B60] hover:text-[#292820] transition-colors font-medium"
                        >
                          <Instagram className="w-3.5 h-3.5 text-[#B08D57]" />
                          <span>Instagram</span>
                        </a>
                        <span className="text-[#E5DED2]">•</span>
                        <a
                          href={OFFICIAL_TIKTOK_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#716B60] hover:text-[#292820] transition-colors font-medium"
                        >
                          <Music2 className="w-3.5 h-3.5 text-[#B08D57]" />
                          <span>TikTok</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supporting Card */}
              <div className="rounded-2xl overflow-hidden border border-[#E5DED2] bg-[#F8F5EE] p-5 flex items-center gap-4">
                <img
                  src={magnifierGemImg}
                  alt="Fine gemstone evaluation"
                  className="w-16 h-16 rounded-xl object-cover border border-[#E5DED2] flex-shrink-0"
                />
                <div>
                  <h4 className="font-serif text-base font-medium text-[#292820]">
                    Personal Stone Assistance
                  </h4>
                  <p className="text-[12.5px] text-[#5A544A] font-normal leading-snug mt-1">
                    Every inquiry is answered personally to help you choose the right natural gemstone or crystal.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 03 — CUSTOM GEMSTONE SOURCING CTA */}
      <section className="relative py-16 sm:py-20 bg-[#F3EFE8] border-y border-[#E5DED2] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-24 right-10 hidden sm:block z-0"
        >
          <EditorialOutlineRing size={260} color="#B08D57" opacity={0.11} />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <span className="font-eyebrow block">
                CUSTOM STONE REQUESTS
              </span>
              <h2 className="font-h2 text-[#292820]">
                Looking for Something Specific?
              </h2>
              <p className="font-body-small text-[#4A453D] max-w-2xl">
                Whether you need a calibrated stone size or a special centerpiece gemstone, share
                what you are looking for and we will help you explore suitable options.
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right">
              <button
                onClick={handleSourcingCtaClick}
                className="primary-button"
              >
                <span>Send Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 04 — HOW THE INQUIRY PROCESS WORKS */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF8F3]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="font-eyebrow block mb-2">
              SIMPLE &amp; CLEAR
            </span>
            <h2 className="font-h2 text-[#292820] mb-3">
              How It Works
            </h2>
            <p className="font-body-small text-[#4A453D]">
              A simple, direct way to ask about any stone in our collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 01 */}
            <div className="p-7 rounded-2xl bg-white border border-[#E5DED2] shadow-2xs flex flex-col justify-between">
              <div>
                <span className="font-serif text-2xl font-semibold text-[#B08D57] block mb-4">
                  01
                </span>
                <h3 className="font-serif text-xl text-[#292820] font-normal mb-2.5">
                  Tell Us What You Need
                </h3>
                <p className="text-[14px] text-[#5A544A] font-normal leading-relaxed">
                  Share which gemstone or crystal you are interested in, along with your preferred
                  size, color, or Product ID.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="p-7 rounded-2xl bg-white border border-[#E5DED2] shadow-2xs flex flex-col justify-between">
              <div>
                <span className="font-serif text-2xl font-semibold text-[#B08D57] block mb-4">
                  02
                </span>
                <h3 className="font-serif text-xl text-[#292820] font-normal mb-2.5">
                  Review Stone Details
                </h3>
                <p className="text-[14px] text-[#5A544A] font-normal leading-relaxed">
                  We will share availability, pricing, and any additional photos or videos you need.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="p-7 rounded-2xl bg-white border border-[#E5DED2] shadow-2xs flex flex-col justify-between">
              <div>
                <span className="font-serif text-2xl font-semibold text-[#B08D57] block mb-4">
                  03
                </span>
                <h3 className="font-serif text-xl text-[#292820] font-normal mb-2.5">
                  Complete Your Order
                </h3>
                <p className="text-[14px] text-[#5A544A] font-normal leading-relaxed">
                  Once you have all the information you need, we help you finalize your selection
                  directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05 — FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8F5EE] border-t border-[#E5DED2]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-eyebrow block mb-2">
              HELPFUL ANSWERS
            </span>
            <h2 className="font-h2 text-[#292820] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="font-body-small text-[#4A453D]">
              Common questions about our gemstones, crystals, and inquiry process.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#E5DED2] bg-white overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full px-5 sm:px-6 py-4.5 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-[#FAF8F3]/60 transition-colors"
                  >
                    <span className="font-serif text-lg sm:text-xl text-[#292820] font-normal">
                      {faq.question}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#FAF8F3] border border-[#E5DED2] flex items-center justify-center text-[#B08D57] flex-shrink-0">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-2 text-[14.5px] text-[#4A453D] font-normal leading-relaxed border-t border-[#E5DED2]/40 bg-[#FAF8F3]/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 06 — FINAL WHATSAPP CTA */}
      <section className="py-16 sm:py-20 bg-[#FAF8F3] border-t border-[#E5DED2]">
        <div className="max-w-[700px] mx-auto px-5 sm:px-8 text-center">
          <span className="font-eyebrow block mb-3">
            DIRECT WHATSAPP CHAT
          </span>

          <h2 className="font-h2 text-[#292820] mb-4">
            Prefer to Chat on WhatsApp?
          </h2>

          <p className="font-body-small text-[#4A453D] mb-8 max-w-lg mx-auto">
            Have a quick question about a stone? Message us directly on WhatsApp to start your
            inquiry.
          </p>

          <div>
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
