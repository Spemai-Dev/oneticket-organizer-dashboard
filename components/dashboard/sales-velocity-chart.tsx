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
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5 h-full">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">{title}</h3>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900">
            Rs. 27.5M
          </span>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
            3,240 tickets
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-48 mt-2">
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
        <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#00d07d]" />
            Peak Velocity: 194 tickets on Friday, 28 Aug
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            Pacing: +14% vs last week
          </span>
        </div>
      )}
    </div>
  );
}
