"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Calendar } from "lucide-react";
import { MOCK_EVENTS } from "../../lib/mock-data";
import { Event } from "../../types";
import styles from "./event-selector.module.scss";

export function EventSelector() {
  const [selectedEvent, setSelectedEvent] = useState<Event>(MOCK_EVENTS[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.selectorWrapper}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.triggerBtn}
      >
        <span>{selectedEvent.title.split("·")[1]?.trim() || selectedEvent.title}</span>
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
            {MOCK_EVENTS.map((evt) => (
              <button
                key={evt.id}
                onClick={() => {
                  setSelectedEvent(evt);
                  setIsOpen(false);
                }}
                className={`${styles.optionItem} ${selectedEvent.id === evt.id ? styles.active : ""}`}
              >
                <div className={styles.evtInfo}>
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <span className={styles.evtTitle}>{evt.title}</span>
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
