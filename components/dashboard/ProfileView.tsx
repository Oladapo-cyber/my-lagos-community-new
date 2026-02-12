import React, { useState, useRef } from 'react';
import { User, Loader2, DollarSign, Package, Check, AlertCircle, Edit2, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import { callXanoEndpoint } from '../../utils/apiClient';

export const ProfileView = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // View/Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
    phoneNumber: user?.phone || '',
    address: user?.address || '',
    billing_address: {
      country: user?.billingAddress?.country || '',
      state: user?.billingAddress?.state || '',
      city: user?.billingAddress?.city || '',
      postal_code: user?.billingAddress?.postalCode || '',
      address: user?.billingAddress?.address || '',
    },
    shipping_address: {
      country: user?.shippingAddress?.country || '',
      state: user?.shippingAddress?.state || '',
      city: user?.shippingAddress?.city || '',
      postal_code: user?.shippingAddress?.postalCode || '',
      address: user?.shippingAddress?.address || '',
    }
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Hydrate form data from user context
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        phoneNumber: user.phone || '',
        address: user.address || '',
        billing_address: {
          country: user.billingAddress?.country || '',
          state: user.billingAddress?.state || '',
          city: user.billingAddress?.city || '',
          postal_code: user.billingAddress?.postalCode || '',
          address: user.billingAddress?.address || '',
        },
        shipping_address: {
          country: user.shippingAddress?.country || '',
          state: user.shippingAddress?.state || '',
          city: user.shippingAddress?.city || '',
          postal_code: user.shippingAddress?.postalCode || '',
          address: user.shippingAddress?.address || '',
        },
      }));
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'billing_address' | 'shipping_address' | null = null, field: string) => {
    const value = e.target.value;
    setFormData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleFileSelect = (file: File) => {
    setUploadError(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, GIF, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadToCloudinary(file);
      setNewAvatarUrl(url);
    } catch (err: any) {
      console.error('[Profile] Upload error:', err);
      setUploadError('Failed to upload image. Please try again.');
      setAvatarPreview(user?.avatar || null); 
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

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

  const handleSubmit = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        image: newAvatarUrl || user?.avatar || '',
        billing_address: formData.billing_address,
        shipping_address: formData.shipping_address,
      };

      await callXanoEndpoint('profile/edit', 'POST', payload);

      if (user) {
        setUser({
          ...user,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phoneNumber,
          address: payload.address,
          avatar: payload.image,
          billingAddress: {
            country: payload.billing_address.country,
            state: payload.billing_address.state,
            city: payload.billing_address.city,
            postalCode: payload.billing_address.postal_code,
            address: payload.billing_address.address,
          },
          shippingAddress: {
            country: payload.shipping_address.country,
            state: payload.shipping_address.state,
            city: payload.shipping_address.city,
            postalCode: payload.shipping_address.postal_code,
            address: payload.shipping_address.address,
          },
        } as any);
      }

      // Success Sequence
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        setIsEditing(false); // Switch to view mode
      }, 2000);

      setNewAvatarUrl(null);
    } catch (err: any) {
      console.error('Save failed:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Success!</h3>
            <p className="text-gray-500 font-medium">Your profile has been updated.</p>
          </div>
        </div>
      )}

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {statusMessage.text}
        </div>
      )}

      {!isEditing ? (
        // VIEW MODE
        <div className="relative">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900">Profile</h2>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Personal Info */}
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8">Personal Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex justify-center lg:justify-start">
                  {/* Circular Avatar for View Mode */}
                <div className="w-56 h-56 rounded-full border-4 border-white shadow-xl bg-gray-100 overflow-hidden relative flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-24 h-24 text-gray-300" />
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <InputGroup label="First Name" value={user?.firstName} readOnly />
                <InputGroup label="Last Name" value={user?.lastName} readOnly />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputGroup label="Email Address" value={user?.email} readOnly />
              <InputGroup label="Phone Number" value={user?.phone} readOnly />
            </div>
            <InputGroup label="Address" value={user?.address} readOnly fullWidth />
          </div>

          {/* Billing Address */}
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Billing Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <InputGroup label="Country" value={formData.billing_address.country} readOnly />
              <InputGroup label="State" value={formData.billing_address.state} readOnly />
              <InputGroup label="City" value={formData.billing_address.city} readOnly />
              <InputGroup label="Postal Code" value={formData.billing_address.postal_code} readOnly />
            </div>
            <InputGroup label="Address" value={formData.billing_address.address} readOnly fullWidth />
          </div>

          {/* Shipping Address */}
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <InputGroup label="Country" value={formData.shipping_address.country} readOnly />
              <InputGroup label="State" value={formData.shipping_address.state} readOnly />
              <InputGroup label="City" value={formData.shipping_address.city} readOnly />
              <InputGroup label="Postal Code" value={formData.shipping_address.postal_code} readOnly />
            </div>
            <InputGroup label="Address" value={formData.shipping_address.address} readOnly fullWidth />
          </div>
        </div>
      ) : (
        // EDIT MODE
        <div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-extrabold text-gray-900">Edit Profile</h2>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>

          {/* Personal Info */}
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8">Personal Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  aria-label="Upload Profile Picture"
                />
                {/* Rectangular Upload Area for Edit Mode */}
                <div
                  onClick={handleClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed border-blue-600 rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-blue-50/50 transition-colors relative overflow-hidden ${
                    isDragging ? 'bg-blue-50' : ''
                  } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : null}

                  {(!avatarPreview || isUploading) && (
                    <>
                      <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 z-10">
                        {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <ImageIcon className="w-6 h-6 text-white" />}
                      </div>
                      <p className="text-xs font-medium text-gray-500 z-10 relative">
                        <span className="text-blue-600 font-bold underline cursor-pointer">Click</span> to upload profile picture or Drag & drop here
                      </p>
                    </>
                  )}
                  
                  {/* Overlay for uploaded image edit hint */}
                  {avatarPreview && !isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <Edit2 className="w-8 h-8 text-white mb-2" />
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Change Photo</span>
                    </div>
                  )}
                </div>
                {uploadError && (
                  <p className="text-red-500 text-xs font-bold mt-2 text-center">{uploadError}</p>
                )}
              </div>
              <div className="lg:col-span-2 space-y-6">
                <InputGroup label="First Name" value={formData.firstName} onChange={(e) => handleInputChange(e, null, 'firstName')} />
                <InputGroup label="Last Name" value={formData.lastName} onChange={(e) => handleInputChange(e, null, 'lastName')} />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputGroup label="Email Address" value={formData.email} onChange={(e) => handleInputChange(e, null, 'email')} readOnly />
              <InputGroup label="Phone Number" value={formData.phoneNumber} onChange={(e) => handleInputChange(e, null, 'phoneNumber')} />
            </div>
            <InputGroup label="Address" value={formData.address} onChange={(e) => handleInputChange(e, null, 'address')} fullWidth />
          </div>

          {/* Billing Address */}
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Billing Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <InputGroup label="Country" value={formData.billing_address.country} onChange={(e) => handleInputChange(e, 'billing_address', 'country')} placeholder="E.g Nigeria" />
              <InputGroup label="State" value={formData.billing_address.state} onChange={(e) => handleInputChange(e, 'billing_address', 'state')} placeholder="E.g Lagos" />
              <InputGroup label="City" value={formData.billing_address.city} onChange={(e) => handleInputChange(e, 'billing_address', 'city')} placeholder="E.g Ikeja" />
              <InputGroup label="Postal Code" value={formData.billing_address.postal_code} onChange={(e) => handleInputChange(e, 'billing_address', 'postal_code')} placeholder="E.g 100001" />
            </div>
            <InputGroup label="Address" value={formData.billing_address.address} onChange={(e) => handleInputChange(e, 'billing_address', 'address')} fullWidth />
          </div>

          {/* Shipping Address */}
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-8 border-t border-gray-100 pt-12">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <InputGroup label="Country" value={formData.shipping_address.country} onChange={(e) => handleInputChange(e, 'shipping_address', 'country')} placeholder="E.g Nigeria" />
              <InputGroup label="State" value={formData.shipping_address.state} onChange={(e) => handleInputChange(e, 'shipping_address', 'state')} placeholder="E.g Lagos" />
              <InputGroup label="City" value={formData.shipping_address.city} onChange={(e) => handleInputChange(e, 'shipping_address', 'city')} placeholder="E.g Ikeja" />
              <InputGroup label="Postal Code" value={formData.shipping_address.postal_code} onChange={(e) => handleInputChange(e, 'shipping_address', 'postal_code')} placeholder="E.g 100001" />
            </div>
            <InputGroup label="Address" value={formData.shipping_address.address} onChange={(e) => handleInputChange(e, 'shipping_address', 'address')} fullWidth />
          </div>

          <div className="pt-8 flex justify-start">
            <button 
              onClick={handleSubmit}
              disabled={isSaving || isUploading}
              className="px-10 py-4 bg-[#2563eb] text-white rounded-lg text-sm font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, placeholder, fullWidth, value, onChange, readOnly }: { label: string; placeholder?: string; fullWidth?: boolean; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; readOnly?: boolean }) => (
  <div className={`bg-white border border-gray-100 rounded-xl p-6 shadow-sm ${fullWidth ? 'w-full' : ''}`}>
    <label className="block text-sm font-bold text-gray-900 mb-4">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value || ''}
      onChange={onChange}
      readOnly={readOnly}
      aria-label={label}
      // Removed "disabled" gray styling mostly, kept readOnly attribute for functionality
      className={`w-full border-b border-gray-200 py-2 text-sm font-medium outline-none focus:border-blue-600 transition-colors placeholder:text-gray-300 text-gray-900 ${readOnly ? 'cursor-default' : ''}`}
    />
  </div>
);
