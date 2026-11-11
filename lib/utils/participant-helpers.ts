import { ParticipantDetailData, ParticipantTicketItem } from "../../types";

export interface RefundStatusMeta {
  label: "Refunded" | "Refund Rejected" | "Refund Initiated" | "Not Refunded";
  variant: "red" | "gold" | "gray";
}

export interface RefundStatusInput {
  is_refund?: boolean;
  is_refund_init?: boolean;
  is_refund_rejected?: boolean;
  refund_request_status?: string;
}

export interface TicketTierLike {
  id?: number | string;
  ticket_id?: number | string;
  ticket_name?: string;
  name?: string;
  ticket_amount?: number | string;
  ticket_visualize_amount?: number | string;
  price?: number | string;
  ticket_price?: number | string;
}

export interface ParticipantTicketFlags {
  ticket_id?: number | string;
  ticket_name?: string;
  ticket_amount?: number | string;
  count?: number;
  seats?: string[];
  discount_percentage?: number | string | null;
  coupon_discount_percentage?: number | string | null;
  is_free_ticket?: boolean | number;
  is_free?: boolean;
  is_coupon_100?: boolean;
  paid_amount?: number | string | null;
  amount_paid?: number | string | null;
  net_amount?: number | string | null;
  ticket_paid_amount?: number | string | null;
  discount_amount?: number | string | null;
  coupon_discount?: number | string | null;
}

/**
 * Resolves participant row refund status badge metadata matching the backend flags.
 */
export function getRefundStatusMeta(
  item: RefundStatusInput | null | undefined
): RefundStatusMeta {
  if (item?.is_refund) {
    return { label: "Refunded", variant: "red" };
  }

  if (
    item?.refund_request_status === "refund-rejected" ||
    item?.refund_request_status === "rejected" ||
    item?.is_refund_rejected
  ) {
    return { label: "Refund Rejected", variant: "red" };
  }

  if (item?.refund_request_status === "refund-initiated" || item?.is_refund_init) {
    return { label: "Refund Initiated", variant: "gold" };
  }

  return { label: "Not Refunded", variant: "gray" };
}

export function toFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function getTicketTierAmount(ticket: TicketTierLike | null | undefined): number {
  return (
    Number(
      ticket?.ticket_amount ??
        ticket?.ticket_visualize_amount ??
        ticket?.price ??
        ticket?.ticket_price ??
        0
    ) || 0
  );
}

/**
 * Returns higher-priced event ticket tiers that the given participant ticket can upgrade to.
 */
export function getUpgradeableEventTickets(
  participantTicket: Partial<ParticipantTicketItem> | null | undefined,
  eventTickets: TicketTierLike[]
): TicketTierLike[] {
  if (!Array.isArray(eventTickets) || eventTickets.length === 0) return [];

  let currentAmount = toFiniteNumber(participantTicket?.ticket_amount);
  if (currentAmount === null) {
    const matched = eventTickets.find(
      (t) =>
        String(t?.ticket_id ?? t?.id) === String(participantTicket?.ticket_id) ||
        (t?.ticket_name &&
          participantTicket?.ticket_name &&
          String(t.ticket_name).toLowerCase() ===
            String(participantTicket.ticket_name).toLowerCase())
    );
    currentAmount = matched ? getTicketTierAmount(matched) : 0;
  }

  return eventTickets.filter((t) => getTicketTierAmount(t) > (currentAmount ?? 0));
}

/**
 * Checks whether a participant ticket item without assigned seats can be upgraded.
 */
export function canUpgradeParticipantTicket(
  participantTicket: Partial<ParticipantTicketItem> | null | undefined,
  eventTickets: TicketTierLike[]
): boolean {
  const hasNoSeats = !participantTicket?.seats || participantTicket.seats.length === 0;
  if (!hasNoSeats) return false;
  return getUpgradeableEventTickets(participantTicket, eventTickets).length > 0;
}

/**
 * Determines whether Cancel + Refund should be disabled (coupon, Koko/MintPay, or free/100%-discounted order).
 */
export function isRefundUnavailable(
  ticket: ParticipantTicketFlags | null | undefined,
  viewData?: ParticipantDetailData | null
): boolean {
  const providerRaw = String(viewData?.provider || "");
  if (providerRaw.toUpperCase() === "COUPON" || viewData?.coupon_code || viewData?.coupon) {
    return true;
  }

  const normalizedProvider = providerRaw.toUpperCase().replace(/[\s_-]/g, "");
  if (
    normalizedProvider === "KOKO" ||
    normalizedProvider === "KOKOPAY" ||
    normalizedProvider === "MINTPAY" ||
    normalizedProvider === "MINT"
  ) {
    return true;
  }

  const discountPercentage =
    toFiniteNumber(ticket?.discount_percentage) ??
    toFiniteNumber(ticket?.coupon_discount_percentage) ??
    toFiniteNumber(viewData?.discount_percentage) ??
    toFiniteNumber(viewData?.coupon_discount_percentage);

  if (discountPercentage !== null && discountPercentage >= 100) return true;

  if (
    ticket?.is_free_ticket === true ||
    ticket?.is_free_ticket === 1 ||
    ticket?.is_free === true ||
    ticket?.is_coupon_100 === true ||
    viewData?.is_free_ticket === true ||
    viewData?.is_free_ticket === 1
  ) {
    return true;
  }

  const ticketAmount = toFiniteNumber(ticket?.ticket_amount);
  const ticketPaid =
    toFiniteNumber(ticket?.paid_amount) ??
    toFiniteNumber(ticket?.amount_paid) ??
    toFiniteNumber(ticket?.net_amount) ??
    toFiniteNumber(ticket?.ticket_paid_amount);

  if (ticketPaid !== null && ticketPaid <= 0) return true;
  if (ticketAmount !== null && ticketAmount <= 0) return true;

  const discountAmount =
    toFiniteNumber(ticket?.discount_amount) ??
    toFiniteNumber(ticket?.coupon_discount) ??
    toFiniteNumber(viewData?.discount_amount) ??
    toFiniteNumber(viewData?.coupon_discount);

  if (
    ticketAmount !== null &&
    discountAmount !== null &&
    discountAmount > 0 &&
    discountAmount >= ticketAmount
  ) {
    return true;
  }

  const detailRecord = viewData as Record<string, unknown> | null | undefined;
  const transactionPaid =
    toFiniteNumber(detailRecord?.paid_amount) ??
    toFiniteNumber(detailRecord?.amount_paid) ??
    toFiniteNumber(viewData?.total_amount) ??
    toFiniteNumber(detailRecord?.net_amount) ??
    toFiniteNumber(detailRecord?.total_paid);

  if (transactionPaid !== null && transactionPaid <= 0) return true;

  return false;
}
