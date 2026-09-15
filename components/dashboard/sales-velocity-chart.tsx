"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SALES_VELOCITY_DATA } from "../../lib/mock-data";
import { formatNumber } from "../../lib/utils";
import styles from "./sales-velocity-chart.module.scss";

interface SalesVelocityChartProps {
  title?: string;
  subtitle?: string;
  showPeakInfo?: boolean;
}

export function SalesVelocityChart({
  title = "Ticket Sales · Last 30 Days",
  subtitle = "Daily velocity & sales volume",
  showPeakInfo = false,
}: SalesVelocityChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.badgeGroup}>
          <span className={styles.revenueBadge}>
            Rs. 27.5M
          </span>
          <span className={styles.ticketsBadge}>
            3,240 tickets
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className={styles.chartContainer}>
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SALES_VELOCITY_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="shortDate"
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
                        <p className="font-bold text-[#00d07d]">{data.shortDate}</p>
                        <p className="mt-1 font-semibold">{data.volume} tickets sold</p>
                        <p className="text-zinc-400">Rs. {formatNumber(data.amount)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                {SALES_VELOCITY_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === SALES_VELOCITY_DATA.length - 3 ? "#00e676" : "#10b981"}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
            Loading chart...
          </div>
        )}
      </div>

      {showPeakInfo && (
        <div className={styles.peakInfoRow}>
          <span className={styles.peakLabel}>
            <span className={styles.greenDot} />
            Peak Velocity: 194 tickets on Friday, 28 Aug
          </span>
          <span className={styles.pacingText}>
            Pacing: +14% vs last week
          </span>
        </div>
      )}
    </div>
  );
}
