"use client";

import React from "react";
import { Maximize2, Tag } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber, formatAmount } from "../../lib/utils";

const getCategoryColor = (categoryName: string) => {
  const lower = (categoryName || "").toLowerCase();
  if (lower.includes("gold")) return "#f59e0b";
  if (lower.includes("silver")) return "#94a3b8";
  if (lower.includes("vip")) return "#a855f7";
  if (lower.includes("general") || lower.includes("early")) return "#00d07d";
  return "#3b82f6";
};

interface ScanDisplayItem {
  id: string | number;
  category: string;
  amount: number;
  sold: number;
  remaining: number;
  total: number;
  scanned?: number;
  isSoldOut: boolean;
  isFree: boolean;
  color: string;
}

interface RawCheckingItem {
  id?: string | number;
  name?: string;
  ticket_name?: string;
  category?: string;
  checked_in_ticket_count?: string | number;
  scanned_count?: string | number;
  scanned?: string | number;
  checked_in?: string | number;
  purchased_ticket_count?: string | number;
  total_tickets?: string | number;
  total_count?: string | number;
  total?: string | number;
  capacity?: string | number;
  sold_tickets?: string | number;
  ticket_category_color?: string;
}

interface RawSlotTicketItem {
  id?: string | number;
  ticket_name?: string;
  name?: string;
  total_tickets?: string | number;
  remaining_tickets?: string | number;
  ticket_amount?: string | number;
  ticket_visualize_amount?: string | number;
  ticket_description?: string;
  is_free_ticket?: boolean;
  show_remaining_tickets?: boolean;
  is_active?: boolean;
  is_sold_out?: boolean;
  ticket_category_color?: string;
}

export function ScanCountCard() {
  const { ticketStatus, analytics, tickets, eventData } = useDashboard();

  const currency =
    analytics?.event?.currency ||
    eventData?.tickets_currency ||
    eventData?.currency ||
    "LKR";

  const hasSlotTickets = Array.isArray(tickets) && tickets.length > 0;

  const rawCheckingStatus: RawCheckingItem[] = Array.isArray(ticketStatus)
    ? (ticketStatus as RawCheckingItem[])
    : Array.isArray((ticketStatus as { data?: unknown })?.data)
    ? ((ticketStatus as { data: RawCheckingItem[] }).data)
    : Array.isArray((ticketStatus as { tiers?: unknown })?.tiers)
    ? ((ticketStatus as { tiers: RawCheckingItem[] }).tiers)
    : [];

  const slotTicketsList = (tickets || []) as RawSlotTicketItem[];

  // Prioritize tickets from tickets-by-slot API when available
  const displayItems: ScanDisplayItem[] = hasSlotTickets
    ? slotTicketsList.map((item: RawSlotTicketItem, idx: number) => {
        const category = item.ticket_name || item.name || `Ticket #${item.id || idx + 1}`;
        const total = Math.round(Number(item.total_tickets ?? 0));
        const remaining = Math.round(Number(item.remaining_tickets ?? 0));
        const sold = Math.max(0, total - remaining);
        const amount = Number(item.ticket_visualize_amount ?? item.ticket_amount ?? 0);
        const isSoldOut = Boolean(item.is_sold_out || (total > 0 && remaining === 0));

        // Cross-reference checking status for gate scans
        const statusMatch = rawCheckingStatus.find(
          (s) =>
            s.id === item.id ||
            s.name === item.ticket_name ||
            s.ticket_name === item.ticket_name ||
            s.category === item.ticket_name
        );
        const scanned = statusMatch
          ? Math.round(Number(statusMatch.checked_in_ticket_count ?? statusMatch.scanned_count ?? 0))
          : undefined;

        return {
          id: item.id || idx + 1,
          category,
          amount,
          sold,
          remaining,
          total,
          scanned,
          isSoldOut,
          isFree: Boolean(item.is_free_ticket),
          color: item.ticket_category_color || getCategoryColor(category),
        };
      })
    : (rawCheckingStatus.length > 0
        ? rawCheckingStatus
        : Array.isArray(analytics?.ticket_category_scan_status)
        ? (analytics.ticket_category_scan_status as RawCheckingItem[])
        : []
      ).map((item: RawCheckingItem, idx: number) => {
        const category = item.name || item.ticket_name || item.category || `Category #${item.id || idx + 1}`;
        const scanned = Math.round(
          Number(item.checked_in_ticket_count ?? item.scanned_count ?? item.scanned ?? item.checked_in ?? item.sold_tickets ?? 0)
        );
        const total = Math.round(
          Number(item.purchased_ticket_count ?? item.total_tickets ?? item.total_count ?? item.total ?? item.capacity ?? 0)
        );
        return {
          id: item.id || idx + 1,
          category,
          amount: 0,
          sold: scanned,
          remaining: Math.max(0, total - scanned),
          total,
          scanned,
          isSoldOut: total > 0 && scanned >= total,
          isFree: false,
          color: item.ticket_category_color || getCategoryColor(category),
        };
      });

  // Calculate totals
  const totalSold = displayItems.reduce((acc, cur) => acc + cur.sold, 0);
  const totalCapacity = displayItems.reduce((acc, cur) => acc + cur.total, 0);
  const totalRemaining = displayItems.reduce((acc, cur) => acc + cur.remaining, 0);
  const hasScans = displayItems.some((cur) => cur.scanned !== undefined);
  const totalScanned = displayItems.reduce((acc, cur) => acc + (cur.scanned || 0), 0);

  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-emerald-500" />
          <span>{hasSlotTickets ? "Ticket Categories & Availability" : "Ticket Category Wise Scan Count"}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
            {hasSlotTickets
              ? `${formatNumber(totalSold)} / ${formatNumber(totalCapacity)} sold (${formatNumber(totalRemaining)} left)`
              : `${formatNumber(totalScanned)} / ${formatNumber(totalCapacity)} tickets scanned`}
          </span>
          <button
            type="button"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400"
            aria-label="Expand category card"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {displayItems.length > 0 ? (
          displayItems.map((item) => {
            const totalVal = item.total > 0 ? item.total : 1;
            const progressVal = hasSlotTickets ? item.sold : (item.scanned ?? item.sold);
            const percentage = Math.min(100, Math.round((progressVal / totalVal) * 100));

            return (
              <div key={item.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.category}</span>

                    {item.amount > 0 && (
                      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {currency} {formatAmount(item.amount)}
                      </span>
                    )}

                    {item.isFree && (
                      <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        Free
                      </span>
                    )}

                    {item.isSoldOut && (
                      <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {formatNumber(item.sold)}{" "}
                      <span className="font-normal text-zinc-400">/ {formatNumber(item.total)}</span>
                    </span>

                    {item.remaining != null && (
                      <span className="text-[11px] text-zinc-400">
                        ({formatNumber(item.remaining)} left)
                      </span>
                    )}

                    {hasScans && item.scanned !== undefined && (
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        · {formatNumber(item.scanned)} scanned
                      </span>
                    )}
                  </div>
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
            <span className="font-medium mb-1">No Ticket Data Available</span>
            <span>No ticket categories or checking status found for this slot.</span>
          </div>
        )}
      </div>
    </div>
  );
}
