"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber, formatAmount } from "../../lib/utils";

export function GrossSaleCard() {
  const { volume, eventData, analytics, selectedKey } = useDashboard();

  const currency = analytics?.event?.currency || eventData?.tickets_currency || eventData?.currency || "LKR";

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

  const grossSale =
    volumeAmount ??
    analytics?.summary?.gross_ticket_sale ??
    analytics?.gross_ticket_sale ??
    analytics?.summary?.gross_revenue ??
    analytics?.gross_revenue ??
    eventData?.gross_revenue ??
    0;

  const refundAmount = Number(analytics?.summary?.refund_amount ?? analytics?.refund_amount ?? 0);
  const netSale =
    (volumeAmount != null ? Math.max(0, volumeAmount - refundAmount) : undefined) ??
    analytics?.summary?.net_sale ??
    analytics?.net_sale ??
    grossSale;

  const ticketsSold =
    volumeTickets ??
    analytics?.summary?.tickets_sold ??
    analytics?.tickets_sold ??
    eventData?.tickets_sold ??
    0;

  const refundCount =
    analytics?.summary?.refund_count ??
    analytics?.refund_count ??
    0;

  const avgValue = ticketsSold > 0 ? grossSale / ticketsSold : (analytics?.average_ticket_size ?? analytics?.summary?.average_ticket_size ?? 0);

  const todayAmount = analytics?.today?.amount ?? analytics?.summary?.today?.amount ?? 0;
  const todayTickets = analytics?.today?.tickets ?? analytics?.summary?.today?.tickets ?? 0;
  const yesterdayAmount = analytics?.yesterday?.amount ?? analytics?.summary?.yesterday?.amount ?? 0;
  const yesterdayTickets = analytics?.yesterday?.tickets ?? analytics?.summary?.yesterday?.tickets ?? 0;
  const trend7d = analytics?.trend_7d_percentage ?? analytics?.summary?.trend_7d_percentage;

  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          GROSS TICKET SALE
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {currency} Live Telemetry
        </span>
      </div>

      <div>
        <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
          {currency} {formatAmount(grossSale)}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <Badge variant="emerald">{formatNumber(ticketsSold)} tickets sold</Badge>
          <span>Net Sale: {currency} {formatAmount(netSale)} · {refundCount} Refunds</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
          <p className="text-[10px] font-semibold text-zinc-400">Today so far</p>
          <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">{currency} {formatAmount(todayAmount)}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">{formatNumber(todayTickets)} tickets</p>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
          <p className="text-[10px] font-semibold text-zinc-400">Yesterday</p>
          <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">{currency} {formatAmount(yesterdayAmount)}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">{formatNumber(yesterdayTickets)} tickets</p>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
          <p className="text-[10px] font-semibold text-zinc-400">Average Ticket Size</p>
          <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {currency} {formatAmount(avgValue)}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Real-time average
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">7-day trend</p>
          <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
            {trend7d != null ? `${trend7d >= 0 ? "↑ " : "↓ "}${trend7d}%` : `${currency} ${formatAmount(netSale)}`}
          </p>
          <p className="mt-0.5 text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
            {trend7d != null ? "vs prior week" : `${refundCount} Refunds`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function RunRateCard() {
  const { volume, eventData, analytics } = useDashboard();

  const ticketsSold =
    analytics?.summary?.tickets_sold ??
    analytics?.tickets_sold ??
    volume?.total_tickets ??
    volume?.venue_total_tickets ??
    eventData?.tickets_sold ??
    0;

  const totalCapacity =
    analytics?.summary?.ticket_capacity ??
    analytics?.ticket_capacity ??
    eventData?.total_capacity ??
    eventData?.ticket_capacity ??
    0;

  const percentSold = analytics?.summary?.sell_through_percentage ?? analytics?.sell_through_percentage ?? (
    totalCapacity > 0 ? Math.min(100, Math.round((ticketsSold / totalCapacity) * 100)) : 0
  );

  const runRate = analytics?.run_rate;
  const ticketsLeft = runRate?.tickets_left ?? analytics?.summary?.tickets_left ?? analytics?.tickets_left ?? Math.max(0, totalCapacity - ticketsSold);
  const daysToEvent = runRate?.days_to_event ?? analytics?.days_to_event;
  const neededPerDay = runRate?.needed_per_day_to_sell_out ?? analytics?.needed_per_day_to_sell_out;
  const currentPace = runRate?.current_pace_per_day ?? analytics?.current_pace_per_day;

  const formatPace = (val: number | undefined | null) => {
    if (val == null) return "0 tkts/day";
    const num = Number(val);
    return Number.isInteger(num) ? `${num} tkts/day` : `${num.toFixed(1)} tkts/day`;
  };

  const curPaceNum = Number(currentPace ?? 0);
  const neededPaceNum = Number(neededPerDay ?? 0);
  const maxPace = Math.max(curPaceNum, neededPaceNum, 1);

  const currentPacePercent = curPaceNum > 0 ? Math.min(100, Math.round((curPaceNum / maxPace) * 100)) : percentSold;
  const neededPacePercent = neededPaceNum > 0 ? Math.min(100, Math.round((neededPaceNum / maxPace) * 100)) : (100 - percentSold);

  const isAhead = curPaceNum >= neededPaceNum && curPaceNum > 0;

  let sellOutText = "sells out smoothly at current venue velocity";
  if (curPaceNum > 0 && ticketsLeft > 0) {
    const days = Math.ceil(ticketsLeft / curPaceNum);
    sellOutText = `sells out in ~${days} days at current pace`;
  } else if (daysToEvent != null) {
    sellOutText = `${daysToEvent} days remaining until event`;
  }

  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          RUN RATE TO EVENT DAY
        </span>
        <Badge variant={isAhead ? "emerald" : "blue"}>
          {isAhead ? "Ahead of pace" : daysToEvent != null ? `${daysToEvent} Days to Event` : "On pace"}
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-500 dark:text-zinc-400">Current pace</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatPace(currentPace)}</span>
          </div>
          <Progress value={currentPacePercent} barClassName="bg-[#00d07d]" className="h-2.5" />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-500 dark:text-zinc-400">Needed to sell out</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatPace(neededPerDay)}</span>
          </div>
          <Progress value={neededPacePercent} barClassName="bg-zinc-200 dark:bg-zinc-700" className="h-2.5" />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/30">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#00d07d] bg-white text-xs font-bold text-[#041c14] shadow-sm dark:bg-zinc-900 dark:text-[#00d07d]">
          {percentSold}%
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {formatNumber(ticketsLeft)} tickets left
          </span>
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            {sellOutText}
          </span>
        </div>
      </div>
    </div>
  );
}
