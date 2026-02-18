import React, { useState, useEffect, useRef } from 'react';
import { 
  Utensils, MapPin, Phone, Share2, Heart, MessageSquare, Facebook, Instagram, Twitter,
  ChevronRight, ChevronLeft, Star, Upload, Check, Camera, Loader2, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

interface ClaimBusinessProps {
  onBack: () => void;
}

interface ImageSlot {
  id: string;
  file?: File;
  preview: string;
  uploadedUrl: string | null;
  isUploading: boolean;
  error: string | null;
}

const AMENITIES_LIST = [
  'Card Payment', 'Wheelchair Accessibility', 'Free Parking', 'Science Museum', 
  'Wi-Fi', 'Retail and Dining', 'Group Visits', 'Pet Friendly', 
  'Guided Tours', 'Reservations', 'Free Admission'
];

export const ClaimBusiness: React.FC<ClaimBusinessProps> = ({ onBack }) => {
  const { user } = useAuth();
  const reviewsRef = useRef<HTMLDivElement>(null);

   // Form State
  const [about, setAbout] = useState('');
  const [businessName, setBusinessName] = useState("Oshey's Cafe & Bar"); 
  const [category, setCategory] = useState('Bar & Cafe');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(['Music', 'Bar', 'Cafe']); // Default tags
  const [newTag, setNewTag] = useState('');

  // Social Media State
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: ''
  });
  const [activeSocialInput, setActiveSocialInput] = useState<string | null>(null);

  // Business Hours State
  const [businessHours, setBusinessHours] = useState<{ [key: string]: string }>({
    Monday: '9:00 AM to 5:00 PM',
    Tuesday: '9:00 AM to 5:00 PM',
    Wednesday: '9:00 AM to 5:00 PM',
    Thursday: '9:00 AM to 5:00 PM',
    Friday: '9:00 AM to 5:00 PM',
    Saturday: '10:00 AM to 4:00 PM',
    Sunday: 'Closed'
  });

  // Review Payload State
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRatings, setReviewRatings] = useState({
    Ambience: 0,
    Location: 0,
    Service: 0,
    Price: 0
  });
  
  // New Review States
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [reviewPreview, setReviewPreview] = useState<string | null>(null);
  const [saveReviewInfo, setSaveReviewInfo] = useState(false);

  // Image State (Dynamic)
  const [images, setImages] = useState<ImageSlot[]>([]);
  
  // Carousel State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-scroll carousel
  useEffect(() => {
    if (isPaused || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newSlots: ImageSlot[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file), 
      uploadedUrl: null,
      isUploading: true,
      error: null
    }));

    setImages(prev => [...prev, ...newSlots]);

    for (const slot of newSlots) {
       try {
         const url = await uploadToCloudinary(slot.file!);
         setImages(prev => prev.map(img => img.id === slot.id ? { ...img, uploadedUrl: url, isUploading: false } : img));
       } catch (err: any) {
         setImages(prev => prev.map(img => img.id === slot.id ? { ...img, error: 'Failed', isUploading: false } : img));
       }
    }
  };

  const handleReviewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReviewFile(file);
      setReviewPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
  };

  // Helper to update specific part of the time string
  const handleTimeChange = (day: string, type: 'open' | 'close', newValue: string) => {
    const current = businessHours[day];
    let [open, close] = current.includes(' to ') ? current.split(' to ') : [current, ''];
    
    if (type === 'open') open = newValue;
    else close = newValue;

    // If "Closed" is typed in open, or fields are empty, handle gracefully? 
    // User asked for "to" to be uneditable, implying standard ranges.
    // robust reconstruction:
    setBusinessHours(prev => ({ ...prev, [day]: `${open} to ${close}` }));
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitSafe = async () => {
    setSubmitError(null);
    if (!user) { setSubmitError('You must be logged in.'); return; }
    if (!address || !phone || !email || !about) { setSubmitError('Please fill required fields (Address, Phone, Email, About).'); return; }
    if (images.some(s => s.isUploading)) { setSubmitError('Wait for uploads to finish.'); return; }

    setIsSubmitting(true);
    const uploadedUrls = images.map(s => s.uploadedUrl).filter((url): url is string => !!url);
    
    let reviewImageUrl = "";
    if (reviewFile) {
        try {
            reviewImageUrl = await uploadToCloudinary(reviewFile);
        } catch (e) {
            console.error("Review Image Upload Failed", e);
        }
    }

    const payload = {
        contact_info: { 
            address, 
            phoneNumber: phone, 
            email, 
            website, 
            media: socialLinks 
        },
        about,
        available_amenities: selectedAmenities.join(', '),
        photo_gallery: uploadedUrls,
        price_range: priceRange,
        business_rating: { 
            score_ambience: reviewRatings.Ambience, 
            score_location: reviewRatings.Location, 
            score_service: reviewRatings.Service, 
            score_price: reviewRatings.Price, 
            score_overall: (reviewRatings.Ambience + reviewRatings.Location + reviewRatings.Service + reviewRatings.Price) / 4 
        },
        reviews: { 
            title: reviewTitle, 
            fullName: reviewName, 
            email: reviewEmail, 
            reviews_comments: reviewComment, 
            image: reviewImageUrl, 
            store_data: saveReviewInfo 
        },
        direction: { lattitiude: null, longitude: null },
        user_id: user.id ? Number(user.id) : 0,
        type: user.type || "",
        business_hours: businessHours,
        tags: tags
    };

    try {
        const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:-ZO6mml0/listing_details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to submit');
        }
        setSubmitSuccess(true);
    } catch (e: any) {
        setSubmitError(e.message || 'Network error');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-12 text-center max-w-lg w-full">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8">
                    <Check className="w-10 h-10 text-emerald-600 stroke-[3px]" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Claim Submitted!</h2>
                <button onClick={onBack} title="Back to Listing" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase hover:bg-blue-700 w-full">Back to Listing</button>
            </div>
        </div>
    );
  }

  // Placeholder images for carousel if empty
  const displayImages = images.length > 0 ? images.map(i => i.preview) : [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490474418645-177b35242d5f?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop',
  ];

  return (
    <div className="bg-white min-h-screen">
       {/* Hero Carousel */}
       <div 
         className="relative h-[500px] w-full overflow-hidden bg-gray-900 group"
         onMouseEnter={() => setIsPaused(true)}
         onMouseLeave={() => setIsPaused(false)}
       >
         <div 
           className="flex h-full transition-transform duration-1000 ease-in-out"
           style={{ transform: `translateX(-${currentSlideIndex * (100 / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1))}%)` }}
         >
           {displayImages.map((img, idx) => (
             <div key={idx} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] h-full border-r border-white/10 relative overflow-hidden">
               <img src={img} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Gallery" />
               <div className="absolute inset-0 bg-black/5"></div>
             </div>
           ))}
         </div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 md:p-4 rounded-full transition-all backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % displayImages.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 md:p-4 rounded-full transition-all backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

         {/* Back Button */}
         <button onClick={onBack} title="Back to Listing" className="absolute top-8 left-8 py-3 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-white/10 z-20">
            <ChevronLeft className="w-4 h-4" /> Back to Listing
         </button>

         {/* Upload Overlay Button */}
         <div className="absolute bottom-8 right-8 z-20">
            <label title="Add Photos" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg transition-all">
                <Camera className="w-4 h-4" />
                Add Photos
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
         </div>
       </div>

       <div className="max-w-7xl mx-auto px-6 py-12">
         <div className="flex flex-col lg:flex-row gap-12">
           
           {/* Main Content (Left) */}
           <div className="w-full lg:w-[68%]">

             {/* Mobile Only: Contact Info (Top) */}
             <div className="block lg:hidden bg-[#fcfcfc] border border-gray-100 rounded-2xl p-6 mb-8">
               <h3 className="text-xl font-black text-[#111] mb-8">Contact Information</h3>
               <div className="space-y-8">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Phone</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-transparent text-sm font-black text-[#111] border-b border-gray-200 focus:border-blue-600 outline-none" placeholder="090..." />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent text-sm font-bold text-gray-500 border-b border-gray-200 focus:border-blue-600 outline-none" placeholder="email@..." />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Website</label>
                    <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-transparent text-sm font-bold text-blue-600 border-b border-gray-200 focus:border-blue-600 outline-none" placeholder="www..." />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Address</label>
                    <input value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-transparent text-sm font-bold text-gray-500 border-b border-gray-200 focus:border-blue-600 outline-none" placeholder="Address..." />
                 </div>
                 
                 <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                   <div className="flex items-center gap-4">
                       <button onClick={() => setActiveSocialInput(activeSocialInput === 'facebook' ? null : 'facebook')} title="Facebook" className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${activeSocialInput === 'facebook' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>
                         <Facebook className="w-4 h-4" />
                       </button>
                       <button onClick={() => setActiveSocialInput(activeSocialInput === 'instagram' ? null : 'instagram')} title="Instagram" className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${activeSocialInput === 'instagram' ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-200 text-gray-400 hover:bg-pink-600 hover:text-white hover:border-pink-600'}`}>
                         <Instagram className="w-4 h-4" />
                       </button>
                       <button onClick={() => setActiveSocialInput(activeSocialInput === 'twitter' ? null : 'twitter')} title="Twitter" className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${activeSocialInput === 'twitter' ? 'bg-sky-500 text-white border-sky-500' : 'border-gray-200 text-gray-400 hover:bg-sky-500 hover:text-white hover:border-sky-500'}`}>
                         <Twitter className="w-4 h-4" />
                       </button>
                   </div>
                   
                   {activeSocialInput && (
                       <div className="animate-in fade-in slide-in-from-top-2">
                           <input 
                             type="text" 
                             value={socialLinks[activeSocialInput as keyof typeof socialLinks]} 
                             onChange={e => setSocialLinks(prev => ({ ...prev, [activeSocialInput]: e.target.value }))}
                             className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold outline-none focus:border-blue-600"
                             placeholder={`Enter ${activeSocialInput.charAt(0).toUpperCase() + activeSocialInput.slice(1)} URL`}
                             autoFocus
                           />
                       </div>
                   )}
                 </div>
               </div>
             </div>
              
             {/* Header Info */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                 <div className="w-full">
                   <input 
                      type="text" 
                      value={businessName} 
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="text-5xl font-extrabold text-[#111] mb-6 tracking-tight w-full border-b border-transparent focus:border-gray-200 outline-none bg-transparent placeholder:text-gray-300 break-words whitespace-normal"
                      placeholder="Business Name"
                   />
                   <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                       <Utensils className="w-4 h-4" />
                       {/* Bind Category */}
                       <input 
                          value={category} 
                          onChange={e => setCategory(e.target.value)}
                          className="bg-transparent outline-none border-b border-transparent focus:border-gray-200 w-auto min-w-[100px] placeholder:text-gray-400"
                          placeholder="Category"
                       />
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                       <MapPin className="w-4 h-4 shrink-0" />
                       {/* Display Address (Read-only) */}
                       <span>{address || '1, Real Address, Lagos, Nigeria'}</span>
                     </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                       <Phone className="w-4 h-4 shrink-0" />
                       {/* Display Phone (Read-only) */}
                       <span>{phone || '08012345678'}</span>
                     </div>
                   </div>
                 </div>
               
               <div className="flex items-center gap-8 shrink-0">
                 <button title="Share" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:opacity-70 transition-all">
                   <Share2 className="w-4 h-4" /> share
                 </button>
                 <button title="Save Listing" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 hover:opacity-70 transition-all">
                   <Heart className="w-4 h-4" /> save listing
                 </button>
                 <button onClick={scrollToReviews} title="Leave a Review" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#f59e0b] hover:opacity-70 transition-all">
                   <MessageSquare className="w-4 h-4" /> Leave a Review
                 </button>
               </div>
             </div>

             {/* About Section */}
             <div className="mb-16">
               <h2 className="text-2xl font-black text-[#111] mb-6">About Business</h2>
               <textarea 
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  className="w-full h-40 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-600 outline-none focus:border-blue-600 transition-all resize-none"
                  placeholder="Describe your business here..."
               />
             </div>

             {/* Amenities */}
              <div className="mb-16">
                <h2 className="text-2xl font-black text-[#111] mb-8">Available Amenities</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 md:gap-x-12">
                 {AMENITIES_LIST.map((item, i) => (
                   <label key={i} className="flex items-center gap-4 cursor-pointer group">
                     <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedAmenities.includes(item) ? 'bg-blue-600 border-blue-600' : 'border-gray-200 group-hover:border-blue-400'}`}>
                       {selectedAmenities.includes(item) && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                     </div>
                     <input type="checkbox" className="hidden" checked={selectedAmenities.includes(item)} onChange={() => toggleAmenity(item)} />
                     <span className={`text-xs font-bold transition-colors ${selectedAmenities.includes(item) ? 'text-blue-900' : 'text-gray-600'}`}>{item}</span>
                   </label>
                 ))}
               </div>
             </div>
             
             {/* Tags */}
             <div className="mb-16">
               <h2 className="text-2xl font-black text-[#111] mb-6">Tags</h2>
               <div className="flex flex-wrap gap-4 mb-4">
                 {tags.map((tag) => (
                   <span key={tag} className="bg-gray-100 px-6 py-2 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2">
                     {tag}
                     <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3"/></button>
                   </span>
                 ))}
               </div>
               <input 
                  type="text" 
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={addTag}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold outline-none focus:border-blue-600"
                  placeholder="Add a tag..."
               />
             </div>

             {/* Gallery Grid (Matched to ListingDetail) */}
             {images.length > 0 && (
                <div className="mb-20">
                  <h2 className="text-2xl font-black text-[#111] mb-8">Photo & Video Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Large Left Image */}
                    <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg group relative">
                      <img src={images[0].preview} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Gallery Large" />
                      <button onClick={() => removeImage(images[0].id)} title="Remove Image" className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4"/></button>
                    </div>
                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                      {/* Medium Top Image */}
                      <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-lg group relative bg-gray-100">
                        {images[1] ? (
                            <>
                                <img src={images[1].preview} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Gallery Med" />
                                <button onClick={() => removeImage(images[1].id)} title="Remove Image" className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4"/></button>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs uppercase">No Image</div>
                        )}
                      </div>
                      {/* Two Small Bottom Images */}
                      <div className="grid grid-cols-2 gap-6">
                        {[2, 3].map((idx) => (
                           <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-lg group relative bg-gray-100">
                              {images[idx] ? (
                                <>
                                    <img src={images[idx].preview} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Gallery Small" />
                                    <button onClick={() => removeImage(images[idx].id)} title="Remove Image" className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4"/></button>
                                </>
                              ) : <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs uppercase">No Image</div>}
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
             )}


              {/* Reviews Section */}
              <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-6 md:p-10" ref={reviewsRef}>
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                 
                  {/* Existing Review Placeholder (Mocking design) */}
                  <div className="bg-[#2d2d2d] rounded-2xl p-6 md:p-8 text-white relative">
                   <div className="absolute top-6 left-6 font-serif italic text-2xl opacity-50">Patron's Review</div>
                   <div className="pt-12 space-y-8">
                     <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20">
                         {reviewPreview ? (
                            <img src={reviewPreview} className="w-full h-full object-cover" alt="User Upload" />
                         ) : (
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="User" />
                         )}
                       </div>
                       <div>
                         <div className="font-black">{reviewName || 'Customer Name'}</div>
                         <div className="text-xs text-white/50 font-bold">{reviewEmail || 'customername@sample.com'}</div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {['Ambience', 'Location', 'Service', 'Price'].map(m => (
                          <div key={m} className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/60">
                            <span>{m}</span>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => <Star key={s} className={`w-2.5 h-2.5 ${s <= (reviewRatings[m as keyof typeof reviewRatings] || 4) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-white/20'}`} />)}
                            </div>
                          </div>
                        ))}
                     </div>

                     <p className="text-sm font-medium text-white/70 leading-relaxed italic">
                       "{reviewComment || "Reflecting how reviews will look on your page."}"
                     </p>
                     
                   </div>
                 </div>

                 {/* Write a Review Form */}
                 <div>
                   <h3 className="text-2xl font-black text-[#111] mb-8">Write a Review</h3>
                   
                   {/* Rating Scales Interactive */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-12">
                     {['Ambience', 'Location', 'Service', 'Price'].map((label) => (
                       <div key={label} className="space-y-2">
                         <div className="flex items-center justify-between">
                           <span className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</span>
                           <div className="flex gap-1">
                             {[1,2,3,4,5].map(s => (
                               <Star 
                                 key={s} 
                                 onClick={() => setReviewRatings(prev => ({ ...prev, [label]: s }))}
                                 className={`w-4 h-4 cursor-pointer hover:text-amber-400 ${s <= reviewRatings[label as keyof typeof reviewRatings] ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-200'}`} 
                               />
                             ))}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>

                   <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                     <input 
                        type="text" 
                        placeholder="Review Title" 
                        value={reviewTitle}
                        onChange={e => setReviewTitle(e.target.value)}
                        className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-300" 
                     />
                     <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={reviewName}
                        onChange={e => setReviewName(e.target.value)}
                        className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-300" 
                     />
                     <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={reviewEmail}
                        onChange={e => setReviewEmail(e.target.value)}
                        className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-300" 
                     />
                     
                     <textarea 
                        placeholder="Your Review" 
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl p-5 text-sm font-bold h-32 outline-none focus:border-blue-600 transition-all placeholder:text-gray-300"
                     ></textarea>

                     {/* Upload Area */}
                     <div className="border-2 border-dashed border-blue-600 rounded-xl p-6 flex items-center justify-center gap-4 cursor-pointer hover:bg-blue-50/50 transition-all relative">
                         {reviewPreview ? (
                            <img src={reviewPreview} className="w-16 h-16 object-cover rounded-lg" />
                         ) : (
                            <Upload className="w-6 h-6 text-blue-600" />
                         )}
                         <span className="text-xs font-bold text-gray-500">
                             <span className="text-blue-600 underline">Upload</span> or Drag & Drop images
                         </span>
                         <input type="file" onChange={handleReviewImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                     </div>
                     
                     {/* Save Info Checkbox */}
                     <div className="flex items-center gap-3 py-2">
                       <input 
                         type="checkbox" 
                         id="save-info" 
                         checked={saveReviewInfo}
                         onChange={e => setSaveReviewInfo(e.target.checked)}
                         className="w-4 h-4 rounded text-blue-600 border-gray-200" 
                       />
                       <label htmlFor="save-info" className="text-xs font-bold text-gray-500">Save my name and email for the next time I comment.</label>
                     </div>
                     
                     <button type="button" className="w-full bg-[#111] hover:bg-[#333] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
                       SUBMIT REVIEW
                     </button>
                   </form>
                 </div>

               </div>
             </div>

           </div>

           {/* Mobile Only: Sponsored Ads (After Reviews) */}
           <div className="block lg:hidden mt-8">
               <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
               <h3 className="text-xl font-black text-[#111] mb-8">Sponsored Ads</h3>
               <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer">
                 <div className="relative h-40">
                   <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Ad" />
                   <div className="absolute top-4 -left-8 w-32 py-1 flex items-center justify-center -rotate-45 text-[10px] font-black text-white bg-red-500 uppercase tracking-tighter shadow-sm">CLOSED</div>
                 </div>
                 <div className="p-6">
                   <h4 className="text-lg font-black text-[#111] mb-2">Listing Name</h4>
                   <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
                     Aliquam lorem ante, dapibus in viverra quis, feugiat tellus nulla ut metus varius.
                   </p>
                 </div>
               </div>
             </div>
           </div>


 
           {/* Sidebar (Right) */}
           <aside className="w-full lg:w-[32%] space-y-8">
             
             {/* Contact Information (Desktop Only) */}
             <div className="hidden lg:block bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
               <h3 className="text-xl font-black text-[#111] mb-8">Contact Information</h3>
               <div className="space-y-8">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Phone</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-transparent text-sm font-black text-[#111] border-b border-gray-200 focus:border-blue-600 outline-none" placeholder="090..." />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent text-sm font-bold text-gray-500 border-b border-gray-200 focus:border-blue-600 outline-none" placeholder="email@..." />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Website</label>
                    <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-transparent text-sm font-bold text-blue-600 border-b border-gray-200 focus:border-blue-600 outline-none" placeholder="www..." />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Address</label>
                    <input value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-transparent text-sm font-bold text-gray-500 border-b border-gray-200 focus:border-blue-600 outline-none" placeholder="Address..." />
                 </div>
                 
                 <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                   <div className="flex items-center gap-4">
                       <button onClick={() => setActiveSocialInput(activeSocialInput === 'facebook' ? null : 'facebook')} title="Facebook" className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${activeSocialInput === 'facebook' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>
                         <Facebook className="w-4 h-4" />
                       </button>
                       <button onClick={() => setActiveSocialInput(activeSocialInput === 'instagram' ? null : 'instagram')} title="Instagram" className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${activeSocialInput === 'instagram' ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-200 text-gray-400 hover:bg-pink-600 hover:text-white hover:border-pink-600'}`}>
                         <Instagram className="w-4 h-4" />
                       </button>
                       <button onClick={() => setActiveSocialInput(activeSocialInput === 'twitter' ? null : 'twitter')} title="Twitter" className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${activeSocialInput === 'twitter' ? 'bg-sky-500 text-white border-sky-500' : 'border-gray-200 text-gray-400 hover:bg-sky-500 hover:text-white hover:border-sky-500'}`}>
                         <Twitter className="w-4 h-4" />
                       </button>
                   </div>
                   
                   {activeSocialInput && (
                       <div className="animate-in fade-in slide-in-from-top-2">
                           <input 
                             type="text" 
                             value={socialLinks[activeSocialInput as keyof typeof socialLinks]} 
                             onChange={e => setSocialLinks(prev => ({ ...prev, [activeSocialInput]: e.target.value }))}
                             className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold outline-none focus:border-blue-600"
                             placeholder={`Enter ${activeSocialInput.charAt(0).toUpperCase() + activeSocialInput.slice(1)} URL`}
                             autoFocus
                           />
                       </div>
                   )}
                 </div>
             </div>
           </div>

             {/* Business Hours */}
             <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
               <h3 className="text-xl font-black text-[#111] mb-8">Business Hours</h3>
               <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const [open, close] = businessHours[day].includes(' to ') ? businessHours[day].split(' to ') : [businessHours[day], ''];
                    return (
                       <div key={day} className="flex items-center justify-between text-xs font-bold gap-2">
                         <span className="w-20 text-gray-500">{day}</span>
                         <div className="flex-1 flex items-center gap-2">
                           <input 
                              value={open} 
                              onChange={e => handleTimeChange(day, 'open', e.target.value)}
                              className="w-full bg-transparent text-center text-[#111] border-b border-gray-200 focus:border-blue-600 outline-none" 
                              placeholder="9:00 AM"
                           />
                           <span className="text-gray-400 font-normal">to</span>
                           <input 
                              value={close} 
                              onChange={e => handleTimeChange(day, 'close', e.target.value)}
                              className="w-full bg-transparent text-center text-[#111] border-b border-gray-200 focus:border-blue-600 outline-none" 
                              placeholder="5:00 PM"
                           />
                         </div>
                       </div>
                    );
                  })}
               </div>
             </div>

             {/* Price Range */}
             <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
               <h3 className="text-xl font-black text-[#111] mb-4">Price range</h3>
               <input value={priceRange} onChange={e => setPriceRange(e.target.value)} className="w-full bg-transparent text-sm font-bold text-gray-500 border-b border-gray-200 focus:border-blue-600 outline-none mb-8" placeholder="N5,000 - N25,000" />
               
               <div className="space-y-4">
                 <button onClick={handleSubmitSafe} disabled={isSubmitting} className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2">
                   {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : 'CONTACT THIS BUSINESS'}
                 </button>
                 <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#111] py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all">
                   GET DIRECTION
                 </button>
               </div>
               
               {isSubmitting && <p className="text-blue-600 text-xs font-bold text-center mt-4">Submitting Claim...</p>}
               {submitError && <p className="text-red-500 text-xs font-bold text-center mt-4">{submitError}</p>}
             </div>

             {/* Business Ratings (Mimicked from ListingDetail) */}
             <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10 text-center">
               <h3 className="text-xl font-black text-[#111] mb-8 text-left">Business Ratings</h3>
               <div className="mb-8">
                 <div className="text-5xl font-black text-blue-600 mb-2">
                     {((reviewRatings.Ambience + reviewRatings.Location + reviewRatings.Service + reviewRatings.Price) / 4).toFixed(1)}
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">New</div>
                 <div className="text-xs font-bold text-gray-400">0 Reviews</div>
               </div>
               
               <div className="space-y-6">
                 {[
                   { label: 'Ambience', score: reviewRatings.Ambience * 20 },
                   { label: 'Service', score: reviewRatings.Service * 20 },
                   { label: 'Location', score: reviewRatings.Location * 20 },
                   { label: 'Price', score: reviewRatings.Price * 20 },
                 ].map((metric, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[11px] font-black text-[#111] uppercase tracking-wider">
                       <span>{metric.label}</span>
                       <span>{metric.score}%</span>
                     </div>
                     <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${metric.score}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             
             {/* Sponsored Ad (Desktop Only) */}
             <div className="hidden lg:block bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
               <h3 className="text-xl font-black text-[#111] mb-8">Sponsored Ads</h3>
               <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer">
                 <div className="relative h-40">
                   <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Ad" />
                   <div className="absolute top-4 -left-8 w-32 py-1 flex items-center justify-center -rotate-45 text-[10px] font-black text-white bg-red-500 uppercase tracking-tighter shadow-sm">CLOSED</div>
                 </div>
                 <div className="p-6">
                   <h4 className="text-lg font-black text-[#111] mb-2">Listing Name</h4>
                   <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
                     Aliquam lorem ante, dapibus in viverra quis, feugiat tellus nulla ut metus varius.
                   </p>
                 </div>
               </div>
             </div>

           </aside>

         </div>
       </div>
    </div>
  );
};
