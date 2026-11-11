"use client";

import React from "react";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { CURRENT_EVENT } from "../../lib/mock-data";
import { formatNumber, formatAmount, getImageUrl } from "../../lib/utils";

export function HeroBanner() {
  const {
    eventData,
    volume,
    tickets,
    analytics,
    venues,
    selectedVenueIndex,
    selectedDayIndex,
    selectedTimeIndex,
  } = useDashboard();

  const title = analytics?.event?.event_name || eventData?.event_name || "Event Overview";
  const subtitle = eventData?.event_description || "Event Details & Sales Telemetry";
  const category = analytics?.event?.category_name || eventData?.category || "Event";
  const eventCode = analytics?.event?.event_details || eventData?.event_code || "";
  const currency = analytics?.event?.currency || eventData?.tickets_currency || "LKR";

  // Selected schedule filter venue, day, time or fallback to event metadata
  const selectedVenueName =
    venues?.[selectedVenueIndex]?.venue ||
    eventData?.venue_name ||
    eventData?.venue ||
    eventData?.location ||
    analytics?.event?.venue_name ||
    "Main Venue";

  const selectedDayObj = venues?.[selectedVenueIndex]?.days?.[selectedDayIndex];
  const rawDateVal =
    selectedDayObj?.day ||
    eventData?.event_date ||
    eventData?.event_datetime ||
    eventData?.date;

  let displayDate = "TBA";
  if (rawDateVal) {
    try {
      const d = new Date(rawDateVal);
      displayDate = !isNaN(d.getTime())
        ? d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
        : String(rawDateVal);
    } catch {
      displayDate = String(rawDateVal);
    }
  }

  const selectedTimeObj = selectedDayObj?.times?.[selectedTimeIndex];
  const displayTime = selectedTimeObj
    ? `${selectedTimeObj.start_time}${selectedTimeObj.end_time ? ` - ${selectedTimeObj.end_time}` : ""}`
    : eventData?.time || "All Day";

  const imagePath = eventData?.poster_image || eventData?.event_banner || analytics?.event?.poster_image || analytics?.event?.event_banner || eventData?.imageUrl;
  const bannerImg = getImageUrl(imagePath, CURRENT_EVENT.imageUrl);

  const soldCount = analytics?.summary?.tickets_sold ?? volume?.total_tickets ?? volume?.venue_total_tickets ?? 0;
  const totalCapacity = analytics?.summary?.ticket_capacity ?? eventData?.total_capacity ?? 0;

  const percentSold = analytics?.summary?.sell_through_percentage ?? (
    totalCapacity > 0 ? Math.min(100, Math.round((soldCount / totalCapacity) * 1000) / 10) : 0
  );
  const leftCount = analytics?.summary?.tickets_left ?? Math.max(0, totalCapacity - soldCount);
  const grossSale = analytics?.summary?.gross_ticket_sale ?? volume?.total_amount ?? volume?.venue_total_amount ?? 0;

  // Render ticket tiers from analytics or tickets state
  const apiTiers = analytics?.event?.ticket_tiers;
  const tierList = Array.isArray(apiTiers) && apiTiers.length > 0
    ? apiTiers.map((t: any) => ({
        id: t.id,
        name: t.ticket_name,
        price: Number(t.ticket_amount || 0),
      }))
    : tickets.length > 0
    ? tickets.map((t: any) => ({
        id: t.id,
        name: t.ticket_name,
        price: Number(t.ticket_amount || 0),
      }))
    : [];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#0d4432] bg-gradient-to-r from-[#041c14] via-[#06291e] to-[#083526] p-6 text-white shadow-xl sm:p-7">
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[#00d07d]/10 blur-3xl" />

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="group relative h-56 w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImg}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00d07d]">Active Event</span>
            <span className="truncate text-xs font-semibold text-white">{subtitle}</span>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col justify-between gap-5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 font-semibold text-amber-400">
              {category}
            </span>
            <span className="rounded-full border border-[#00d07d]/30 bg-[#00d07d]/20 px-3 py-1 font-semibold text-[#00d07d]">
              {tierList.length} Ticket Tiers
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-800/80 px-3 py-1 font-mono text-[11px] text-zinc-300">
              {eventCode}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-[#97bcac]">
              <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                <MapPin className="h-3.5 w-3.5 text-[#00d07d]" />
                <span>{selectedVenueName}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Calendar className="h-3.5 w-3.5 text-[#00d07d]" />
                <span>{displayDate}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Clock className="h-3.5 w-3.5 text-[#00d07d]" />
                <span>{displayTime}</span>
              </span>
              <span>·</span>
              <span>Currency: <strong className="text-white">{currency}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {tierList.map((tier) => (
              <div key={tier.id} className="rounded-xl border border-[#0e543e] bg-[#093d2c]/80 px-3 py-1.5 font-medium text-zinc-300">
                <span>{tier.name} </span>
                <span className="font-bold text-[#00d07d]">{currency} {formatAmount(tier.price)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-[#0d4432] pt-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-[#7ca898]">
                <span>SELL-THROUGH</span>
                <span className="font-mono text-zinc-300">
                  {formatNumber(soldCount)} / {formatNumber(totalCapacity)} Sold
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-extrabold text-white">{percentSold}%</span>
                <span className="rounded-full bg-[#00d07d]/20 px-2 py-0.5 text-xs font-bold text-[#00d07d]">
                  {leftCount} Left
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-[#0d4432] bg-[#083526]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00d07d] to-emerald-500 shadow-[0_0_12px_rgba(0,208,125,0.6)] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, percentSold))}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:border-l sm:border-[#0d4432] sm:pl-4">
              <span className="text-[11px] font-bold tracking-wider text-[#7ca898]">
                TOTAL VENUE REVENUE
              </span>
              <span className="text-2xl font-extrabold text-white">
                {currency} {formatAmount(grossSale)}
              </span>
              <span className="text-xs font-semibold text-[#00d07d]">
                Live Sales Telemetry
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
