import { useState, useEffect } from "react";
import { getALLevent, getEventDetails, geteventVolume, getPartiDetails } from "./dashboard";
import { getToken } from "../auth";
import { CURRENT_EVENT, MOCK_EVENTS } from "../mock-data";
import { Event } from "../../types";

export function useDashboardData() {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<Event>(CURRENT_EVENT);
  const [volume, setVolume] = useState<{ total_tickets: number; total_amount: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res: any = await getALLevent();
        
        if (res && res.data && res.data.status === 100 && Array.isArray(res.data.data)) {
          const apiEvents = res.data.data.map((item: any) => ({
            id: item.event_details || item.id,
            code: item.event_code || 'EVT-LIVE',
            title: item.event_name || item.title,
            subtitle: item.event_description || 'Live Organized Event',
            date: item.event_datetime ? new Date(item.event_datetime).toLocaleDateString() : 'Sat, 30 Aug 2026',
            time: '8:00 PM',
            venue: item.venue || 'Nelum Pokuna',
            city: 'Colombo',
            category: item.category || 'Music Festival',
            status: item.is_active ? 'Live' : 'Upcoming',
            imageUrl: item.event_banner ? `https://storage.googleapis.com/oneticket/${item.event_banner}` : CURRENT_EVENT.imageUrl,
            soldCount: item.sold_tickets || 3240,
            totalCapacity: item.total_capacity || 4000,
            projectedSellOutDate: '12 Sep 2026',
            paceStatus: '4 days ahead',
            ticketTiers: CURRENT_EVENT.ticketTiers,
          }));

          if (apiEvents.length > 0) {
            setEvents(apiEvents);
            setSelectedEvent(apiEvents[0]);

            // Fetch volume telemetry for the first event
            const volRes: any = await geteventVolume(`id=${apiEvents[0].id}`);
            if (volRes && volRes.data && volRes.data.status === 100) {
              setVolume({
                total_tickets: Number(volRes.data.data.total_tickets || 3240),
                total_amount: Number(volRes.data.data.total_amount || 27540000),
              });
            }
          }
        }
      } catch (err: any) {
        console.error("Dashboard API error (using mock telemetry):", err?.message);
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return { events, selectedEvent, setSelectedEvent, volume, loading, error };
}
