"use client";

import React, { useState } from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { HeroBanner } from "../../../components/dashboard/hero-banner";
import { GrossSaleCard, RunRateCard } from "../../../components/dashboard/metric-card";
import { ScanCountCard } from "../../../components/dashboard/scan-count-card";
import { RefundSummaryCard } from "../../../components/dashboard/refund-summary-card";
import { SalesVelocityChart } from "../../../components/dashboard/sales-velocity-chart";
import { PaymentMethodDonut } from "../../../components/dashboard/payment-method-donut";

export default function DashboardPage() {
  const [selectedDay, setSelectedDay] = useState("All Days");

  const dayTabs = [
    "All Days",
    "Day 1 (20th Oct)",
    "Day 2 (21st Oct)",
    "Day 3 (22nd Oct)",
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Bar */}
      <TopbarHeader />

      {/* Hero DJ Solstice Event Banner */}
      <HeroBanner />

      {/* Day Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {dayTabs.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedDay === day
                ? "bg-[#043825] text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Top Metric Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrossSaleCard />
        <RunRateCard />
      </div>

      {/* Category Scans & Refunds Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScanCountCard />
        <RefundSummaryCard />
      </div>

      {/* 30-Day Sales Velocity & Payment Gateway Donut Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesVelocityChart />
        </div>
        <div className="lg:col-span-1">
          <PaymentMethodDonut />
        </div>
      </div>
    </div>
  );
}
