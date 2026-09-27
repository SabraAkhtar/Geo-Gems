import React, { useEffect } from 'react';
import { EcommerceProvider, useEcommerce } from './context/EcommerceContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { CategorySection } from './components/CategorySection';
import { FeaturedCollections } from './components/FeaturedCollections';
import { ProductGrid } from './components/ProductGrid';
import { InspirationSection } from './components/InspirationSection';
import { WhyUsSection } from './components/WhyUsSection';
import { JewelrySection } from './components/JewelrySection';
import { CollectionPage } from './components/CollectionPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { EducationSection } from './components/EducationSection';
import { LegalPolicyView } from './components/LegalPolicyView';
import { NotFoundView } from './components/NotFoundView';
import { Footer } from './components/Footer';
import { AdminView } from './components/admin/AdminView';

// Modals & Drawers
import { SavedStonesDrawer } from './components/SavedStonesDrawer';
import { SearchModal } from './components/SearchModal';
import { InquiryModal } from './components/InquiryModal';
import { EducationModal } from './components/EducationModal';
import { Sparkles } from 'lucide-react';
import { updatePageSeo } from './utils/seo';

const MainAppContent: React.FC = () => {
  const { currentView, activeGemstone, closeGemstoneDetail, notification, filters } = useEcommerce();

  // Scroll to top & update SEO / OpenGraph / Canonical / Product JSON-LD when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    updatePageSeo(currentView, activeGemstone, filters.selectedCategory, filters.selectedType);
  }, [currentView, activeGemstone, filters.selectedCategory, filters.selectedType]);

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF8F3] text-[#121212] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#121212]">
        <AdminView />

        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-300">
            <div className="bg-[#FAF8F3] text-[#121212] px-4 py-3 rounded-xl shadow-2xl border border-[#B08D57] flex items-center gap-3 text-xs max-w-sm">
              <Sparkles className="w-4 h-4 text-[#B08D57] flex-shrink-0" />
              <p className="font-medium text-[#121212] leading-snug">{notification}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#292820] font-sans antialiased selection:bg-[#B08D57]/20 selection:text-[#121212]">
      {/* Top Refined Header & Brand Navigation */}
      <Navbar />

      {/* Main View Switching */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero />
            <TrustStrip />
            <CategorySection />
            <FeaturedCollections />
            <ProductGrid />
            <InspirationSection />
            <WhyUsSection />
            <JewelrySection />
          </>
        )}

        {(currentView === 'collection' || currentView === 'saved-stones') && <CollectionPage />}
        {currentView === 'stone' && activeGemstone && (
          <ProductDetailPage gemstone={activeGemstone} onBack={closeGemstoneDetail} />
        )}
        {currentView === 'education' && <EducationSection />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'privacy' && <LegalPolicyView mode="privacy" />}
        {currentView === 'terms' && <LegalPolicyView mode="terms" />}
        {currentView === 'not-found' && <NotFoundView />}
      </main>

      {/* Luxury Editorial Footer */}
      <Footer />

      {/* Drawers & Search Modals */}
      <SavedStonesDrawer />
      <SearchModal />
      <InquiryModal />
      <EducationModal />

      {/* Elegant Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-300">
          <div className="bg-[#FAF8F3] text-[#121212] px-4 py-3 rounded-xl shadow-2xl border border-[#B08D57] flex items-center gap-3 text-xs max-w-sm">
            <Sparkles className="w-4 h-4 text-[#B08D57] flex-shrink-0" />
            <p className="font-medium text-[#121212] leading-snug">{notification}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <EcommerceProvider>
      <MainAppContent />
    </EcommerceProvider>
  );
}
