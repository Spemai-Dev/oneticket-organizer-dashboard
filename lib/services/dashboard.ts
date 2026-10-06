import { get, unauth_add, getIpgReportNew, auth_add, buildQueryString } from "./common";
import {
  LoginPayload,
  RefreshTokenPayload,
  EventsOverviewParams,
  EventDetailParams,
  EventAnalyticsParams,
  EventVolumeParams,
  EventCheckingStatusParams,
  TicketsBySlotParams,
  EventParticipantsParams,
  EventParticipantDetailParams,
  TicketUpgradeQueryParams,
  TicketUpgradePayload,
  ResendUpgradeEmailPayload,
  TicketCancellationQueryParams,
  TicketCancellationPayload,
  ResendConfirmationParams,
  RefundRequestPayload,
  NotifyListParams,
  ListDashboardNotifiesParams,
} from "../../types/api";

// -------------------------------------------------------------
// 0 - Auth (Portal)
// -------------------------------------------------------------

/**
 * Portal Login API
 * Endpoint: POST /api/v3/organization/portal/login/
 */
export const sign = async (body: LoginPayload | any) => {
  return await unauth_add("organization/portal/login/", body);
};

/**
 * Refresh Token API
 * Endpoint: POST /api/v3/organization/portal/token/refresh/
 */
export const refreshToken = async (body: RefreshTokenPayload | string) => {
  const payload = typeof body === "string" ? { refresh_token: body } : body;
  return await unauth_add("organization/portal/token/refresh/", payload);
};

// -------------------------------------------------------------
// 1 - Events
// -------------------------------------------------------------

/**
 * Get All Events API (legacy minimal list)
 * Endpoint: GET /api/v3/organization/dashboard/events/
 */
export const getALLevent = async () => {
  try {
    const data = await get("organization/dashboard/events/");
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Events Overview API (new UI grid)
 * Endpoint: GET /api/v3/organization/dashboard/events-overview/
 */
export const getEventsOverview = async (params?: EventsOverviewParams | string) => {
  try {
    const queryString = buildQueryString(params);
    const endpoint = queryString
      ? `organization/dashboard/events-overview/?${queryString}`
      : "organization/dashboard/events-overview/";
    const data = await get(endpoint);
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Get Event Details by Event ID
 * Endpoint: GET /api/v3/organization/dashboard/event-detail/
 */
export const getEventDetails = async (eventId: string | number | EventDetailParams) => {
  try {
    const query = typeof eventId === "object" ? buildQueryString(eventId) : `id=${eventId}`;
    const data = await get(`organization/dashboard/event-detail/?${query}`);
    return data;
  } catch (error) {
    return error;
  }
};

// -------------------------------------------------------------
// 2 - Analytics & Volume
// -------------------------------------------------------------

/**
 * Event Analytics API (KPIs + charts)
 * Endpoint: GET /api/v3/organization/dashboard/event-analytics/
 */
export const getEventAnalytics = async (params: EventAnalyticsParams | string) => {
  try {
    const queryString = buildQueryString(params);
    const data = await get(`organization/dashboard/event-analytics/?${queryString}`);
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Get Event Sales Volume (legacy totals)
 * Endpoint: GET /api/v3/organization/dashboard/event-volume/
 */
export const geteventVolume = async (params: EventVolumeParams | string) => {
  try {
    const queryString = buildQueryString(params);
    const data = await get(`organization/dashboard/event-volume/?${queryString}`);
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Get Event Gate Checking Status (scan by tier)
 * Endpoint: GET /api/v3/organization/dashboard/event-checking-status/
 */
export const getEventS = async (params: EventCheckingStatusParams | string) => {
  try {
    const queryString = buildQueryString(params);
    const data = await get(`organization/dashboard/event-checking-status/?${queryString}`);
    return data;
  } catch (error) {
    return error;
  }
};

// -------------------------------------------------------------
// 3 - Tickets & Participants
// -------------------------------------------------------------

/**
 * Get Tickets by Slot
 * Endpoint: GET /api/v3/organization/dashboard/tickets-by-slot/
 */
export const getTickent = async (params: TicketsBySlotParams | string) => {
  try {
    const queryString = buildQueryString(params);
    const data = await get(`organization/dashboard/tickets-by-slot/?${queryString}`);
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Get Event Participants (transaction list)
 * Endpoint: GET /api/v3/organization/dashboard/event-participants/
 */
export const getPartiDetails = async (params: EventParticipantsParams | string) => {
  try {
    const queryString = buildQueryString(params);
    const data = await get(`organization/dashboard/event-participants/?${queryString}`);
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Get Event Participant Detail by ID
 * Endpoint: GET /api/v3/organization/dashboard/event-participant-detail/
 */
export const getDetailsById = async (params: EventParticipantDetailParams | string) => {
  try {
    const queryString = buildQueryString(params);
    const data = await get(`organization/dashboard/event-participant-detail/?${queryString}`);
    return data;
  } catch (error) {
    return error;
  }
};

// -------------------------------------------------------------
// 4 - Ticket Upgrade
// -------------------------------------------------------------

/**
 * Ticket Upgrade Preview
 * Endpoint: POST /api/v3/organization/dashboard/ticket-upgrade/?onepay_transaction_id=...&customer_email=...
 */
export const previewTicketUpgrade = async (
  queryParams: TicketUpgradeQueryParams | string,
  body: TicketUpgradePayload
) => {
  const queryString = buildQueryString(queryParams);
  return await auth_add(`organization/dashboard/ticket-upgrade/?${queryString}`, body);
};

/**
 * Ticket Upgrade Confirm
 * Endpoint: POST /api/v3/organization/dashboard/ticket-upgrade/confirm/?onepay_transaction_id=...&customer_email=...
 */
export const confirmTicketUpgrade = async (
  queryParams: TicketUpgradeQueryParams | string,
  body: TicketUpgradePayload
) => {
  const queryString = buildQueryString(queryParams);
  return await auth_add(`organization/dashboard/ticket-upgrade/confirm/?${queryString}`, body);
};

/**
 * Resend Upgrade Confirmation Email
 * Endpoint: POST /api/v3/organization/dashboard/ticket-upgrade/resend-confirmation/
 */
export const resendUpgradeConfirmation = async (
  body: ResendUpgradeEmailPayload | number | string
) => {
  const payload = typeof body === "object" ? body : { upgrade_request_id: Number(body) };
  return await auth_add("organization/dashboard/ticket-upgrade/resend-confirmation/", payload);
};

// -------------------------------------------------------------
// 5 - Ticket Cancellation
// -------------------------------------------------------------

/**
 * Ticket Cancellation Preview
 * Endpoint: POST /api/v3/organization/dashboard/ticket-cancellation/?onepay_transaction_id=...&customer_email=...
 */
export const previewTicketCancellation = async (
  queryParams: TicketCancellationQueryParams | string,
  body: TicketCancellationPayload
) => {
  const queryString = buildQueryString(queryParams);
  return await auth_add(`organization/dashboard/ticket-cancellation/?${queryString}`, body);
};

/**
 * Ticket Cancellation Confirm
 * Endpoint: POST /api/v3/organization/dashboard/ticket-cancellation/confirm/?onepay_transaction_id=...&customer_email=...
 */
export const confirmTicketCancellation = async (
  queryParams: TicketCancellationQueryParams | string,
  body: TicketCancellationPayload
) => {
  const queryString = buildQueryString(queryParams);
  return await auth_add(`organization/dashboard/ticket-cancellation/confirm/?${queryString}`, body);
};

// -------------------------------------------------------------
// 6 - Notifications & Reports
// -------------------------------------------------------------

/**
 * Resend Event Confirmation (SMS / Email)
 * Endpoint: GET /api/v3/organization/dashboard/resend-event-confirmation/
 */
export const reSend = async (params: ResendConfirmationParams | string) => {
  const queryString = buildQueryString(params);
  return await get(`organization/dashboard/resend-event-confirmation/?${queryString}`);
};

/**
 * Refund Request (Full)
 * Endpoint: POST /api/v3/organization/dashboard/refund-request/
 */
export const refundRequest = async (transactionId: string | number | RefundRequestPayload) => {
  const payload =
    typeof transactionId === "object" ? transactionId : { transaction_id: transactionId };
  return await auth_add("organization/dashboard/refund-request/", payload);
};

/**
 * Download Event Report (Excel)
 * Endpoint: GET /api/v3/organization/dashboard/report/?event_id=...
 */
export const download = async (params: string | { event_id: string | number }) => {
  const queryString = typeof params === "object" ? buildQueryString(params) : `event_id=${params}`;
  const endpoint = `organization/dashboard/report/?${queryString}`;
  return await getIpgReportNew(endpoint);
};

/**
 * Get Notify List (Simple)
 * Endpoint: GET /api/v3/organization/dashboard/notify-list/
 */
export const getNotifyList = async (params?: NotifyListParams | string) => {
  const queryString = buildQueryString(params);
  const endpoint = queryString
    ? `organization/dashboard/notify-list/?${queryString}`
    : "organization/dashboard/notify-list/";
  return await get(endpoint);
};

/**
 * Get Dashboard Notifications List (Paginated)
 * Endpoint: GET /api/v3/organization/dashboard/list-dashboard/
 */
export const getNotifiesDetails = async (params: ListDashboardNotifiesParams | string) => {
  const queryString = buildQueryString(params);
  return await get(`organization/dashboard/list-dashboard/?${queryString}`);
};

/**
 * Download Notify Report (Excel)
 * Endpoint: GET /api/v3/organization/dashboard/notify_report/?event_details=...
 */
export const downloadNotifyReport = async (params: string | { event_details: string | number }) => {
  const queryString =
    typeof params === "object" ? buildQueryString(params) : `event_details=${params}`;
  const endpoint = `organization/dashboard/notify_report/?${queryString}`;
  return await getIpgReportNew(endpoint);
};
