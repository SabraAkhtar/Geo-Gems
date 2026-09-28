import React from 'react';
import { X, Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { SecondaryButton } from './SecondaryButton';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getStoneId, getWeightDisplay, getPriceDisplay, getWhatsAppInquiryUrl } from '../utils/gemstoneHelpers';

export const SavedStonesDrawer: React.FC = () => {
  const {
    isSavedStonesOpen,
    setIsSavedStonesOpen,
    savedStones,
    allProducts,
    toggleSavedStone,
    openGemstoneDetail,
  } = useEcommerce();

  if (!isSavedStonesOpen) return null;

  const savedList = allProducts.filter((p) => savedStones.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-stones-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#121212]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsSavedStonesOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#FAF8F3] border-l border-[#E5DED2] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#E5DED2] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#B08D57]/40 flex items-center justify-center text-[#B08D57]">
                <Bookmark className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 id="saved-stones-title" className="font-serif text-lg font-medium text-[#121212]">
                  Saved Stones
                </h2>
                <p className="text-[11.5px] font-sans text-[#5A544A]">
                  {savedList.length} {savedList.length === 1 ? 'stone' : 'stones'} saved
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSavedStonesOpen(false)}
              className="p-2 text-[#5A544A] hover:text-[#121212] transition-colors rounded-lg hover:bg-[#FAF8F3] cursor-pointer"
              aria-label="Close saved stones drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedList.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Bookmark className="w-12 h-12 text-[#D8CFC2] mx-auto mb-3" />
                <h3 className="font-serif text-xl font-normal text-[#121212] mb-1">
                  No Saved Stones Yet
                </h3>
                <p className="text-xs text-[#5A544A] max-w-[260px] mx-auto leading-relaxed mb-6 font-sans">
                  Save your favorite gemstones and crystals while browsing to compare and inquire anytime.
                </p>
                <button
                  onClick={() => setIsSavedStonesOpen(false)}
                  className="primary-button"
                  style={{ padding: '0.85em 1.8em' }}
                >
                  <span>Explore Collection</span>
                </button>
              </div>
            ) : (
              savedList.map((stone) => {
                const stoneId = getStoneId(stone);
                const weightDisplay = getWeightDisplay(stone, false);
                const priceInfo = getPriceDisplay(stone);
                const whatsappUrl = getWhatsAppInquiryUrl(stone);

                return (
                  <div
                    key={stone.id}
                    className="p-3.5 bg-white rounded-xl border border-[#E5DED2] flex gap-3.5 items-center hover:border-[#B08D57]/50 transition-colors shadow-xs"
                  >
                    <div
                      onClick={() => {
                        openGemstoneDetail(stone);
                        setIsSavedStonesOpen(false);
                      }}
                      className="w-[72px] h-[72px] rounded-lg overflow-hidden bg-[#161514] flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={stone.images[0] || '/stones/ruby.jpg'}
                        alt={stone.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-sans font-semibold tracking-wider text-[#B08D57] uppercase">
                          {stoneId}
                        </span>
                        <button
                          onClick={() => toggleSavedStone(stone.id)}
                          className="text-[#B7AEA2] hover:text-[#A14B38] p-1 transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4
                        onClick={() => {
                          openGemstoneDetail(stone);
                          setIsSavedStonesOpen(false);
                        }}
                        className="font-serif text-[15px] font-medium text-[#121212] truncate cursor-pointer hover:text-[#B08D57] transition-colors"
                      >
                        {stone.name}
                      </h4>

                      <p className="text-[11.5px] font-sans text-[#716B60] mt-0.5">
                        {weightDisplay} • {stone.origin || stone.cut}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-xs font-sans font-semibold text-[#121212]">
                          {priceInfo.label}
                        </span>

                        <SecondaryButton
                          size="sm"
                          href={whatsappUrl}
                          target="_blank"
                          icon={<WhatsAppIcon className="w-4 h-4 text-white" />}
                          text="Inquire"
                          title="Inquire on WhatsApp"
                          ariaLabel="Inquire on WhatsApp"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer CTA */}
          {savedList.length > 0 && (
            <div className="p-6 border-t border-[#E5DED2] bg-white space-y-3">
              <a
                href={getWhatsAppInquiryUrl(savedList[0])}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button w-full"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Inquire on WhatsApp</span>
              </a>
              <p className="text-[11.5px] text-[#5A544A] text-center font-normal">
                Ask about your saved stones directly on WhatsApp
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
