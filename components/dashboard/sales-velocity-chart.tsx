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
import { formatNumber, formatAmount } from "../../lib/utils";
import styles from "./sales-velocity-chart.module.scss";

import { useDashboard } from "../../lib/context/dashboard-context";

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
  const { analytics, eventData, volume } = useDashboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currency = analytics?.event?.currency || eventData?.tickets_currency || "LKR";

  const raw30Days = analytics?.sales_last_30_days;
  const has30DaysData = Array.isArray(raw30Days) && raw30Days.length > 0;

  const chartData = has30DaysData
    ? raw30Days.map((item: any) => {
        let shortDate = item.date;
        if (item.date && item.date.includes("-")) {
          const parts = item.date.split("-");
          if (parts.length === 3) {
            const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            shortDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }
        }
        return {
          shortDate,
          fullDate: item.date,
          volume: Number(item.tickets || 0),
          amount: Number(item.amount || 0),
        };
      })
    : [];

  const totalRevenue = has30DaysData
    ? chartData.reduce((acc: number, cur: any) => acc + cur.amount, 0)
    : Number(analytics?.summary?.gross_ticket_sale || volume?.total_amount || 0);

  const totalTickets = has30DaysData
    ? chartData.reduce((acc: number, cur: any) => acc + cur.volume, 0)
    : Number(analytics?.summary?.tickets_sold || volume?.total_tickets || 0);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.badgeGroup}>
          <span className={styles.revenueBadge}>
            {currency} {formatAmount(totalRevenue)}
          </span>
          <span className={styles.ticketsBadge}>
            {formatNumber(totalTickets)} tickets
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className={styles.chartContainer}>
        {mounted ? (
          chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                          <p className="text-zinc-400">{currency} {formatAmount(data.amount)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === chartData.length - 1 ? "#00e676" : "#10b981"}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-zinc-500">
              <span className="font-medium mb-1">No Sales Velocity Data</span>
              <span>No ticket sales activity recorded in the last 30 days.</span>
            </div>
          )
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
            Daily Velocity Active
          </span>
          <span className={styles.pacingText}>
            30-Day Sales Telemetry
          </span>
        </div>
      )}
    </div>
  );
}
