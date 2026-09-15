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
import styles from "./gate-scan-chart.module.scss";

const SCAN_TIMELINE_DATA = [
  { time: "6:00 PM", scans: 45, total: 45 },
  { time: "6:30 PM", scans: 120, total: 165 },
  { time: "7:00 PM", scans: 280, total: 445 },
  { time: "7:30 PM", scans: 410, total: 855 },
  { time: "8:00 PM", scans: 560, total: 1415 },
  { time: "8:30 PM", scans: 390, total: 1805 },
  { time: "9:00 PM", scans: 210, total: 2015 },
  { time: "9:30 PM", scans: 95, total: 2110 },
  { time: "10:00 PM", scans: 30, total: 2140 },
];

export function GateScanChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            Peak: 560 scans/hr
          </span>
          <span className={styles.speedBadge}>
            Avg 1.2s per scan
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className={styles.chartContainer}>
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={SCAN_TIMELINE_DATA}
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
                        <p className="mt-1 font-semibold">{data.scans} scans/hr</p>
                        <p className="text-zinc-400">Cumulative: {data.total} scanned</p>
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
          <span className={styles.value}>2,140 / 3,240</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.label}>PEAK WINDOW</span>
          <span className={styles.value}>8:00 - 8:30 PM</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.label}>GATE EFFICIENCY</span>
          <span className={styles.value} style={{ color: "#00d07d" }}>98.4% Valid</span>
        </div>
      </div>
    </div>
  );
}
