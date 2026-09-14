"use client";

import React from "react";

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
    <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 flex-wrap">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const count = counts[tab] ?? 0;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? "bg-[#043825] text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <span>{tab}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive
                  ? "bg-[#00d07d] text-[#041c14]"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
