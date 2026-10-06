"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber, formatAmount } from "../../lib/utils";
import styles from "./metric-card.module.scss";

export function GrossSaleCard() {
  const { volume, eventData, analytics, selectedKey } = useDashboard();

  const currency = analytics?.event?.currency || eventData?.tickets_currency || eventData?.currency || "LKR";

  const volumeAmount = selectedKey && volume?.venue_total_amount != null
    ? Number(volume.venue_total_amount)
    : volume?.total_amount != null
    ? Number(volume.total_amount)
    : undefined;

  const volumeTickets = selectedKey && volume?.venue_total_tickets != null
    ? Number(volume.venue_total_tickets)
    : volume?.total_tickets != null
    ? Number(volume.total_tickets)
    : undefined;

  const grossSale =
    volumeAmount ??
    analytics?.summary?.gross_ticket_sale ??
    analytics?.gross_ticket_sale ??
    analytics?.summary?.gross_revenue ??
    analytics?.gross_revenue ??
    eventData?.gross_revenue ??
    0;

  const refundAmount = Number(analytics?.summary?.refund_amount ?? analytics?.refund_amount ?? 0);
  const netSale =
    (volumeAmount != null ? Math.max(0, volumeAmount - refundAmount) : undefined) ??
    analytics?.summary?.net_sale ??
    analytics?.net_sale ??
    grossSale;

  const ticketsSold =
    volumeTickets ??
    analytics?.summary?.tickets_sold ??
    analytics?.tickets_sold ??
    eventData?.tickets_sold ??
    0;

  const refundCount =
    analytics?.summary?.refund_count ??
    analytics?.refund_count ??
    0;

  const avgValue = ticketsSold > 0 ? grossSale / ticketsSold : (analytics?.average_ticket_size ?? analytics?.summary?.average_ticket_size ?? 0);

  const todayAmount = analytics?.today?.amount ?? analytics?.summary?.today?.amount ?? 0;
  const todayTickets = analytics?.today?.tickets ?? analytics?.summary?.today?.tickets ?? 0;
  const yesterdayAmount = analytics?.yesterday?.amount ?? analytics?.summary?.yesterday?.amount ?? 0;
  const yesterdayTickets = analytics?.yesterday?.tickets ?? analytics?.summary?.yesterday?.tickets ?? 0;
  const trend7d = analytics?.trend_7d_percentage ?? analytics?.summary?.trend_7d_percentage;

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
          {currency} {formatAmount(grossSale)}
        </h3>
        <div className={styles.metaRow}>
          <Badge variant="emerald">{formatNumber(ticketsSold)} tickets sold</Badge>
          <span>Net Sale: {currency} {formatAmount(netSale)} · {refundCount} Refunds</span>
        </div>
      </div>

      {/* 4 Inner Stats Cards */}
      <div className={styles.innerStatsGrid}>
        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Today so far</p>
          <p className={styles.statValue}>{currency} {formatAmount(todayAmount)}</p>
          <p className={styles.statSubtext}>{formatNumber(todayTickets)} tickets</p>
        </div>

        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Yesterday</p>
          <p className={styles.statValue}>{currency} {formatAmount(yesterdayAmount)}</p>
          <p className={styles.statSubtext}>{formatNumber(yesterdayTickets)} tickets</p>
        </div>

        <div className={styles.innerStatCard}>
          <p className={styles.statLabel}>Average Ticket Size</p>
          <p className={styles.statValue}>
            {currency} {formatAmount(avgValue)}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            Real-time average
          </p>
        </div>

        <div className={styles.trendCard}>
          <p className={styles.trendLabel}>7-day trend</p>
          <p className={styles.trendValue}>
            {trend7d != null ? `${trend7d >= 0 ? "↑ " : "↓ "}${trend7d}%` : `${currency} ${formatAmount(netSale)}`}
          </p>
          <p className={styles.trendSubtext}>
            {trend7d != null ? "vs prior week" : `${refundCount} Refunds`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function RunRateCard() {
  const { volume, eventData, analytics } = useDashboard();

  const ticketsSold =
    analytics?.summary?.tickets_sold ??
    analytics?.tickets_sold ??
    volume?.total_tickets ??
    volume?.venue_total_tickets ??
    eventData?.tickets_sold ??
    0;

  const totalCapacity =
    analytics?.summary?.ticket_capacity ??
    analytics?.ticket_capacity ??
    eventData?.total_capacity ??
    eventData?.ticket_capacity ??
    0;

  const percentSold = analytics?.summary?.sell_through_percentage ?? analytics?.sell_through_percentage ?? (
    totalCapacity > 0 ? Math.min(100, Math.round((ticketsSold / totalCapacity) * 100)) : 0
  );

  const runRate = analytics?.run_rate;
  const ticketsLeft = runRate?.tickets_left ?? analytics?.summary?.tickets_left ?? analytics?.tickets_left ?? Math.max(0, totalCapacity - ticketsSold);
  const daysToEvent = runRate?.days_to_event ?? analytics?.days_to_event;
  const neededPerDay = runRate?.needed_per_day_to_sell_out ?? analytics?.needed_per_day_to_sell_out;
  const currentPace = runRate?.current_pace_per_day ?? analytics?.current_pace_per_day;

  const formatPace = (val: number | undefined | null) => {
    if (val == null) return "0 tkts/day";
    const num = Number(val);
    return Number.isInteger(num) ? `${num} tkts/day` : `${num.toFixed(1)} tkts/day`;
  };

  const curPaceNum = Number(currentPace ?? 0);
  const neededPaceNum = Number(neededPerDay ?? 0);
  const maxPace = Math.max(curPaceNum, neededPaceNum, 1);

  const currentPacePercent = curPaceNum > 0 ? Math.min(100, Math.round((curPaceNum / maxPace) * 100)) : percentSold;
  const neededPacePercent = neededPaceNum > 0 ? Math.min(100, Math.round((neededPaceNum / maxPace) * 100)) : (100 - percentSold);

  const isAhead = curPaceNum >= neededPaceNum && curPaceNum > 0;

  let sellOutText = "sells out smoothly at current venue velocity";
  if (curPaceNum > 0 && ticketsLeft > 0) {
    const days = Math.ceil(ticketsLeft / curPaceNum);
    sellOutText = `sells out in ~${days} days at current pace`;
  } else if (daysToEvent != null) {
    sellOutText = `${daysToEvent} days remaining until event`;
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <span className={styles.headerTitle}>
          RUN RATE TO EVENT DAY
        </span>
        <Badge variant={isAhead ? "emerald" : "blue"}>
          {isAhead ? "Ahead of pace" : daysToEvent != null ? `${daysToEvent} Days to Event` : "On pace"}
        </Badge>
      </div>

      <div className={styles.paceContainer}>
        <div className={styles.paceItem}>
          <div className={styles.paceHeader}>
            <span className={styles.label}>Current pace</span>
            <span className={styles.value}>{formatPace(currentPace)}</span>
          </div>
          <Progress value={currentPacePercent} barClassName="bg-[#00d07d]" className="h-2.5" />
        </div>

        <div className={styles.paceItem}>
          <div className={styles.paceHeader}>
            <span className={styles.label}>Needed to sell out</span>
            <span className={styles.value}>{formatPace(neededPerDay)}</span>
          </div>
          <Progress value={neededPacePercent} barClassName="bg-zinc-200 dark:bg-zinc-700" className="h-2.5" />
        </div>
      </div>

      {/* Circle summary box & Run Rate Metrics */}
      <div className={styles.summaryBox}>
        <div className={styles.circleBadge}>
          {percentSold}%
        </div>
        <div className={styles.summaryText}>
          <span className={styles.title}>
            {formatNumber(ticketsLeft)} tickets left
          </span>
          <span className={styles.subtitle}>
            {sellOutText}
          </span>
        </div>
      </div>
    </div>
  );
}
