/**
 * @mlc/api-client — public surface
 *
 * Re-exports everything consumers need. Import from this file, not from
 * individual sub-modules, so internal refactors don't break consumers.
 *
 * Core utilities (Xano HTTP client + auth helpers)
 */
export {
  callXanoEndpoint,
  setAuthToken,
  getAuthToken,
  parseApiResponseError,
} from './xanoClient';
export type { AppType } from './xanoClient';

// ============================
// Business API services
// ============================
export { getAllBusinesses, createBusiness, approveBusiness } from './services/business';

// ============================
// LGA API services
// ============================
export { getAllLGAs } from './services/lga';

// ============================
// Event API services
// ============================
export { getEvent, getAllEvents, createEvent, approveEvent } from './services/event';

// ============================
// Shop API services
// ============================
export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCartItems,
  getCartItem,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from './services/shop';

