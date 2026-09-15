"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import styles from "./metric-card.module.scss";

export function GrossSaleCard() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <span className={styles.headerTitle}>
          GROSS TICKET SALE
        </span>
        <span className={styles.datePill}>
          Sat, 30 Aug 2026
        </span>
      </div>

      <div>
        <h3 className={styles.mainValue}>
          Rs. 27,540,000.00
        </h3>
        <div className={styles.metaRow}>
          <Badge variant="emerald">3,240 tickets sold</Badge>
          <span>Net Rs. 26,120,000</span>
          <span>·</span>
          <span>12 refunds</span>
        </div>
      </div>

      {/* 4 Inner Stats Cards */}
      <div className={styles.innerStatsGrid}>
        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Today so far</p>
          <p className={styles.statValue}>Rs. 480,000</p>
          <p className={styles.statSubtext}>62 tickets</p>
        </div>

        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Yesterday</p>
          <p className={styles.statValue}>Rs. 512,000</p>
          <p className={styles.statSubtext}>70 tickets</p>
        </div>

        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Average Ticket Size</p>
          <p className={styles.statValue}>Rs. 8,500</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            +18% above benchmark
          </p>
        </div>

        <div className={styles.trendCard}>
          <p className={styles.trendLabel}>7-day trend</p>
          <p className={styles.trendValue}>↑ 14%</p>
          <p className={styles.trendSubtext}>vs prior week</p>
        </div>
      </div>
    </div>
  );
}

export function RunRateCard() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <span className={styles.headerTitle}>
          RUN RATE TO EVENT DAY
        </span>
        <Badge variant="emerald">Ahead of pace</Badge>
      </div>

      <div className={styles.paceContainer}>
        <div className={styles.paceItem}>
          <div className={styles.paceHeader}>
            <span className={styles.label}>Current pace</span>
            <span className={styles.value}>12 tkts/day</span>
          </div>
          <Progress value={80} barClassName="bg-[#00d07d]" className="h-2.5" />
        </div>

        <div className={styles.paceItem}>
          <div className={styles.paceHeader}>
            <span className={styles.label}>Needed to sell out</span>
            <span className={styles.value}>3 tkts/day</span>
          </div>
          <Progress value={30} barClassName="bg-zinc-300 dark:bg-zinc-700" className="h-2.5" />
        </div>
      </div>

      {/* Circle summary box */}
      <div className={styles.summaryBox}>
        <div className={styles.circleBadge}>
          96%
        </div>
        <div className={styles.summaryText}>
          <span className={styles.title}>
            760 tickets left
          </span>
          <span className={styles.subtitle}>
            sells out in ~10 days at current pace
          </span>
        </div>
      </div>
    </div>
  );
}
