"use client";

import React from "react";
import { EventSelector } from "./event-selector";
import styles from "./topbar-header.module.scss";

interface TopbarHeaderProps {
  actionButton?: React.ReactNode;
}

export function TopbarHeader({ actionButton }: TopbarHeaderProps) {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftColumn}>
        <h1 className={styles.greetingTitle}>
          Good afternoon, Amila
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
          <span>Sat, 30 Aug 2026</span>
          <span>·</span>
          <span className={styles.eventName}>Neon Nights Vol. 3</span>
          <span>·</span>
          <span>LKR</span>
        </div>
      </div>

      <div className={styles.rightColumn}>
        {actionButton}
        <EventSelector />
      </div>
    </header>
  );
}
