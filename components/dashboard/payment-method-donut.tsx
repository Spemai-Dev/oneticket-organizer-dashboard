"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PAYMENT_METHOD_STATS } from "../../lib/mock-data";
import { formatNumber } from "../../lib/utils";

export function PaymentMethodDonut() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5 h-full">
      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
          Sale by Payment Method
        </h3>
        <p className="text-xs text-zinc-500">Gateway distribution & split</p>
      </div>

      <div className="flex flex-col items-center gap-5 my-auto w-full">
        {/* Centered Donut Chart with Center Text */}
        <div className="relative w-44 h-44 shrink-0 mx-auto flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_METHOD_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {PAYMENT_METHOD_STATS.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-zinc-900 text-white p-2 rounded-xl text-xs shadow-xl border border-zinc-800">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-emerald-400 font-semibold">{data.count} tickets</p>
                          <p className="text-zinc-400">Rs. {formatNumber(data.amount)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
              Loading...
            </div>
          )}

          {/* Center Text overlay inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
              Rs. 27.5M
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">3,240 tkts</span>
          </div>
        </div>

        {/* Legend List underneath chart spanning full width */}
        <div className="flex flex-col gap-2.5 w-full pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {PAYMENT_METHOD_STATS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between text-xs w-full gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {item.name}
                </span>
                <span className="text-zinc-400 font-normal text-[11px] shrink-0">
                  · {item.count}
                </span>
              </div>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0 text-right">
                Rs. {(item.amount / 1000000).toFixed(1)}M
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
