import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  MapPin,
  Phone,
  Camera,
  Check,
  ChevronDown,
  Loader2,
  Info,
  X,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { createEvent, getAllLGAs } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import type { LGA, CreateEventPayload } from '../types';

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

const EMPTY_SLOT: ImageSlot = {
  file: null,
  preview: null,
  uploadedUrl: null,
  isUploading: false,
  error: null,
};

interface AddEventPageProps {
  onBackToDashboard?: () => void;
}

export const AddEventPage: React.FC<AddEventPageProps> = ({ onBackToDashboard }) => {
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

  // ── Image slots (up to 3 images) ─────────────────────────────────────────
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([
    { ...EMPTY_SLOT },
    { ...EMPTY_SLOT },
    { ...EMPTY_SLOT },
  ]);

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

  // ── Helpers ────────────────────────────────────────────────────────────────
  const updateImageSlot = (index: number, updates: Partial<ImageSlot>) => {
    setImageSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  // ── Image select & auto-upload ─────────────────────────────────────────────
  const handleImageSelect = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      updateImageSlot(index, { error: 'Please select a valid image file.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      updateImageSlot(index, { error: 'Image must be less than 10 MB.' });
      return;
    }

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

    try {
      const url = await uploadToCloudinary(file);
      updateImageSlot(index, { uploadedUrl: url, isUploading: false });
    } catch (err: any) {
      updateImageSlot(index, {
        error: err.message || 'Upload failed.',
        isUploading: false,
      });
    }
  };

  const removeImage = (index: number) => {
    updateImageSlot(index, { ...EMPTY_SLOT });
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
    if (lgaId === '') { setSubmitError('Please select a location (LGA).'); return; }

    if (imageSlots.some((s) => s.isUploading)) {
      setSubmitError('Please wait for all images to finish uploading.');
      return;
    }

    try {
      setIsSubmitting(true);

      const timestamp = new Date(timeEnd).getTime();
      const images = imageSlots
        .map((s) => s.uploadedUrl)
        .filter((url): url is string => !!url);

      const payload: CreateEventPayload = {
        name: name.trim(),
        category,
        about: about.trim(),
        theme: theme.trim(),
        type: type as 'Physical' | 'Hybrid' | 'Online',
        address: address.trim(),
        time_end: timestamp,
        lga_id: lgaId as number,
        image: images,
        contact_info: {
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          website: website.trim(),
        },
        approved: false,
        status: 'Draft',
        user_id: user?.id ? Number(user.id) : 0,
        tags: [],
        schdule: {
          type: 'point',
          data: { lat: 6.5244, lng: 3.3792 },
          time_end: String(timestamp),
        },
      };

      console.log('[AddEvent] Submitting payload:', payload);
      await createEvent(payload, 'main');

      setSubmitSuccess(true);

      setName(''); setCategory(''); setAbout(''); setTheme(''); setType('');
      setAddress(''); setTimeEnd(''); setEmail(''); setPhoneNumber('');
      setWebsite(''); setLgaId('');
      setImageSlots([{ ...EMPTY_SLOT }, { ...EMPTY_SLOT }, { ...EMPTY_SLOT }]);

      setTimeout(() => { navigate('/events'); }, 2000);
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
    <div className="min-h-screen bg-[#fcfcfc]">

      {/* Success Modal */}
      {submitSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSubmitSuccess(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 md:p-16 text-center max-w-lg w-full">
            <button
              onClick={() => setSubmitSuccess(false)}
              aria-label="Close"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-emerald-600 stroke-[3px]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">Event Submitted!</h2>
            <p className="text-gray-500 font-medium text-sm mb-8">
              Your event has been submitted successfully and is now pending admin approval.
              You will be notified once it is published.
            </p>
            <button
              onClick={() => { setSubmitSuccess(false); onBackToDashboard?.(); navigate('/events'); }}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              View Events <ArrowRight className="w-4 h-4" />
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
            alt="Lagos Events"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            List Your Event
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto">
            Create an event and submit it for admin approval. Once approved, it will appear on our platform.
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
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Event Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Tech Conference 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Category *</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer bg-transparent"
                    >
                      <option value="">Select category</option>
                      {EVENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Event Type *</label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer bg-transparent"
                    >
                      <option value="">Select type</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Event Description *</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your event, what makes it special…"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full border border-gray-50 bg-gray-50/30 rounded-xl p-5 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Event Theme *</label>
                  <input
                    type="text"
                    placeholder="e.g. Innovation, Networking, Entertainment"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Location & Date */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Location & Date</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Event Address *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 123 Main Street, Lagos"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all pr-8"
                    />
                    <MapPin className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Location (LGA) *</label>
                  <div className="relative">
                    <select
                      value={lgaId}
                      onChange={(e) =>
                        setLgaId(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer bg-transparent"
                    >
                      <option value="">Select LGA</option>
                      {lgas.map((lga) => (
                        <option key={lga.id} value={lga.id}>{lga.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Event Date *</label>
                  <input
                    type="date"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact Information */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Email Address *</label>
                  <input
                    type="email"
                    placeholder="contact@event.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+234 123 456 7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Website (Optional)</label>
                  <input
                    type="text"
                    placeholder="www.event.com (optional)"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Event Images */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Camera className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Event Images</h2>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-bold text-gray-400 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Upload high-quality images for your event (Banner, Flyer, Venue). Max 10 MB each.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {imageSlots.map((slot, index) => (
                    <div key={index} className="relative">
                      {slot.preview ? (
                        <div className="aspect-video rounded-2xl overflow-hidden relative group border border-gray-100">
                          <img
                            src={slot.preview}
                            alt={`Event image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {slot.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                          )}
                          {slot.uploadedUrl && !slot.isUploading && (
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                            </div>
                          )}
                          <button
                            onClick={() => removeImage(index)}
                            aria-label="Remove image"
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          {slot.uploadedUrl && !slot.isUploading && (
                            <div className="absolute bottom-2 right-2 bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-black flex items-center gap-1">
                              <Check className="w-3 h-3" /> Uploaded
                            </div>
                          )}
                        </div>
                      ) : (
                        <label className="aspect-video rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all group">
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
                            {index === 0 ? 'BANNER / FLYER' : `PHOTO ${index + 1}`}
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

            {/* Submit Button */}
            <div className="pt-10">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || imageSlots.some((s) => s.isUploading)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.25em] shadow-2xl shadow-blue-500/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    SUBMITTING...
                  </>
                ) : imageSlots.some((s) => s.isUploading) ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    UPLOADING IMAGES...
                  </>
                ) : (
                  'SUBMIT EVENT FOR APPROVAL'
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