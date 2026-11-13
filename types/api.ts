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
  venue_key: string;
}

// 3 - Tickets & participants
export interface TicketsBySlotParams {
  event_id: string | number;
  venue_key: string;
}

export interface EventParticipantsParams {
  id: string | number;
  venue_key: string;
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

export interface ParticipantQrTicket {
  qr_link?: string | null;
  is_scanned?: boolean;
  scanned_at?: string | null;
  seat?: string | null;
  holder_name?: string | null;
  holder_email?: string | null;
  holder_phone?: string | null;
  was_transferred?: boolean;
  assigned_by_name?: string | null;
  assigned_by_email?: string | null;
  assigned_by_phone?: string | null;
  assigned_to_name?: string | null;
  assigned_to_email?: string | null;
  assigned_to_phone?: string | null;
}

export interface ParticipantTicketItem {
  ticket_id: number | string;
  ticket_name: string;
  ticket_amount: number | string;
  count: number;
  seats?: string[];
  qr_tickets?: ParticipantQrTicket[];
}

export interface ParticipantTicketUpgradeItem {
  id?: number | string;
  from_ticket_name?: string;
  to_ticket_name?: string;
  upgrade_count?: number;
  upgrade_pay_amount?: number | string;
  upgraded_at?: string;
  upgrade_onepay_transaction_id?: string;
}

export interface ParticipantTicketCancellationItem {
  id?: number | string;
  ticket_name?: string;
  cancel_count?: number;
  cancellation_mode?: string;
  refund_amount?: number | string;
  cancelled_at?: string;
  cancellation_note?: string;
}

export interface ParticipantDetailData {
  customer_first_name?: string;
  customer_last_name?: string;
  customer_email?: string;
  customer_phone_no?: string;
  datetime?: string;
  tickets?: ParticipantTicketItem[];
  ticket_upgrades?: ParticipantTicketUpgradeItem[];
  ticket_cancellations?: ParticipantTicketCancellationItem[];
  is_sms_send?: boolean;
  is_email_send?: boolean;
  verification_method?: string;
  verification_id?: string;
  onepay_transaction_id?: string;
  currency?: string;
  provider?: string;
  total_amount?: number | string;
  gross_amount?: number | string;
  discounted_amount?: number | string | null;
  card_discount?: number | string | null;
  transaction_reference?: string;
  coupon_code?: string;
  coupon?: unknown;
  discount_percentage?: number | string | null;
  coupon_discount_percentage?: number | string | null;
  discount_amount?: number | string | null;
  coupon_discount?: number | string | null;
  is_free_ticket?: boolean | number;
  row_transaction_id?: number | string;
  row_transaction_reference?: string;
  row_is_refund?: boolean;
  row_is_refund_init?: boolean;
  row_is_refund_rejected?: boolean;
  row_is_refund_request_approved?: boolean;
  row_refund_request_status?: string;
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
  organizer_email?: string;
}

export interface ResendUpgradeEmailPayload {
  upgrade_request_id?: number | string;
  upgrade_onepay_transaction_id?: string;
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

