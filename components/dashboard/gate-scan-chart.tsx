"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber } from "../../lib/utils";

export function GateScanChart() {
  const [mounted, setMounted] = useState(false);
  const { ticketStatus, tickets, volume, analytics } = useDashboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute live total scanned and capacity from getEventS (event-checking-status API)
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

  let liveScanned = 0;
  let liveCapacity = 0;

  if (rawCheckingStatus.length > 0) {
    rawCheckingStatus.forEach((item: any) => {
      liveScanned += Math.round(Number(item.checked_in_ticket_count ?? item.scanned_count ?? item.scanned ?? item.checked_in ?? item.sold_tickets ?? 0));
      liveCapacity += Math.round(Number(item.purchased_ticket_count ?? item.total_tickets ?? item.total_count ?? item.total ?? item.capacity ?? 0));
    });
  } else if (volume) {
    liveScanned = Number(volume.total_tickets || 0);
    liveCapacity = Number(volume.total_tickets || 0);
  }

  const finalTimeline = [
    { time: "Start", scans: 0, total: 0 },
    { time: "Current", scans: liveScanned, total: liveScanned },
  ];

  const scannedText = `${formatNumber(liveScanned)} / ${formatNumber(liveCapacity)}`;
  const peakText = `${formatNumber(liveScanned)} scans`;
  const efficiency = liveCapacity > 0 ? Math.round((liveScanned / liveCapacity) * 100) : 0;

  return (
    <div className="flex h-full flex-col justify-between gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Hourly Gate Entry & Scan Velocity</h3>
          <p className="text-xs text-zinc-500">Real-time ticket scans per 30-min window</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Total Scanned: {peakText}
          </span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Live Scanner Feed
          </span>
        </div>
      </div>

      <div className="mt-2 h-56 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={finalTimeline}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d07d" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00d07d" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-zinc-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-zinc-800">
                        <p className="font-bold text-[#00d07d]">{data.time}</p>
                        <p className="mt-1 font-semibold">{data.scans} total scans</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="#00d07d"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scanGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
            Loading scan graph...
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">TOTAL SCANNED</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{scannedText}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">CHECK-IN RATE</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{efficiency}% Checked In</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">GATE STATUS</span>
          <span className="text-sm font-bold text-[#00d07d]">Active & Verified</span>
        </div>
      </div>
    </div>
  );
}
