import type { LGA, LGAListResponse } from '@mlc/shared-types';
import { callXanoEndpoint } from '../xanoClient';
import type { AppType } from '../xanoClient';

/**
 * Fetch all Local Government Areas (LGAs) in Lagos.
 *
 * Uses GET /lga/all to retrieve the complete list of LGAs available for filtering businesses.
 *
 * @example
 * const data = await getAllLGAs();
 * // Returns { items: [{ id: 1, name: 'Alimosho' }, ...], ... }
 *
 * @param app     App context used to select the correct auth token. Default: 'main'.
 */
export async function getAllLGAs(app: AppType = 'main'): Promise<LGAListResponse> {
  return callXanoEndpoint('lga/all', 'GET', undefined, undefined, app) as Promise<LGAListResponse>;
}

/**
 * Search for businesses within a specific LGA by keyword.
 *
 * Convenience function that calls getAllBusinesses with lga_id filtered.
 * Useful for the autocomplete dropdown in the hero search.
 *
 * @param lgaId    The LGA ID to filter by
 * @param keyword  The keyword to search for in business name/description
 * @param category Optional category filter
 * @param app      App context for auth token
 */
export async function searchBusinessesByLGAAndKeyword(
  lgaId: number,
  keyword: string,
  category?: string,
  app: AppType = 'main',
) {
  const { getAllBusinesses } = await import('./business');
  return getAllBusinesses(
    {
      lga_id: lgaId,
      category,
      page: 1,
      per_page: 10, // Limit autocomplete results
    },
    app,
  );
}
