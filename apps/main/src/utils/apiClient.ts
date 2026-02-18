// Re-export api client from shared package for backward compatibility
export { callXanoEndpoint, setAuthToken, getAuthToken, parseApiResponseError } from '@mlc/api-client';
export type { AppType } from '@mlc/api-client';

// Re-export the legacy default export shape for components using it
import axios from 'axios';
const API_URL = 'http://localhost:3001';
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
export default apiClient;
