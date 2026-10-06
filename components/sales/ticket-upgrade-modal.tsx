"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2, X, RefreshCw } from "lucide-react";
import { previewTicketUpgrade, confirmTicketUpgrade, resendUpgradeConfirmation } from "../../lib/services/dashboard";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber } from "../../lib/utils";

interface TicketUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: any;
  defaultTransactionId?: string;
  defaultCustomerEmail?: string;
}

export function TicketUpgradeModal({
  isOpen,
  onClose,
  order,
  defaultTransactionId = "R0VP1192CE2B5DCE8C15C",
  defaultCustomerEmail = "customer@example.com",
}: TicketUpgradeModalProps) {
  const { tickets } = useDashboard();

  const [transactionId, setTransactionId] = useState(defaultTransactionId);
  const [customerEmail, setCustomerEmail] = useState(defaultCustomerEmail);
  const [currentTicketName, setCurrentTicketName] = useState<string>("General Entry");
  const [currentTicketId, setCurrentTicketId] = useState<number | string>(101);
  const [upgradeTicketId, setUpgradeTicketId] = useState<string>("");
  const [upgradeCount, setUpgradeCount] = useState<number>(1);
  const [upgradeRequestId, setUpgradeRequestId] = useState<number>(1);

  const [mode, setMode] = useState<"upgrade" | "resend">("upgrade");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyDetails, setVerifyDetails] = useState<any>(null);
  const [confirmResult, setConfirmResult] = useState<any>(null);
  const [resendResult, setResendResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync state when modal opens or target order changes
  useEffect(() => {
    if (isOpen) {
      const txId = order?.transactionId || order?.transaction_reference || defaultTransactionId;
      const email = order?.attendeeEmail || order?.customer_email || defaultCustomerEmail;
      const tierName = order?.tier || order?.ticket_name || "General Entry";
      const qty = order?.quantity || 1;

      setTransactionId(txId);
      setCustomerEmail(email);
      setCurrentTicketName(tierName);
      setUpgradeCount(qty);
      setUpgradeTicketId("");
      setIsVerified(false);
      setVerifyDetails(null);
      setConfirmResult(null);
      setResendResult(null);
      setError(null);

      // Attempt to resolve current ticket ID from available slot tickets
      if (tickets && tickets.length > 0) {
        const matched = tickets.find(
          (t: any) =>
            (t.ticket_name && t.ticket_name.toLowerCase() === tierName.toLowerCase()) ||
            (t.name && t.name.toLowerCase() === tierName.toLowerCase())
        );
        if (matched) {
          setCurrentTicketId(matched.ticket_id || matched.id || 101);
        }
      }
    }
  }, [isOpen, order, defaultTransactionId, defaultCustomerEmail, tickets]);

  if (!isOpen) return null;

  // Filter available target tickets to upgrade to
  const availableTargetTickets = tickets && tickets.length > 0
    ? tickets.filter((t: any) => String(t.ticket_id || t.id) !== String(currentTicketId))
    : [
        { id: "102", name: "VIP Pass", price: 12500 },
        { id: "103", name: "Gold Tier", price: 8500 },
      ];

  const handleVerify = async () => {
    if (!transactionId || !customerEmail) {
      setError("Transaction details are missing.");
      return;
    }
    if (!upgradeTicketId) {
      setError("Please select an upgrade ticket tier.");
      return;
    }
    if (!upgradeCount || upgradeCount < 1) {
      setError("Please enter a valid ticket count.");
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
      const body = {
        current_ticket_id: currentTicketId,
        upgrade_ticket_id: Number(upgradeTicketId) || upgradeTicketId,
        upgrade_ticket_count: Number(upgradeCount) || 1,
        organizer_email: "info@onepay.lk",
      };

      const res: any = await previewTicketUpgrade(queryParams, body);
      const resStatus = res?.data?.status || res?.status;

      if (resStatus === 200 || resStatus === 100) {
        setVerifyDetails(res?.data?.data || res?.data || res);
        setIsVerified(true);
      } else {
        setError(res?.data?.message || "Verification failed.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "An error occurred during upgrade verification.");
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
      const body = {
        current_ticket_id: currentTicketId,
        upgrade_ticket_id: Number(upgradeTicketId) || upgradeTicketId,
        upgrade_ticket_count: Number(upgradeCount) || 1,
        organizer_email: "info@onepay.lk",
      };

      const res: any = await confirmTicketUpgrade(queryParams, body);
      const resStatus = res?.data?.status || res?.status;

      if (resStatus === 200 || resStatus === 100) {
        setConfirmResult(res?.data || res);
      } else {
        setError(res?.data?.message || "Ticket upgrade confirmation failed.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "An error occurred during confirmation.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleResend = async () => {
    setIsVerifying(true);
    setError(null);
    try {
      const res: any = await resendUpgradeConfirmation({ upgrade_request_id: upgradeRequestId });
      setResendResult(res?.data || res);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to resend confirmation email.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 p-6 flex flex-col gap-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ticket Upgrade</h3>
              <p className="text-xs text-zinc-400">Upgrade customer tickets to higher tier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-zinc-800/60 p-1 rounded-xl gap-1">
          <button
            onClick={() => {
              setMode("upgrade");
              setIsVerified(false);
              setVerifyDetails(null);
              setConfirmResult(null);
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "upgrade"
                ? "bg-[#00d07d] text-[#041c14] shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Ticket Upgrade Flow
          </button>
          <button
            onClick={() => {
              setMode("resend");
              setIsVerified(false);
              setVerifyDetails(null);
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "resend"
                ? "bg-[#00d07d] text-[#041c14] shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Resend Email
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === "upgrade" && (
          <div className="flex flex-col gap-4">
            {/* Transaction Reference & Email Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value);
                    setIsVerified(false);
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setIsVerified(false);
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Current Ticket (Read-only) */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Current Ticket
              </label>
              <div className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-400">
                {currentTicketName} (ID: {currentTicketId})
              </div>
            </div>

            {/* Target Upgrade Ticket Selection */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Upgrade Ticket Tier
              </label>
              <select
                value={upgradeTicketId}
                onChange={(e) => {
                  setUpgradeTicketId(e.target.value);
                  setIsVerified(false);
                  setVerifyDetails(null);
                }}
                disabled={isVerifying || isConfirming}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select upgrade ticket tier...</option>
                {availableTargetTickets.map((t: any) => (
                  <option key={t.ticket_id || t.id} value={t.ticket_id || t.id}>
                    {t.ticket_name || t.name}
                    {t.price || t.ticket_amount ? ` — Rs. ${formatNumber(t.price || t.ticket_amount)}.00` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Ticket Upgrade Count */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Number of Tickets to Upgrade
              </label>
              <input
                type="number"
                min={1}
                value={upgradeCount}
                onChange={(e) => {
                  setUpgradeCount(Number(e.target.value));
                  setIsVerified(false);
                }}
                disabled={isVerifying || isConfirming}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Verification Details Breakdown Block */}
            {verifyDetails && (
              <div className="p-4 bg-zinc-800/80 border border-zinc-700 rounded-xl flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Upgrade Verification Details
                </span>
                <pre className="text-[11px] text-zinc-300 font-mono bg-zinc-900/80 p-3 rounded-lg overflow-x-auto max-h-40 border border-zinc-800">
                  {JSON.stringify(verifyDetails, null, 2)}
                </pre>
              </div>
            )}

            {/* Confirmation Result Banner */}
            {confirmResult && (
              <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Ticket upgraded successfully! Upgrade confirmation processed.</span>
              </div>
            )}

            {/* Footer Buttons: Cancel / Verify -> Confirm */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-all"
              >
                Cancel
              </button>

              {!isVerified ? (
                <button
                  type="button"
                  disabled={isVerifying || !upgradeTicketId}
                  onClick={handleVerify}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#041c14] font-bold rounded-xl text-xs transition-all disabled:opacity-50"
                >
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Upgrade"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isConfirming || !!confirmResult}
                  onClick={handleConfirm}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#041c14] font-bold rounded-xl text-xs transition-all disabled:opacity-50"
                >
                  {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Upgrade"}
                </button>
              )}
            </div>
          </div>
        )}

        {mode === "resend" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Upgrade Request ID
              </label>
              <input
                type="number"
                value={upgradeRequestId}
                onChange={(e) => setUpgradeRequestId(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {resendResult && (
              <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Confirmation email re-sent to customer successfully.</span>
              </div>
            )}

            <button
              disabled={isVerifying}
              onClick={handleResend}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#041c14] font-bold rounded-xl text-xs transition-all disabled:opacity-50"
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Resend Upgrade Confirmation Email</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
