"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Calendar } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { MOCK_EVENTS } from "../../lib/mock-data";
import styles from "./event-selector.module.scss";

export function EventSelector() {
  const { events, selectedEventId, setSelectedEventId, eventData } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);

  // Active label
  const activeTitle = eventData?.event_name ||
    events.find((e) => String(e.event_details || e.id) === String(selectedEventId))?.event_name ||
    MOCK_EVENTS[0].title;

  const displayList = events.length > 0 ? events : MOCK_EVENTS.map(m => ({
    id: m.id,
    event_details: m.id,
    event_name: m.title,
  }));

  return (
    <div className={styles.selectorWrapper}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.triggerBtn}
      >
        <span>{activeTitle}</span>
        <ChevronDown className={`${styles.chevronIcon} ${isOpen ? styles.open : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <p className={styles.title}>Select Active Event</p>
            </div>
            {displayList.map((evt) => {
              const id = String(evt.event_details || evt.id);
              const name = evt.event_name || evt.title;
              const isSelected = id === String(selectedEventId);

              return (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedEventId(id);
                    setIsOpen(false);
                  }}
                  className={`${styles.optionItem} ${isSelected ? styles.active : ""}`}
                >
                  <div className={styles.evtInfo}>
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <span className={styles.evtTitle}>{name}</span>
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#00d07d]" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
