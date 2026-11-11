"use client";

import React from "react";
import { Maximize2 } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber } from "../../lib/utils";

const getCategoryColor = (categoryName: string) => {
  const lower = (categoryName || "").toLowerCase();
  if (lower.includes("gold")) return "#f59e0b";
  if (lower.includes("silver")) return "#94a3b8";
  if (lower.includes("vip")) return "#a855f7";
  if (lower.includes("general") || lower.includes("early")) return "#00d07d";
  return "#3b82f6";
};

export function ScanCountCard() {
  const { ticketStatus, analytics, tickets } = useDashboard();

  // Extract checking status list from ticketStatus (event-checking-status API) or analytics fallback
  const rawList = Array.isArray(ticketStatus)
    ? ticketStatus
    : Array.isArray(ticketStatus?.data)
    ? ticketStatus.data
    : Array.isArray(ticketStatus?.tiers)
    ? ticketStatus.tiers
    : Array.isArray(analytics?.ticket_category_scan_status)
    ? analytics.ticket_category_scan_status
    : Array.isArray(tickets)
    ? tickets
    : [];

  const displayItems = rawList.map((item: any) => {
    const category = item.name || item.ticket_name || item.category || `Category #${item.id || ""}`;
    const scanned = Math.round(Number(item.checked_in_ticket_count ?? item.scanned_count ?? item.scanned ?? item.checked_in ?? item.sold_tickets ?? 0));
    const total = Math.round(Number(item.purchased_ticket_count ?? item.total_tickets ?? item.total_count ?? item.total ?? item.capacity ?? 0));

    return {
      category,
      scanned,
      total,
      color: item.ticket_category_color || getCategoryColor(category),
    };
  });

  // Calculate totals
  const totalScanned = displayItems.reduce((acc: number, cur: any) => acc + cur.scanned, 0);
  const totalCapacity = displayItems.reduce((acc: number, cur: any) => acc + cur.total, 0);

  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          TICKET CATEGORY WISE SCAN COUNT
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
            {formatNumber(totalScanned)} / {formatNumber(totalCapacity)} tickets scanned
          </span>
          <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {displayItems.length > 0 ? (
          displayItems.map((item: any) => {
            const totalVal = item.total > 0 ? item.total : 1;
            const percentage = Math.min(100, Math.round((item.scanned / totalVal) * 100));
            return (
              <div key={item.category} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.category}</span>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {formatNumber(item.scanned)} <span className="font-normal text-zinc-400">/ {formatNumber(item.total)}</span>
                  </span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 w-full flex flex-col items-center justify-center text-center text-xs text-zinc-500">
            <span className="font-medium mb-1">No Scan Data Available</span>
            <span>No checking status found for this event.</span>
          </div>
        )}
      </div>
    </div>
  );
}
