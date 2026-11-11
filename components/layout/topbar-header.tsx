"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { EventSelector } from "./event-selector";
import { useDashboard } from "../../lib/context/dashboard-context";

interface TopbarHeaderProps {
  actionButton?: React.ReactNode;
}

export function TopbarHeader({ actionButton }: TopbarHeaderProps) {
  const { handleLogout, eventData, analytics, events, selectedEventId } = useDashboard();

  const activeEventName =
    eventData?.event_name ||
    analytics?.event?.event_name ||
    events.find((e) => String(e.event_details || e.id || e.event_id) === String(selectedEventId))?.event_name ||
    "Active Event";
  const currency = analytics?.event?.currency || eventData?.tickets_currency || "LKR";

  return (
    <header className="flex flex-col justify-between gap-4 pb-4 pt-1 sm:flex-row sm:items-center sm:pb-6 sm:pt-2">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
          Good afternoon, Merchant
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Live Updates
          </span>
          <span>·</span>
          <span className="max-w-[150px] truncate sm:max-w-none">{activeEventName}</span>
          <span>·</span>
          <span>{currency}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {actionButton}
        <EventSelector />
        <button
          type="button"
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/50"
          title="Logout from dashboard"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
