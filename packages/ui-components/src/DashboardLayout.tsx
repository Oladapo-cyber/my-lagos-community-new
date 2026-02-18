import React, { useState, ReactNode } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface DashboardLayoutProps {
  menuItems: { id: string; icon: React.ComponentType<{ className?: string }>; label: string }[];
  basePath: string;
  onReturnHome: () => void;
  children: ReactNode;
  /** Optional role badge displayed at top of sidebar */
  roleBadge?: ReactNode;
  /** User data for header display */
  user?: { firstName?: string; lastName?: string; avatar?: string } | null;
}

/**
 * Shared dashboard layout with sidebar, header, and content area.
 * Reused by CustomerDashboard, MerchantDashboard, and AdminDashboard.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  menuItems,
  basePath,
  onReturnHome,
  children,
  roleBadge,
  user,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derive active tab from current URL path
  const pathSuffix = location.pathname.replace(basePath, '').replace(/^\//, '');
  const activeTab = pathSuffix || 'dashboard';

  // Handle sidebar navigation — update URL
  const handleTabClick = (tabId: string) => {
    const path = tabId === 'dashboard' ? basePath : `${basePath}/${tabId}`;
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Generate initials from user name
  const getInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'User';
    const first = user.firstName?.charAt(0).toUpperCase() + (user.firstName?.slice(1) || '');
    const last = user.lastName?.charAt(0).toUpperCase() + (user.lastName?.slice(1) || '');
    return `${first} ${last}`.trim();
  };

  // Format active tab label for breadcrumb
  const getActiveLabel = () => {
    const item = menuItems.find((m) => m.id === activeTab);
    return item?.label || activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f9fafb] overflow-hidden relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-24 right-6 z-[999] w-10 h-10 bg-gray-100 text-gray-600 rounded-lg shadow-sm flex items-center justify-center active:scale-95 transition-all border border-gray-200"
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-white/40 z-[990] backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-[995] w-72 bg-[#fff] lg:bg-white border-r border-white/5 lg:border-gray-100 flex flex-col pt-6 h-full transition-transform duration-300 transform
        lg:translate-x-0 lg:static 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Optional Role Badge */}
        {roleBadge && (
          <div className="px-6 mb-4">
            {roleBadge}
          </div>
        )}

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 translate-x-1 shadow-sm'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:pl-8'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 relative z-10 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                  }`}
                />
                <span className="text-sm font-bold tracking-tight relative z-10">{item.label}</span>

                {/* Hover indicator for inactive */}
                {!isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Return to Community Button */}
        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onReturnHome();
            }}
            className="w-full bg-[#222] text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            Return to Community
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-[#f9fafb]">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 lg:px-10 lg:pt-6 pb-4 shrink-0 z-10 bg-[#f9fafb]">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{getActiveLabel()}</h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 pr-12 lg:pr-0">
            <span className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">
              Home &gt;&gt; {getActiveLabel()}
            </span>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm self-start">
              <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden relative">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-xs">
                    {getInitials()}
                  </div>
                )}
              </div>
              <span className="text-sm font-bold text-gray-800">{getDisplayName()}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-10 lg:pb-10">{children}</div>
      </div>
    </div>
  );
};
