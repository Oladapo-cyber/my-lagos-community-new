import type {
  XanoEvent,
  XanoEventDetail,
  EventListResponse,
  GetEventParams,
  GetAllEventsParams,
  CreateEventPayload,
} from '@mlc/shared-types';
import { callXanoEndpoint, XANO_EVENT_BASE_URL } from '../xanoClient';
import type { AppType } from '../xanoClient';

// ============================
// Event API Service
// ============================

/**
 * Fetch a single event by its numeric ID from Xano.
 *
 * Calls POST /event with `{ event_id }` in the body.
 *
 * @example
 * const event = await getEvent(2);
 *
 * @param eventId  The numeric ID of the event to retrieve.
 * @param app      App context for auth token. Default: 'main'.
 */
export async function getEvent(
  eventId: number,
  app: AppType = 'main',
): Promise<XanoEvent> {
  return callXanoEndpoint(
    'event',
    'GET',
    undefined,
    { event_id: eventId },
    app,
    XANO_EVENT_BASE_URL,
  ) as Promise<XanoEvent>;
}

/**
 * Fetch a paginated, filtered list of events from Xano.
 *
 * Uses POST /event/all with a JSON body for filtering by category, LGA, date, etc.
 *
 * @example
 * // Fetch approved events in Agege
 * const data = await getAllEvents({ lga_id: 1, approved: true });
 *
 * @param params  Optional filter/pagination params. Falls back to page=1, per_page=20.
 * @param app     App context used to select the correct auth token. Default: 'main'.
 */
export async function getAllEvents(
  params: GetAllEventsParams = {},
  app: AppType = 'main',
): Promise<EventListResponse> {
  // Xano /event/all is a GET endpoint — all filters go as query params.
  // Booleans must be numeric (1/0). Missing params default to safe empty values
  // so Xano doesn't 500 on undefined fields.
  const queryParams: Record<string, unknown> = {
    page:      params.page      ?? 1,
    per_page:  params.per_page  ?? 8,
    // Xano REQUIRES the approved param — omitting it returns 0 results.
    // Default to 1 (approved). Use approved=false explicitly for pending events.
    approved:  params.approved !== undefined ? (params.approved ? 1 : 0) : 1,
    status:    params.status    ?? '',
    lga_id:    params.lga_id    ?? 0,
    name:      params.name      ?? '',
    category:  params.category  ?? '',
    tags:      params.tags      ?? '',
    time_end:  params.time_end  ?? '2099-12-31',
  };

  return callXanoEndpoint('event/all', 'GET', undefined, queryParams, app, XANO_EVENT_BASE_URL) as Promise<EventListResponse>;
}

/**
 * Create a new event in Xano.
 *
 * Requires an authenticated session — the auth token is attached automatically.
 * The `user_id` is derived server-side from the token, but can also be passed.
 *
 * @example
 * const event = await createEvent({ name: 'My Event', category: 'Music', ... });
 *
 * @param payload  Full event creation payload (see CreateEventPayload).
 * @param app      App context for auth token. Default: 'main'.
 */
export async function createEvent(
  payload: CreateEventPayload,
  app: AppType = 'main',
): Promise<XanoEvent> {
  return callXanoEndpoint('event/create', 'POST', payload, undefined, app, XANO_EVENT_BASE_URL) as Promise<XanoEvent>;
}

/**
 * Update an event in Xano — used by admin to approve/revoke.
 *
 * Sends the FULL existing event record with only `approved` changed.
 * Xano's POST /event/update requires all fields to be present; omitting
 * any field would blank it out on the server.
 *
 * @param event    The full current event object (fetched from the API).
 * @param approved The new approval state to apply.
 * @param app      App context for auth token. Default: 'admin'.
 */
export async function approveEvent(
  event: XanoEvent,
  approved: boolean,
  app: AppType = 'admin',
): Promise<XanoEvent> {
  const payload = {
    event_id:     event.id,
    name:         event.name,
    contact_info: event.contact_info,
    category:     event.category,
    about:        event.about,
    approved,
    image:        event.image,
    status:       event.status,
    user_id:      event.user_id,
    tags:         event.tags,
    theme:        event.theme,
    type:         event.type,
    lga_id:       event.lga_id,
    address:      event.address,
    schdule:      event.schdule,
    time_end:     event.time_end ?? null,
  };
  return callXanoEndpoint('event/update', 'POST', payload, undefined, app, XANO_EVENT_BASE_URL) as Promise<XanoEvent>;
}
