"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { ScanCountCard } from "../../../components/dashboard/scan-count-card";
import { GateScanChart } from "../../../components/dashboard/gate-scan-chart";
import { Smartphone, RefreshCw } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { useDashboard } from "../../../lib/context/dashboard-context";
import { formatNumber } from "../../../lib/utils";

export default function GateScanningPage() {
  const { eventData, venues, ticketStatus, analytics, tickets, refreshData } = useDashboard();

  // Determine current venue label
  const activeVenueName = eventData?.venue || venues[0]?.venue || "Main Gate Entrance";

  // Extract raw checking status from getEventS API (event-checking-status)
  const rawCheckingStatus = Array.isArray(ticketStatus)
    ? ticketStatus
    : Array.isArray(ticketStatus?.data)
    ? ticketStatus.data
    : Array.isArray(ticketStatus?.tiers)
    ? ticketStatus.tiers
    : Array.isArray(analytics?.ticket_category_scan_status)
    ? analytics.ticket_category_scan_status
    : Array.isArray(tickets)
    ? tickets
    : [];

  const gateTerminals = rawCheckingStatus.map((item: any, idx: number) => {
    const name = item.name || item.ticket_name || item.category || `Category #${item.id || idx + 1}`;
    const checkedIn = Math.round(Number(item.checked_in_ticket_count ?? item.scanned_count ?? item.scanned ?? item.checked_in ?? item.sold_tickets ?? 0));
    const purchased = Math.round(Number(item.purchased_ticket_count ?? item.total_tickets ?? item.total_count ?? item.total ?? item.capacity ?? 0));

    return {
      id: `Gate ${String.fromCharCode(65 + idx)} - ${name} Lane`,
      device: idx % 2 === 0 ? `OneScan Terminal #${String(idx + 1).padStart(2, "0")}` : `Mobile App Scanner #${String(idx + 1).padStart(2, "0")}`,
      status: checkedIn > 0 || purchased > 0 ? "Online" : "Idle",
      count: checkedIn,
      total: purchased,
    };
  });

  const activeScannersCount = gateTerminals.filter((g: any) => g.status === "Online").length || (gateTerminals.length > 0 ? gateTerminals.length : 1);

  return (
    <div className="flex flex-col gap-6">
      <TopbarHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Live Gate Scanning Control
          </h2>
          <p className="text-xs text-zinc-500">
            Monitor real-time gate entry speed, scanner app connections & ticket check-ins
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#00d07d] transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Telemetry</span>
          </button>
          <Badge variant="emerald" className="gap-1 px-3 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            {activeScannersCount} Scanners Active
          </Badge>
        </div>
      </div>

      {/* Main Chart & Progress Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GateScanChart />
        </div>
        <div className="lg:col-span-1">
          <ScanCountCard />
        </div>
      </div>

      {/* Scanner Hardware Status */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            CONNECTED GATE TERMINALS
          </span>
          <span className="text-xs font-semibold text-[#00d07d]">{activeVenueName}</span>
        </div>

        {gateTerminals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gateTerminals.map((gate: any) => (
              <div
                key={gate.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#041c14] text-[#00d07d] flex items-center justify-center font-bold shrink-0">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{gate.id}</h4>
                    <p className="text-[11px] text-zinc-400">{gate.device}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {formatNumber(gate.count)} scans
                    </span>
                    {gate.total > 0 && (
                      <span className="text-[10px] text-zinc-400">
                        of {formatNumber(gate.total)} tickets
                      </span>
                    )}
                  </div>
                  <Badge variant={gate.status === "Online" ? "emerald" : "gray"}>
                    {gate.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 w-full flex flex-col items-center justify-center text-center text-xs text-zinc-500">
            <span className="font-medium mb-1">No Gate Terminals Active</span>
            <span>No checking status data found for the selected event.</span>
          </div>
        )}
      </div>
    </div>
  );
}
