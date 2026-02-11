
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  History, 
  UserCircle, 
  MapPin, 
  Check, 
  Clock, 
  CalendarDays, 
  CalendarClock, 
  Eye, 
  MessageSquare,
  Star,
  User,
  MoreVertical,
  Plus,
  Download,
  Image as ImageIcon,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onReturnHome: () => void;
}

type SubView = 'dashboard' | 'listings' | 'events' | 'orders' | 'profile';

export const Dashboard: React.FC<DashboardProps> = ({ onReturnHome }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SubView>('dashboard');

  const SIDEBAR_ITEMS = [
    { id: 'dashboard' as SubView, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'listings' as SubView, icon: ListTodo, label: 'Manage Listings' },
    { id: 'events' as SubView, icon: Calendar, label: 'Manage Events' },
    { id: 'orders' as SubView, icon: History, label: 'Order History' },
    { id: 'profile' as SubView, icon: UserCircle, label: 'Profile' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <StatsOverview />;
      case 'listings': return <ListingsView />;
      case 'events': return <EventsView />;
      case 'orders': return <OrdersView />;
      case 'profile': return <ProfileView />;
      default: return <StatsOverview />;
    }
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

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f9fafb]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col pt-10 sticky top-16 h-[calc(100vh-64px)]">
        <nav className="flex-1 px-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-lg cursor-pointer transition-all ${
                activeTab === item.id 
                  ? 'bg-gray-50 text-gray-900 shadow-sm border border-gray-100' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-gray-900' : 'text-gray-400'}`} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </div>
          ))}
        </nav>
        
        {/* Return to Community Button */}
        <button 
          onClick={onReturnHome}
          className="mt-auto bg-[#222] text-white py-5 px-6 flex items-center gap-3 font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Return to Community
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {/* Header Area */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{activeTab}</h1>
          
          <div className="flex items-center gap-8">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Home &gt;&gt; {activeTab === 'dashboard' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-xs">
                {getInitials()}
              </div>
              <span className="text-sm font-bold text-gray-800">{getDisplayName()}</span>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

const StatsOverview = () => {
  const STAT_CARDS = [
    { id: 1, value: '10', label: 'Published Listings', color: 'bg-blue-600', icon: (
      <div className="relative"><MapPin className="w-8 h-8" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5"><Check className="w-3 h-3 text-blue-600" /></div></div>
    )},
    { id: 2, value: '5', label: 'Pending Listings', color: 'bg-pink-500', icon: (
      <div className="relative"><MapPin className="w-8 h-8" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5"><Clock className="w-3 h-3 text-pink-500" /></div></div>
    )},
    { id: 3, value: '10', label: 'Published Events', color: 'bg-sky-400', icon: <CalendarDays className="w-8 h-8" /> },
    { id: 4, value: '10', label: 'Pending Events', color: 'bg-orange-500', icon: <CalendarClock className="w-8 h-8" /> },
    { id: 5, value: '5', label: 'Completed Orders', color: 'bg-[#ffb44a]', icon: <div className="border-2 border-white rounded p-0.5"><Check className="w-5 h-5" /></div> },
    { id: 6, value: '5', label: 'Total Views', color: 'bg-emerald-500', icon: <Eye className="w-8 h-8" /> },
    { id: 7, value: '5', label: 'Total Reviews', color: 'bg-purple-600', icon: (
      <div className="relative flex items-center justify-center"><MessageSquare className="w-8 h-8" /><div className="absolute inset-0 flex items-center justify-center pb-1"><Star className="w-3.5 h-3.5 fill-white text-white" /></div></div>
    )},
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {STAT_CARDS.map((card) => (
        <div key={card.id} className={`${card.color} rounded-xl p-8 text-white flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02] cursor-default min-h-[220px]`}>
          <div className="w-16 h-16 rounded-full border border-white/40 flex items-center justify-center mb-6">{card.icon}</div>
          <span className="text-4xl font-extrabold mb-2 tracking-tight">{card.value}</span>
          <span className="text-sm font-bold uppercase tracking-widest opacity-90">{card.label}</span>
        </div>
      ))}
    </div>
  );
};

const ListingsView = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      <input 
        type="text" 
        placeholder="Search listings" 
        className="px-4 py-3 bg-white border border-gray-200 rounded-lg w-full max-w-sm text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">All Listings</button>
        <button className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
          Export CSV
        </button>
        <button className="flex-1 sm:flex-none px-6 py-3 bg-[#2563eb] text-white rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
          ADD LISTING
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
            <th className="px-6 py-4 rounded-tl-lg">Ticket Name</th>
            <th className="px-6 py-4">Ratings</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 rounded-tr-lg w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[1, 2].map((i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-6">
                <div className="font-extrabold text-gray-900">Oshey's Cafe</div>
                <div className="text-xs text-gray-400 font-medium">Landmark Centre, Lagos | +234 801 234 5678</div>
              </td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600">8.5 Superb</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600">Bar & Cafe</td>
              <td className="px-6 py-6">
                <span className={`text-sm font-bold ${i === 2 ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {i === 2 ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-6 py-6"><MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const EventsView = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      <input 
        type="text" 
        placeholder="Search events" 
        className="px-4 py-3 bg-white border border-gray-200 rounded-lg w-full max-w-sm text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">All Events</button>
        <button className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Export CSV</button>
        <button className="px-6 py-3 bg-[#2563eb] text-white rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20">CREATE EVENT</button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
            <th className="px-6 py-4 rounded-tl-lg">Event Name</th>
            <th className="px-6 py-4 text-center">Tickets Sold</th>
            <th className="px-6 py-4 text-center">Gross</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 rounded-tr-lg w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[1, 2].map((i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-6">
                <div className="font-extrabold text-gray-900">Oshey's Cafe</div>
                <div className="text-xs text-gray-400 font-medium">Landmark Centre, Lagos | +234 801 234 5678</div>
              </td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">{i === 1 ? '100' : '230'}</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">{i === 1 ? '10,000' : '8,000'}</td>
              <td className="px-6 py-6">
                <span className={`text-sm font-bold ${i === 2 ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {i === 2 ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-6 py-6"><MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OrdersView = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      <input 
        type="text" 
        placeholder="Search Orders" 
        className="px-4 py-3 bg-white border border-gray-200 rounded-lg w-full max-w-sm text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <button className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">All Orders</button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
            <th className="px-6 py-4 rounded-tl-lg">Item</th>
            <th className="px-6 py-4 text-center">Unit Price</th>
            <th className="px-6 py-4 text-center">Quantity</th>
            <th className="px-6 py-4 text-center">Gross</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 rounded-tr-lg w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[1, 2].map((i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-6 font-extrabold text-gray-900">Product Name</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">500,000</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">x 5</td>
              <td className="px-6 py-6 text-sm font-bold text-gray-600 text-center">120,000,000</td>
              <td className="px-6 py-6">
                <span className={`text-sm font-bold ${i === 1 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {i === 1 ? 'Cancelled' : 'Completed'}
                </span>
              </td>
              <td className="px-6 py-6"><MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ProfileView = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setUploadError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Xano
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const { callXanoEndpoint } = await import('../utils/apiClient');

      // Upload image as form data
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await callXanoEndpoint('upload/attachment', 'POST', formData);
      console.log('[Profile] Upload response:', uploadResponse);

      // Update profile with new avatar URL
      const avatarUrl = uploadResponse?.path || uploadResponse?.url || uploadResponse;
      
      if (avatarUrl && user) {
        // Update user profile on backend
        await callXanoEndpoint('user', 'POST', {
          ...user,
          avatar: avatarUrl,
        });

        // Update local user state
        setUser({ ...user, avatar: typeof avatarUrl === 'string' ? avatarUrl : '' });
      }
    } catch (err: any) {
      console.error('[Profile] Upload error:', err);
      setUploadError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div className="space-y-12">
      {/* Personal Info */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-8">Personal Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-6 text-center group cursor-pointer transition-colors relative overflow-hidden ${
                isDragging
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-blue-600 hover:bg-blue-50/50'
              } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 font-bold text-lg">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
              )}
              {!avatarPreview && (
                <p className="text-xs font-medium text-gray-500">
                  <span className="text-blue-600 font-bold underline">Click</span> to upload profile picture or Drag & drop here
                </p>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                  <span className="text-sm font-bold text-blue-600 animate-pulse">Uploading...</span>
                </div>
              )}
              {avatarPreview && !isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold text-white">Change Photo</span>
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-red-500 text-xs font-bold mt-2">{uploadError}</p>
            )}
          </div>
          <div className="lg:col-span-2 space-y-6">
            <InputGroup label="First Name" value={user?.firstName} />
            <InputGroup label="Last Name" value={user?.lastName} />
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputGroup label="Email Address" value={user?.email} />
          <InputGroup label="Phone Number" value={user?.phone} />
        </div>
        <InputGroup label="Address" value={user?.address} fullWidth />
      </div>

      {/* Billing Address */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Billing Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <InputGroup label="Country" placeholder="E.g Nigeria" />
          <InputGroup label="State" placeholder="E.g Lagos" />
          <InputGroup label="City" placeholder="E.g Ikeja" />
          <InputGroup label="Postal Code" placeholder="E.g 100001" />
        </div>
        <InputGroup label="Address" fullWidth />
      </div>

      {/* Shipping Address */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <InputGroup label="Country" placeholder="E.g Nigeria" />
          <InputGroup label="State" placeholder="E.g Lagos" />
          <InputGroup label="City" placeholder="E.g Ikeja" />
          <InputGroup label="Postal Code" placeholder="E.g 100001" />
        </div>
        <InputGroup label="Address" fullWidth />
      </div>

      <div className="pt-8 flex justify-start">
      <button className="px-10 py-4 bg-[#2563eb] text-white rounded-lg text-sm font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
        SAVE CHANGES
      </button>
    </div>
    </div>
  );
};

const InputGroup = ({ label, placeholder, fullWidth, value }: { label: string; placeholder?: string; fullWidth?: boolean; value?: string }) => (
  <div className={`bg-white border border-gray-100 rounded-xl p-6 shadow-sm ${fullWidth ? 'w-full' : ''}`}>
    <label className="block text-sm font-bold text-gray-900 mb-4">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value || ''}
      readOnly={!!value}
      className="w-full border-b border-gray-200 py-2 text-sm font-medium outline-none focus:border-blue-600 transition-colors placeholder:text-gray-300"
    />
  </div>
);
