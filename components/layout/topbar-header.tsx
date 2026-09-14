"use client";

import React from "react";
import { EventSelector } from "./event-selector";

interface TopbarHeaderProps {
  actionButton?: React.ReactNode;
}

export function TopbarHeader({ actionButton }: TopbarHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 pt-1 sm:pt-2">
      <div className="flex flex-col gap-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Good afternoon, Amila
        </h1>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Updates
          </span>
          <span>·</span>
          <span>Sat, 30 Aug 2026</span>
          <span>·</span>
          <span className="truncate max-w-[150px] sm:max-w-none">Neon Nights Vol. 3</span>
          <span>·</span>
          <span>LKR</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {actionButton}
        <EventSelector />
      </div>
    </header>
  );
}
