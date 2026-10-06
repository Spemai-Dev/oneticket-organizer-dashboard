"use client";

import React from "react";
import { Maximize2 } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber } from "../../lib/utils";
import styles from "./scan-count-card.module.scss";

const getCategoryColor = (categoryName: string) => {
  const lower = (categoryName || "").toLowerCase();
  if (lower.includes("gold")) return "#f59e0b";
  if (lower.includes("silver")) return "#94a3b8";
  if (lower.includes("vip")) return "#a855f7";
  if (lower.includes("general") || lower.includes("early")) return "#00d07d";
  return "#3b82f6";
};

export function ScanCountCard() {
  const { ticketStatus, analytics, tickets } = useDashboard();

  // Extract checking status list from ticketStatus (event-checking-status API) or analytics fallback
  const rawList = Array.isArray(ticketStatus)
    ? ticketStatus
    : Array.isArray(ticketStatus?.data)
    ? ticketStatus.data
    : Array.isArray(ticketStatus?.tiers)
    ? ticketStatus.tiers
    : Array.isArray(analytics?.ticket_category_scan_status)
    ? analytics.ticket_category_scan_status
    : Array.isArray(tickets)
    ? tickets
    : [];

  const displayItems = rawList.map((item: any) => {
    const category = item.name || item.ticket_name || item.category || `Category #${item.id || ""}`;
    const scanned = Math.round(Number(item.checked_in_ticket_count ?? item.scanned_count ?? item.scanned ?? item.checked_in ?? item.sold_tickets ?? 0));
    const total = Math.round(Number(item.purchased_ticket_count ?? item.total_tickets ?? item.total_count ?? item.total ?? item.capacity ?? 0));

    return {
      category,
      scanned,
      total,
      color: item.ticket_category_color || getCategoryColor(category),
    };
  });

  // Calculate totals
  const totalScanned = displayItems.reduce((acc: number, cur: any) => acc + cur.scanned, 0);
  const totalCapacity = displayItems.reduce((acc: number, cur: any) => acc + cur.total, 0);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>
          TICKET CATEGORY WISE SCAN COUNT
        </span>
        <div className={styles.actionGroup}>
          <span className={styles.ticketBadge}>
            {formatNumber(totalScanned)} / {formatNumber(totalCapacity)} tickets scanned
          </span>
          <button className={styles.expandBtn}>
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={styles.categoryList}>
        {displayItems.length > 0 ? (
          displayItems.map((item: any) => {
            const totalVal = item.total > 0 ? item.total : 1;
            const percentage = Math.min(100, Math.round((item.scanned / totalVal) * 100));
            return (
              <div key={item.category} className={styles.categoryItem}>
                <div className={styles.metaHeader}>
                  <div className={styles.categoryInfo}>
                    <span
                      className={styles.colorDot}
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.category}</span>
                  </div>
                  <span className={styles.countText}>
                    {formatNumber(item.scanned)} <span className={styles.totalCount}>/ {formatNumber(item.total)}</span>
                  </span>
                </div>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 w-full flex flex-col items-center justify-center text-center text-xs text-zinc-500">
            <span className="font-medium mb-1">No Scan Data Available</span>
            <span>No checking status found for this event.</span>
          </div>
        )}
      </div>
    </div>
  );
}
