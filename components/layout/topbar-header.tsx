"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { EventSelector } from "./event-selector";
import { useDashboard } from "../../lib/context/dashboard-context";
import styles from "./topbar-header.module.scss";

interface TopbarHeaderProps {
  actionButton?: React.ReactNode;
}

export function TopbarHeader({ actionButton }: TopbarHeaderProps) {
  const { handleLogout, eventData } = useDashboard();

  const activeEventName = eventData?.event_name || "Neon Nights Vol. 3";
  const currency = eventData?.tickets_currency || "LKR";

  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftColumn}>
        <h1 className={styles.greetingTitle}>
          Good afternoon, Merchant
        </h1>
        <div className={styles.metaInfoRow}>
          <span className={styles.liveStatus}>
            <span className={styles.pulseBadge}>
              <span className={styles.pingDot}></span>
              <span className={styles.solidDot}></span>
            </span>
            Live Updates
          </span>
          <span>·</span>
          <span className={styles.eventName}>{activeEventName}</span>
          <span>·</span>
          <span>{currency}</span>
        </div>
      </div>

      <div className={styles.rightColumn}>
        {actionButton}
        <EventSelector />
        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="Logout from dashboard"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
