"use client";

import React from "react";
import { MapPin, Calendar, Clock, Filter } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";

export function ScheduleFilter() {
  const {
    venues,
    selectedVenueIndex,
    selectedDayIndex,
    selectedTimeIndex,
    selectedKey,
    handleVenueSelect,
    handleDaySelect,
    handleTimeSelect,
  } = useDashboard();

  if (!venues || venues.length === 0) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-900">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            <Filter className="h-4 w-4 text-[#00d07d]" />
            <span>Event Schedule Filter</span>
          </div>
        </div>
        <p className="py-1 text-xs italic text-zinc-400">No schedule or venues configured for this event.</p>
      </div>
    );
  }

  const currentVenue = venues[selectedVenueIndex];
  const currentDays = currentVenue?.days || [];
  const currentDay = currentDays[selectedDayIndex];
  const currentTimes = currentDay?.times || [];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
          <Filter className="h-4 w-4 text-[#00d07d]" />
          <span>Location & Schedule Filter</span>
        </div>
        {selectedKey && (
          <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-[11px] font-semibold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            KEY: {selectedKey}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <MapPin className="h-3.5 w-3.5" />
          <span>Location / Venue</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {venues.map((venue, vi) => (
            <button
              key={vi}
              type="button"
              onClick={() => handleVenueSelect(vi)}
              className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[0.625rem] border px-3.5 py-[0.45rem] text-xs font-semibold transition-all ${
                selectedVenueIndex === vi
                  ? "border-[#043825] bg-[#043825] text-white shadow-[0_2px_4px_rgba(4,56,37,0.2)] dark:border-[#00d07d] dark:bg-[#00d07d] dark:text-[#041c14]"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{venue.venue}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>Date / Day</span>
        </div>
        {currentDays.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {currentDays.map((dayObj, di) => (
              <button
                key={di}
                type="button"
                onClick={() => handleDaySelect(di)}
                className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[0.625rem] border px-3.5 py-[0.45rem] text-xs font-semibold transition-all ${
                  selectedDayIndex === di
                    ? "border-[#043825] bg-[#043825] text-white shadow-[0_2px_4px_rgba(4,56,37,0.2)] dark:border-[#00d07d] dark:bg-[#00d07d] dark:text-[#041c14]"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                <Calendar className="h-3 w-3 shrink-0" />
                <span>{dayObj.day}</span>
              </button>
            ))}
          </div>
        ) : (
          <span className="py-1 text-xs italic text-zinc-400">No days configured for selected venue</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Clock className="h-3.5 w-3.5" />
          <span>Time Slot</span>
        </div>
        {currentTimes.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {currentTimes.map((timeObj, ti) => (
              <button
                key={ti}
                type="button"
                onClick={() => handleTimeSelect(ti)}
                className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[0.625rem] border px-3.5 py-[0.45rem] text-xs font-semibold transition-all ${
                  selectedTimeIndex === ti
                    ? "border-[#043825] bg-[#043825] text-white shadow-[0_2px_4px_rgba(4,56,37,0.2)] dark:border-[#00d07d] dark:bg-[#00d07d] dark:text-[#041c14]"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                <Clock className="h-3 w-3 shrink-0" />
                <span>{timeObj.start_time} - {timeObj.end_time}</span>
              </button>
            ))}
          </div>
        ) : (
          <span className="py-1 text-xs italic text-zinc-400">No time slots configured for selected day</span>
        )}
      </div>
    </div>
  );
}
