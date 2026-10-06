import { Event } from "../../types";
import { CURRENT_EVENT } from "../mock-data";
import { getImageUrl } from "../utils";

/**
 * Extracts array payload from various API response wrapping formats
 */
export function extractArrayData(res: any): any[] {
  if (!res) return [];
  const body = res.data !== undefined ? res.data : res;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.events)) return body.events;
  if (Array.isArray(body?.result)) return body.result;
  if (Array.isArray(body?.items)) return body.items;
  return [];
}

/**
 * Normalizes raw API response item into standard UI Event object
 */
export function normalizeEventData(item: any): Event {
  if (!item) return CURRENT_EVENT;

  const id = String(item.event_details || item.id || item.event_id || "EVT-LIVE");
  const code = item.event_code || item.code || `EVT-${id}`;
  const title = item.event_name || item.title || item.name || "Live Organized Event";
  const subtitle = item.event_description || item.subtitle || item.description || "Official Ticketed Event";

  // Format date safely
  let dateStr = "Sat, 30 Aug 2026";
  const rawDate = item.event_date || item.event_datetime || item.date || item.start_date;
  if (rawDate) {
    try {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        dateStr = parsed.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } else {
        dateStr = String(rawDate);
      }
    } catch {
      dateStr = String(rawDate);
    }
  }

  // Format banner/poster image URL
  const bannerPath = item.poster_image || item.event_banner || item.banner_image || item.event_image || item.imageUrl || item.banner || item.image;
  const imageUrl = getImageUrl(bannerPath, CURRENT_EVENT.imageUrl);

  // Status mapping
  let status: "Live" | "Upcoming" | "Past" | "Draft" = "Live";
  if (typeof item.status === "string") {
    const s = item.status.toLowerCase();
    if (s === "live" || s === "active") status = "Live";
    else if (s === "upcoming") status = "Upcoming";
    else if (s === "past" || s === "completed") status = "Past";
    else if (s === "draft") status = "Draft";
  } else if (item.is_active !== undefined) {
    status = item.is_active ? "Live" : "Upcoming";
  }

  const soldCount = Number(item.tickets_sold ?? item.sold_tickets ?? item.soldCount ?? 0);
  const totalCapacity = Number(item.ticket_capacity ?? item.total_capacity ?? item.totalCapacity ?? item.capacity ?? 0);

  const rawTiers = item.ticket_tiers || item.ticketTiers || item.tiers;
  const ticketTiers = Array.isArray(rawTiers) && rawTiers.length > 0
    ? rawTiers.map((t: any, idx: number) => ({
        id: String(t.id || t.ticket_id || idx + 1),
        name: t.ticket_name || t.tier_name || t.name || `Tier ${idx + 1}`,
        price: Number(t.ticket_amount || t.ticket_visualize_amount || t.price || t.ticket_price || 0),
        currency: t.currency || item.currency || "LKR",
        available: Number(t.remaining_tickets ?? t.available_tickets ?? t.available ?? 0),
        total: Number(t.total_tickets ?? t.total ?? 0),
        sold: Number(t.sold_tickets ?? t.sold ?? 0),
        color: t.ticket_category_color || "#00d07d",
      }))
    : [];

  return {
    id,
    code,
    title,
    subtitle,
    date: dateStr,
    time: item.time || "8:00 PM",
    venue: item.venue_name || item.venue || "Nelum Pokuna",
    city: item.city || item.location || "Colombo",
    category: item.category_name || item.category || "Music Festival",
    status,
    imageUrl,
    ticketTiers,
    soldCount,
    totalCapacity,
    projectedSellOutDate: item.projectedSellOutDate || "12 Sep 2026",
    paceStatus: item.paceStatus || "On Schedule",
    grossRevenue: Number(item.gross_revenue ?? item.gross_ticket_sale ?? item.total_amount ?? 0),
    currency: item.currency || "LKR",
  };
}
