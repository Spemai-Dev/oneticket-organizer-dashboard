"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { ScheduleFilter } from "../../../components/dashboard/schedule-filter";
import { useDashboard } from "../../../lib/context/dashboard-context";
import { formatNumber, formatAmount } from "../../../lib/utils";
import { Tags } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface RawTierItem {
  id?: string | number;
  ticket_id?: string | number;
  ticket_name?: string;
  name?: string;
  tier_name?: string;
  ticket_amount?: number | string;
  ticket_visualize_amount?: number | string;
  price?: number | string;
  ticket_price?: number | string;
  total_tickets?: number | string;
  total?: number | string;
  remaining_tickets?: number | string;
  available_tickets?: number | string;
  available?: number | string;
  sold_tickets?: number | string;
  is_sold_out?: boolean;
  currency?: string;
  ticket_category_color?: string;
  is_active?: boolean;
  is_free_ticket?: boolean;
  ticket_description?: string;
}

interface DisplayTierItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  total: number;
  sold: number;
  available: number;
  status: string;
  color: string;
  isFree: boolean;
  description: string;
}

export default function TicketTiersPage() {
  const {
    tickets,
    eventData,
    analytics,
    selectedKey,
    venues,
    selectedVenueIndex,
    selectedDayIndex,
    selectedTimeIndex,
    loading,
  } = useDashboard();

  const hasLiveTickets = Array.isArray(tickets) && tickets.length > 0;

  // When a specific venue slot key is selected, display slot tickets
  // If no venue key is selected, fall back to eventData or analytics ticket tiers
  const rawTierList: RawTierItem[] = selectedKey
    ? (tickets as RawTierItem[]) || []
    : hasLiveTickets
    ? (tickets as RawTierItem[])
    : Array.isArray(eventData?.ticket_tiers) && eventData.ticket_tiers.length > 0
    ? (eventData.ticket_tiers as RawTierItem[])
    : Array.isArray(analytics?.event?.ticket_tiers) && analytics.event.ticket_tiers.length > 0
    ? (analytics.event.ticket_tiers as RawTierItem[])
    : [];

  const displayTiers: DisplayTierItem[] = rawTierList.map((t: RawTierItem, idx: number) => {
    const price = Number(t.ticket_amount || t.ticket_visualize_amount || t.price || t.ticket_price || 0);
    const total = Number(t.total_tickets || t.total || 0);
    const remaining = Number(t.remaining_tickets || t.available_tickets || t.available || 0);
    const sold = t.sold_tickets !== undefined ? Number(t.sold_tickets) : Math.max(0, total - remaining);
    const isSoldOut = t.is_sold_out || (total > 0 && remaining === 0);
    const currency = t.currency || eventData?.currency || analytics?.event?.currency || "LKR";
    const color = t.ticket_category_color || "#00d07d";

    let statusText = isSoldOut ? "Sold Out" : "In Stock";
    if (t.is_active === false) statusText = "Inactive";

    return {
      id: String(t.id || t.ticket_id || idx + 1),
      name: t.ticket_name || t.name || t.tier_name || `Tier ${idx + 1}`,
      price,
      currency,
      total,
      sold,
      available: remaining,
      status: statusText,
      color,
      isFree: Boolean(t.is_free_ticket),
      description: t.ticket_description || "",
    };
  });

  const activeTitle = eventData?.event_name || analytics?.event?.event_name || "Active Event";
  const currentVenue = venues?.[selectedVenueIndex]?.venue;
  const currentDay = venues?.[selectedVenueIndex]?.days?.[selectedDayIndex]?.day;
  const currentTime = venues?.[selectedVenueIndex]?.days?.[selectedDayIndex]?.times?.[selectedTimeIndex];
  const timeLabel = currentTime ? `${currentTime.start_time} - ${currentTime.end_time}` : "";
  const venueInfo = currentVenue
    ? `${currentVenue}${currentDay ? ` · ${currentDay}` : ""}${timeLabel ? ` · ${timeLabel}` : ""}`
    : "";

  return (
    <div className="flex flex-col gap-6">
      <TopbarHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Ticket Tiers Management
          </h2>
          <p className="text-xs text-zinc-500">
            Live slot allocation and pricing tiers for {activeTitle}
            {venueInfo && (
              <span className="font-semibold text-zinc-700 dark:text-zinc-300"> ({venueInfo})</span>
            )}
          </p>
        </div>
      </div>

      {/* Interactive Location, Date & Time Schedule Filter */}
      <ScheduleFilter />

      {/* Tier Cards Grid */}
      <div className={loading ? "grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 transition-opacity" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
        {displayTiers.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center flex flex-col items-center justify-center gap-3">
            <Tags className="h-8 w-8 text-zinc-400" />
            <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">No Ticket Tiers Configured</h3>
            <p className="text-xs text-zinc-400">
              {selectedKey
                ? "There are no active ticket tiers allocated for this selected venue slot."
                : "There are no active ticket tiers allocated for this event."}
            </p>
          </div>
        ) : (
          displayTiers.map((tier: DisplayTierItem) => (
            <div
              key={tier.id}
              className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                  >
                    <Tags className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <span className="text-[11px] text-zinc-400">
                      Remaining: {formatNumber(tier.available)} / {formatNumber(tier.total)} (Sold: {formatNumber(tier.sold)})
                    </span>
                  </div>
                </div>
                <Badge variant={tier.status === "In Stock" ? "emerald" : tier.status === "Sold Out" ? "red" : "gray"}>
                  {tier.status}
                </Badge>
              </div>

              <div>
                <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {tier.isFree ? "Free Ticket" : `${tier.currency} ${formatAmount(tier.price)}`}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {tier.description ? tier.description : "Per ticket · Includes portal fee"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="text-zinc-500 font-mono text-[11px]">
                  {selectedKey ? `KEY: ${selectedKey}` : "All Slots"}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Slot Active
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
