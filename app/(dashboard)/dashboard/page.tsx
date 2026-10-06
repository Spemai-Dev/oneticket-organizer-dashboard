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
import { useDashboard } from "../../../lib/context/dashboard-context";

export default function DashboardPage() {
  const { loading } = useDashboard();

  return (
    <div className="relative flex flex-col gap-6">
      {/* Loading Progress Bar Indicator */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#00d07d]/20 overflow-hidden">
          <div className="h-full bg-[#00d07d] animate-pulse w-full origin-left" />
        </div>
      )}

      {/* Top Header Bar */}
      <TopbarHeader />

      {/* Main Content Area */}
      <div className={loading ? "opacity-60 transition-opacity duration-200 pointer-events-none" : "transition-opacity duration-200"}>
        {/* Hero Event Banner */}
        <HeroBanner />

        {/* Interactive Location, Date & Time Schedule Filter */}
        <div className="mt-6">
          <ScheduleFilter />
        </div>

        {/* Top Metric Cards Row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GrossSaleCard />
          <RunRateCard />
        </div>

        {/* Category Scans & Refunds Breakdown Row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScanCountCard />
          <RefundSummaryCard />
        </div>

        {/* 30-Day Sales Velocity & Payment Gateway Donut Row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesVelocityChart />
          </div>
          <div className="lg:col-span-1">
            <PaymentMethodDonut />
          </div>
        </div>
      </div>
    </div>
  );
}
