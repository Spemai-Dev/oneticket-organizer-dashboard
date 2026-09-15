"use client";

import React from "react";
import { CURRENT_EVENT } from "../../lib/mock-data";
import { formatNumber } from "../../lib/utils";
import styles from "./hero-banner.module.scss";

export function HeroBanner() {
  const percentSold = Math.round((CURRENT_EVENT.soldCount / CURRENT_EVENT.totalCapacity) * 1000) / 10;
  const leftCount = CURRENT_EVENT.totalCapacity - CURRENT_EVENT.soldCount;

  return (
    <div className={styles.heroCard}>
      {/* Dynamic Background Glow */}
      <div className={styles.bgGlow} />

      <div className={styles.layout}>
        {/* Poster Image */}
        <div className={styles.posterWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CURRENT_EVENT.imageUrl}
            alt={CURRENT_EVENT.title}
            className={styles.posterImage}
          />
          <div className={styles.posterOverlay}>
            <span className={styles.featuredBadge}>Featured Event</span>
            <span className={styles.subtitle}>{CURRENT_EVENT.subtitle}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className={styles.content}>
          {/* Top Badges */}
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>
              {CURRENT_EVENT.category}
            </span>
            <span className={styles.tierCountBadge}>
              {CURRENT_EVENT.ticketTiers.length} Ticket Tiers
            </span>
            <span className={styles.codeBadge}>
              {CURRENT_EVENT.code}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>
              {CURRENT_EVENT.title}
            </h2>
            <p className={styles.details}>
              {CURRENT_EVENT.date} · {CURRENT_EVENT.time} · {CURRENT_EVENT.venue}, {CURRENT_EVENT.city}
            </p>
          </div>

          {/* Pricing Pills */}
          <div className={styles.pricingRow}>
            {CURRENT_EVENT.ticketTiers.map((tier) => (
              <div key={tier.id} className={styles.pricingPill}>
                <span>{tier.name} </span>
                <span className={styles.priceAmount}>Rs. {formatNumber(tier.price)}</span>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className={styles.statsBar}>
            {/* Sell Through Progress */}
            <div className={styles.sellThroughCol}>
              <div className={styles.header}>
                <span>SELL-THROUGH</span>
                <span className={styles.soldCount}>
                  {formatNumber(CURRENT_EVENT.soldCount)} / {formatNumber(CURRENT_EVENT.totalCapacity)} Sold
                </span>
              </div>
              <div className={styles.percentageRow}>
                <span className={styles.percentText}>{percentSold}%</span>
                <span className={styles.leftBadge}>
                  {leftCount} Left
                </span>
              </div>
              {/* Green Progress Bar */}
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${percentSold}%` }}
                />
              </div>
            </div>

            {/* Projected Sell Out */}
            <div className={styles.projectedCol}>
              <span className={styles.label}>
                PROJECTED SELL-OUT
              </span>
              <span className={styles.date}>
                {CURRENT_EVENT.projectedSellOutDate}
              </span>
              <span className={styles.paceStatus}>
                {CURRENT_EVENT.paceStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
