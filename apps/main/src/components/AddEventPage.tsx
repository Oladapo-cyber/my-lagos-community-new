import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { createEvent, getAllLGAs } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import type { LGA } from '../types';

const EVENT_CATEGORIES = [
  'Business',
  'Gaming',
  'Health & Wellness',
  'Festivals',
  'Music',
  'Food & Drinks',
  'Hackathons',
  'Virtual Events',
  'Fashion Show',
  'Comedy',
  'Sports',
  'Webinar',
  'Religious',
];

const EVENT_TYPES = ['Physical', 'Hybrid', 'Online'];

interface ImageSlot {
  file: File | null;
  preview: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  error: string | null;
}

interface AddEventPageProps {
  onBackToDashboard?: () => void;
}

export const AddEventPage: React.FC<AddEventPageProps> = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Form state ────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [about, setAbout] = useState('');
  const [theme, setTheme] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [lgaId, setLgaId] = useState<number | ''>('');

  // ── LGA list ───────────────────────────────────────────────────────────────
  const [lgas, setLgas] = useState<LGA[]>([]);

  // ── Image slot (event typically has 1 main image) ────────────────────────
  const [imageSlot, setImageSlot] = useState<ImageSlot>({
    file: null,
    preview: null,
    uploadedUrl: null,
    isUploading: false,
    error: null,
  });

  // ── Form state flags ──────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch LGAs on mount
  useEffect(() => {
    getAllLGAs()
      .then((resp) => {
        const raw = resp as unknown;
        const list =
          raw && typeof raw === 'object' && 'items' in (raw as object)
            ? (raw as { items: LGA[] }).items
            : Array.isArray(raw)
            ? (raw as LGA[])
            : [];
        setLgas(list);
      })
      .catch(() => {});
  }, []);

  // ── Image upload handler ───────────────────────────────────────────────────
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageSlot((prev) => ({
        ...prev,
        error: 'Please select a valid image file.',
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageSlot((prev) => ({
        ...prev,
        file,
        preview: evt.target?.result as string,
        error: null,
      }));
    };
    reader.readAsDataURL(file);
  };

  // ── Upload image to Cloudinary ─────────────────────────────────────────────
  const uploadImage = async () => {
    if (!imageSlot.file) return;

    setImageSlot((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      const url = await uploadToCloudinary(imageSlot.file);
      setImageSlot((prev) => ({
        ...prev,
        uploadedUrl: url,
        isUploading: false,
      }));
    } catch (err: any) {
      setImageSlot((prev) => ({
        ...prev,
        isUploading: false,
        error: err.message || 'Failed to upload image.',
      }));
    }
  };

  // ── Clear image ────────────────────────────────────────────────────────────
  const clearImage = () => {
    setImageSlot({
      file: null,
      preview: null,
      uploadedUrl: null,
      isUploading: false,
      error: null,
    });
  };

  // ── Form submission ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitError(null);

    // Validation
    if (!name.trim()) {
      setSubmitError('Event name is required.');
      return;
    }
    if (!category) {
      setSubmitError('Please select a category.');
      return;
    }
    if (!about.trim()) {
      setSubmitError('Event description is required.');
      return;
    }
    if (!theme.trim()) {
      setSubmitError('Event theme is required.');
      return;
    }
    if (!type) {
      setSubmitError('Please select an event type (Physical, Hybrid, or Online).');
      return;
    }
    if (!address.trim()) {
      setSubmitError('Event address is required.');
      return;
    }
    if (!timeEnd.trim()) {
      setSubmitError('Event end date is required.');
      return;
    }
    if (!email.trim()) {
      setSubmitError('Email address is required.');
      return;
    }
    if (!phoneNumber.trim()) {
      setSubmitError('Phone number is required.');
      return;
    }
    if (lgaId === '') {
      setSubmitError('Please select a location (LGA).');
      return;
    }

    // Check if image is still uploading
    if (imageSlot.isUploading) {
      setSubmitError('Please wait for the image to finish uploading.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Build payload
      const payload = {
        name: name.trim(),
        category,
        about: about.trim(),
        theme: theme.trim(),
        type: type as 'Physical' | 'Hybrid' | 'Online',
        address: address.trim(),
        time_end: timeEnd,
        lga_id: lgaId as number,
        image: imageSlot.uploadedUrl ? [imageSlot.uploadedUrl] : [],
        contact_info: {
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          website: website.trim(),
        },
        approved: false,
        status: 'Pending',
        user_id: user?.id ? Number(user.id) : 0,
        tags: [],
        schdule: {}, // Note: Xano has typo "schdule"
      };

      console.log('[AddEvent] Submitting payload:', payload);
      await createEvent(payload, 'main');

      setSubmitSuccess(true);

      // Reset form
      setName('');
      setCategory('');
      setAbout('');
      setTheme('');
      setType('');
      setAddress('');
      setTimeEnd('');
      setEmail('');
      setPhoneNumber('');
      setWebsite('');
      setLgaId('');
      clearImage();

      // Redirect to events page after 2 seconds
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err: any) {
      console.error('[AddEvent] Submission failed:', err);
      setSubmitError(
        err.message || 'Failed to submit your event. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-extrabold text-gray-900">List Your Event</h1>
          </div>
          <p className="text-gray-600 font-medium mt-2">
            Create an event and submit it for admin approval. Once approved, it will appear on our platform.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-4">
            <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Event submitted successfully!</p>
              <p className="text-sm text-emerald-700 mt-1">
                Your event is pending admin approval. Redirecting to events page…
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{submitError}</p>
            </div>
          </div>
        )}

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Basic Information */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tech Conference 2026"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category & Type (Side by side) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {EVENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Event Description *
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us about your event, what makes it special…"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Event Theme *
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Innovation, Networking, Entertainment"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Location & Date */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location & Date
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Event Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Main Street, Lagos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* LGA & End Date (Side by side) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Location (LGA) *
                  </label>
                  <div className="relative">
                    <select
                      value={lgaId}
                      onChange={(e) =>
                        setLgaId(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select LGA</option>
                      {lgas.map((lga) => (
                        <option key={lga.id} value={lga.id}>
                          {lga.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@event.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+234 123 456 7890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.event.com (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Event Image */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Event Image
            </h2>

            <div className="space-y-4">
              {/* Image Preview */}
              {(imageSlot.preview || imageSlot.uploadedUrl) && (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageSlot.preview || imageSlot.uploadedUrl!}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                  {!imageSlot.uploadedUrl && (
                    <div className="absolute inset-0 bg-black/10" />
                  )}
                  <button
                    type="button"
                    onClick={clearImage}
                    disabled={imageSlot.isUploading}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {imageSlot.uploadedUrl && (
                    <div className="absolute bottom-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Uploaded
                    </div>
                  )}
                </div>
              )}

              {/* Upload Area */}
              {!imageSlot.uploadedUrl && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700 mb-1">
                    Upload event banner or image
                  </p>
                  <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 10MB</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm cursor-pointer transition-colors">
                      Choose Image
                    </span>
                  </label>
                </div>
              )}

              {/* Error */}
              {imageSlot.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {imageSlot.error}
                </div>
              )}

              {/* Upload Button */}
              {imageSlot.preview && !imageSlot.uploadedUrl && (
                <button
                  type="button"
                  onClick={uploadImage}
                  disabled={imageSlot.isUploading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {imageSlot.isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    'Upload Image'
                  )}
                </button>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || submitSuccess}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-bold text-lg rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 mb-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting…
              </>
            ) : submitSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Event Submitted!
              </>
            ) : (
              'Submit Event for Approval'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
