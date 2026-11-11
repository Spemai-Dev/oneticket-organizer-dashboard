"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PAYMENT_METHOD_STATS } from "../../lib/mock-data";
import { formatNumber, formatAmount } from "../../lib/utils";

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
    <div className="flex h-full flex-col justify-between gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
          Sale by Payment Method
        </h3>
        <p className="text-xs text-zinc-500">Gateway distribution & split</p>
      </div>

      <div className="my-auto flex w-full flex-col items-center gap-5">
        {paymentData.length > 0 ? (
          <>
            <div className="relative mx-auto flex h-44 w-44 shrink-0 items-center justify-center">
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
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                  {currency} {formatAmount(totalAmount)}
                </span>
                <span className="text-[10px] font-medium text-zinc-500">{formatNumber(totalTickets)} tkts</span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2.5 border-t border-zinc-100 pt-2 dark:border-zinc-800">
              {paymentData.map((item: any) => (
                <div key={item.key} className="flex w-full items-center justify-between gap-2 text-xs">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate font-semibold text-zinc-800 dark:text-zinc-200">
                      {item.name}
                    </span>
                    <span className="shrink-0 text-[11px] font-normal text-zinc-400">
                      · {item.count} tkts
                    </span>
                  </div>
                  <span className="shrink-0 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
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
