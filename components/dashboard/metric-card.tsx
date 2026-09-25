"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber } from "../../lib/utils";
import styles from "./metric-card.module.scss";

export function GrossSaleCard() {
  const { volume, eventData } = useDashboard();

  const totalAmount = volume?.total_amount ?? volume?.venue_total_amount ?? 27540000;
  const totalTickets = volume?.total_tickets ?? volume?.venue_total_tickets ?? 3240;
  const currency = eventData?.tickets_currency || "LKR";

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <span className={styles.headerTitle}>
          GROSS TICKET SALE
        </span>
        <span className={styles.datePill}>
          {currency} Live Telemetry
        </span>
      </div>

      <div>
        <h3 className={styles.mainValue}>
          {currency} {formatNumber(totalAmount)}
        </h3>
        <div className={styles.metaRow}>
          <Badge variant="emerald">{formatNumber(totalTickets)} tickets sold</Badge>
          <span>Venue Filter Active</span>
        </div>
      </div>

      {/* 4 Inner Stats Cards */}
      <div className={styles.innerStatsGrid}>
        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Total Tickets</p>
          <p className={styles.statValue}>{formatNumber(totalTickets)}</p>
          <p className={styles.statSubtext}>Verified orders</p>
        </div>

        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Total Sales Revenue</p>
          <p className={styles.statValue}>{currency} {formatNumber(totalAmount)}</p>
          <p className={styles.statSubtext}>Gross volume</p>
        </div>

        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Average Ticket Value</p>
          <p className={styles.statValue}>
            {currency} {totalTickets > 0 ? formatNumber(Math.round(totalAmount / totalTickets)) : "0.00"}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            Real-time average
          </p>
        </div>

        <div className={styles.trendCard}>
          <p className={styles.trendLabel}>Sales Status</p>
          <p className={styles.trendValue}>Active</p>
          <p className={styles.trendSubtext}>Gateway synchronized</p>
        </div>
      </div>
    </div>
  );
}

export function RunRateCard() {
  const { volume, eventData } = useDashboard();

  const totalTickets = volume?.total_tickets ?? volume?.venue_total_tickets ?? 3240;
  const totalCapacity = eventData?.total_capacity || 4000;
  const percentSold = Math.min(100, Math.round((totalTickets / totalCapacity) * 100));
  const ticketsLeft = Math.max(0, totalCapacity - totalTickets);

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
            <span className={styles.label}>Current Sell-Through Pace</span>
            <span className={styles.value}>{percentSold}% Capacity</span>
          </div>
          <Progress value={percentSold} barClassName="bg-[#00d07d]" className="h-2.5" />
        </div>

        <div className={styles.paceItem}>
          <div className={styles.paceHeader}>
            <span className={styles.label}>Remaining Inventory</span>
            <span className={styles.value}>{ticketsLeft} tkts left</span>
          </div>
          <Progress value={100 - percentSold} barClassName="bg-zinc-300 dark:bg-zinc-700" className="h-2.5" />
        </div>
      </div>

      {/* Circle summary box */}
      <div className={styles.summaryBox}>
        <div className={styles.circleBadge}>
          {percentSold}%
        </div>
        <div className={styles.summaryText}>
          <span className={styles.title}>
            {formatNumber(ticketsLeft)} tickets left
          </span>
          <span className={styles.subtitle}>
            sells out smoothly at current venue velocity
          </span>
        </div>
      </div>
    </div>
  );
}
