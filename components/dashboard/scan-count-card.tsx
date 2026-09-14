"use client";

import React from "react";
import { Maximize2 } from "lucide-react";
import { SCAN_COUNT_DATA } from "../../lib/mock-data";
import { formatNumber } from "../../lib/utils";

export function ScanCountCard() {
  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
          TICKET CATEGORY WISE SCAN COUNT
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900">
            1,234 / 3,240 tickets
          </span>
          <button className="h-7 w-7 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center hover:bg-purple-100 transition-colors">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {SCAN_COUNT_DATA.map((item) => {
          const percentage = Math.round((item.scanned / item.total) * 100);
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
                  {item.scanned} <span className="text-zinc-400 font-normal">/ {item.total}</span>
                </span>
              </div>

              <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
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
        })}
      </div>
    </div>
  );
}
