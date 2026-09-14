"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { Ticket, Plus, Percent } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export default function CouponCodesPage() {
  const coupons = [
    { code: "EARLYBIRD20", discount: "20% OFF", uses: "420 / 500", status: "Active", expires: "30 Aug 2026" },
    { code: "NEONVIP10", discount: "Rs. 1,000 OFF", uses: "88 / 100", status: "Active", expires: "28 Aug 2026" },
    { code: "CONFRONTGUEST", discount: "100% Complimentary", uses: "15 / 20", status: "Expired", expires: "15 Aug 2026" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <TopbarHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Coupon Codes & Promo Marketing
          </h2>
          <p className="text-xs text-zinc-500">
            Create discount codes, track conversion rates and manage promotional offers
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#00d07d] hover:bg-[#00b36b] text-[#041c14] rounded-xl text-xs font-bold shadow-md transition-all">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                {coupon.code}
              </span>
              <Badge variant={coupon.status === "Active" ? "emerald" : "gray"}>
                {coupon.status}
              </Badge>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                {coupon.discount}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Redemptions: {coupon.uses}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
              <span>Valid until</span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{coupon.expires}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
