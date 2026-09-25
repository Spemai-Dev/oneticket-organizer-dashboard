"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { HeroBanner } from "../../../components/dashboard/hero-banner";
import { ScheduleFilter } from "../../../components/dashboard/schedule-filter";
import { GrossSaleCard, RunRateCard } from "../../../components/dashboard/metric-card";
import { ScanCountCard } from "../../../components/dashboard/scan-count-card";
import { RefundSummaryCard } from "../../../components/dashboard/refund-summary-card";
import { SalesVelocityChart } from "../../../components/dashboard/sales-velocity-chart";
import { PaymentMethodDonut } from "../../../components/dashboard/payment-method-donut";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Bar */}
      <TopbarHeader />

      {/* Hero DJ Solstice Event Banner */}
      <HeroBanner />

      {/* Interactive Location, Date & Time Schedule Filter */}
      <ScheduleFilter />

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
