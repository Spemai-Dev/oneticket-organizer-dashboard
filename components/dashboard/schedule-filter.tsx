"use client";

import React from "react";
import { MapPin, Calendar, Clock, Filter } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import styles from "./schedule-filter.module.scss";

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
      <div className={styles.filterCard}>
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <Filter className={styles.icon} />
            <span>Event Schedule Filter</span>
          </div>
        </div>
        <p className={styles.emptyText}>No schedule or venues configured for this event.</p>
      </div>
    );
  }

  const currentVenue = venues[selectedVenueIndex];
  const currentDays = currentVenue?.days || [];
  const currentDay = currentDays[selectedDayIndex];
  const currentTimes = currentDay?.times || [];

  return (
    <div className={styles.filterCard}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <Filter className={styles.icon} />
          <span>Location & Schedule Filter</span>
        </div>
        {selectedKey && (
          <span className={styles.activeKeyBadge}>
            KEY: {selectedKey}
          </span>
        )}
      </div>

      {/* 1. Location / Venue Filter Row */}
      <div className={styles.filterSection}>
        <div className={styles.sectionLabel}>
          <MapPin className={styles.labelIcon} />
          <span>Location / Venue</span>
        </div>
        <div className={styles.pillRow}>
          {venues.map((venue, vi) => (
            <button
              key={vi}
              type="button"
              onClick={() => handleVenueSelect(vi)}
              className={`${styles.pillBtn} ${selectedVenueIndex === vi ? styles.activePill : ""}`}
            >
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{venue.venue}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Date / Day Filter Row */}
      <div className={styles.filterSection}>
        <div className={styles.sectionLabel}>
          <Calendar className={styles.labelIcon} />
          <span>Date / Day</span>
        </div>
        {currentDays.length > 0 ? (
          <div className={styles.pillRow}>
            {currentDays.map((dayObj, di) => (
              <button
                key={di}
                type="button"
                onClick={() => handleDaySelect(di)}
                className={`${styles.pillBtn} ${selectedDayIndex === di ? styles.activePill : ""}`}
              >
                <Calendar className="h-3 w-3 shrink-0" />
                <span>{dayObj.day}</span>
              </button>
            ))}
          </div>
        ) : (
          <span className={styles.emptyText}>No days configured for selected venue</span>
        )}
      </div>

      {/* 3. Time Slot Filter Row */}
      <div className={styles.filterSection}>
        <div className={styles.sectionLabel}>
          <Clock className={styles.labelIcon} />
          <span>Time Slot</span>
        </div>
        {currentTimes.length > 0 ? (
          <div className={styles.pillRow}>
            {currentTimes.map((timeObj, ti) => (
              <button
                key={ti}
                type="button"
                onClick={() => handleTimeSelect(ti)}
                className={`${styles.pillBtn} ${selectedTimeIndex === ti ? styles.activePill : ""}`}
              >
                <Clock className="h-3 w-3 shrink-0" />
                <span>{timeObj.start_time} - {timeObj.end_time}</span>
              </button>
            ))}
          </div>
        ) : (
          <span className={styles.emptyText}>No time slots configured for selected day</span>
        )}
      </div>
    </div>
  );
}
