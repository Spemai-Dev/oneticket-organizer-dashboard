"use client";

import React from "react";
import { RotateCw } from "lucide-react";
import { REFUND_SUMMARY_DATA } from "../../lib/mock-data";
import { formatNumber } from "../../lib/utils";
import styles from "./refund-summary-card.module.scss";

export function RefundSummaryCard() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>
          PAYMENT METHOD WISE REFUND
        </span>
        <div className={styles.actionGroup}>
          <span className={styles.refundBadge}>
            12 tickets · 1.5% of gross · Rs. 420,000
          </span>
          <button className={styles.refreshBtn}>
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={styles.gatewayList}>
        {REFUND_SUMMARY_DATA.map((item) => (
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
                Rs. {formatNumber(item.amount)}
              </span>
            </div>

            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(item.amount / 20000) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
