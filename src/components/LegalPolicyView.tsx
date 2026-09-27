import React from 'react';
import { ArrowLeft, ShieldCheck, Truck, Lock, Globe } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { BUSINESS_WHATSAPP_DISPLAY, getGeneralWhatsAppUrl } from '../utils/gemstoneHelpers';
import { WhatsAppIcon } from './WhatsAppIcon';

interface LegalPolicyViewProps {
  mode: 'privacy' | 'terms';
}

export const LegalPolicyView: React.FC<LegalPolicyViewProps> = ({ mode }) => {
  const { setCurrentView } = useEcommerce();
  const whatsAppUrl = getGeneralWhatsAppUrl(
    'Hello Geo Gems Crystals,\n\nI have a question regarding shipping and stone inquiries.\n\nThank you.'
  );

  return (
    <div className="py-12 lg:py-20 bg-[#FAF8F3] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#5A544A] hover:text-[#121212] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#B08D57]" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl border border-[#E5DED2] p-8 sm:p-12 shadow-xs space-y-8">
          {/* Tabs to switch between Privacy Policy and Shipping & Delivery */}
          <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-[#E5DED2]">
            <button
              onClick={() => setCurrentView('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                mode === 'privacy'
                  ? 'bg-[#121212] text-[#FAF8F3]'
                  : 'bg-[#FAF8F3] text-[#5A544A] hover:text-[#121212]'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setCurrentView('terms')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                mode === 'terms'
                  ? 'bg-[#121212] text-[#FAF8F3]'
                  : 'bg-[#FAF8F3] text-[#5A544A] hover:text-[#121212]'
              }`}
            >
              Shipping, Delivery &amp; Terms
            </button>
          </div>

          {mode === 'privacy' ? (
            <div className="space-y-6">
              <div>
                <span className="font-eyebrow">Customer Trust &amp; Data Protection</span>
                <h1 className="font-h1 text-[#121212] mt-1">Privacy Policy</h1>
              </div>

              <div className="space-y-4 font-body text-[#292820]">
                <p>
                  At <strong>Geo Gems Crystals</strong>, we respect your privacy and handle all personal
                  contact and stone inquiry details with strict confidentiality.
                </p>

                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E5DED2] flex items-start gap-3.5">
                  <Lock className="w-5 h-5 text-[#B08D57] flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-sans text-sm font-semibold text-[#121212]">
                      What Information We Collect
                    </h2>
                    <p className="font-body-small text-[#5A544A] mt-1">
                      When you submit an inquiry form or message us on WhatsApp, we only receive the
                      details you choose to share—such as your name, email address or phone number, and
                      the stone ID you are asking about.
                    </p>
                  </div>
                </div>

                <h2 className="font-h3 text-[#121212] pt-2">How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-2 font-body-small text-[#5A544A]">
                  <li>To reply to your questions about specific gemstones or crystals.</li>
                  <li>To share additional natural daylight photos, videos, or lab report details.</li>
                  <li>To arrange safe delivery and provide shipment tracking when you purchase a stone.</li>
                </ul>

                <h2 className="font-h3 text-[#121212] pt-2">Zero Third-Party Sharing</h2>
                <p className="font-body-small text-[#5A544A]">
                  We never sell, rent, or share your contact details with third-party marketers. Saved
                  Stones are stored locally in your browser for your convenience.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <span className="font-eyebrow">Worldwide Dispatch &amp; Stone Verification</span>
                <h1 className="font-h1 text-[#121212] mt-1">Shipping, Delivery &amp; Terms</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E5DED2]">
                  <Truck className="w-5 h-5 text-[#B08D57] mb-2" />
                  <h2 className="font-sans text-sm font-semibold text-[#121212]">
                    Protective Packaging &amp; Tracking
                  </h2>
                  <p className="font-body-small text-[#5A544A] mt-1">
                    Every gemstone and crystal is securely packed in a protective parcel box and
                    shipped with full tracking.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E5DED2]">
                  <Globe className="w-5 h-5 text-[#B08D57] mb-2" />
                  <h2 className="font-sans text-sm font-semibold text-[#121212]">
                    International Delivery
                  </h2>
                  <p className="font-body-small text-[#5A544A] mt-1">
                    We ship to collectors and jewelry businesses worldwide. Delivery timelines and
                    shipping costs are confirmed directly before dispatch.
                  </p>
                </div>
              </div>

              <div className="space-y-4 font-body text-[#292820]">
                <h2 className="font-h3 text-[#121212] pt-2">Honest Stone Descriptions</h2>
                <p className="font-body-small text-[#5A544A]">
                  Every stone listed by Geo Gems Crystals is a real, individual stone or crystal. We
                  clearly state the weight in carats (ct) or grams (g), origin when known, and any
                  known treatment. Before finalizing any order, you can request natural-light videos on
                  WhatsApp.
                </p>

                <h2 className="font-h3 text-[#121212] pt-2">Direct Inquiry &amp; Availability</h2>
                <p className="font-body-small text-[#5A544A]">
                  Because natural gemstones and crystals are one-of-a-kind, availability is confirmed
                  directly with our team via WhatsApp ({BUSINESS_WHATSAPP_DISPLAY}) or our inquiry form.
                </p>
              </div>
            </div>
          )}

          {/* Direct WhatsApp Assistance Footer */}
          <div className="pt-6 border-t border-[#E5DED2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-[#5A544A]">
              <ShieldCheck className="w-4 h-4 text-[#B08D57]" />
              <span>Have a question? Message us directly on WhatsApp ({BUSINESS_WHATSAPP_DISPLAY}).</span>
            </div>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button text-white"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
