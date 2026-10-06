"use client";

import React from "react";
import styles from "./event-filter-tabs.module.scss";

interface EventFilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: Record<string, number | undefined>;
}

export function EventFilterTabs({
  activeTab,
  onTabChange,
  counts = {},
}: EventFilterTabsProps) {
  const tabs = ["All", "Live", "Upcoming", "Past", "Draft"];

  return (
    <div className={styles.tabsRow}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const count = counts[tab];
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`${styles.tabBtn} ${isActive ? styles.active : ""}`}
          >
            <span>{tab}</span>
            {count !== undefined && (
              <span className={styles.countBadge}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
