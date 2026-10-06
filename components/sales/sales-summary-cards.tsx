"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatNumber, formatAmount } from "../../lib/utils";
import styles from "./sales-summary-cards.module.scss";

export function SalesSummaryCards() {
  const { analytics, eventData, volume, selectedKey } = useDashboard();

  const currency = analytics?.event?.currency || eventData?.tickets_currency || eventData?.currency || "LKR";

  // Priority to volume API data for total_amount and venue_total_amount
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

  const grossSale = volumeAmount ?? Number(analytics?.summary?.gross_ticket_sale ?? analytics?.gross_ticket_sale ?? eventData?.gross_revenue ?? 0);
  const refundAmount = Number(analytics?.summary?.refund_amount ?? analytics?.refund_amount ?? 0);
  const netSale = (volumeAmount != null ? Math.max(0, volumeAmount - refundAmount) : undefined) ?? Number(analytics?.summary?.net_sale ?? analytics?.net_sale ?? grossSale);

  const ticketsSold = volumeTickets ?? Number(analytics?.summary?.tickets_sold ?? analytics?.tickets_sold ?? eventData?.tickets_sold ?? 0);
  const totalCapacity = Number(analytics?.summary?.ticket_capacity ?? eventData?.total_capacity ?? 0);
  const ticketsLeft = Number(analytics?.summary?.tickets_left ?? Math.max(0, totalCapacity - ticketsSold));
  const sellThroughPercent = analytics?.summary?.sell_through_percentage ?? (
    totalCapacity > 0 ? Math.min(100, Math.round((ticketsSold / totalCapacity) * 100)) : 0
  );
  const refundCount = Number(analytics?.summary?.refund_count ?? 0);
  const gatewayFees = Number(analytics?.summary?.payment_gateway_fees ?? 0);

  return (
    <div className={styles.cardsGrid}>
      {/* Card 1 */}
      <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
          <span className={styles.headerTitle}>
            TOTAL GROSS SALE
          </span>
          <Badge variant="emerald" className="gap-1">
            Live Telemetry
          </Badge>
        </div>

        <div className={styles.mainSection}>
          <h3 className={styles.amountTitle}>
            {currency} {formatAmount(grossSale)}
          </h3>
          <p className={styles.subtitle}>Gross event revenue</p>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.leftText}>
            Avg Daily: {currency} {ticketsSold > 0 ? formatAmount(grossSale / Math.max(1, ticketsSold)) : "0.00"} / tkt
          </span>
          <span className={styles.statusText}>Synchronized</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
          <span className={styles.headerTitle}>
            TICKETS SOLD
          </span>
          <Badge variant="emerald">{sellThroughPercent}% Cap</Badge>
        </div>

        <div className={styles.mainSection}>
          <div className={styles.countRow}>
            <h3 className={styles.soldCount}>
              {formatNumber(ticketsSold)}
            </h3>
            <span className={styles.capacityCount}>/ {formatNumber(totalCapacity)}</span>
          </div>
          <Progress value={Math.min(100, Math.max(0, sellThroughPercent))} barClassName="bg-[#00d07d]" className="h-2.5 mt-2" />
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.leftText}>{formatNumber(ticketsLeft)} tickets left</span>
          <span className={styles.statusText}>Active Sales</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
          <span className={styles.headerTitle}>
            NET SALE
          </span>
          <Badge variant={refundCount > 0 ? "red" : "emerald"}>
            {refundCount} refunds
          </Badge>
        </div>

        <div className={styles.mainSection}>
          <h3 className={styles.amountTitle}>
            {currency} {formatAmount(netSale)}
          </h3>
          <p className={styles.subtitle}>
            {currency} {formatAmount(refundAmount)} refunded
          </p>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.leftText}>Payment gateway fees</span>
          <span className={styles.feeText}>{currency} {formatAmount(gatewayFees)}</span>
        </div>
      </div>
    </div>
  );
}
