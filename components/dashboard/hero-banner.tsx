"use client";

import React from "react";
import { CURRENT_EVENT } from "../../lib/mock-data";
import { formatNumber } from "../../lib/utils";

export function HeroBanner() {
  const percentSold = Math.round((CURRENT_EVENT.soldCount / CURRENT_EVENT.totalCapacity) * 1000) / 10;
  const leftCount = CURRENT_EVENT.totalCapacity - CURRENT_EVENT.soldCount;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041c14] via-[#06291e] to-[#083526] text-white p-6 sm:p-7 shadow-xl border border-[#0d4432]">
      {/* Dynamic Background Glow */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#00d07d]/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Poster Image */}
        <div className="relative w-full md:w-56 h-56 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CURRENT_EVENT.imageUrl}
            alt={CURRENT_EVENT.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#00d07d]">Featured Event</span>
            <span className="text-xs font-semibold text-white truncate">{CURRENT_EVENT.subtitle}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col justify-between flex-1 w-full gap-5">
          {/* Top Badges */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {CURRENT_EVENT.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#00d07d]/20 text-[#00d07d] font-semibold border border-[#00d07d]/30">
              {CURRENT_EVENT.ticketTiers.length} Ticket Tiers
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-300 font-mono text-[11px] border border-zinc-700">
              {CURRENT_EVENT.code}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {CURRENT_EVENT.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#97bcac] mt-1 font-medium">
              {CURRENT_EVENT.date} · {CURRENT_EVENT.time} · {CURRENT_EVENT.venue}, {CURRENT_EVENT.city}
            </p>
          </div>

          {/* Pricing Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {CURRENT_EVENT.ticketTiers.map((tier) => (
              <div
                key={tier.id}
                className="px-3 py-1.5 rounded-xl bg-[#093d2c]/80 border border-[#0e543e] text-zinc-300 font-medium"
              >
                <span>{tier.name} </span>
                <span className="font-bold text-[#00d07d]">Rs. {formatNumber(tier.price)}</span>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#0d4432]">
            {/* Sell Through Progress */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-[#7ca898]">
                <span>SELL-THROUGH</span>
                <span className="font-mono text-zinc-300">
                  {formatNumber(CURRENT_EVENT.soldCount)} / {formatNumber(CURRENT_EVENT.totalCapacity)} Sold
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white font-mono">{percentSold}%</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00d07d]/20 text-[#00d07d] text-xs font-bold">
                  {leftCount} Left
                </span>
              </div>
              {/* Green Progress Bar */}
              <div className="h-2 w-full bg-[#083526] rounded-full overflow-hidden border border-[#0d4432]">
                <div
                  className="h-full bg-gradient-to-r from-[#00d07d] to-[#10b981] rounded-full shadow-[0_0_12px_rgba(0,208,125,0.6)] transition-all duration-500"
                  style={{ width: `${percentSold}%` }}
                />
              </div>
            </div>

            {/* Projected Sell Out */}
            <div className="flex flex-col gap-1.5 sm:border-l sm:border-[#0d4432] sm:pl-4">
              <span className="text-[11px] font-bold tracking-wider text-[#7ca898]">
                PROJECTED SELL-OUT
              </span>
              <span className="text-2xl font-extrabold text-white">
                {CURRENT_EVENT.projectedSellOutDate}
              </span>
              <span className="text-xs font-semibold text-[#00d07d]">
                {CURRENT_EVENT.paceStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
