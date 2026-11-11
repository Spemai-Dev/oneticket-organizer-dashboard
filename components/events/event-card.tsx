"use client";

import React from "react";
import { Event } from "../../types";
import { formatNumber, formatAmount } from "../../lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const sold = Number(event.soldCount || 0);
  const total = Number(event.totalCapacity || 1);
  const percentSold = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0;
  const currency = event.currency || "LKR";
  const grossRevenue = event.grossRevenue !== undefined && event.grossRevenue > 0
    ? Number(event.grossRevenue)
    : sold * 8500;

  const getStatusBadge = (status: string) => {
    const isLive = status === "Live";
    const isUpcoming = status === "Upcoming";
    const statusClass = isLive
      ? "border-emerald-200 bg-emerald-50/80 text-emerald-600 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-400"
      : isUpcoming
      ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800/60 dark:bg-blue-950/30 dark:text-blue-400"
      : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClass}`}>
        <span className="h-2 w-2 rounded-full bg-current" />
        {status === "Live" ? "Live" : status}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-4 sm:gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-[7.5rem] w-[6.5rem] shrink-0 cursor-pointer rounded-2xl border border-black/5 object-cover shadow-md transition duration-300 hover:scale-105 hover:shadow-lg sm:h-[8.5rem] sm:w-[7.5rem] dark:border-white/10"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-[#382405] px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                {event.category}
              </span>
              <span className="rounded-full bg-[#042e1d] px-2.5 py-0.5 text-[10px] font-bold text-[#00d07d]">
                {event.ticketTiers.length} Ticket Tiers
              </span>
            </div>
            {getStatusBadge(event.status)}
          </div>

          <h3 className="mt-0.5 cursor-pointer truncate text-base font-extrabold text-zinc-900 transition-colors hover:text-[#00d07d] sm:text-lg dark:text-white" title={event.title}>
            {event.title}
          </h3>

          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {event.date} · {event.venue}, {event.city}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Sold: <strong className="font-extrabold text-zinc-900 dark:text-white">{formatNumber(event.soldCount)}</strong> / {formatNumber(event.totalCapacity)}
          </span>
          <span className="font-extrabold text-[#00d07d]">{percentSold}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-[#00d07d] transition-[width] duration-500"
            style={{ width: `${percentSold}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">GROSS REVENUE</span>
        <h4 className="text-xl font-extrabold text-zinc-900 sm:text-[1.375rem] dark:text-white">
          {currency} {formatAmount(grossRevenue)}
        </h4>
      </div>
    </div>
  );
}
