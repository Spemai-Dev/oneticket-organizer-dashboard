"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export function GrossSaleCard() {
  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
          GROSS TICKET SALE
        </span>
        <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
          Sat, 30 Aug 2026
        </span>
      </div>

      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Rs. 27,540,000.00
        </h3>
        <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-zinc-500">
          <Badge variant="emerald">3,240 tickets sold</Badge>
          <span>Net Rs. 26,120,000</span>
          <span>·</span>
          <span>12 refunds</span>
        </div>
      </div>

      {/* 4 Inner Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
          <p className="text-[10px] font-semibold text-zinc-400">Today so far</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Rs. 480,000</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">62 tickets</p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
          <p className="text-[10px] font-semibold text-zinc-400">Yesterday</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Rs. 512,000</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">70 tickets</p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
          <p className="text-[10px] font-semibold text-zinc-400">Average Ticket Size</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Rs. 8,500</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            +18% above benchmark
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">7-day trend</p>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">↑ 14%</p>
          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">vs prior week</p>
        </div>
      </div>
    </div>
  );
}

export function RunRateCard() {
  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
          RUN RATE TO EVENT DAY
        </span>
        <Badge variant="emerald">Ahead of pace</Badge>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-zinc-500 dark:text-zinc-400">Current pace</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">12 tkts/day</span>
          </div>
          <Progress value={80} barClassName="bg-[#00d07d]" className="h-2.5" />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-zinc-500 dark:text-zinc-400">Needed to sell out</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">3 tkts/day</span>
          </div>
          <Progress value={30} barClassName="bg-zinc-300 dark:bg-zinc-700" className="h-2.5" />
        </div>
      </div>

      {/* Circle summary box */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-full border-2 border-[#00d07d] flex items-center justify-center font-bold text-xs text-[#041c14] dark:text-[#00d07d] bg-white dark:bg-zinc-900 shadow-sm">
          96%
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            760 tickets left
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            sells out in ~10 days at current pace
          </span>
        </div>
      </div>
    </div>
  );
}
