
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
import { ListingsPage } from './components/ListingsPage';
import { ListingDetail } from './components/ListingDetail';
import { ContactPage } from './components/ContactPage';
import { EventsPage } from './components/EventsPage';
import { AddBusinessPage } from './components/AddBusinessPage';
import { ShopPage } from './components/ShopPage';
import { ProductDetail } from './components/ProductDetail';
import { EventDetailPage } from './components/EventDetailPage';
import { SelectTicketCategory } from './components/SelectTicketCategory';
import { EventRegistration } from './components/EventRegistration';
import { Checkout } from './components/Checkout';
import { AuthModal } from './components/AuthModal';
import { NotFoundPage } from './components/NotFoundPage';
import { CustomerDashboard } from './components/dashboards/customer/CustomerDashboard';
import { MerchantDashboard } from './components/dashboards/merchant/MerchantDashboard';
import { useAuth } from './context/AuthContext';
import { getDashboardForUser } from './utils/routeGuards';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';

// Wrapper for EventDetailPage to extract URL params
const EventDetailWrapper: React.FC<{ onEventClick: (id: number) => void }> = ({ onEventClick }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  if (!eventId || isNaN(Number(eventId))) {
    return <Navigate to="/events" replace />;
  }
  
  return (
    <EventDetailPage 
      eventId={Number(eventId)} 
      onBack={() => navigate('/events')} 
      onEventClick={onEventClick} 
    />
  );
};

// Wrapper for ListingDetail to extract URL params
const ListingDetailWrapper: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  
  if (!listingId || isNaN(Number(listingId))) {
    return <Navigate to="/listings" replace />;
  }
  
  return (
    <ListingDetail onBack={() => navigate('/listings')} />
  );
};

// Wrapper for ProductDetail to extract URL params
const ProductDetailWrapper: React.FC<{ onProductClick: (id: number) => void }> = ({ onProductClick }) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  if (!productId || isNaN(Number(productId))) {
    return <Navigate to="/shop" replace />;
  }
  
  return (
    <ProductDetail onBack={() => navigate('/shop')} onProductClick={onProductClick} />
  );
};

const App: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');

  const { isLoggedIn, isLoading, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardPath = location.pathname.startsWith('/dashboard');

  const handleListingClick = (id: number) => {
    navigate(`/listings/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventClick = (id: number) => {
    navigate(`/events/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (id: number) => {
    navigate(`/shop/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (view: 'login' | 'signup') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar 
        onProfileClick={() => navigate('/dashboard')}
        onLogoClick={() => navigate('/')}
        onListingsClick={() => navigate('/listings')}
        onContactClick={() => navigate('/contact')}
        onEventsClick={() => navigate('/events')}
        onAddBusinessClick={() => navigate('/add-business')}
        onShopClick={() => navigate('/shop')}
        onLoginClick={() => openAuthModal('login')}
        onSignupClick={() => openAuthModal('signup')}
        isLoggedIn={isLoggedIn}
        onLogoutClick={handleLogout}
      />

      <main className={location.pathname !== '/' ? 'pt-20' : ''}>
        <Routes>
          <Route path="/" element={
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
          } />

          <Route path="/listings" element={<ListingsPage onListingClick={handleListingClick} />} />
          <Route path="/listings/:listingId" element={<ListingDetailWrapper />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/events" element={<EventsPage onEventClick={handleEventClick} />} />
          <Route path="/events/:eventId" element={<EventDetailWrapper onEventClick={handleEventClick} />} />
          <Route path="/events/:eventId/select-ticket" element={<SelectTicketCategory />} />
          <Route path="/events/:eventId/registration" element={<EventRegistration />} />
          <Route path="/events/:eventId/checkout" element={<Checkout />} />
          <Route path="/add-business" element={<AddBusinessPage onBackToDashboard={() => navigate('/dashboard')} />} />
          <Route path="/shop" element={<ShopPage onProductClick={handleProductClick} />} />
          <Route path="/shop/:productId" element={<ProductDetailWrapper onProductClick={handleProductClick} />} />

          {/* Dashboard redirect and role-guarded nested dashboards */}
          <Route path="/dashboard" element={<DashboardRouterRedirect />} />
          <Route path="/dashboard/customer/*" element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard onReturnHome={() => navigate('/')} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/merchant/*" element={
            <ProtectedRoute allowedRole="merchant">
              <MerchantDashboard onReturnHome={() => navigate('/')} />
            </ProtectedRoute>
          } />

          {/* Admin routes removed — admin dashboard is at admin.mylagoscommunity.com */}

          <Route path="/404" element={<NotFoundPage onReturnHome={() => navigate('/')} />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

      <AIChatBot />
      {location.pathname !== '/' && !isDashboardPath && <Footer />}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authModalView} 
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

// Loading spinner shown while auth state is being resolved
const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center h-[calc(100vh-96px)]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading...</p>
    </div>
  </div>
);

// Protects dashboard routes
const ProtectedRoute: React.FC<{ allowedRole: string; children: React.ReactNode }> = ({ allowedRole, children }) => {
  const { isLoggedIn, isLoading, user } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn || user?.role !== allowedRole) return <NotFoundPage onReturnHome={() => navigate('/')} />;
  return <>{children}</>;
};

// Redirects /dashboard to the correct role-specific dashboard
const DashboardRouterRedirect: React.FC = () => {
  const { user, isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  // Admin users are redirected to the separate admin app
  if (isLoggedIn && user?.role === 'admin') {
    // In production, redirect to admin subdomain:
    // window.location.href = 'https://admin.mylagoscommunity.com';
    // For development, redirect to localhost:3001:
    window.location.href = 'http://localhost:3001';
    return <LoadingScreen />;
  }

  const dashboardType = isLoggedIn && user ? getDashboardForUser(user) : null;
  switch (dashboardType) {
    case 'merchant':
      return <Navigate to="/dashboard/merchant" replace />;
    case 'customer':
      return <Navigate to="/dashboard/customer" replace />;
    default:
      return <Navigate to="/404" replace />;
  }
};

export default App;
