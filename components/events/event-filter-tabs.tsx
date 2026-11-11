"use client";

import React from "react";

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
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const count = counts[tab];
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
              isActive
                ? "border-transparent bg-[#043825] text-white shadow-sm"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <span>{tab}</span>
            {count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-[#00d07d] text-[#041c14]"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
