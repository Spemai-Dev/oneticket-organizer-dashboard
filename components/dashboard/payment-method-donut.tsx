"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PAYMENT_METHOD_STATS } from "../../lib/mock-data";
import { formatNumber, formatAmount } from "../../lib/utils";
import styles from "./payment-method-donut.module.scss";

import { useDashboard } from "../../lib/context/dashboard-context";

export function PaymentMethodDonut() {
  const [mounted, setMounted] = useState(false);
  const { analytics, eventData, volume } = useDashboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currency = analytics?.event?.currency || eventData?.tickets_currency || "LKR";

  const rawPaymentMethods = analytics?.sale_by_payment_method;
  const hasPaymentData = Array.isArray(rawPaymentMethods) && rawPaymentMethods.length > 0;

  const colorPalette = ["#00d07d", "#3b82f6", "#a855f7", "#f59e0b", "#ec4899"];

  const paymentData = hasPaymentData
    ? rawPaymentMethods.map((item: any, idx: number) => ({
        key: item.payment_method || `pm-${idx}`,
        name: item.payment_method || "Payment Method",
        count: Number(item.tickets || 0),
        amount: Number(item.amount || 0),
        color: colorPalette[idx % colorPalette.length],
      }))
    : [];

  const totalAmount = hasPaymentData
    ? paymentData.reduce((acc: number, cur: any) => acc + cur.amount, 0)
    : Number(analytics?.summary?.gross_ticket_sale || volume?.total_amount || 0);

  const totalTickets = hasPaymentData
    ? paymentData.reduce((acc: number, cur: any) => acc + cur.count, 0)
    : Number(analytics?.summary?.tickets_sold || volume?.total_tickets || 0);

  return (
    <div className={styles.cardContainer}>
      <div>
        <h3 className={styles.title}>
          Sale by Payment Method
        </h3>
        <p className={styles.subtitle}>Gateway distribution & split</p>
      </div>

      <div className={styles.chartContent}>
        {paymentData.length > 0 ? (
          <>
            {/* Centered Donut Chart with Center Text */}
            <div className={styles.chartWrapper}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {paymentData.map((entry: any) => (
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
                              <p className="text-zinc-400">{currency} {formatAmount(data.amount)}</p>
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
                  {currency} {formatAmount(totalAmount)}
                </span>
                <span className={styles.totalTickets}>{formatNumber(totalTickets)} tkts</span>
              </div>
            </div>

            {/* Legend List underneath chart */}
            <div className={styles.legendList}>
              {paymentData.map((item: any) => (
                <div key={item.key} className={styles.legendItem}>
                  <div className={styles.methodInfo}>
                    <span
                      className={styles.colorDot}
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={styles.methodName}>
                      {item.name}
                    </span>
                    <span className={styles.countSubtext}>
                      · {item.count} tkts
                    </span>
                  </div>
                  <span className={styles.amountText}>
                    {currency} {formatAmount(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 w-full flex flex-col items-center justify-center text-center text-xs text-zinc-500">
            <span className="font-medium mb-1">No Payment Method Data</span>
            <span>No payment gateway transaction details recorded.</span>
          </div>
        )}
      </div>
    </div>
  );
}
