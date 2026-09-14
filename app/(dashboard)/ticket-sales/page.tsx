"use client";

import React from "react";
import { Download } from "lucide-react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { SalesSummaryCards } from "../../../components/sales/sales-summary-cards";
import { SalesVelocityChart } from "../../../components/dashboard/sales-velocity-chart";
import { PaymentMethodDonut } from "../../../components/dashboard/payment-method-donut";
import { SalesDataTable } from "../../../components/sales/sales-data-table";

export default function TicketSalesPage() {
  const handleExportCSV = () => {
    alert("Exporting CSV report for Neon Nights Vol. 3 orders...");
  };

  const actionButton = (
    <button
      onClick={handleExportCSV}
      className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-all cursor-pointer"
    >
      <Download className="h-3.5 w-3.5" />
      <span>Export CSV</span>
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Bar */}
      <TopbarHeader actionButton={actionButton} />

      {/* Top 3 Summary Metric Cards */}
      <SalesSummaryCards />

      {/* Middle Row: Sales Velocity & Gateway Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesVelocityChart
            title="Sales Velocity & Daily Volume"
            subtitle="Track daily order surges leading to festival opening date"
            showPeakInfo={true}
          />
        </div>
        <div className="lg:col-span-1">
          <PaymentMethodDonut />
        </div>
      </div>

      {/* Orders Data Table Section */}
      <SalesDataTable />
    </div>
  );
}
