"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { Wallet, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export default function PayoutsPage() {
  return (
    <div className="flex flex-col gap-6">
      <TopbarHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Payouts & Bank Settlements
          </h2>
          <p className="text-xs text-zinc-500">
            View automated ticket revenue payouts, merchant settlements & bank transfer history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-4">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">AVAILABLE FOR PAYOUT</span>
          <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Rs. 8,420,000.00</h3>
          <button className="w-full py-2.5 bg-[#00d07d] text-[#041c14] font-bold text-xs rounded-xl hover:bg-[#00b36b] transition-all">
            Request Instant Payout
          </button>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-4">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">TOTAL SETTLED TO DATE</span>
          <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Rs. 17,700,000.00</h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Commercial Bank (A/C ****4829)</span>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-4">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">PENDING GATEWAY CLEARANCE</span>
          <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Rs. 1,420,000.00</h3>
          <span className="text-xs text-zinc-400">Clears in T+1 business day</span>
        </div>
      </div>
    </div>
  );
}
