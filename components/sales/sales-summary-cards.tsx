"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber, formatAmount } from "../../lib/utils";

export function SalesSummaryCards() {
  const { analytics, eventData, volume, selectedKey } = useDashboard();

  const currency = analytics?.event?.currency || eventData?.tickets_currency || eventData?.currency || "LKR";

  // Priority to volume API data for total_amount and venue_total_amount
  const volumeAmount = selectedKey && volume?.venue_total_amount != null
    ? Number(volume.venue_total_amount)
    : volume?.total_amount != null
    ? Number(volume.total_amount)
    : undefined;

  const volumeTickets = selectedKey && volume?.venue_total_tickets != null
    ? Number(volume.venue_total_tickets)
    : volume?.total_tickets != null
    ? Number(volume.total_tickets)
    : undefined;

  const grossSale = volumeAmount ?? Number(analytics?.summary?.gross_ticket_sale ?? analytics?.gross_ticket_sale ?? eventData?.gross_revenue ?? 0);
  const refundAmount = Number(analytics?.summary?.refund_amount ?? analytics?.refund_amount ?? 0);
  const netSale = (volumeAmount != null ? Math.max(0, volumeAmount - refundAmount) : undefined) ?? Number(analytics?.summary?.net_sale ?? analytics?.net_sale ?? grossSale);

  const ticketsSold = volumeTickets ?? Number(analytics?.summary?.tickets_sold ?? analytics?.tickets_sold ?? eventData?.tickets_sold ?? 0);
  const totalCapacity = Number(analytics?.summary?.ticket_capacity ?? eventData?.total_capacity ?? 0);
  const ticketsLeft = Number(analytics?.summary?.tickets_left ?? Math.max(0, totalCapacity - ticketsSold));
  const sellThroughPercent = analytics?.summary?.sell_through_percentage ?? (
    totalCapacity > 0 ? Math.min(100, Math.round((ticketsSold / totalCapacity) * 100)) : 0
  );
  const refundCount = Number(analytics?.summary?.refund_count ?? 0);
  const gatewayFees = Number(analytics?.summary?.payment_gateway_fees ?? 0);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            TOTAL GROSS SALE
          </span>
          <Badge variant="emerald" className="gap-1">
            Live Telemetry
          </Badge>
        </div>

        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {currency} {formatAmount(grossSale)}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">Gross event revenue</p>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
          <span className="text-zinc-500">
            Avg Daily: {currency} {ticketsSold > 0 ? formatAmount(grossSale / Math.max(1, ticketsSold)) : "0.00"} / tkt
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Synchronized</span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            TICKETS SOLD
          </span>
          <Badge variant="emerald">{sellThroughPercent}% Cap</Badge>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {formatNumber(ticketsSold)}
            </h3>
            <span className="text-sm font-semibold text-zinc-400">/ {formatNumber(totalCapacity)}</span>
          </div>
          <Progress value={Math.min(100, Math.max(0, sellThroughPercent))} barClassName="bg-[#00d07d]" className="mt-2 h-2.5" />
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
          <span className="text-zinc-500">{formatNumber(ticketsLeft)} tickets left</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Active Sales</span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            NET SALE
          </span>
          <Badge variant={refundCount > 0 ? "red" : "emerald"}>
            {refundCount} refunds
          </Badge>
        </div>

        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {currency} {formatAmount(netSale)}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            {currency} {formatAmount(refundAmount)} refunded
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
          <span className="text-zinc-500">Payment gateway fees</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">{currency} {formatAmount(gatewayFees)}</span>
        </div>
      </div>
    </div>
  );
}
