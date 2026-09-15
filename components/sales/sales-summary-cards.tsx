"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import styles from "./sales-summary-cards.module.scss";

export function SalesSummaryCards() {
  return (
    <div className={styles.cardsGrid}>
      {/* Card 1 */}
      <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
          <span className={styles.headerTitle}>
            TOTAL GROSS SALE
          </span>
          <Badge variant="emerald" className="gap-1">
            ↗ +18.4%
          </Badge>
        </div>

        <div className={styles.mainSection}>
          <h3 className={styles.amountTitle}>
            Rs. 27,540,000.00
          </h3>
          <p className={styles.subtitle}>vs target Rs. 24.5M forecast</p>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.leftText}>Avg Daily: Rs. 918,000</span>
          <span className={styles.statusText}>On Track</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
          <span className={styles.headerTitle}>
            TICKETS SOLD
          </span>
          <Badge variant="emerald">81.0% Cap</Badge>
        </div>

        <div className={styles.mainSection}>
          <div className={styles.countRow}>
            <h3 className={styles.soldCount}>
              3,240
            </h3>
            <span className={styles.capacityCount}>/ 4,000</span>
          </div>
          <Progress value={81} barClassName="bg-[#00d07d]" className="h-2.5 mt-2" />
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.leftText}>760 tickets left</span>
          <span className={styles.statusText}>4 days ahead</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
          <span className={styles.headerTitle}>
            NET SALE
          </span>
          <Badge variant="red">12 refunds</Badge>
        </div>

        <div className={styles.mainSection}>
          <h3 className={styles.amountTitle}>
            Rs. 26,120,000.00
          </h3>
          <p className={styles.subtitle}>Rs. 420,000 refunded (1.5%)</p>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.leftText}>Payment gateway fees</span>
          <span className={styles.feeText}>Rs. 1,000,000</span>
        </div>
      </div>
    </div>
  );
}
