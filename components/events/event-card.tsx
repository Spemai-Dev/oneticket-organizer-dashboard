"use client";

import React from "react";
import { Event } from "../../types";
import { formatNumber } from "../../lib/utils";
import styles from "./event-card.module.scss";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const percentSold = Math.round((event.soldCount / event.totalCapacity) * 100);
  const grossRevenue = event.soldCount * 8500; // Calculated gross revenue

  const getStatusBadge = (status: string) => {
    const isLive = status === "Live";
    const isUpcoming = status === "Upcoming";
    const statusClass = isLive
      ? styles.live
      : isUpcoming
      ? styles.upcoming
      : styles.past;

    return (
      <span className={`${styles.statusBadge} ${statusClass}`}>
        <span className={styles.statusDot} />
        {status === "Live" ? "Live" : status}
      </span>
    );
  };

  return (
    <div className={styles.cardContainer}>
      {/* Top Row: Poster Thumbnail + Info Column */}
      <div className={styles.topRow}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className={styles.posterImg}
        />

        <div className={styles.infoCol}>
          {/* Badges Header */}
          <div className={styles.badgesHeader}>
            <div className={styles.leftBadges}>
              <span className={styles.categoryBadge}>
                {event.category}
              </span>
              <span className={styles.tierBadge}>
                {event.ticketTiers.length} Ticket Tiers
              </span>
            </div>
            {getStatusBadge(event.status)}
          </div>

          {/* Title */}
          <h3 className={styles.title} title={event.title}>
            {event.title}
          </h3>

          {/* Date & Location */}
          <p className={styles.dateLocation}>
            {event.date} · {event.venue}, {event.city}
          </p>
        </div>
      </div>

      {/* Middle Progress Bar Section */}
      <div className={styles.progressSection}>
        <div className={styles.progressMeta}>
          <span>
            Sold: <strong className={styles.soldBold}>{formatNumber(event.soldCount)}</strong> / {formatNumber(event.totalCapacity)}
          </span>
          <span className={styles.percentVal}>{percentSold}%</span>
        </div>
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${percentSold}%` }}
          />
        </div>
      </div>

      {/* Bottom Gross Revenue Section */}
      <div className={styles.revenueSection}>
        <span className={styles.revenueLabel}>GROSS REVENUE</span>
        <h4 className={styles.revenueAmount}>
          Rs. {formatNumber(grossRevenue || 27540000)}
        </h4>
      </div>
    </div>
  );
}
