import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Clock, 
  Camera, 
  Check,
  ChevronDown,
  Info,
  X,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { callXanoEndpoint } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';

const AMENITIES = [
  'Free Wi-Fi', 'Parking', 'Wheelchair Accessible', 'Card Payments', 
  'Pet Friendly', 'Outdoor Seating', 'Reservations', 'Delivery', 
  'Live Music', 'Smoking Area', 'Family Friendly', 'Bar'
];

// These must match the Xano enum values exactly
const CATEGORIES = [
  'Medical Emergency',
  'Instant Loan',
  'Arts & Culture',
  'Restaurants',
  'Health & Beauty',
  'Shopping',
  'Hotels & Travel',
  'Nightlife',
  'Real Estate',
  'Automotive',
  'Services',
  'Bars & Cafes'
];



interface ImageSlot {
  file: File | null;
  preview: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  error: string | null;
}

interface AddBusinessPageProps {
  onBackToDashboard?: () => void;
}

export const AddBusinessPage: React.FC<AddBusinessPageProps> = ({ onBackToDashboard }) => {
  const { user } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [weekdayOpen, setWeekdayOpen] = useState('');
  const [weekdayClose, setWeekdayClose] = useState('');
  const [weekendOpen, setWeekendOpen] = useState('');
  const [weekendClose, setWeekendClose] = useState('');
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  // Yup schema for website validation (optional but must be valid URL if provided)
  const websiteSchema = Yup.string()
    .transform((value) => {
      if (!value) return '';
      // Auto-prepend https:// if missing
      if (!/^https?:\/\//i.test(value)) return `https://${value}`;
      return value;
    })
    .test('is-valid-url', 'Please enter a valid website (e.g. www.mybusiness.com)', (value) => {
      if (!value) return true; // optional
      try {
        const url = new URL(value);
        // Must have a dot in the hostname (e.g. site.com, not just "go")
        return url.hostname.includes('.');
      } catch {
        return false;
      }
    });

  // Image slots (up to 4 images)
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([
    { file: null, preview: null, uploadedUrl: null, isUploading: false, error: null },
    { file: null, preview: null, uploadedUrl: null, isUploading: false, error: null },
    { file: null, preview: null, uploadedUrl: null, isUploading: false, error: null },
    { file: null, preview: null, uploadedUrl: null, isUploading: false, error: null },
  ]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle image selection and upload to Cloudinary
  const handleImageSelect = async (index: number, file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      updateImageSlot(index, { error: 'Please select an image file' });
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      updateImageSlot(index, { error: 'Image must be less than 5MB' });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      updateImageSlot(index, {
        file,
        preview: e.target?.result as string,
        error: null,
        isUploading: true,
        uploadedUrl: null,
      });
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      const url = await uploadToCloudinary(file);
      updateImageSlot(index, { uploadedUrl: url, isUploading: false });
    } catch (err: any) {
      updateImageSlot(index, {
        error: err.message || 'Upload failed',
        isUploading: false,
      });
    }
  };

  const updateImageSlot = (index: number, updates: Partial<ImageSlot>) => {
    setImageSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = { ...newSlots[index], ...updates };
      return newSlots;
    });
  };

  const removeImage = (index: number) => {
    updateImageSlot(index, {
      file: null,
      preview: null,
      uploadedUrl: null,
      isUploading: false,
      error: null,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Validate and submit form
  const handleSubmit = async () => {
    setSubmitError(null);

    // Validation
    if (!name.trim()) { setSubmitError('Business name is required.'); return; }
    if (!category) { setSubmitError('Please select a category.'); return; }
    if (!description.trim()) { setSubmitError('Business description is required.'); return; }
    if (!email.trim()) { setSubmitError('Email address is required.'); return; }
    if (!phoneNumber.trim()) { setSubmitError('Phone number is required.'); return; }
    if (!address.trim()) { setSubmitError('Address is required.'); return; }

    // Validate website with Yup if provided
    setWebsiteError(null);
    let cleanedWebsite = '';
    if (website.trim()) {
      try {
        cleanedWebsite = await websiteSchema.validate(website.trim()) || '';
      } catch (err: any) {
        setWebsiteError(err.message);
        setSubmitError(err.message);
        return;
      }
    }

    // Check images are not still uploading
    const anyUploading = imageSlots.some((s) => s.isUploading);
    if (anyUploading) {
      setSubmitError('Please wait for all images to finish uploading.');
      return;
    }

    // Collect uploaded image URLs (first URL = logo by convention)
    const images = imageSlots
      .map((s) => s.uploadedUrl)
      .filter((url): url is string => !!url);


    try {
      setIsSubmitting(true);

      const payload = {
        name: name.trim(),
        category,
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        address: address.trim(),
        images,
        description: description.trim(),
        website: cleanedWebsite,
        // Array of amenity strings as expected by /business/create
        amenities: selectedAmenities,
        // Hours as a plain key→value object as expected by /business/create
        hours: {
          weekdays_open:  weekdayOpen  || 'N/A',
          weekdays_close: weekdayClose || 'N/A',
          weekends_open:  weekendOpen  || 'N/A',
          weekends_close: weekendClose || 'N/A',
        },
        // LGA left as empty object until backend exposes LGA lookup endpoint
        lga: {},
        // Note: user_id is intentionally omitted — Xano derives it from the auth token
      };

      console.log('[AddBusiness] Submitting payload:', payload);
      await callXanoEndpoint('business/create', 'POST', payload);

      setSubmitSuccess(true);
      // Reset form
      setName('');
      setCategory('');
      setDescription('');
      setEmail('');
      setPhoneNumber('');
      setWebsite('');
      setAddress('');
      setSelectedAmenities([]);
      setWeekdayOpen('');
      setWeekdayClose('');
      setWeekendOpen('');
      setWeekendClose('');
      setImageSlots([
        { file: null, preview: null, uploadedUrl: null, isUploading: false, error: null },
        { file: null, preview: null, uploadedUrl: null, isUploading: false, error: null },
        { file: null, preview: null, uploadedUrl: null, isUploading: false, error: null },
        { file: null, preview: null, uploadedUrl: null, isUploading: false, error: null },
      ]);
    } catch (err: any) {
      console.error('[AddBusiness] Submission failed:', err);
      setSubmitError(err.message || 'Failed to submit your listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* Success Modal */}
      {submitSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSubmitSuccess(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 md:p-16 text-center max-w-lg w-full animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setSubmitSuccess(false)}
              aria-label="Close success notification"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-emerald-600 stroke-[3px]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">Listing Submitted!</h2>
            <p className="text-gray-500 font-medium text-sm mb-8">
              Your business listing has been submitted successfully and is now pending review.
              You will be notified once it is published.
            </p>
            <button
              onClick={() => { setSubmitSuccess(false); onBackToDashboard?.(); }}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Back to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://communitycra.vercel.app/static/media/banner.232e74bf9e2c596c4201.webp" 
            className="w-full h-full object-cover grayscale-[0.3] brightness-50" 
            alt="Lagos Business" 
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            List Your Business
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto">
            Reach thousands of potential customers in the My Lagos Community. 
            Grow your brand with us.
          </p>
        </div>
      </section>

      {/* Form Content */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          
          <div className="p-10 md:p-16 space-y-16">
            
            {/* Global Error */}
            {submitError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-3">
                <Info className="w-5 h-5 flex-shrink-0" />
                {submitError}
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Business Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter your business name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Business Category *</label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      aria-label="Business Category"
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer bg-transparent"
                    >
                      <option value="">Choose a category</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Business Description *</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your business, what makes you unique?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-50 bg-gray-50/30 rounded-xl p-5 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Details */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Contact Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="hello@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="+234..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Website URL (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. www.mybusiness.com"
                    value={website}
                    onChange={(e) => { setWebsite(e.target.value); setWebsiteError(null); }}
                    className={`w-full border-b py-3 text-sm font-bold outline-none transition-all ${
                      websiteError ? 'border-red-400 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'
                    }`}
                  />
                  {websiteError && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">{websiteError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Address / Location *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Victoria Island, Lagos"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all pr-8"
                    />
                    <MapPin className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Media & Graphics */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Camera className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Media & Graphics</h2>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-bold text-gray-400 flex items-center gap-2">
                  <Info className="w-4 h-4" /> 
                  Upload high-quality images to showcase your business (Logo, Interior, Exterior). Max 5MB each.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageSlots.map((slot, index) => (
                    <div key={index} className="relative">
                      {slot.preview ? (
                        <div className="aspect-square rounded-2xl overflow-hidden relative group border border-gray-100">
                          <img
                            src={slot.preview}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Upload overlay */}
                          {slot.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                          )}
                          {/* Success checkmark */}
                          {slot.uploadedUrl && !slot.isUploading && (
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                            </div>
                          )}
                          {/* Remove button */}
                          <button
                            onClick={() => removeImage(index)}
                            aria-label="Remove image"
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all group">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageSelect(index, file);
                              e.target.value = '';
                            }}
                          />
                          <Camera className="w-6 h-6 text-gray-300 group-hover:text-blue-500" />
                          <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-blue-500">
                            {index === 0 ? 'LOGO' : `PHOTO ${index}`}
                          </span>
                        </label>
                      )}
                      {slot.error && (
                        <p className="text-red-500 text-[10px] font-bold mt-1 text-center">{slot.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Amenities & Hours */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Amenities & Extras</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 block mb-6">Select Available Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    {AMENITIES.map(item => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedAmenities.includes(item)}
                            onChange={() => toggleAmenity(item)}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-200 bg-white checked:bg-blue-600 checked:border-blue-600 transition-all" 
                          />
                          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                            <Check className="w-3 h-3 stroke-[4px]" />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Weekday Hours */}
                <div className="pt-8">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 block mb-4">Weekday Hours (Mon – Fri)</label>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400">Opens</label>
                      <input
                        type="text"
                        placeholder="e.g. 8:00 AM"
                        value={weekdayOpen}
                        onChange={(e) => setWeekdayOpen(e.target.value)}
                        className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400">Closes</label>
                      <input
                        type="text"
                        placeholder="e.g. 6:00 PM"
                        value={weekdayClose}
                        onChange={(e) => setWeekdayClose(e.target.value)}
                        className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Weekend Hours */}
                <div className="pt-6">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 block mb-4">Weekend Hours (Sat – Sun)</label>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400">Opens</label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM"
                        value={weekendOpen}
                        onChange={(e) => setWeekendOpen(e.target.value)}
                        className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400">Closes</label>
                      <input
                        type="text"
                        placeholder="e.g. 4:00 PM"
                        value={weekendClose}
                        onChange={(e) => setWeekendClose(e.target.value)}
                        className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-10">
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || imageSlots.some(s => s.isUploading)}
                className="w-full bg-[#ff4500] hover:bg-orange-700 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.25em] shadow-2xl shadow-orange-500/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    SUBMITTING...
                  </>
                ) : imageSlots.some(s => s.isUploading) ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    UPLOADING IMAGES...
                  </>
                ) : (
                  'SUBMIT BUSINESS LISTING'
                )}
              </button>
              <p className="text-center text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest">
                By submitting, you agree to our terms of service and privacy policy.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};