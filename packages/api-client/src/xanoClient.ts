import axios from 'axios';

// ============================
// Xano Configuration
// ============================

const XANO_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:-ZO6mml0';

/**
 * ⚠️  UPDATE THIS if your event endpoints are in a different Xano API group.
 *
 * How to find it:
 *   1. Open your Xano dashboard → API
 *   2. Click the API group tab that contains /event, /event/all, /event/create
 *   3. Copy the base URL shown at the top (e.g. https://x8ki-letl-twmt.n7.xano.io/api:-XXXXXXXX)
 *   4. Paste it here.
 */
export const XANO_EVENT_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:-ZO6mml0';

/** Distinguishes between the main consumer app and the admin dashboard */
export type AppType = 'main' | 'admin';

// Token storage keys per app
const TOKEN_KEYS: Record<AppType, string> = {
  main: 'main_auth_token',
  admin: 'admin_auth_token',
};

// ============================
// Auth Token Helpers
// ============================

/**
 * Persist an auth token for a specific app in localStorage.
 * Pass `null` to clear the token (logout).
 */
export function setAuthToken(token: string | null, app: AppType = 'main') {
  const key = TOKEN_KEYS[app];
  if (token) {
    localStorage.setItem(key, token);
  } else {
    localStorage.removeItem(key);
  }
}

/**
 * Retrieve the stored auth token for a specific app.
 * Returns `null` if the user is not logged in.
 */
export function getAuthToken(app: AppType = 'main'): string | null {
  return localStorage.getItem(TOKEN_KEYS[app]);
}

// ============================
// Core HTTP Client
// ============================

// Public endpoints that should NEVER receive an Authorization header.
// Sending auth headers to these triggers a CORS preflight that Xano's
// wildcard `Access-Control-Allow-Headers: *` cannot satisfy, causing the browser to block them.
// IMPORTANT: Use exact endpoint strings only — do NOT use prefix matching, as 'event' would
// accidentally match 'event/create' and strip the auth token from protected write operations.
const PUBLIC_ENDPOINTS: string[] = [
  'event/all',   // GET /event/all  — public browse
  'event',       // GET /event?event_id=X  — public single fetch
  'lga/all',     // GET /lga/all  — public lookup
  'business/all', // GET /business/all  — public browse
  'business',    // GET /business?id=X  — public single fetch
];

function isPublicEndpoint(endpoint: string): boolean {
  // Exact match only — avoids 'event' accidentally matching 'event/create', 'event/update', etc.
  return PUBLIC_ENDPOINTS.includes(endpoint);
}

/**
 * Issue an authenticated (if a token exists) HTTP request to a Xano endpoint.
 *
 * @param endpoint - Path segment appended to the Xano base URL, e.g. `'business/all'`
 * @param method   - HTTP verb. Defaults to `'GET'`.
 * @param data     - Request body (for POST/PUT). Use `undefined` for GET requests.
 * @param params   - URL query parameters (for GET requests).
 * @param app      - App context used to look up the correct auth token.
 * @param baseUrl  - Optional override for the Xano base URL (use for endpoints in a different API group).
 */
export async function callXanoEndpoint(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown,
  params?: Record<string, unknown>,
  app: AppType = 'main',
  baseUrl?: string,
) {
  const url = `${baseUrl ?? XANO_BASE_URL}/${endpoint}`;

  const headers: Record<string, string> = {};

  // Only set JSON content-type for non-FormData payloads
  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Only attach Bearer token for protected endpoints.
  // Public endpoints must NOT send Authorization — Xano's CORS wildcard header
  // does not cover Authorization, causing the preflight to fail.
  const token = getAuthToken(app);
  if (token && !isPublicEndpoint(endpoint)) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axios({ method, url, data, params, headers });
  return response.data;
}

// ============================
// Error Parsing
// ============================

/**
 * Convert an Axios error into a human-readable string suitable for UI display.
 */
export function parseApiResponseError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;

    if (data?.message && typeof data.message === 'string') return data.message;
    if (data?.error) {
      return typeof data.error === 'string' ? data.error : (data.error as { message: string }).message;
    }

    switch (error.response?.status) {
      case 400: return 'Invalid information provided. Please check your inputs.';
      case 401: return 'Authentication failed. Please check your credentials.';
      case 403: return 'You do not have permission to perform this action.';
      case 404: return 'The requested resource was not found.';
      case 429: return 'Too many requests. Please try again later.';
      case 500: return 'Server error. Our team has been notified. Please try again soon.';
      default:  return `Request failed with status ${error.response?.status ?? 'unknown'}`;
    }
  }

  if (error instanceof Error) {
    if (error.message === 'Network Error') return 'Network error. Please check your internet connection.';
    return error.message;
  }

  return 'An unexpected error occurred.';
}
