import type {
  Business,
  BusinessListResponse,
  CreateBusinessPayload,
  GetAllBusinessesParams,
} from '@mlc/shared-types';
import { callXanoEndpoint } from '../xanoClient';
import type { AppType } from '../xanoClient';

// ============================
// Business API Service
// ============================

/**
 * Fetch a paginated, filtered list of businesses from Xano.
 *
 * Uses GET /business/all with query params.
 *
 * @example
 * // Fetch first page of approved restaurants
 * const data = await getAllBusinesses({ category: 'Restaurants', approved: true });
 *
 * @param params  Optional filter/pagination params. Falls back to page=1, per_page=20.
 * @param app     App context used to select the correct auth token. Default: 'main'.
 */
export async function getAllBusinesses(
  params: GetAllBusinessesParams = {},
  app: AppType = 'main',
): Promise<BusinessListResponse> {
  const queryParams: Record<string, unknown> = {
    page: 1,
    per_page: 20,
    ...params,
  };

  return callXanoEndpoint('business/all', 'GET', undefined, queryParams, app) as Promise<BusinessListResponse>;
}

/**
 * Create a new business listing in Xano.
 *
 * Requires an authenticated session — the auth token is attached automatically
 * by `callXanoEndpoint`. The `user_id` is derived server-side from the token,
 * so it should NOT be included in the payload.
 *
 * @example
 * const business = await createBusiness({ name: 'My Cafe', category: 'Bars & Cafes', ... });
 *
 * @param payload  Full business creation payload (see CreateBusinessPayload).
 * @param app      App context for auth token. Default: 'main'.
 */
export async function createBusiness(
  payload: CreateBusinessPayload,
  app: AppType = 'main',
): Promise<Business> {
  return callXanoEndpoint('business/create', 'POST', payload, undefined, app) as Promise<Business>;
}

/**
 * Approve or reject a business listing in Xano.
 *
 * Calls PATCH /business/{id} with { approved } to update the listing status.
 *
 * @param id       The business record ID.
 * @param approved  Pass `true` to approve, `false` to reject/revoke.
 * @param app      App context for auth token. Default: 'admin'.
 */
export async function approveBusiness(
  id: number,
  approved: boolean,
  app: AppType = 'admin',
): Promise<Business> {
  return callXanoEndpoint(`business/${id}`, 'PUT', { approved }, undefined, app) as Promise<Business>;
}
