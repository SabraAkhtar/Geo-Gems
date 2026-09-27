import React from 'react';
import { X, Clock, BookOpen, Share2, Check } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { SecondaryButton } from './SecondaryButton';

export const EducationModal: React.FC = () => {
  const { selectedArticle, closeArticle, showNotification } = useEcommerce();
  const [copied, setCopied] = React.useState(false);

  if (!selectedArticle) return null;

  // ESC key listener & body scroll lock
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeArticle();
    };
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedArticle, closeArticle]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showNotification('Guide link copied to clipboard.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171717]/70 backdrop-blur-sm transition-opacity"
        onClick={closeArticle}
      />

      <div
        className="min-h-screen px-4 py-8 flex items-center justify-center relative"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeArticle();
        }}
      >
        <div
          className="relative bg-[#F7F5F0] rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#DED9CE] z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header image */}
          <div className="relative aspect-[21/9] sm:aspect-[21/8] overflow-hidden bg-[#FAF8F3]">
            <img
              src={selectedArticle.heroImage}
              alt={selectedArticle.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

            {/* Close button */}
            <button
              onClick={closeArticle}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-[#F5F1E9] hover:bg-[#B08D57] hover:text-[#25221D] transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Overlay Title */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-[#B08D57] uppercase mb-1.5">
                <span>{selectedArticle.gemstone} GUIDE</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-normal lowercase">
                  <Clock className="w-3 h-3" />
                  {selectedArticle.readingTime}
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF8F3] font-medium leading-[1.1] tracking-tight">
                {selectedArticle.title}
              </h2>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-6 sm:p-10 max-h-[60vh] overflow-y-auto">
            <p className="font-sans text-[17px] sm:text-[18px] text-[#292820] font-normal mb-8 pb-6 border-b border-[#E5DED2] leading-[1.7] max-reading-article">
              "{selectedArticle.subtitle}"
            </p>

            <div className="space-y-7 max-reading-article">
              {selectedArticle.contentSections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-h3 text-[#121212] mb-2.5">
                    {section.heading}
                  </h3>
                  <p className="font-sans text-[16px] sm:text-[17px] text-[#5A544A] font-normal leading-[1.75]">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Disclaimer & Sharing */}
            <div className="mt-10 pt-6 border-t border-[#E5DED2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-[#716B60] italic">
                Educational reference compiled by GEO GEMS CRYSTALS gemology research team.
              </p>

              <SecondaryButton
                onClick={handleShare}
                icon={copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
                text={copied ? 'Copied' : 'Share'}
                title="Share Article"
                ariaLabel="Share Article"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
