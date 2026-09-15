"use client";

import React from "react";
import styles from "./event-filter-tabs.module.scss";

interface EventFilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: Record<string, number>;
}

export function EventFilterTabs({
  activeTab,
  onTabChange,
  counts = { All: 4, Live: 1, Upcoming: 2, Past: 1, Draft: 0 },
}: EventFilterTabsProps) {
  const tabs = ["All", "Live", "Upcoming", "Past", "Draft"];

  return (
    <div className={styles.tabsRow}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const count = counts[tab] ?? 0;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`${styles.tabBtn} ${isActive ? styles.active : ""}`}
          >
            <span>{tab}</span>
            <span className={styles.countBadge}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
