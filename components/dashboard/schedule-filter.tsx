"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Clock, Filter, ChevronDown, Check } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";

interface FilterDropdownProps {
  icon: React.ComponentType<{ className?: string }>;
  selectedLabel: string;
  options: { value: number; label: string }[];
  selectedValue: number;
  onSelect: (value: number) => void;
  minWidth?: string;
}

/** Custom dropdown matching the EventSelector template design */
function FilterDropdown({
  icon: Icon,
  selectedLabel,
  options,
  selectedValue,
  onSelect,
  minWidth = "min-w-[180px]",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${minWidth}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon className="h-3.5 w-3.5 shrink-0 text-[#00d07d]" />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 min-w-full w-max max-w-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-1">
          <div className="max-h-56 overflow-y-auto flex flex-col gap-0.5 pr-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSelect(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors cursor-pointer gap-2 ${
                    isSelected
                      ? "bg-[#00d07d]/10 text-[#00d07d] font-bold"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[#00d07d]" : "text-zinc-400"}`} />
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#00d07d]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const currentTime = currentTimes[selectedTimeIndex];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2.5 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
          <Filter className="h-4 w-4 text-[#00d07d]" />
          <span>Location & Schedule Filter</span>
        </div>
        {selectedKey && (
          <span className="rounded-md border border-zinc-200/60 bg-zinc-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            KEY: {selectedKey}
          </span>
        )}
      </div>

      {/* Inline Location, Date & Time Controls with Block (Top/Bottom) Title & Value */}
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4 pt-1">
        {/* Location / Venue */}
        <div className="flex flex-col items-start gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <MapPin className="h-3.5 w-3.5 text-[#00d07d]" />
            <span>Location / Venue</span>
          </label>
          {venues.length > 1 ? (
            <FilterDropdown
              icon={MapPin}
              selectedLabel={currentVenue?.venue || "Select Venue"}
              selectedValue={selectedVenueIndex}
              onSelect={handleVenueSelect}
              options={venues.map((v, i) => ({ value: i, label: v.venue }))}
              minWidth="min-w-[180px]"
            />
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              {venues.map((venue, vi) => (
                <button
                  key={vi}
                  type="button"
                  onClick={() => handleVenueSelect(vi)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[0.625rem] border px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedVenueIndex === vi
                      ? "border-[#043825] bg-[#043825] text-white shadow-sm dark:border-[#00d07d] dark:bg-[#00d07d] dark:text-[#041c14]"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{venue.venue}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date / Day */}
        <div className="flex flex-col items-start gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-3.5 w-3.5 text-[#00d07d]" />
            <span>Date / Day</span>
          </label>
          {currentDays.length > 1 ? (
            <FilterDropdown
              icon={Calendar}
              selectedLabel={currentDay?.day || "Select Day"}
              selectedValue={selectedDayIndex}
              onSelect={handleDaySelect}
              options={currentDays.map((d, i) => ({ value: i, label: d.day }))}
              minWidth="min-w-[160px]"
            />
          ) : currentDays.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {currentDays.map((dayObj, di) => (
                <button
                  key={di}
                  type="button"
                  onClick={() => handleDaySelect(di)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[0.625rem] border px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedDayIndex === di
                      ? "border-[#043825] bg-[#043825] text-white shadow-sm dark:border-[#00d07d] dark:bg-[#00d07d] dark:text-[#041c14]"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>{dayObj.day}</span>
                </button>
              ))}
            </div>
          ) : (
            <span className="flex h-9 items-center text-xs italic text-zinc-400">No days</span>
          )}
        </div>

        {/* Time Slot */}
        <div className="flex flex-col items-start gap-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-[#00d07d]" />
            <span>Time Slot</span>
          </label>
          {currentTimes.length > 1 ? (
            <FilterDropdown
              icon={Clock}
              selectedLabel={currentTime ? `${currentTime.start_time} - ${currentTime.end_time}` : "Select Slot"}
              selectedValue={selectedTimeIndex}
              onSelect={handleTimeSelect}
              options={currentTimes.map((t, i) => ({ value: i, label: `${t.start_time} - ${t.end_time}` }))}
              minWidth="min-w-[180px]"
            />
          ) : currentTimes.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {currentTimes.map((timeObj, ti) => (
                <button
                  key={ti}
                  type="button"
                  onClick={() => handleTimeSelect(ti)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[0.625rem] border px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedTimeIndex === ti
                      ? "border-[#043825] bg-[#043825] text-white shadow-sm dark:border-[#00d07d] dark:bg-[#00d07d] dark:text-[#041c14]"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{timeObj.start_time} - {timeObj.end_time}</span>
                </button>
              ))}
            </div>
          ) : (
            <span className="flex h-9 items-center text-xs italic text-zinc-400">No time slots</span>
          )}
        </div>
      </div>
    </div>
  );
}
