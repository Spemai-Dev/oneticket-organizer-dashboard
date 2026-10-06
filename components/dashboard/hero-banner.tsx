"use client";

import React from "react";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { CURRENT_EVENT } from "../../lib/mock-data";
import { environment } from "../../lib/environment";
import { formatNumber, formatAmount, getImageUrl } from "../../lib/utils";
import styles from "./hero-banner.module.scss";

export function HeroBanner() {
  const {
    eventData,
    volume,
    tickets,
    analytics,
    venues,
    selectedVenueIndex,
    selectedDayIndex,
    selectedTimeIndex,
  } = useDashboard();

  const title = analytics?.event?.event_name || eventData?.event_name || "Event Overview";
  const subtitle = eventData?.event_description || "Event Details & Sales Telemetry";
  const category = analytics?.event?.category_name || eventData?.category || "Event";
  const eventCode = analytics?.event?.event_details || eventData?.event_code || "";
  const currency = analytics?.event?.currency || eventData?.tickets_currency || "LKR";

  // Selected schedule filter venue, day, time or fallback to event metadata
  const selectedVenueName =
    venues?.[selectedVenueIndex]?.venue ||
    eventData?.venue_name ||
    eventData?.venue ||
    eventData?.location ||
    analytics?.event?.venue_name ||
    "Main Venue";

  const selectedDayObj = venues?.[selectedVenueIndex]?.days?.[selectedDayIndex];
  const rawDateVal =
    selectedDayObj?.day ||
    eventData?.event_date ||
    eventData?.event_datetime ||
    eventData?.date;

  let displayDate = "TBA";
  if (rawDateVal) {
    try {
      const d = new Date(rawDateVal);
      displayDate = !isNaN(d.getTime())
        ? d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
        : String(rawDateVal);
    } catch {
      displayDate = String(rawDateVal);
    }
  }

  const selectedTimeObj = selectedDayObj?.times?.[selectedTimeIndex];
  const displayTime = selectedTimeObj
    ? `${selectedTimeObj.start_time}${selectedTimeObj.end_time ? ` - ${selectedTimeObj.end_time}` : ""}`
    : eventData?.time || "All Day";

  const imagePath = eventData?.poster_image || eventData?.event_banner || analytics?.event?.poster_image || analytics?.event?.event_banner || eventData?.imageUrl;
  const bannerImg = getImageUrl(imagePath, CURRENT_EVENT.imageUrl);

  const soldCount = analytics?.summary?.tickets_sold ?? volume?.total_tickets ?? volume?.venue_total_tickets ?? 0;
  const totalCapacity = analytics?.summary?.ticket_capacity ?? eventData?.total_capacity ?? 0;

  const percentSold = analytics?.summary?.sell_through_percentage ?? (
    totalCapacity > 0 ? Math.min(100, Math.round((soldCount / totalCapacity) * 1000) / 10) : 0
  );
  const leftCount = analytics?.summary?.tickets_left ?? Math.max(0, totalCapacity - soldCount);
  const grossSale = analytics?.summary?.gross_ticket_sale ?? volume?.total_amount ?? volume?.venue_total_amount ?? 0;

  // Render ticket tiers from analytics or tickets state
  const apiTiers = analytics?.event?.ticket_tiers;
  const tierList = Array.isArray(apiTiers) && apiTiers.length > 0
    ? apiTiers.map((t: any) => ({
        id: t.id,
        name: t.ticket_name,
        price: Number(t.ticket_amount || 0),
      }))
    : tickets.length > 0
    ? tickets.map((t: any) => ({
        id: t.id,
        name: t.ticket_name,
        price: Number(t.ticket_amount || 0),
      }))
    : [];

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

          {/* Title & Location / Date / Time Info */}
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>
              {title}
            </h2>
            <div className={styles.metaLocationRow}>
              <span className={styles.metaItem}>
                <MapPin className="h-3.5 w-3.5 text-[#00d07d]" />
                <span>{selectedVenueName}</span>
              </span>
              <span>·</span>
              <span className={styles.metaItem}>
                <Calendar className="h-3.5 w-3.5 text-[#00d07d]" />
                <span>{displayDate}</span>
              </span>
              <span>·</span>
              <span className={styles.metaItem}>
                <Clock className="h-3.5 w-3.5 text-[#00d07d]" />
                <span>{displayTime}</span>
              </span>
              <span>·</span>
              <span>Currency: <strong className="text-white">{currency}</strong></span>
            </div>
          </div>

          {/* Pricing Pills */}
          <div className={styles.pricingRow}>
            {tierList.map((tier) => (
              <div key={tier.id} className={styles.pricingPill}>
                <span>{tier.name} </span>
                <span className={styles.priceAmount}>{currency} {formatAmount(tier.price)}</span>
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
                  style={{ width: `${Math.min(100, Math.max(0, percentSold))}%` }}
                />
              </div>
            </div>

            {/* Projected Sell Out */}
            <div className={styles.projectedCol}>
              <span className={styles.label}>
                TOTAL VENUE REVENUE
              </span>
              <span className={styles.date}>
                {currency} {formatAmount(grossSale)}
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
