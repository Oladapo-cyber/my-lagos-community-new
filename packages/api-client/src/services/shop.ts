import type {
  Product,
  CreateProductPayload,
  CartItem,
  CartItemPayload,
  ShopOrder,
  CreateOrderPayload,
} from '@mlc/shared-types';
import { callXanoEndpoint } from '../xanoClient';
import type { AppType } from '../xanoClient';

// ============================
// Product API Service
// ============================

export async function getAllProducts(app: AppType = 'main'): Promise<Product[]> {
  return callXanoEndpoint('product', 'GET', undefined, undefined, app) as Promise<Product[]>;
}

export async function getProduct(productId: number, app: AppType = 'main'): Promise<Product> {
  return callXanoEndpoint(`product/${productId}`, 'GET', undefined, undefined, app) as Promise<Product>;
}

export async function getMerchantProducts(userId: string, app: AppType = 'main'): Promise<Product[]> {
  return callXanoEndpoint('product/single', 'GET', undefined, { user_id: userId }, app) as Promise<Product[]>;
}

export async function createProduct(payload: CreateProductPayload, app: AppType = 'main'): Promise<Product> {
  return callXanoEndpoint('product', 'POST', payload, undefined, app) as Promise<Product>;
}

export async function updateProduct(productId: number, payload: Partial<CreateProductPayload>, app: AppType = 'main'): Promise<Product> {
  return callXanoEndpoint(`product/${productId}`, 'PATCH', payload, undefined, app) as Promise<Product>;
}

export async function deleteProduct(productId: number, app: AppType = 'admin'): Promise<void> {
  return callXanoEndpoint(`product/${productId}`, 'DELETE', undefined, undefined, app) as Promise<void>;
}

// ============================
// Cart API Service
// ============================

export async function getAllCartItems(app: AppType = 'main'): Promise<CartItem[]> {
  return callXanoEndpoint('cart', 'GET', undefined, undefined, app) as Promise<CartItem[]>;
}

export async function getCartItem(cartId: number, app: AppType = 'main'): Promise<CartItem> {
  return callXanoEndpoint(`cart/${cartId}`, 'GET', undefined, undefined, app) as Promise<CartItem>;
}

export async function addToCart(payload: CartItemPayload, app: AppType = 'main'): Promise<CartItem> {
  return callXanoEndpoint('cart', 'POST', payload, undefined, app) as Promise<CartItem>;
}

export async function updateCartItem(cartId: number, payload: CartItemPayload, app: AppType = 'main'): Promise<CartItem> {
  return callXanoEndpoint(`cart/${cartId}`, 'PUT', payload, undefined, app) as Promise<CartItem>;
}

export async function deleteCartItem(cartId: number, app: AppType = 'main'): Promise<void> {
  return callXanoEndpoint(`cart/${cartId}`, 'DELETE', undefined, undefined, app) as Promise<void>;
}

// ============================
// Order API Service
// ============================

export async function getAllOrders(app: AppType = 'main'): Promise<ShopOrder[]> {
  return callXanoEndpoint('order', 'GET', undefined, undefined, app) as Promise<ShopOrder[]>;
}

export async function getOrder(orderId: number, app: AppType = 'main'): Promise<ShopOrder> {
  return callXanoEndpoint(`order/${orderId}`, 'GET', undefined, undefined, app) as Promise<ShopOrder>;
}

export async function createOrder(payload: CreateOrderPayload, app: AppType = 'main'): Promise<ShopOrder> {
  return callXanoEndpoint('order', 'POST', payload, undefined, app) as Promise<ShopOrder>;
}

export async function updateOrder(orderId: number, payload: CreateOrderPayload, app: AppType = 'main'): Promise<ShopOrder> {
  return callXanoEndpoint(`order/${orderId}`, 'PUT', payload, undefined, app) as Promise<ShopOrder>;
}

export async function deleteOrder(orderId: number, app: AppType = 'admin'): Promise<void> {
  return callXanoEndpoint(`order/${orderId}`, 'DELETE', undefined, undefined, app) as Promise<void>;
}
