"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  User,
  CreditCard,
  Bell,
  Ticket,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  AlertTriangle,
  QrCode,
} from "lucide-react";
import {
  getDetailsById,
  reSend,
  resendUpgradeConfirmation,
} from "../../lib/services/dashboard";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatAmount } from "../../lib/utils";
import {
  canUpgradeParticipantTicket,
  getRefundStatusMeta,
  RefundStatusInput,
  toFiniteNumber,
} from "../../lib/utils/participant-helpers";
import { Badge } from "../ui/badge";
import { TicketUpgradeModal } from "./ticket-upgrade-modal";
import { TicketCancellationModal } from "./ticket-cancellation-modal";
import {
  ParticipantDetailData,
  ParticipantQrTicket,
  ParticipantTicketItem,
  ParticipantTicketUpgradeItem,
} from "../../types";

const TICKET_COLORS = [
  "#b45309",
  "#0369a1",
  "#7c3aed",
  "#047857",
  "#ca8a04",
  "#0891b2",
  "#6d28d9",
  "#65a30d",
];

interface ParticipantRowSummary extends RefundStatusInput {
  id?: number | string;
  transaction_reference?: string;
  is_refund_request_approved?: boolean;
}

interface ViewParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  transactionReference: string | null;
  rowData?: ParticipantRowSummary | null;
  onActionSuccess?: () => void;
}

interface ApiWrappedResponse<T = unknown> {
  status?: number;
  message?: string;
  data?: {
    status?: number;
    message?: string;
    data?: T;
  };
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const maybeErr = err as {
      message?: string;
      response?: { data?: { message?: string } };
    };
    return maybeErr.response?.data?.message || maybeErr.message || fallback;
  }
  return fallback;
}

function TicketQrDetails({
  qrTickets,
  copiedQr,
  onCopy,
}: {
  qrTickets: ParticipantQrTicket[];
  copiedQr: string | null;
  onCopy: (qrCode: string) => void;
}) {
  if (qrTickets.length === 0) {
    return (
      <p className="text-[11px] text-zinc-400">No QR issued for this ticket.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        <QrCode className="h-3.5 w-3.5 text-[#00d07d]" />
        <span>QR details</span>
      </div>
      {qrTickets.map((qr) => {
        const holder = [qr.holder_name, qr.holder_email, qr.holder_phone].filter(Boolean).join(" · ");
        const ticketUrl = String(qr.qr_link || "").trim();
        return (
          <div
            key={qr.qr_code}
            className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 flex flex-col gap-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-[11px] font-bold text-zinc-900 dark:text-white break-all">
                {qr.qr_code}
              </span>
              <button
                type="button"
                onClick={() => onCopy(ticketUrl || qr.qr_code)}
                title={ticketUrl ? "Copy ticket link" : "Copy QR code"}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer shrink-0"
              >
                {copiedQr === (ticketUrl || qr.qr_code) ? (
                  <Check className="h-3.5 w-3.5 text-[#00d07d]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {ticketUrl ? (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline break-all"
              >
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                {ticketUrl}
              </a>
            ) : null}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={qr.is_scanned ? "emerald" : "gold"}>
                {qr.is_scanned ? "Scanned" : "Not scanned"}
              </Badge>
              {qr.seat ? (
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono font-semibold text-zinc-700 dark:text-zinc-200">
                  Seat {qr.seat}
                </span>
              ) : null}
              {qr.was_transferred ? (
                <span className="text-[11px] font-semibold text-zinc-500">Transferred</span>
              ) : null}
            </div>
            {holder ? (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 break-all">{holder}</p>
            ) : null}
            {qr.scanned_at ? (
              <p className="text-[11px] text-zinc-400">Scanned {qr.scanned_at}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 last:border-b-0 text-xs">
      <span className="text-zinc-500 dark:text-zinc-400 font-medium shrink-0">{label}</span>
      <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-right break-all">
        {value}
      </span>
    </div>
  );
}

export function ViewParticipantModal({
  isOpen,
  onClose,
  eventId,
  transactionReference,
  rowData,
  onActionSuccess,
}: ViewParticipantModalProps) {
  const { tickets: eventTickets } = useDashboard();

  const [detail, setDetail] = useState<ParticipantDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingSms, setIsSubmittingSms] = useState(false);
  const [resendingUpgradeId, setResendingUpgradeId] = useState<number | string | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedQr, setCopiedQr] = useState<string | null>(null);

  const [upgradeTicket, setUpgradeTicket] = useState<ParticipantTicketItem | null>(null);
  const [cancelTicket, setCancelTicket] = useState<ParticipantTicketItem | null>(null);

  const fetchDetailPayload = useCallback(async (): Promise<{
    detail?: ParticipantDetailData;
    error?: string;
  }> => {
    if (!eventId || !transactionReference) return {};

    const res = (await getDetailsById({
      event_id: eventId,
      transaction_id: transactionReference,
    })) as ApiWrappedResponse<ParticipantDetailData> | null;

    const body = res?.data;
    if (body?.status === 200 && body?.data) {
      return {
        detail: {
          ...body.data,
          transaction_reference: body.data?.transaction_reference || transactionReference,
          row_transaction_id: rowData?.id,
          row_transaction_reference: transactionReference,
          row_is_refund: rowData?.is_refund,
          row_is_refund_init: rowData?.is_refund_init,
          row_is_refund_rejected: rowData?.is_refund_rejected,
          row_is_refund_request_approved: rowData?.is_refund_request_approved,
          row_refund_request_status: rowData?.refund_request_status,
        },
      };
    }

    return {
      error: body?.message || res?.message || "Failed to fetch participant details.",
    };
  }, [eventId, transactionReference, rowData]);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDetailPayload();
      if (result.detail) {
        setDetail(result.detail);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "An unexpected error occurred while fetching participant details.")
      );
    } finally {
      setLoading(false);
    }
  }, [fetchDetailPayload]);

  useEffect(() => {
    if (!isOpen || !eventId || !transactionReference) return;
    let active = true;

    fetchDetailPayload()
      .then((result) => {
        if (!active) return;
        if (result.detail) {
          setDetail(result.detail);
          setError(null);
        } else if (result.error) {
          setError(result.error);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            getErrorMessage(err, "An unexpected error occurred while fetching participant details.")
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen, eventId, transactionReference, fetchDetailPayload]);

  if (!isOpen) return null;

  const handleCopyTransactionId = async (value: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      }
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 1500);
    } catch {
      // Ignore clipboard failure in restricted contexts
    }
  };

  const handleCopyQr = async (qrCode: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(qrCode);
      }
      setCopiedQr(qrCode);
      setTimeout(() => setCopiedQr(null), 1500);
    } catch {
      // Ignore clipboard failure in restricted contexts
    }
  };

  const handleResendNotification = async (type: "sms" | "email") => {
    if (!detail?.onepay_transaction_id) {
      setFeedback({ type: "error", message: "Onepay Transaction ID is missing." });
      return;
    }

    if (type === "sms") setIsSubmittingSms(true);
    else setIsSubmittingEmail(true);
    setFeedback(null);

    try {
      const res = (await reSend({
        onepay_transaction_id: detail.onepay_transaction_id,
        is_send_sms: type === "sms",
        is_send_email: type === "email",
      })) as ApiWrappedResponse | null;

      const apiStatus = res?.data?.status;
      const isOk =
        apiStatus !== undefined
          ? apiStatus === 200 || apiStatus === 100
          : res?.status === 200;

      if (isOk) {
        setFeedback({
          type: "success",
          message:
            res?.data?.message ||
            `${type === "email" ? "Email" : "SMS"} notification resent successfully.`,
        });
        await loadDetail();
      } else {
        setFeedback({
          type: "error",
          message: res?.data?.message || "Failed to resend notification.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "An error occurred while resending notification."),
      });
    } finally {
      if (type === "sms") setIsSubmittingSms(false);
      else setIsSubmittingEmail(false);
    }
  };

  const handleResendUpgradeEmail = async (upgrade: ParticipantTicketUpgradeItem) => {
    const upgradeRequestId = upgrade?.id;
    const upgradeTxnId = upgrade?.upgrade_onepay_transaction_id;
    if (!upgradeRequestId && !upgradeTxnId) {
      setFeedback({ type: "error", message: "Upgrade reference is missing." });
      return;
    }

    const key = upgradeRequestId || upgradeTxnId || "";
    setResendingUpgradeId(key);
    setFeedback(null);

    try {
      const body: { upgrade_request_id?: number | string; upgrade_onepay_transaction_id?: string } =
        {};
      if (upgradeRequestId) body.upgrade_request_id = upgradeRequestId;
      if (upgradeTxnId) body.upgrade_onepay_transaction_id = upgradeTxnId;

      const res = (await resendUpgradeConfirmation(body)) as ApiWrappedResponse | null;
      const apiStatus = res?.data?.status;
      const isOk =
        apiStatus !== undefined
          ? apiStatus === 200 || apiStatus === 100
          : res?.status === 200;

      if (isOk) {
        setFeedback({
          type: "success",
          message: res?.data?.message || "Upgrade confirmation email resent.",
        });
      } else {
        setFeedback({
          type: "error",
          message: res?.data?.message || "Failed to resend upgrade confirmation email.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Failed to resend upgrade confirmation email."),
      });
    } finally {
      setResendingUpgradeId(null);
    }
  };

  const handleTicketMutationSuccess = async () => {
    await loadDetail();
    onActionSuccess?.();
  };

  const currency = detail?.currency || "LKR";
  const formatMoney = (value: unknown) => `${currency} ${formatAmount(toFiniteNumber(value) ?? 0)}`;
  const ticketsList = Array.isArray(detail?.tickets) ? detail.tickets : [];
  const totalTicketCount = ticketsList.reduce(
    (sum, t) => sum + (Number(t?.count) || 0),
    0
  );
  const grossAmount = toFiniteNumber(detail?.gross_amount) ?? 0;
  const discountedAmount = toFiniteNumber(detail?.discounted_amount) ?? 0;
  const cardDiscount = toFiniteNumber(detail?.card_discount) ?? 0;
  const paidAmount = toFiniteNumber(detail?.total_amount) ?? 0;

  const refundMeta = getRefundStatusMeta({
    is_refund: detail?.row_is_refund,
    is_refund_init: detail?.row_is_refund_init,
    is_refund_rejected: detail?.row_is_refund_rejected,
    refund_request_status: detail?.row_refund_request_status,
  });
  const paymentStatusLabel = detail?.row_is_refund ? "Refunded" : "Success";
  const paymentStatusVariant = detail?.row_is_refund ? "red" : "emerald";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-xl h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="participant-detail-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <div>
              <h2
                id="participant-detail-title"
                className="text-base font-extrabold text-zinc-900 dark:text-white"
              >
                Participant Details
              </h2>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                {transactionReference || "Transaction"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close participant details"
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {feedback && (
              <div
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium ${
                  feedback.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-zinc-500 dark:text-zinc-400 text-xs">
                <Loader2 className="h-6 w-6 animate-spin text-[#00d07d]" />
                <span>Loading participant details...</span>
              </div>
            ) : error ? (
              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col items-center text-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <p className="text-xs font-medium text-red-600 dark:text-red-300">{error}</p>
                <button
                  type="button"
                  onClick={loadDetail}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : detail ? (
              <>
                {/* 1. User Details */}
                <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                    <User className="h-4 w-4 text-[#00d07d]" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      User Details
                    </h3>
                  </div>
                  <DetailRow label="First Name" value={detail.customer_first_name || "Not Available"} />
                  <DetailRow label="Last Name" value={detail.customer_last_name || "Not Available"} />
                  <DetailRow label="Email Address" value={detail.customer_email || "Not Available"} />
                  <DetailRow label="Phone Number" value={detail.customer_phone_no || "Not Available"} />
                  <DetailRow
                    label="Verification ID"
                    value={`${detail.verification_id || "Not Available"} (${detail.verification_method || "N/A"})`}
                  />
                  <DetailRow label="Date and Time" value={detail.datetime || "Not Available"} />
                </section>

                {/* 2. Payment Details */}
                <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                    <CreditCard className="h-4 w-4 text-[#00d07d]" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      Payment Details
                    </h3>
                  </div>
                  <DetailRow
                    label="Status"
                    value={<Badge variant={paymentStatusVariant}>{paymentStatusLabel}</Badge>}
                  />
                  {detail.row_refund_request_status ||
                  detail.row_is_refund_init ||
                  detail.row_is_refund_rejected ||
                  detail.row_is_refund ? (
                    <DetailRow
                      label="Refund Status"
                      value={<Badge variant={refundMeta.variant}>{refundMeta.label}</Badge>}
                    />
                  ) : null}
                  <DetailRow
                    label="Onepay Transaction ID"
                    value={
                      detail.onepay_transaction_id ? (
                        <span className="inline-flex items-center gap-1.5 font-mono">
                          <span>{detail.onepay_transaction_id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyTransactionId(detail.onepay_transaction_id || "")}
                            title="Copy transaction ID"
                            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                          >
                            {copiedTx ? (
                              <Check className="h-3.5 w-3.5 text-[#00d07d]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </span>
                      ) : (
                        "Not Available"
                      )
                    }
                  />
                  <DetailRow label="Payment Method" value={detail.provider || "Not Available"} />
                </section>

                {/* 3. Notification details */}
                <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                    <Bell className="h-4 w-4 text-[#00d07d]" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      Notification details
                    </h3>
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                      Email Notification
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant={detail.is_email_send ? "emerald" : "red"}>
                        {detail.is_email_send ? "Success" : "Failed"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleResendNotification("email")}
                        disabled={isSubmittingEmail}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-[#00d07d] text-zinc-700 dark:text-zinc-200 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingEmail ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                        <span>Resend</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2.5 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                      SMS Notification
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant={detail.is_sms_send ? "emerald" : "red"}>
                        {detail.is_sms_send ? "Success" : "Failed"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleResendNotification("sms")}
                        disabled={isSubmittingSms}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-[#00d07d] text-zinc-700 dark:text-zinc-200 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingSms ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                        <span>Resend</span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* 4. Tickets Details */}
                <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                    <Ticket className="h-4 w-4 text-[#00d07d]" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      Tickets Details
                    </h3>
                  </div>

                  {ticketsList.length > 0 ? (
                    <>
                      <div className="overflow-x-auto rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-bold uppercase text-zinc-400">
                              <th className="px-3 py-2.5">Ticket Name</th>
                              <th className="px-3 py-2.5">Ticket Price</th>
                              <th className="px-3 py-2.5 text-right">No of Tickets</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ticketsList.map((ticket, index) => {
                              const seats = Array.isArray(ticket.seats) ? ticket.seats : [];
                              const qrTickets = Array.isArray(ticket.qr_tickets) ? ticket.qr_tickets : [];
                              const scannedCount = qrTickets.filter((qr) => qr.is_scanned).length;
                              const upgradeable = canUpgradeParticipantTicket(ticket, eventTickets);
                              return (
                                <React.Fragment key={`${ticket.ticket_id}-${index}`}>
                                  <tr className="border-b border-zinc-100 dark:border-zinc-800/70">
                                    <td
                                      className="px-3 py-2.5 font-bold"
                                      style={{ color: TICKET_COLORS[index % TICKET_COLORS.length] }}
                                    >
                                      <div className="flex flex-col gap-1">
                                        <span>
                                          {index + 1}. {ticket.ticket_name}
                                        </span>
                                        {qrTickets.length > 0 && (
                                          <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                                            {scannedCount}/{qrTickets.length} QR scanned
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2.5 font-mono text-zinc-700 dark:text-zinc-300">
                                      {formatMoney(ticket.ticket_amount)}
                                    </td>
                                    <td className="px-3 py-2.5 font-mono font-bold text-right text-zinc-900 dark:text-white">
                                      {ticket.count}
                                    </td>
                                  </tr>
                                  <tr className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 bg-zinc-50/70 dark:bg-zinc-950/30">
                                    <td colSpan={3} className="px-3 py-2">
                                      <div className="flex flex-col gap-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          {seats.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                              {seats.map((seat, sIdx) => (
                                                <span
                                                  key={sIdx}
                                                  className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono font-semibold text-zinc-700 dark:text-zinc-200"
                                                >
                                                  {seat}
                                                </span>
                                              ))}
                                            </div>
                                          ) : upgradeable ? (
                                            <button
                                              type="button"
                                              onClick={() => setUpgradeTicket(ticket)}
                                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                                            >
                                              <ArrowUpRight className="h-3 w-3" />
                                              <span>Ticket Upgrade</span>
                                            </button>
                                          ) : (
                                            <span />
                                          )}

                                          <button
                                            type="button"
                                            onClick={() => setCancelTicket(ticket)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                                          >
                                            <AlertTriangle className="h-3 w-3" />
                                            <span>Cancel Ticket</span>
                                          </button>
                                        </div>

                                        <TicketQrDetails
                                          qrTickets={qrTickets}
                                          copiedQr={copiedQr}
                                          onCopy={handleCopyQr}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Ticket Summary & Totals */}
                      <div className="mt-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 flex flex-col gap-2 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                            Total Tickets
                          </span>
                          <span className="font-mono font-extrabold text-zinc-900 dark:text-white">
                            {totalTicketCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Gross Amount</span>
                          <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                            {formatMoney(grossAmount)}
                          </span>
                        </div>
                        {discountedAmount > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 dark:text-zinc-400">Discount</span>
                            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              − {formatMoney(discountedAmount)}
                            </span>
                          </div>
                        )}
                        {cardDiscount > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 dark:text-zinc-400">Card Discount</span>
                            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              − {formatMoney(cardDiscount)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                          <span className="font-extrabold text-zinc-900 dark:text-white">
                            Amount Paid
                          </span>
                          <span className="font-mono text-sm font-extrabold text-[#00d07d]">
                            {formatMoney(paidAmount)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 py-2">
                      No tickets available.
                    </p>
                  )}
                </section>

                {/* Ticket Upgrades History */}
                {Array.isArray(detail.ticket_upgrades) && detail.ticket_upgrades.length > 0 && (
                  <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-4">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                      <ArrowUpRight className="h-4 w-4 text-[#00d07d]" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                        Ticket Upgrades
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {detail.ticket_upgrades.map((upgrade, index) => {
                        const rowKey = upgrade.id || upgrade.upgrade_onepay_transaction_id || index;
                        const isResending =
                          resendingUpgradeId === (upgrade.id || upgrade.upgrade_onepay_transaction_id);
                        return (
                          <div
                            key={rowKey}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-zinc-900 dark:text-white">
                                {upgrade.from_ticket_name || "Ticket"} → {upgrade.to_ticket_name || "Ticket"}
                              </span>
                              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                Count: {upgrade.upgrade_count || 0}
                                {upgrade.upgrade_pay_amount != null && (
                                  <> · {formatMoney(upgrade.upgrade_pay_amount)}</>
                                )}
                                {upgrade.upgraded_at && <> · {upgrade.upgraded_at}</>}
                              </span>
                              {upgrade.upgrade_onepay_transaction_id && (
                                <span className="text-[11px] font-mono text-zinc-400">
                                  Ref: {upgrade.upgrade_onepay_transaction_id}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleResendUpgradeEmail(upgrade)}
                              disabled={isResending}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-[#00d07d] text-zinc-700 dark:text-zinc-200 font-semibold text-[11px] transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                            >
                              {isResending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3 w-3" />
                              )}
                              <span>Resend confirmation</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Ticket Cancellations History */}
                {Array.isArray(detail.ticket_cancellations) && detail.ticket_cancellations.length > 0 && (
                  <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-4">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                        Ticket Cancellations
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {detail.ticket_cancellations.map((cancelItem, idx) => (
                        <div
                          key={cancelItem.id || idx}
                          className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs flex flex-col gap-0.5"
                        >
                          <span className="font-bold text-zinc-900 dark:text-white">
                            {cancelItem.ticket_name || "Ticket"} (Qty: {cancelItem.cancel_count ?? 1})
                          </span>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {cancelItem.cancellation_mode || "Cancelled"}
                            {cancelItem.refund_amount != null && (
                              <> · Refund: {formatMoney(cancelItem.refund_amount)}</>
                            )}
                            {cancelItem.cancelled_at && <> · {cancelItem.cancelled_at}</>}
                          </span>
                          {cancelItem.cancellation_note && (
                            <span className="text-[11px] text-zinc-400">
                              Note: {cancelItem.cancellation_note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Integrated Ticket Upgrade Modal */}
      <TicketUpgradeModal
        isOpen={Boolean(upgradeTicket)}
        onClose={() => setUpgradeTicket(null)}
        ticket={upgradeTicket}
        onSuccess={handleTicketMutationSuccess}
        defaultTransactionId={detail?.onepay_transaction_id || transactionReference || ""}
        defaultCustomerEmail={detail?.customer_email || ""}
      />

      {/* Integrated Ticket Cancellation Modal */}
      <TicketCancellationModal
        isOpen={Boolean(cancelTicket)}
        onClose={() => setCancelTicket(null)}
        ticket={cancelTicket}
        viewData={detail}
        onSuccess={handleTicketMutationSuccess}
        defaultTransactionId={detail?.onepay_transaction_id || transactionReference || ""}
        defaultCustomerEmail={detail?.customer_email || ""}
      />
    </>
  );
}
