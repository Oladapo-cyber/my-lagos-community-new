import type React from 'react';

// ============================
// Role & Auth Types
// ============================

// Backend Xano user types (as stored in user table)
export type BackendUserType = 'User' | 'Admin' | 'Merchant';

// Frontend role types (used throughout the app)
export type UserRole = 'customer' | 'merchant' | 'admin';

/**
 * Map backend user type enum to frontend role
 */
export const mapBackendUserTypeToRole = (backendType: string | undefined): UserRole => {
  if (!backendType) return 'customer';
  
  switch (backendType) {
    case 'Admin':
      return 'admin';
    case 'Merchant':
      return 'merchant';
    case 'User':
    default:
      return 'customer';
  }
};

/**
 * Map frontend role to backend user type enum (for signup/updates)
 */
export const mapRoleToBackendUserType = (role: UserRole): BackendUserType => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'merchant':
      return 'Merchant';
    case 'customer':
    default:
      return 'User';
  }
};

export type MerchantStatus = 'pending' | 'approved' | 'rejected';

export interface UserAddress {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  address?: string;
}

export interface MerchantProfile {
  id?: string;
  businessName: string;
  businessCategory: string;
  businessDescription?: string;
  status: MerchantStatus;
  approvedAt?: string;
  createdAt?: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  role: UserRole;
  type?: BackendUserType;
  merchantProfile?: MerchantProfile;
  billingAddress?: UserAddress;
  shippingAddress?: UserAddress;
}

// ============================
// Dashboard Types
// ============================

export interface MenuItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface StatCard {
  id: number;
  value: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

// ============================
// Business / Listing Types
// ============================

export interface Listing {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  status: 'draft' | 'published' | 'pending';
  category: string;
  rating: number;
  image: string;
  merchantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  image: string;
  ticketsSold?: number;
  status: 'draft' | 'published' | 'pending';
  merchantId?: string;
}

export interface Order {
  id: string;
  item: string;
  unitPrice: number;
  quantity: number;
  gross: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  merchantId?: string;
  customerId?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  merchantId: string;
  customerId: string;
  customerName: string;
  rating: number;
  text: string;
  createdAt: string;
}

// ============================
// Admin Analytics Types
// ============================

export interface PlatformStats {
  totalRevenue: number;
  activeUsers: number;
  activeMerchants: number;
  totalOrders: number;
  pendingMerchants: number;
  totalListings: number;
  totalEvents: number;
  platformHealth: number; // 0-100
}

export interface FraudAlert {
  id: string;
  alertType: 'suspicious_login' | 'chargeback' | 'unusual_activity' | 'account_takeover';
  userId: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  resolved: boolean;
}

// ============================
// Xano Business API Types
// ============================

/**
 * A business listing as returned by the Xano business/all endpoint.
 * Maps 1-to-1 with the items[] array in BusinessListResponse.
 */
export interface Business {
  id: number;
  /** Unix timestamp in milliseconds */
  created_at: number;
  user_id: number;
  name: string;
  category: string;
  description: string;
  email: string;
  phoneNumber: string;
  website: string;
  address: string;
  /** Array of Cloudinary image URLs; first image is treated as the primary thumbnail */
  images: string[];
  amenities: string[];
  /** Opening/closing hours keyed by day name, e.g. { "Monday": "9am–5pm" } */
  hours: Record<string, string> | null;
  approved: boolean;
  lga_id: number;
  /** Open status string set by the business owner, e.g. "Open", "Closed" */
  status: string;
}

/**
 * Paginated wrapper returned by POST /business/all.
 */
export interface BusinessListResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  items: Business[];
}

/**
 * POST body accepted by /business/all.
 * All fields are optional — omit any you don't need to filter on.
 */
export interface GetAllBusinessesParams {
  lga_id?: number;
  /** Filter by open/closed status string */
  status?: string;
  /** Filter by approval state */
  approved?: boolean;
  tags?: string[];
  /** Filter by category enum value (must match Xano enum exactly) */
  category?: string;
  amenities?: string[];
  /** 1-based page number */
  page?: number;
  /** Results per page */
  per_page?: number;
}

/**
 * POST body for /business/create.
 * Requires an authenticated user — the auth token is attached automatically.
 */
export interface CreateBusinessPayload {
  name: string;
  category: string;
  phoneNumber: string;
  email: string;
  address: string;
  /** Array of Cloudinary image URLs */
  images: string[];
  description: string;
  website: string;
  /** Array of amenity strings, e.g. ["Free Wi-Fi", "Parking"] */
  amenities: string[];
  /** Opening/closing hours keyed by day name */
  hours: Record<string, string>;
  /** LGA (Local Government Area) object — leave as {} if not yet specified */
  lga: Record<string, unknown>;
}

// ============================
// Xano LGA API Types
// ============================

/**
 * A Lagos Local Government Area as returned by GET /lga/all.
 */
export interface LGA {
  id: number;
  created_at?: number;
  name: string;
  /** Slug or short code, if provided by Xano */
  slug?: string;
  [key: string]: unknown;
}

/** Paginated wrapper returned by GET /lga/all. */
export interface LGAListResponse {
  items: LGA[];
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
}

// ============================
// Xano Event API Types
// ============================

// ============================
// Xano Event API Types
// ============================

/** ContactInfo for an event */
export interface EventContactInfo {
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
}

/** Geographic location data in the event schedule */
export interface EventLocationData {
  lat: number;
  lng: number;
}

/** Event schedule/location object */
export interface EventSchedule {
  data: EventLocationData;
  type: 'point' | string;
}

/**
 * A single event as returned by Xano's /event endpoint (GET with event_id param)
 * or from the /event/all paginated list.
 */
export interface XanoEvent {
  id: number;
  created_at: number; // Unix timestamp in ms
  name: string;
  category: string; // e.g. "Hackathons", "Comedy", "Gaming", "Business", "Music"
  about: string; // Event description
  approved: boolean;
  image: string[]; // Array of image URLs
  status: 'Active' | 'Concluded' | 'Cancelled' | string; // Event status
  user_id: number;
  tags: string[]; // Array of tag strings
  theme: string; // Event theme
  type: 'Physical' | 'Hybrid' | 'Online'; // Event delivery type
  lga_id: number;
  lga_name?: string; // Only in /event/all response
  address: string; // Venue address
  schdule: EventSchedule; // Note: Xano has typo "schdule" instead of "schedule"
  time_end: string; // End date, e.g. "2025-09-18"
  contact_info: EventContactInfo;
}

/**
 * Paginated wrapper returned by GET /event/all.
 */
export interface EventListResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  items: XanoEvent[];
}

/**
 * Parameters for POST /event/all (sent as JSON body).
 */
export interface GetAllEventsParams {
  page?: number;
  per_page?: number;
  approved?: boolean;
  category?: string;
  lga_id?: number;
  name?: string;
  status?: string;
  tags?: string; // Xano expects a string, not an array
  time_end?: string; // Filter to events ending before this date (required by Xano — defaults to far future)
}

/**
 * Payload for POST /event (to get a single event by ID).
 */
export interface GetEventParams {
  event_id: number;
}

/**
 * Payload for POST /event/create.
 */
export interface CreateEventPayload {
  name: string;
  contact_info: EventContactInfo;
  category: string;
  about: string;
  approved?: boolean;
  image: string[]; // Cloudinary URLs
  status: string;
  user_id: number;
  tags: string[];
  theme: string;
  type: 'Physical' | 'Hybrid' | 'Online';
  lga_id: number;
  address: string;
  schdule: Record<string, unknown>; // Flexible for now
  time_end: string | null;
}

// ============================
// Legacy Xano Event Detail Type (kept for backward compat)
// ============================

/**
 * Event detail returned by GET /event?event_id=<id>.
 *
 * @note The backend has not yet provided the full response schema. The fields
 * below were derived from the existing dummy data model in eventsData.ts.
 * Tighten this interface once the backend confirms the actual shape.
 */
export interface XanoEventDetail {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  category: string;
  description: string;
  organizer?: string;
  tags?: string[];
  /** Array of image/banner URLs */
  images?: string[];
  ticketPrices: {
    regular: number;
    vip: number;
    gold: number;
    platinum: number;
  };
  /** Allows undocumented fields from Xano to pass through without TS errors */
  [key: string]: unknown;
}
