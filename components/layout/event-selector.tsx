"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Calendar, Search } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { MOCK_EVENTS } from "../../lib/mock-data";
import styles from "./event-selector.module.scss";

export function EventSelector() {
  const { events, selectedEventId, setSelectedEventId, eventData } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const rawList = events.length > 0 ? events : MOCK_EVENTS.map(m => ({
    id: m.id,
    event_details: m.id,
    event_name: m.title,
  }));

  // Active label
  const selectedEvt = rawList.find((e) => String(e.event_details || e.id || e.event_id) === String(selectedEventId));
  const activeTitle = selectedEvt?.event_name || selectedEvt?.title || eventData?.event_name || "Select Event";

  // Filter events based on search text input
  const filteredEvents = rawList.filter((evt) => {
    const name = (evt.event_name || evt.title || "").toLowerCase();
    const code = String(evt.event_details || evt.event_code || evt.id || "").toLowerCase();
    const query = searchText.trim().toLowerCase();
    return name.includes(query) || code.includes(query);
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchText("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.selectorWrapper} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.triggerBtn}
      >
        <Calendar className="h-3.5 w-3.5 text-[#00d07d] shrink-0" />
        <span className="max-w-[160px] truncate">{activeTitle}</span>
        <ChevronDown className={`${styles.chevronIcon} ${isOpen ? styles.open : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-2">
          {/* Header & Search Input Box */}
          <div className="p-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search events by name..."
                className="w-full bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Events List */}
          <div className="max-h-60 overflow-y-auto flex flex-col gap-1 pr-1">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt) => {
                const id = String(evt.event_details || evt.id || evt.event_id);
                const name = evt.event_name || evt.title || `Event #${id}`;
                const isSelected = id === String(selectedEventId);

                return (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedEventId(id);
                      setIsOpen(false);
                      setSearchText("");
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#00d07d]/10 text-[#00d07d] font-bold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Calendar className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[#00d07d]" : "text-zinc-400"}`} />
                      <span className="truncate">{name}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#00d07d]" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-zinc-400">
                No matching events found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
