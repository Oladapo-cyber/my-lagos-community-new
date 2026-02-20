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
 * Update a business listing in Xano — used by admin to approve/revoke.
 *
 * Sends the FULL existing business record with only `approved` changed.
 * Xano's POST /business/update requires all fields to be present; omitting
 * any field would blank it out on the server.
 *
 * @param business The full current business object (fetched from the API).
 * @param approved The new approval state to apply.
 * @param app      App context for auth token. Default: 'admin'.
 */
export async function approveBusiness(
  business: Business,
  approved: boolean,
  app: AppType = 'admin',
): Promise<Business> {
  const payload = {
    business_id:  business.id,
    name:         business.name,
    category:     business.category,
    description:  business.description,
    email:        business.email,
    phoneNumber:  business.phoneNumber,
    website:      business.website,
    address:      business.address,
    images:       business.images,
    amenities:    business.amenities,
    hours:        business.hours ?? {},
    approved,
    lga_id:       business.lga_id,
    status:       business.status,
    user_id:      business.user_id,
  };
  return callXanoEndpoint('business/update', 'POST', payload, undefined, app) as Promise<Business>;
}
