"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PAYMENT_METHOD_STATS } from "../../lib/mock-data";
import { formatNumber } from "../../lib/utils";
import styles from "./payment-method-donut.module.scss";

export function PaymentMethodDonut() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.cardContainer}>
      <div>
        <h3 className={styles.title}>
          Sale by Payment Method
        </h3>
        <p className={styles.subtitle}>Gateway distribution & split</p>
      </div>

      <div className={styles.chartContent}>
        {/* Centered Donut Chart with Center Text */}
        <div className={styles.chartWrapper}>
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
          <div className={styles.centerOverlay}>
            <span className={styles.totalAmount}>
              Rs. 27.5M
            </span>
            <span className={styles.totalTickets}>3,240 tkts</span>
          </div>
        </div>

        {/* Legend List underneath chart spanning full width */}
        <div className={styles.legendList}>
          {PAYMENT_METHOD_STATS.map((item) => (
            <div
              key={item.key}
              className={styles.legendItem}
            >
              <div className={styles.methodInfo}>
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: item.color }}
                />
                <span className={styles.methodName}>
                  {item.name}
                </span>
                <span className={styles.countSubtext}>
                  · {item.count}
                </span>
              </div>
              <span className={styles.amountText}>
                Rs. {(item.amount / 1000000).toFixed(1)}M
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
