import axios from 'axios';

// Xano Configuration
const XANO_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:-ZO6mml0';

// Token storage keys per app
const TOKEN_KEYS = {
  main: 'main_auth_token',
  admin: 'admin_auth_token',
} as const;

export type AppType = 'main' | 'admin';

/**
 * Set authentication token for a specific app
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
 * Get the current auth token for a specific app
 */
export function getAuthToken(app: AppType = 'main'): string | null {
  return localStorage.getItem(TOKEN_KEYS[app]);
}

/**
 * Call a Xano API endpoint
 */
export async function callXanoEndpoint(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  params?: any,
  app: AppType = 'main'
) {
  const url = `${XANO_BASE_URL}/${endpoint}`;
  
  const headers: any = {};

  // Only set JSON content type for non-FormData payloads
  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Add auth token if available
  const token = getAuthToken(app);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios({
      method,
      url,
      data,
      params,
      headers
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = parseApiResponseError(error);
    console.error(`Xano API Error (${endpoint}):`, errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Robustly parse API errors into human-readable messages
 */
export function parseApiResponseError(error: any): string {
  if (error.response) {
    const data = error.response.data;
    
    if (data.message) return data.message;
    if (data.error) return typeof data.error === 'string' ? data.error : data.error.message;
    
    switch (error.response.status) {
      case 400: return 'Invalid information provided. Please check your inputs.';
      case 401: return 'Authentication failed. Please check your credentials.';
      case 403: return 'You do not have permission to perform this action.';
      case 404: return 'The requested resource was not found.';
      case 429: return 'Too many requests. Please try again later.';
      case 500: return 'Server error. Our team has been notified. Please try again soon.';
      default: return `Request failed with status ${error.response.status}`;
    }
  } else if (error.request) {
    return 'Network error. Please check your internet connection.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
}
