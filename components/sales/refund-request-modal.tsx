"use client";

import React, { useState } from "react";
import { RotateCcw, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { refundRequest } from "../../lib/services/dashboard";

interface RefundRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTransactionId?: string;
}

export function RefundRequestModal({
  isOpen,
  onClose,
  defaultTransactionId = "12345",
}: RefundRequestModalProps) {
  const [transactionId, setTransactionId] = useState(defaultTransactionId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRefund = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await refundRequest({ transaction_id: transactionId });
      setResult(res?.data || res);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to process full refund request.");
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
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Full Refund Request</h3>
              <p className="text-xs text-zinc-400">Initiate full automated refund for transaction</p>
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
              Event Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {result && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>Full refund request initiated successfully!</span>
            </div>
          )}

          <button
            disabled={loading || !transactionId}
            onClick={handleRefund}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                <span>Submit Refund Request</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
