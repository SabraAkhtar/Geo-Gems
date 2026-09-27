import React from 'react';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { SecondaryButton } from './SecondaryButton';

export const NotFoundView: React.FC = () => {
  const { setCurrentView } = useEcommerce();

  return (
    <div className="min-h-[70vh] bg-[#FAF8F3] flex items-center justify-center px-4 py-20 select-none">
      <div className="max-w-lg text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3EFE8] border border-[#B08D57]/40 text-[#B08D57] mx-auto shadow-xs">
          <Compass className="w-8 h-8" />
        </div>

        <div>
          <span className="font-eyebrow">404 — Page Not Found</span>
          <h1 className="font-h1 text-[#121212] mt-2 mb-3">
            Stone Not Found
          </h1>
          <p className="font-body text-[#5A544A] max-w-md mx-auto leading-relaxed">
            This stone may no longer be available, or the page link may have been entered incorrectly.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCurrentView('collection')}
            className="primary-button"
          >
            <span>Explore Collection</span>
          </button>

          <SecondaryButton
            onClick={() => setCurrentView('home')}
            icon={<ArrowLeft className="w-4 h-4 text-white" />}
            text="Home"
            title="Back to Home"
            ariaLabel="Back to Home"
          />
        </div>
      </div>
    </div>
  );
};
