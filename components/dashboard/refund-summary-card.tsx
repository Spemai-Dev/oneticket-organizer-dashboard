"use client";

import React from "react";
import { RotateCw } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { REFUND_SUMMARY_DATA } from "../../lib/mock-data";
import { formatNumber, formatAmount } from "../../lib/utils";

export function RefundSummaryCard() {
  const { analytics, eventData } = useDashboard();

  const currency = analytics?.event?.currency || eventData?.tickets_currency || "LKR";
  const refundCount = analytics?.summary?.refund_count ?? 0;
  const refundAmount = analytics?.summary?.refund_amount ?? 0;
  const grossSale = analytics?.summary?.gross_ticket_sale ?? 1;
  const refundPercent = grossSale > 0 ? ((refundAmount / grossSale) * 100).toFixed(1) : "0.0";

  const refundByGateway = analytics?.refund_by_payment_method;
  const hasGatewayData = Array.isArray(refundByGateway) && refundByGateway.length > 0;

  const colorPalette = ["#ef4444", "#f97316", "#eab308", "#06b6d4"];

  const displayItems = hasGatewayData
    ? refundByGateway.map((item: any, idx: number) => ({
        gateway: item.payment_method || `Gateway ${idx + 1}`,
        refundsCount: item.tickets ?? item.refund_count ?? 0,
        amount: Number(item.amount || 0),
        color: colorPalette[idx % colorPalette.length],
      }))
    : [];

  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          PAYMENT METHOD WISE REFUND
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {refundCount} tickets · {refundPercent}% of gross · {currency} {formatAmount(refundAmount)}
          </span>
          <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400">
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {displayItems.length > 0 ? (
          displayItems.map((item: any) => (
            <div key={item.gateway} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.gateway}</span>
                  <span className="font-normal text-zinc-400">· {item.refundsCount} refunds</span>
                </div>
                <span className="font-mono font-extrabold text-zinc-900 dark:text-zinc-100">
                  {currency} {formatAmount(item.amount)}
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${refundAmount > 0 ? Math.min(100, Math.max(5, (item.amount / refundAmount) * 100)) : 0}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center text-xs text-zinc-400">
            <span className="font-semibold text-emerald-500 mb-1">✓ Zero Refunds Processed</span>
            <span>No payment method refund activity recorded for this event.</span>
          </div>
        )}
      </div>
    </div>
  );
}
