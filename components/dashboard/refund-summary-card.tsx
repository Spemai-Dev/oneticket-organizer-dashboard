"use client";

import React from "react";
import { RotateCw } from "lucide-react";
import { REFUND_SUMMARY_DATA } from "../../lib/mock-data";
import { formatNumber } from "../../lib/utils";

export function RefundSummaryCard() {
  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
          PAYMENT METHOD WISE REFUND
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
            12 tickets · 1.5% of gross · Rs. 420,000
          </span>
          <button className="h-7 w-7 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-100 transition-colors">
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {REFUND_SUMMARY_DATA.map((item) => (
          <div key={item.gateway} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.gateway}</span>
                <span className="text-zinc-400 font-normal">· {item.refundsCount} refunds</span>
              </div>
              <span className="font-mono font-extrabold text-zinc-900 dark:text-zinc-100">
                Rs. {formatNumber(item.amount)}
              </span>
            </div>

            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.amount / 20000) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
