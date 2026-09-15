"use client";

import React from "react";
import { Maximize2 } from "lucide-react";
import { SCAN_COUNT_DATA } from "../../lib/mock-data";
import styles from "./scan-count-card.module.scss";

export function ScanCountCard() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>
          TICKET CATEGORY WISE SCAN COUNT
        </span>
        <div className={styles.actionGroup}>
          <span className={styles.ticketBadge}>
            1,234 / 3,240 tickets
          </span>
          <button className={styles.expandBtn}>
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={styles.categoryList}>
        {SCAN_COUNT_DATA.map((item) => {
          const percentage = Math.round((item.scanned / item.total) * 100);
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
                  {item.scanned} <span className={styles.totalCount}>/ {item.total}</span>
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
        })}
      </div>
    </div>
  );
}
