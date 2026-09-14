"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Calendar } from "lucide-react";
import { MOCK_EVENTS } from "../../lib/mock-data";
import { Event } from "../../types";

export function EventSelector() {
  const [selectedEvent, setSelectedEvent] = useState<Event>(MOCK_EVENTS[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-all"
      >
        <span>{selectedEvent.title.split("·")[1]?.trim() || selectedEvent.title}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 z-30 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-1.5 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Select Active Event</p>
            </div>
            {MOCK_EVENTS.map((evt) => (
              <button
                key={evt.id}
                onClick={() => {
                  setSelectedEvent(evt);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                  selectedEvent.id === evt.id
                    ? "bg-[#00d07d]/10 text-[#041c14] dark:text-[#00d07d] font-semibold"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <span className="truncate">{evt.title}</span>
                </div>
                {selectedEvent.id === evt.id && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#00d07d]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
