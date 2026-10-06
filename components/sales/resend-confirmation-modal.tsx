"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, CheckCircle2, AlertCircle, Loader2, Send, X } from "lucide-react";
import { reSend } from "../../lib/services/dashboard";

interface ResendConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTransactionId?: string;
}

export function ResendConfirmationModal({
  isOpen,
  onClose,
  defaultTransactionId = "R0VP1192CE2B5DCE8C15C",
}: ResendConfirmationModalProps) {
  const [transactionId, setTransactionId] = useState(defaultTransactionId);
  const [sendSms, setSendSms] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await reSend({
        onepay_transaction_id: transactionId,
        is_send_sms: sendSms,
        is_send_email: sendEmail,
      });
      setResult(res?.data || res);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to resend event confirmation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Resend Confirmation</h3>
              <p className="text-xs text-zinc-400">Send event confirmation via SMS or Email</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              OnePay Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2.5 bg-zinc-800/60 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-xs font-semibold text-zinc-300">Dispatch Channels</span>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-500"
              />
              <div className="flex items-center gap-2 text-xs text-zinc-200">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>Send Confirmation Email</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendSms}
                onChange={(e) => setSendSms(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-500"
              />
              <div className="flex items-center gap-2 text-xs text-zinc-200">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Send SMS Notification</span>
              </div>
            </label>
          </div>

          {result && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>Event confirmation sent successfully!</span>
            </div>
          )}

          <button
            disabled={loading || (!sendEmail && !sendSms)}
            onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Dispatch Confirmation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
