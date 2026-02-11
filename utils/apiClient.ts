/// <reference types="vite/client" />

import axios from 'axios';

// Base API URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for CSRF
});

// Xano Configuration
const XANO_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:-ZO6mml0';





// CSRF token storage
let csrfToken: string | null = null;

// Fetch CSRF token from server
export async function fetchCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  
  try {
    const response = await apiClient.get('/api/csrf-token');
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('[API Client] Failed to fetch CSRF token:', error);
    throw error;
  }
}

// Request interceptor - Add CSRF token and auth headers
apiClient.interceptors.request.use(
  async (config) => {
    // Add CSRF token for non-GET requests
    if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
      try {
        const token = await fetchCsrfToken();
        config.headers['X-CSRF-Token'] = token;
      } catch (error) {
        console.error('[API Client] CSRF token error:', error);
      }
    }

    // Add authorization token if available (for Xano endpoints)
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`[API] Response ${response.status}:`, response.data);
    }
    return response;
  },
  async (error) => {
    // Handle CSRF token expiration
    if (error.response?.status === 403 && error.response?.data?.error === 'CSRF token expired') {
      console.log('[API Client] CSRF token expired, refreshing...');
      csrfToken = null; // Clear expired token
      
      // Retry the request
      try {
        const token = await fetchCsrfToken();
        error.config.headers['X-CSRF-Token'] = token;
        return apiClient.request(error.config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('[API Client] Unauthorized - clearing auth');
      localStorage.removeItem('auth_token');
      // You can dispatch a logout action here if using state management
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('[API] Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// ============================================
// API METHODS
// ============================================

/**
 * Send a chat message to Gemini AI
 */
export async function sendChatMessage(message: string) {
  const response = await apiClient.post('/api/chat', { message });
  return response.data;
}

/**
 * Call a Xano API endpoint
 */
export async function callXanoEndpoint(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  params?: any
) {
  // Use direct axios call for Xano to bypass local server proxy
  const url = `${XANO_BASE_URL}/${endpoint}`;
  
  const headers: any = {
    'Content-Type': 'application/json'
  };

  // Add auth token if available
  const token = getAuthToken();
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
    console.error(`Xano API Error (${endpoint}):`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Set authentication token for subsequent requests
 */
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

/**
 * Get the current auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export default apiClient;
