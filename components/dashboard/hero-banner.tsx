"use client";

import React from "react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { CURRENT_EVENT } from "../../lib/mock-data";
import { environment } from "../../lib/environment";
import { formatNumber } from "../../lib/utils";
import styles from "./hero-banner.module.scss";

export function HeroBanner() {
  const { eventData, volume, tickets } = useDashboard();

  const title = eventData?.event_name || CURRENT_EVENT.title;
  const subtitle = eventData?.event_description || CURRENT_EVENT.subtitle;
  const category = eventData?.category || CURRENT_EVENT.category;
  const eventCode = eventData?.event_code || CURRENT_EVENT.code;
  const currency = eventData?.tickets_currency || "LKR";

  const bannerImg = eventData?.event_banner
    ? `${environment.aws}/${eventData.event_banner.replace(/^\//, '')}`
    : CURRENT_EVENT.imageUrl;

  const soldCount = volume?.total_tickets ?? volume?.venue_total_tickets ?? CURRENT_EVENT.soldCount;
  const totalCapacity = eventData?.total_capacity || CURRENT_EVENT.totalCapacity;

  const percentSold = Math.min(100, Math.round((soldCount / totalCapacity) * 1000) / 10);
  const leftCount = Math.max(0, totalCapacity - soldCount);

  // Render tickets or fall back to mock tiers
  const tierList = tickets.length > 0
    ? tickets.map((t: any) => ({
        id: t.id,
        name: t.ticket_name,
        price: Number(t.ticket_amount || 0),
      }))
    : CURRENT_EVENT.ticketTiers;

  return (
    <div className={styles.heroCard}>
      {/* Dynamic Background Glow */}
      <div className={styles.bgGlow} />

      <div className={styles.layout}>
        {/* Poster Image */}
        <div className={styles.posterWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImg}
            alt={title}
            className={styles.posterImage}
          />
          <div className={styles.posterOverlay}>
            <span className={styles.featuredBadge}>Active Event</span>
            <span className={styles.subtitle}>{subtitle}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className={styles.content}>
          {/* Top Badges */}
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>
              {category}
            </span>
            <span className={styles.tierCountBadge}>
              {tierList.length} Ticket Tiers
            </span>
            <span className={styles.codeBadge}>
              {eventCode}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>
              {title}
            </h2>
            <p className={styles.details}>
              Currency: {currency} {eventData?.event_expire_on ? `· Expire: ${new Date(eventData.event_expire_on).toLocaleDateString()}` : ''}
            </p>
          </div>

          {/* Pricing Pills */}
          <div className={styles.pricingRow}>
            {tierList.map((tier) => (
              <div key={tier.id} className={styles.pricingPill}>
                <span>{tier.name} </span>
                <span className={styles.priceAmount}>{currency} {formatNumber(tier.price)}</span>
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
                  {formatNumber(soldCount)} / {formatNumber(totalCapacity)} Sold
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
                TOTAL VENUE REVENUE
              </span>
              <span className={styles.date}>
                {currency} {formatNumber(volume?.total_amount || volume?.venue_total_amount || 27540000)}
              </span>
              <span className={styles.paceStatus}>
                Live Sales Telemetry
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
