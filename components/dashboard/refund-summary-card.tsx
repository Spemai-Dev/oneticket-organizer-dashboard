"use client";

import React from "react";
import { RotateCw } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { REFUND_SUMMARY_DATA } from "../../lib/mock-data";
import { formatNumber, formatAmount } from "../../lib/utils";
import styles from "./refund-summary-card.module.scss";

export function RefundSummaryCard() {
  const { analytics, eventData } = useDashboard();

  const currency = analytics?.event?.currency || eventData?.tickets_currency || "LKR";
  const refundCount = analytics?.summary?.refund_count ?? 0;
  const refundAmount = analytics?.summary?.refund_amount ?? 0;
  const grossSale = analytics?.summary?.gross_ticket_sale ?? 1;
  const refundPercent = grossSale > 0 ? ((refundAmount / grossSale) * 100).toFixed(1) : "0.0";

  const refundByGateway = analytics?.refund_by_payment_method;
  const hasGatewayData = Array.isArray(refundByGateway) && refundByGateway.length > 0;

  const colorPalette = ["#ef4444", "#f97316", "#eab308", "#06b6d4"];

  const displayItems = hasGatewayData
    ? refundByGateway.map((item: any, idx: number) => ({
        gateway: item.payment_method || `Gateway ${idx + 1}`,
        refundsCount: item.tickets ?? item.refund_count ?? 0,
        amount: Number(item.amount || 0),
        color: colorPalette[idx % colorPalette.length],
      }))
    : [];

  return (
    <div className={styles.cardContainer}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>
          PAYMENT METHOD WISE REFUND
        </span>
        <div className={styles.actionGroup}>
          <span className={styles.refundBadge}>
            {refundCount} tickets · {refundPercent}% of gross · {currency} {formatAmount(refundAmount)}
          </span>
          <button className={styles.refreshBtn}>
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={styles.gatewayList}>
        {displayItems.length > 0 ? (
          displayItems.map((item: any) => (
            <div key={item.gateway} className={styles.gatewayItem}>
              <div className={styles.metaHeader}>
                <div className={styles.gatewayInfo}>
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.gateway}</span>
                  <span className={styles.countSubtext}>· {item.refundsCount} refunds</span>
                </div>
                <span className={styles.amountText}>
                  {currency} {formatAmount(item.amount)}
                </span>
              </div>

              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${refundAmount > 0 ? Math.min(100, Math.max(5, (item.amount / refundAmount) * 100)) : 0}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center text-xs text-zinc-400">
            <span className="font-semibold text-emerald-500 mb-1">✓ Zero Refunds Processed</span>
            <span>No payment method refund activity recorded for this event.</span>
          </div>
        )}
      </div>
    </div>
  );
}
