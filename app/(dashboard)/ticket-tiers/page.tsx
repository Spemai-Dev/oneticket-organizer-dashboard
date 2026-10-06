"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { useDashboard } from "../../../lib/context/dashboard-context";
import { formatNumber, formatAmount } from "../../../lib/utils";
import { Tags } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export default function TicketTiersPage() {
  const { tickets, eventData, analytics } = useDashboard();

  const hasLiveTickets = tickets && tickets.length > 0;
  const rawTierList = hasLiveTickets
    ? tickets
    : Array.isArray(eventData?.ticket_tiers) && eventData.ticket_tiers.length > 0
    ? eventData.ticket_tiers
    : Array.isArray(analytics?.event?.ticket_tiers) && analytics.event.ticket_tiers.length > 0
    ? analytics.event.ticket_tiers
    : [];

  const displayTiers = rawTierList.map((t: any, idx: number) => {
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
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayTiers.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center flex flex-col items-center justify-center gap-3">
            <Tags className="h-8 w-8 text-zinc-400" />
            <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">No Ticket Tiers Configured</h3>
            <p className="text-xs text-zinc-400">There are no active ticket tiers allocated for this event.</p>
          </div>
        ) : (
          displayTiers.map((tier: any) => (
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

              <div className="flex items-center justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
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
