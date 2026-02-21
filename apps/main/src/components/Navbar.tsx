import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Heart, User, LogIn, UserPlus, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onProfileClick: () => void;
  onLogoClick: () => void;
  onListingsClick: () => void;
  onContactClick: () => void;
  onEventsClick: () => void;
  onAddBusinessClick: () => void;
  onShopClick: () => void;
  onCartClick: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  isLoggedIn: boolean;
  onLogoutClick: () => void;
}

const BrandLogo = () => (
  <svg width="119" height="51" viewBox="0 0 119 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
    {/* SVG content omitted for brevity in-patch; kept identical to previous implementation in workspace */}
    <path d="M.465 13.576c0-2.315.548-4.123 1.643-5.425 1.095-1.302 2.625-1.953 4.588-1.953.868 0 1.736.186 2.604.558a7.547 7.547 0 0 1 2.356 1.519 6.113 6.113 0 0 1 2.108-1.519 6.276 6.276 0 0 1 2.604-.558c.889 0 1.819.258 2.79.775a7.034 7.034 0 0 1 2.449 2.077 5.09 5.09 0 0 1 .992 3.069v10.819h-4.061V12.243c0-.682-.279-1.25-.837-1.705a2.956 2.956 0 0 0-1.922-.682c-.91 0-1.695.393-2.356 1.178.29.827.434 1.674.434 2.542l-.062 9.393h-3.472v-9.393c0-.785-.186-1.478-.558-2.077a3.483 3.483 0 0 0-1.426-1.364c-.62-.29-1.168-.434-1.643-.434-.992 0-1.705.3-2.139.899-.413.6-.62 1.591-.62 2.976v9.393H.465v-9.393Zm22.766-7.378h3.472v9.393c0 1.199.413 2.15 1.24 2.852.826.682 1.839 1.023 3.038 1.023 1.178 0 2.18-.341 3.007-1.023.826-.703 1.24-1.653 1.24-2.852V6.198H38.7l.062 9.393c0 .744-.104 1.457-.31 2.139l.03-.031.187.341a7.927 7.927 0 0 1 .837 3.534c0 1.343-.32 2.573-.961 3.689a6.622 6.622 0 0 1-2.697 2.635c-1.158.6-2.315.899-3.472.899a7.368 7.368 0 0 1-3.038-.651 7.18 7.18 0 0 1-2.511-1.86l2.759-1.519c.392.33.826.579 1.302.744.496.186.992.279 1.488.279.682 0 1.333-.176 1.953-.527.64-.351 1.116-.806 1.426-1.364.31-.517.465-1.126.465-1.829 0-.31-.031-.6-.093-.868a7.719 7.719 0 0 1-2.387 1.333 8.856 8.856 0 0 1-2.76.434c-1.363 0-2.634-.3-3.812-.899a7.515 7.515 0 0 1-2.852-2.604c-.724-1.137-1.085-2.428-1.085-3.875V6.198ZM50.155.06v22.878h-4.06V.06h4.06Zm14.529 14.477c0-.868-.227-1.674-.682-2.418a5 5 0 0 0-1.767-1.829 4.773 4.773 0 0 0-2.45-.651c-.867 0-1.683.227-2.448.682a4.83 4.83 0 0 0-1.767 1.767c-.455.723-.682 1.54-.682 2.449 0 .868.217 1.684.65 2.449a5.077 5.077 0 0 0 1.799 1.767c.723.455 1.54.682 2.449.682.868 0 1.674-.217 2.418-.651a5.254 5.254 0 0 0 1.829-1.798c.434-.744.65-1.56.65-2.449Zm0 6.82c-1.488 1.054-3.12 1.581-4.898 1.581a8.356 8.356 0 0 1-4.216-1.116 8.407 8.407 0 0 1-3.038-3.1c-.765-1.26-1.147-2.656-1.147-4.185 0-1.509.372-2.904 1.116-4.185a8.574 8.574 0 0 1 3.1-3.1 8.19 8.19 0 0 1 4.185-1.116c1.488 0 2.873.372 4.154 1.116a8.323 8.323 0 0 1 3.1 2.945 7.749 7.749 0 0 1 1.147 4.092l-.031 8.556h-3.472v-1.488Zm4.441-6.758c0-1.509.372-2.904 1.116-4.185a8.406 8.406 0 0 1 3.038-3.1c1.26-.765 2.666-1.147 4.216-1.147a8.19 8.19 0 0 1 4.185 1.116 8.171 8.171 0 0 1 3.1 3.007c.765 1.26 1.147 2.656 1.147 4.185a8.37 8.37 0 0 1-1.085 4.185c.372.95.558 1.922.558 2.914 0 1.343-.32 2.573-.96 3.689a6.623 6.623 0 0 1-2.698 2.635c-1.157.6-2.315.899-3.472.899a7.368 7.368 0 0 1-3.038-.651 7.179 7.179 0 0 1-2.51-1.86l2.758-1.519c.393.33.827.579 1.302.744.496.186.992.279 1.488.279.682 0 1.333-.176 1.953-.527.64-.351 1.116-.806 1.426-1.364.31-.517.465-1.116.465-1.798 0-.248-.01-.403-.03-.465a8.217 8.217 0 0 1-4.527 1.333 8.356 8.356 0 0 1-4.216-1.116 8.479 8.479 0 0 1-3.069-3.038c-.765-1.26-1.147-2.666-1.147-4.216Zm3.503 0c0 .868.217 1.684.651 2.449a5 5 0 0 0 1.83 1.767 4.997 4.997 0 0 0 2.448.651c.868 0 1.674-.217 2.418-.651a4.924 4.924 0 0 0 1.798-1.829 4.997 4.997 0 0 0 .651-2.449c0-.868-.227-1.674-.682-2.418a4.697 4.697 0 0 0-1.798-1.798 4.883 4.883 0 0 0-2.449-.651c-.868 0-1.684.227-2.449.682a4.762 4.762 0 0 0-1.767 1.798 4.883 4.883 0 0 0-.65 2.449Zm22.638 8.37a8.356 8.356 0 0 1-4.216-1.116 8.407 8.407 0 0 1-3.038-3.1c-.764-1.26-1.147-2.656-1.147-4.185 0-1.509.372-2.904 1.116-4.185a8.574 8.574 0 0 1 3.1-3.1 8.189 8.189 0 0 1 4.185-1.116c1.488 0 2.883.382 4.185 1.147a8.404 8.404 0 0 1 3.1 3.038 8.356 8.356 0 0 1 1.116 4.216 8.179 8.179 0 0 1-1.147 4.216 8.237 8.237 0 0 1-3.038 3.038c-1.28.765-2.686 1.147-4.216 1.147Zm0-3.751c.848 0 1.623-.207 2.325-.62a4.503 4.503 0 0 0 1.705-1.705 4.61 4.61 0 0 0 .62-2.325c0-.847-.206-1.622-.62-2.325a4.285 4.285 0 0 0-1.674-1.705 4.668 4.668 0 0 0-2.356-.62c-.847 0-1.632.207-2.356.62-.702.393-1.26.95-1.674 1.674a4.668 4.668 0 0 0-.62 2.356c0 .847.207 1.633.62 2.356.414.703.982 1.26 1.705 1.674a4.61 4.61 0 0 0 2.325.62Zm15.943.248c.992.02 1.725-.072 2.201-.279.475-.227.764-.579.868-1.054.02-.062.031-.165.031-.31 0-.496-.279-.878-.837-1.147-.166-.103-.899-.31-2.201-.62l-1.054-.248c-1.261-.351-2.284-.703-3.069-1.054-.786-.351-1.406-.806-1.86-1.364-.455-.558-.682-1.26-.682-2.108a5.47 5.47 0 0 1 .775-2.852c.516-.868 1.219-1.457 2.108-1.767.744-.269 1.777-.403 3.1-.403 1.591 0 3.482.165 5.673.496l-1.116 3.007-4.433-.403c-1.323-.02-2.077.341-2.263 1.085a1.716 1.716 0 0 0-.031.341c0 .372.32.682.961.93.186.103 1.095.372 2.728.806 1.86.455 3.193.889 3.999 1.302 1.405.785 2.108 1.891 2.108 3.317 0 .351-.052.785-.155 1.302-.352 1.447-1.168 2.542-2.449 3.286-1.261.723-2.956 1.054-5.084.992l-4.867-.496 1.395-3.193 4.154.434Z" fill="#FFBE5B"></path>
    <path d="M.36 39.472a6.34 6.34 0 0 1 .864-3.24 6.637 6.637 0 0 1 2.4-2.4 6.34 6.34 0 0 1 3.24-.864 6.3 6.3 0 0 1 2.856.672A6.723 6.723 0 0 1 12 35.488c.608.8 1.016 1.68 1.224 2.64l-2.832-.024a3.686 3.686 0 0 0-1.368-1.752 3.678 3.678 0 0 0-2.16-.672c-.672 0-1.304.176-1.896.528A3.74 3.74 0 0 0 3.6 37.576a3.488 3.488 0 0 0-.528 1.896c0 .672.168 1.304.504 1.896a3.93 3.93 0 0 0 1.392 1.368c.56.352 1.192.528 1.896.528.8 0 1.52-.224 2.16-.672a3.774 3.774 0 0 0 1.392-1.776h2.808A6.445 6.445 0 0 1 12 43.456a6.49 6.49 0 0 1-2.256 1.848c-.88.448-1.84.672-2.88.672a6.47 6.47 0 0 1-3.264-.864 6.509 6.509 0 0 1-2.352-2.4c-.592-.976-.888-2.056-.888-3.24Zm20.698 6.504a6.47 6.47 0 0 1-3.264-.864 6.509 6.509 0 0 1-2.352-2.4c-.592-.976-.888-2.056-.888-3.24a6.34 6.34 0 0 1 .864-3.24 6.637 6.637 0 0 1 2.4-2.4 6.34 6.34 0 0 1 3.24-.864c1.152 0 2.232.296 3.24.888a6.509 6.509 0 0 1 2.4 2.352 6.47 6.47 0 0 1 .864 3.264 6.335 6.335 0 0 1-.888 3.264 6.379 6.379 0 0 1-2.352 2.352 6.252 6.252 0 0 1-3.264.888Zm0-2.904c.656 0 1.256-.16 1.8-.48.56-.32 1-.76 1.32-1.32.32-.56.48-1.16.48-1.8 0-.656-.16-1.256-.48-1.8-.304-.56-.736-1-1.296-1.32a3.614 3.614 0 0 0-1.824-.48c-.656 0-1.264.16-1.824.48a3.362 3.362 0 0 0-1.296 1.296c-.32.56-.48 1.168-.48 1.824 0 .656.16 1.264.48 1.824.32.544.76.976 1.32 1.296.56.32 1.16.48 1.8.48Zm7.83-4.368c0-1.792.424-3.192 1.272-4.2.848-1.008 2.032-1.512 3.552-1.512.672 0 1.344.144 2.016.432.672.272 1.28.664 1.824 1.176a4.733 4.733 0 0 1 1.632-1.176 4.858 4.858 0 0 1 2.016-.432c.688 0 1.408.2 2.16.6.768.4 1.4.936 1.896 1.608.512.704.768 1.496.768 2.376v8.376H42.88v-8.28c0-.528-.216-.968-.648-1.32a2.289 2.289 0 0 0-1.488-.528c-.704 0-1.312.304-1.824.912.224.64.336 1.296.336 1.968l-.048 7.272H36.52v-7.272c0-.608-.144-1.144-.432-1.608a2.696 2.696 0 0 0-1.104-1.056c-.48-.224-.904-.336-1.272-.336-.768 0-1.32.232-1.656.696-.32.464-.48 1.232-.48 2.304v7.272h-2.688v-7.272Zm18.46 0c0-1.792.424-3.192 1.272-4.2.848-1.008 2.032-1.512 3.552-1.512.672 0 1.344.144 2.016.432.671.272 1.28.664 1.823 1.176a4.733 4.733 0 0 1 1.633-1.176 4.858 4.858 0 0 1 2.016-.432c.688 0 1.408.2 2.16.6.767.4 1.4.936 1.895 1.608.513.704.769 1.496.769 2.376v8.376H61.34v-8.28c0-.528-.217-.968-.649-1.32a2.289 2.289 0 0 0-1.488-.528c-.704 0-1.312.304-1.824.912.224.64.337 1.296.337 1.968l-.049 7.272H54.98v-7.272c0-.608-.143-1.144-.431-1.608a2.696 2.696 0 0 0-1.105-1.056c-.48-.224-.904-.336-1.271-.336-.768 0-1.32.232-1.656.696-.32.464-.480 1.232-.48 2.304v7.272h-2.689v-7.272Zm30.675-5.712.048 7.272c0 1.104-.28 2.096-.84 2.976a5.499 5.499 0 0 1-2.232 2.04 6.713 6.713 0 0 1-2.952.696 6.417 6.417 0 0 1-2.952-.696 5.818 5.818 0 0 1-2.208-2.016c-.56-.88-.84-1.88-.84-3v-7.272h2.688v7.272c0 .928.32 1.664.96 2.208.64.528 1.424.792 2.352.792.912 0 1.688-.264 2.328-.792.64-.544.96-1.28.96-2.208v-7.272h2.688Zm10.656 5.712c0-.928-.32-1.656-.96-2.184-.64-.544-1.416-.816-2.328-.816-.928 0-1.712.272-2.352.816-.64.528-.96 1.256-.96 2.184v7.272h-2.688v-7.272c0-1.12.272-2.112.816-2.976a5.668 5.668 0 0 1 2.256-2.04 6.463 6.463 0 0 1 2.928-.696c1.056 0 2.04.24 2.952.72a5.88 5.88 0 0 1 2.232 1.968c.56.896.84 1.904.84 3.024l-.048 7.272H88.68v-7.272Zm7.47 7.32h-3.144V32.992h3.144v13.032Zm-1.632-14.16c-.496 0-.92-.168-1.272-.504a1.776 1.776 0 0 1-.504-1.272c0-.48.168-.888.504-1.224a1.734 1.734 0 0 1 1.272-.528c.496 0 .912.176 1.248.528.352.336.528.744.528 1.224 0 .496-.176.92-.528 1.272a1.695 1.695 0 0 1-1.248.504Zm3.57-3.456h3.144v3.912h2.88l-.744 2.784h-2.136v10.824h-3.144v-17.52Zm7.339 4.584h2.688v7.272c0 .928.32 1.664.96 2.208.64.528 1.424.792 2.352.792.912 0 1.688-.264 2.328-.792.64-.544.96-1.28.96-2.208v-7.272h2.688l.048 7.272c0 .576-.08 1.128-.24 1.656l.024-.024.144.264c.432.88.648 1.792.648 2.736 0 1.04-.248 1.992-.744 2.856a5.128 5.128 0 0 1-2.088 2.04c-.896.464-1.792.696-2.688.696-.816 0-1.6-.168-2.352-.504a5.559 5.559 0 0 1-1.944-1.44l2.136-1.176c.304.256.64.448 1.008.576.384.144.768.216 1.152.216.528 0 1.032-.136 1.512-.408.496-.272.864-.624 1.104-1.056.24-.4.36-.872.36-1.416 0-.24-.024-.464-.072-.672a5.977 5.977 0 0 1-1.848 1.032c-.688.224-1.4.336-2.136.336a6.417 6.417 0 0 1-2.952-.696 5.818 5.818 0 0 1-2.208-2.016c-.56-.88-.84-1.88-.84-3v-7.272Z" fill="#303030"></path>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ 
  onProfileClick, 
  onLogoClick, 
  onListingsClick, 
  onContactClick, 
  onEventsClick, 
  onAddBusinessClick, 
  onShopClick,
  onCartClick,
  onLoginClick,
  onSignupClick,
  isLoggedIn,
  onLogoutClick
}) => {
  const { cartCount } = useCart();
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAuthMenu(false);
      }
      if (overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
        setShowMobileProfileMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
          !overlayRef.current?.contains(event.target as Node)) {
        setShowMobileMenu(false);
        setShowMobileProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on navigation
  const handleMobileNavClick = (callback: () => void) => {
    callback();
    setShowMobileMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col cursor-pointer flex-shrink-0" onClick={onLogoClick}>
          <BrandLogo />
        </div>

        {/* Desktop Links: Visible on lg and above */}
        <div className="hidden lg:flex items-center space-x-8 font-medium text-sm text-gray-600">
          <a href="#" onClick={(e) => { e.preventDefault(); onLogoClick(); }} className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onListingsClick(); }} className="hover:text-blue-600 transition-colors">Listings</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEventsClick(); }} className="hover:text-blue-600 transition-colors">Events</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onShopClick(); }} className="hover:text-blue-600 transition-colors">Shop</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onContactClick(); }} className="hover:text-blue-600 transition-colors">Contact</a>
        </div>

        {/* Desktop: List Your Business Button */}
        {isLoggedIn && (
          <button 
            onClick={onAddBusinessClick}
            className="hidden lg:block border border-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all whitespace-nowrap"
          >
            LIST YOUR BUSINESS
          </button>
        )}

        {/* Actions: Heart, Bag, Profile (Desktop) + Hamburger (Mobile/Tablet) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
          {/* Heart Icon */}
          <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Heart className="w-6 h-6 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </div>

          {/* Shopping Bag Icon */}
          <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={onCartClick}>
            <ShoppingBag className="w-6 h-6 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </div>

          {/* Desktop Profile Dropdown (Hidden on md and below) */}
          <div className="relative hidden lg:block" ref={menuRef}>
            <div 
              onClick={() => setShowAuthMenu(!showAuthMenu)} 
              className={`cursor-pointer border rounded-full p-1.5 transition-colors ${isLoggedIn ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-blue-500 text-gray-700'}`}
            >
              <User className="w-5 h-5" />
            </div>
            
            {showAuthMenu && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 z-50 overflow-hidden">
                {isLoggedIn ? (
                  <>
                    <button 
                      onClick={() => { setShowAuthMenu(false); onProfileClick(); }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 transition-colors"
                    >
                       <User className="w-4 h-4 text-gray-500" />
                       <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">DASHBOARD</span>
                    </button>
                    
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button 
                      onClick={() => { setShowAuthMenu(false); onLogoutClick(); }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 transition-colors"
                    >
                       <LogIn className="w-4 h-4 text-gray-500" />
                       <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">LOG OUT</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { setShowAuthMenu(false); onLoginClick(); }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 transition-colors"
                    >
                       <LogIn className="w-4 h-4 text-gray-500" />
                       <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">LOG IN</span>
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button 
                      onClick={() => { setShowAuthMenu(false); onSignupClick(); }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 transition-colors"
                    >
                       <UserPlus className="w-4 h-4 text-gray-500" />
                       <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">SIGN UP</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Menu Button (Visible on md and below) */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="w-6 h-6 sm:w-5 sm:h-5" /> : <Menu className="w-6 h-6 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu rendered into document.body to avoid stacking-context issues */}
      {showMobileMenu && typeof document !== 'undefined' && createPortal(
        <>
          <div 
            ref={overlayRef}
            className="lg:hidden fixed inset-0 top-[68px] bg-black/20 backdrop-blur-sm z-[9998] w-[25%] sm:w-[20%] md:w-[15%]"
            onClick={() => {
              setShowMobileMenu(false);
              setShowMobileProfileMenu(false);
            }}
          />

          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed top-[68px] bottom-0 right-0 w-[75%] sm:w-[80%] md:w-[85%] bg-white shadow-lg z-[9999] overflow-y-auto"
          >
            <div className="px-4 py-4">
              <div className="space-y-1 mb-6 pb-6 border-b border-gray-200">
                <a href="#" onClick={(e) => { e.preventDefault(); handleMobileNavClick(onLogoClick); }} className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Home</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleMobileNavClick(onListingsClick); }} className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Listings</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleMobileNavClick(onEventsClick); }} className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Events</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleMobileNavClick(onShopClick); }} className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Shop</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleMobileNavClick(onContactClick); }} className="block px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Contact</a>
              </div>

              {isLoggedIn && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <button onClick={() => handleMobileNavClick(onAddBusinessClick)} className="w-full border border-gray-900 px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all rounded-lg">LIST YOUR BUSINESS</button>
                </div>
              )}

              <div className="space-y-2">
                {isLoggedIn ? (
                  <>
                    <button onClick={() => setShowMobileProfileMenu(!showMobileProfileMenu)} className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg"><User className="w-5 h-5 text-blue-600" /></div>
                        <span>Profile</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showMobileProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showMobileProfileMenu && (
                      <div className="ml-4 space-y-2 pl-4 border-l-2 border-blue-200">
                        <button onClick={() => { setShowMobileProfileMenu(false); handleMobileNavClick(onProfileClick); }} className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"><User className="w-4 h-4" />Dashboard</button>
                        <button onClick={() => { setShowMobileProfileMenu(false); handleMobileNavClick(onLogoutClick); }} className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors"><LogIn className="w-4 h-4" />Log Out</button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={() => handleMobileNavClick(onLoginClick)} className="w-full px-4 py-3 flex items-center gap-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"><div className="p-2 bg-blue-100 rounded-lg"><LogIn className="w-5 h-5 text-blue-600" /></div>Log In</button>
                    <button onClick={() => handleMobileNavClick(onSignupClick)} className="w-full px-4 py-3 flex items-center gap-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"><div className="p-2 bg-blue-100 rounded-lg"><UserPlus className="w-5 h-5 text-blue-600" /></div>Sign Up</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
