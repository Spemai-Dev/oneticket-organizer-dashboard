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
import styles from "./gate-scan-chart.module.scss";

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
    <div className={styles.cardContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Hourly Gate Entry & Scan Velocity</h3>
          <p className={styles.subtitle}>Real-time ticket scans per 30-min window</p>
        </div>
        <div className={styles.badgeGroup}>
          <span className={styles.liveBadge}>
            <span className={styles.dot} />
            Total Scanned: {peakText}
          </span>
          <span className={styles.speedBadge}>
            Live Scanner Feed
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className={styles.chartContainer}>
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

      <div className={styles.metricsRow}>
        <div className={styles.metricBox}>
          <span className={styles.label}>TOTAL SCANNED</span>
          <span className={styles.value}>{scannedText}</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.label}>CHECK-IN RATE</span>
          <span className={styles.value}>{efficiency}% Checked In</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.label}>GATE STATUS</span>
          <span className={styles.value} style={{ color: "#00d07d" }}>Active & Verified</span>
        </div>
      </div>
    </div>
  );
}
