
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryStrip } from './components/CategoryStrip';
import { CuriositySection } from './components/CuriositySection';
import { HowItWorks } from './components/HowItWorks';
import { FeaturedSection } from './components/FeaturedSection';
import { PopularLocations } from './components/PopularLocations';
import { Testimonials } from './components/Testimonials';
import { BlogSection } from './components/BlogSection';
import { Footer } from './components/Footer';
import { AIChatBot } from './components/AIChatBot';
import { Dashboard } from './components/Dashboard';
import { ListingsPage } from './components/ListingsPage';
import { ListingDetail } from './components/ListingDetail';
import { ContactPage } from './components/ContactPage';
import { EventsPage } from './components/EventsPage';
import { AddBusinessPage } from './components/AddBusinessPage';
import { ShopPage } from './components/ShopPage';
import { ProductDetail } from './components/ProductDetail';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'listings' | 'listing-detail' | 'contact' | 'events' | 'add-business' | 'shop' | 'product-detail'>('home');
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  
  // Get auth state from context
  const { isLoggedIn, logout } = useAuth();

  const handleListingClick = (id: number) => {
    setSelectedListingId(id);
    setCurrentView('listing-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (view: typeof currentView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (view: 'login' | 'signup') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigateTo('dashboard'); 
  };

  const handleLogout = () => {
    logout();
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar 
        onProfileClick={() => navigateTo('dashboard')} 
        onLogoClick={() => navigateTo('home')} 
        onListingsClick={() => navigateTo('listings')}
        onContactClick={() => navigateTo('contact')}
        onEventsClick={() => navigateTo('events')}
        onAddBusinessClick={() => navigateTo('add-business')}
        onShopClick={() => navigateTo('shop')}
        onLoginClick={() => openAuthModal('login')}
        onSignupClick={() => openAuthModal('signup')}
        isLoggedIn={isLoggedIn}
        onLogoutClick={handleLogout}
      />
      
      <main className={currentView !== 'home' ? 'pt-24' : ''}>
        {currentView === 'home' && (
          <>
            <Hero />
            <CategoryStrip />
            <CuriositySection />
            <HowItWorks />
            <FeaturedSection />
            <PopularLocations onListingClick={handleListingClick} />
            <Testimonials />
            <BlogSection />
            <Footer />
          </>
        )}
        {currentView === 'listings' && (
          <ListingsPage onListingClick={handleListingClick} />
        )}
        {currentView === 'listing-detail' && (
          <ListingDetail onBack={() => navigateTo('listings')} />
        )}
        {currentView === 'contact' && (
          <ContactPage />
        )}
        {currentView === 'events' && (
          <EventsPage />
        )}
        {currentView === 'add-business' && (
          <AddBusinessPage onBackToDashboard={() => navigateTo('dashboard')} />
        )}
        {currentView === 'shop' && (
          <ShopPage onProductClick={handleProductClick} />
        )}
        {currentView === 'product-detail' && (
          <ProductDetail onBack={() => navigateTo('shop')} onProductClick={handleProductClick} />
        )}
        {currentView === 'dashboard' && <Dashboard onReturnHome={() => navigateTo('home')} />}
      </main>

      <AIChatBot />
      {currentView !== 'home' && currentView !== 'dashboard' && <Footer />}

      {/* Auth Modal Popup */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authModalView} 
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;
