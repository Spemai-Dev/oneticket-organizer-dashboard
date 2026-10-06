// API Payload & Parameter Interfaces for OneTicket Organization Dashboard API

// 0 - Auth
export interface LoginPayload {
  email: string;
  password: string;
  app_type?: string; // default: "web"
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

// 1 - Events
export interface EventsOverviewParams {
  status?: "all" | "live" | "upcoming" | "past" | "draft" | string;
  page?: number;
  limit?: number;
}

export interface EventDetailParams {
  id: string | number;
}

// 2 - Analytics & volume
export interface EventAnalyticsParams {
  id: string | number;
  venue_key?: string;
}

export interface EventVolumeParams {
  id: string | number;
  venue_key?: string;
}

export interface EventCheckingStatusParams {
  event_id: string | number;
  venue_key?: string;
}

// 3 - Tickets & participants
export interface TicketsBySlotParams {
  event_id: string | number;
  venue_key?: string;
}

export interface EventParticipantsParams {
  id: string | number;
  venue_key?: string;
  page?: number;
  limit?: number;
  search_text?: string;
  is_checked_in?: boolean | string;
  ticket_id?: string | number;
  transaction_status?: "completed" | "refunded" | string;
}

export interface EventParticipantDetailParams {
  event_id: string | number;
  transaction_id: string;
}

// 4 - Ticket upgrade
export interface TicketUpgradeQueryParams {
  onepay_transaction_id: string;
  customer_email: string;
}

export interface TicketUpgradePayload {
  current_ticket_id: number | string;
  upgrade_ticket_id: number | string;
  upgrade_ticket_count: number;
}

export interface ResendUpgradeEmailPayload {
  upgrade_request_id: number | string;
}

// 5 - Ticket cancellation
export interface TicketCancellationQueryParams {
  onepay_transaction_id: string;
  customer_email: string;
}

export interface TicketCancellationPayload {
  ticket_id: number | string;
  cancel_count: number;
  cancellation_mode: "cancel_only" | "cancel_and_refund" | string;
  refund_reason?: string;
  cancellation_note?: string;
}

// 6 - Notifications & reports
export interface ResendConfirmationParams {
  onepay_transaction_id: string;
  is_send_sms?: boolean | string;
  is_send_email?: boolean | string;
}

export interface RefundRequestPayload {
  transaction_id: string | number;
}

export interface NotifyListParams {
  organizer_email: string;
  event_id?: string | number;
}

export interface ListDashboardNotifiesParams {
  event_details: string | number;
  page?: number;
  limit?: number;
  organizer_email?: string;
  search_text?: string;
  venue_key?: string;
}

