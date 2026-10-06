"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { previewTicketCancellation, confirmTicketCancellation } from "../../lib/services/dashboard";

interface TicketCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: any;
  defaultTransactionId?: string;
  defaultCustomerEmail?: string;
}

const REFUND_REASONS = [
  { value: "REQUESTED_BY_CUSTOMER", label: "Requested by customer" },
  { value: "EVENT_CANCELLED", label: "Event cancelled" },
  { value: "DUPLICATE_BOOKING", label: "Duplicate booking" },
  { value: "OTHER", label: "Other" },
];

export function TicketCancellationModal({
  isOpen,
  onClose,
  order,
  defaultTransactionId = "R0VP1192CE2B5DCE8C15C",
  defaultCustomerEmail = "customer@example.com",
}: TicketCancellationModalProps) {
  const [transactionId, setTransactionId] = useState(defaultTransactionId);
  const [customerEmail, setCustomerEmail] = useState(defaultCustomerEmail);
  const [ticketName, setTicketName] = useState<string>("General Entry");
  const [ticketId, setTicketId] = useState<number | string>(101);
  const [cancelCount, setCancelCount] = useState<number>(1);
  const [cancellationMode, setCancellationMode] = useState<"cancel_only" | "cancel_and_refund">("cancel_only");
  const [refundReason, setRefundReason] = useState<string>("REQUESTED_BY_CUSTOMER");
  const [cancellationNote, setCancellationNote] = useState<string>("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyDetails, setVerifyDetails] = useState<any>(null);
  const [confirmResult, setConfirmResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const txId = order?.transactionId || order?.transaction_reference || defaultTransactionId;
      const email = order?.attendeeEmail || order?.customer_email || defaultCustomerEmail;
      const tierName = order?.tier || order?.ticket_name || "General Entry";
      const qty = order?.quantity || 1;

      setTransactionId(txId);
      setCustomerEmail(email);
      setTicketName(tierName);
      setTicketId(order?.ticket_id || 101);
      setCancelCount(qty);
      setCancellationMode("cancel_only");
      setRefundReason("REQUESTED_BY_CUSTOMER");
      setCancellationNote("");
      setIsVerified(false);
      setVerifyDetails(null);
      setConfirmResult(null);
      setError(null);
    }
  }, [isOpen, order, defaultTransactionId, defaultCustomerEmail]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!transactionId || !customerEmail) {
      setError("Transaction details are missing.");
      return;
    }
    if (!cancelCount || cancelCount < 1) {
      setError("Please enter a valid ticket cancel count.");
      return;
    }
    if (!cancellationNote.trim()) {
      setError("Please enter a cancellation note.");
      return;
    }

    setIsVerifying(true);
    setIsVerified(false);
    setVerifyDetails(null);
    setError(null);

    try {
      const queryParams = {
        onepay_transaction_id: transactionId,
        customer_email: customerEmail,
      };
      const body: any = {
        ticket_id: ticketId,
        cancel_count: Number(cancelCount) || 1,
        cancellation_mode: cancellationMode,
        cancellation_note: cancellationNote.trim(),
      };
      if (cancellationMode === "cancel_and_refund") {
        body.refund_reason = refundReason;
      }

      const res: any = await previewTicketCancellation(queryParams, body);
      const resStatus = res?.data?.status || res?.status;

      if (resStatus === 200 || resStatus === 100) {
        setVerifyDetails(res?.data?.data || res?.data || res);
        setIsVerified(true);
      } else {
        setError(res?.data?.message || "Cancellation preview failed.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "An error occurred during cancellation preview.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirm = async () => {
    if (!isVerified) return;

    setIsConfirming(true);
    setError(null);

    try {
      const queryParams = {
        onepay_transaction_id: transactionId,
        customer_email: customerEmail,
      };
      const body: any = {
        ticket_id: ticketId,
        cancel_count: Number(cancelCount) || 1,
        cancellation_mode: cancellationMode,
        cancellation_note: cancellationNote.trim(),
      };
      if (cancellationMode === "cancel_and_refund") {
        body.refund_reason = refundReason;
      }

      const res: any = await confirmTicketCancellation(queryParams, body);
      const resStatus = res?.data?.status || res?.status;

      if (resStatus === 200 || resStatus === 100) {
        setConfirmResult(res?.data || res);
      } else {
        setError(res?.data?.message || "Cancellation confirmation failed.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "An error occurred during cancellation confirmation.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ticket Cancellation</h3>
              <p className="text-xs text-zinc-400">Cancel tickets and request refund</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Handling fee banner */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-medium">
          Rs. 100 handling fee per ticket applies to all cancellations.
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Transaction ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Current Ticket
            </label>
            <div className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-red-400">
              {ticketName}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Number of Tickets to Cancel
            </label>
            <input
              type="number"
              min={1}
              value={cancelCount}
              onChange={(e) => {
                setCancelCount(Number(e.target.value));
                setIsVerified(false);
              }}
              disabled={isVerifying || isConfirming}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Cancellation Mode */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Cancellation Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCancellationMode("cancel_only");
                  setIsVerified(false);
                }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  cancellationMode === "cancel_only"
                    ? "bg-zinc-800 border-red-500 text-white"
                    : "bg-zinc-800/40 border-zinc-700 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span className="text-xs font-bold">Cancel Only</span>
                <span className="text-[10px] text-zinc-400">No refund processed. Fee applies.</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCancellationMode("cancel_and_refund");
                  setIsVerified(false);
                }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  cancellationMode === "cancel_and_refund"
                    ? "bg-zinc-800 border-red-500 text-white"
                    : "bg-zinc-800/40 border-zinc-700 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span className="text-xs font-bold">Cancel + Refund</span>
                <span className="text-[10px] text-zinc-400">Refund = price − Rs. 100 fee.</span>
              </button>
            </div>
          </div>

          {cancellationMode === "cancel_and_refund" && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Refund Reason
              </label>
              <select
                value={refundReason}
                onChange={(e) => {
                  setRefundReason(e.target.value);
                  setIsVerified(false);
                }}
                disabled={isVerifying || isConfirming}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                {REFUND_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Cancellation Note
            </label>
            <textarea
              rows={2}
              placeholder="Enter reason for cancellation..."
              value={cancellationNote}
              onChange={(e) => {
                setCancellationNote(e.target.value);
                setIsVerified(false);
              }}
              disabled={isVerifying || isConfirming}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {verifyDetails && (
            <div className="p-4 bg-zinc-800/80 border border-zinc-700 rounded-xl flex flex-col gap-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Cancellation Verification Details
              </span>
              <pre className="text-[11px] text-zinc-300 font-mono bg-zinc-900/80 p-3 rounded-lg overflow-x-auto max-h-40 border border-zinc-800">
                {JSON.stringify(verifyDetails, null, 2)}
              </pre>
            </div>
          )}

          {confirmResult && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>Ticket cancellation processed and refund confirmed!</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-all"
            >
              Close
            </button>

            {!isVerified ? (
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerify}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Preview Cancellation"}
              </button>
            ) : (
              <button
                type="button"
                disabled={isConfirming || !!confirmResult}
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Cancellation"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
