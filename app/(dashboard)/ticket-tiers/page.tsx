"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { CURRENT_EVENT } from "../../../lib/mock-data";
import { formatNumber } from "../../../lib/utils";
import { Tags, Plus, Edit2, Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export default function TicketTiersPage() {
  return (
    <div className="flex flex-col gap-6">
      <TopbarHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Ticket Tiers Management
          </h2>
          <p className="text-xs text-zinc-500">
            Configure pricing, allocation limits and early-bird rules for {CURRENT_EVENT.title}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#00d07d] hover:bg-[#00b36b] text-[#041c14] rounded-xl text-xs font-bold shadow-md transition-all">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Add Ticket Tier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CURRENT_EVENT.ticketTiers.map((tier) => (
          <div
            key={tier.id}
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Tags className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <span className="text-[11px] text-zinc-400">Active Category</span>
                </div>
              </div>
              <Badge variant="emerald">In Stock</Badge>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                Rs. {formatNumber(tier.price)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Per ticket · Includes portal fee</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Sales Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
