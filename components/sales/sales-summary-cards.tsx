"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export function SalesSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1 */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            TOTAL GROSS SALE
          </span>
          <Badge variant="emerald" className="gap-1">
            ↗ +18.4%
          </Badge>
        </div>

        <div>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Rs. 27,540,000.00
          </h3>
          <p className="text-xs text-zinc-500 mt-1">vs target Rs. 24.5M forecast</p>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-zinc-500">Avg Daily: Rs. 918,000</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">On Track</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            TICKETS SOLD
          </span>
          <Badge variant="emerald">81.0% Cap</Badge>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              3,240
            </h3>
            <span className="text-sm font-semibold text-zinc-400">/ 4,000</span>
          </div>
          <Progress value={81} barClassName="bg-[#00d07d]" className="h-2.5 mt-2" />
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-zinc-500">760 tickets left</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">4 days ahead</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            NET SALE
          </span>
          <Badge variant="red">12 refunds</Badge>
        </div>

        <div>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Rs. 26,120,000.00
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Rs. 420,000 refunded (1.5%)</p>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-zinc-500">Payment gateway fees</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">Rs. 1,000,000</span>
        </div>
      </div>
    </div>
  );
}
