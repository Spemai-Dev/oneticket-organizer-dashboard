"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { deleteToken, getToken } from "../auth";
import {
  getALLevent,
  getEventDetails,
  geteventVolume,
  getEventS,
  getTickent,
  getPartiDetails,
} from "../services/dashboard";

export interface VenueTime {
  start_time: string;
  end_time: string;
  key: string;
}

export interface VenueDay {
  day: string;
  times: VenueTime[];
}

export interface Venue {
  venue: string;
  days: VenueDay[];
}

export interface DashboardContextType {
  events: any[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  eventData: any;
  venues: Venue[];
  selectedVenueIndex: number;
  selectedDayIndex: number;
  selectedTimeIndex: number;
  selectedKey: string | null;
  handleVenueSelect: (index: number) => void;
  handleDaySelect: (index: number) => void;
  handleTimeSelect: (index: number) => void;
  volume: any;
  ticketStatus: any;
  tickets: any[];
  participants: any[];
  dataCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  loading: boolean;
  handleLogout: () => void;
  refreshData: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventData, setEventData] = useState<any>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueIndex, setSelectedVenueIndex] = useState<number>(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [volume, setVolume] = useState<any>(null);
  const [ticketStatus, setTicketStatus] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [dataCount, setDataCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Logout Action
  const handleLogout = useCallback(() => {
    deleteToken();
    router.push("/login");
  }, [router]);

  // Helper to construct URL query strings
  const jsonToUrlParams = (json: Record<string, any>) => {
    const params = new URLSearchParams();
    for (const key in json) {
      if (json[key] !== undefined && json[key] !== null && json[key] !== "") {
        params.append(key, String(json[key]));
      }
    }
    return params.toString();
  };

  // Fetch telemetry for specific event & venue_key
  const fetchTelemetry = useCallback(async (eventId: string, venueKey?: string | null) => {
    if (!eventId) return;

    try {
      // 1. Fetch Volume
      const volParams: Record<string, any> = { id: eventId };
      if (venueKey) volParams.venue_key = venueKey;
      const volRes: any = await geteventVolume(jsonToUrlParams(volParams));
      if (volRes?.data?.status === 100) {
        setVolume(volRes.data.data);
      }

      // 2. Fetch Checking Status
      const statusParams: Record<string, any> = { event_id: eventId };
      if (venueKey) statusParams.venue_key = venueKey;
      const statusRes: any = await getEventS(jsonToUrlParams(statusParams));
      if (statusRes?.data?.status === 100) {
        setTicketStatus(statusRes.data.data);
      }

      // 3. Fetch Tickets by Slot
      const ticketParams: Record<string, any> = { event_id: eventId };
      if (venueKey) ticketParams.venue_key = venueKey;
      const ticketRes: any = await getTickent(jsonToUrlParams(ticketParams));
      if (ticketRes?.data?.status === 100) {
        setTickets(ticketRes.data.data || []);
      }

      // 4. Fetch Participants
      const partParams: Record<string, any> = {
        page: currentPage,
        limit: 10,
        id: eventId,
        search_text: "",
      };
      if (venueKey) partParams.venue_key = venueKey;
      const partRes: any = await getPartiDetails(jsonToUrlParams(partParams));
      if (partRes?.data?.status === 200) {
        setParticipants(partRes.data.data || []);
        setDataCount(partRes.data.count || 0);
      }
    } catch (err) {
      console.error("Error fetching telemetry:", err);
    }
  }, [currentPage]);

  // Fetch details for selected event
  const fetchEventDetails = useCallback(async (eventId: string) => {
    try {
      const data: any = await getEventDetails(eventId);
      if (data?.data?.status === 100) {
        const details = data.data.data;
        setEventData(details);

        const venueList: Venue[] = details.venues || [];
        setVenues(venueList);

        if (
          venueList.length > 0 &&
          venueList[0].days?.length > 0 &&
          venueList[0].days[0].times?.length > 0
        ) {
          const firstKey = venueList[0].days[0].times[0].key;
          setSelectedVenueIndex(0);
          setSelectedDayIndex(0);
          setSelectedTimeIndex(0);
          setSelectedKey(firstKey);
          await fetchTelemetry(eventId, firstKey);
        } else {
          setSelectedKey(null);
          await fetchTelemetry(eventId, null);
        }
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
    }
  }, [fetchTelemetry]);

  // Initial Load: Get all events
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const res: any = await getALLevent();
      if (res?.data?.data && Array.isArray(res.data.data)) {
        const eventList = res.data.data;
        setEvents(eventList);

        const firstEventId = eventList[0]?.event_details || eventList[0]?.id;
        if (firstEventId) {
          setSelectedEventId(String(firstEventId));
          await fetchEventDetails(String(firstEventId));
        }
      }
    } catch (err) {
      console.error("Error loading events on load:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchEventDetails]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Venue Select
  const handleVenueSelect = (vi: number) => {
    setSelectedVenueIndex(vi);
    setSelectedDayIndex(0);
    setSelectedTimeIndex(0);
    const key = venues[vi]?.days?.[0]?.times?.[0]?.key || null;
    setSelectedKey(key);
    if (selectedEventId) {
      fetchTelemetry(selectedEventId, key);
    }
  };

  // Handle Day Select
  const handleDaySelect = (di: number) => {
    setSelectedDayIndex(di);
    setSelectedTimeIndex(0);
    const key = venues[selectedVenueIndex]?.days?.[di]?.times?.[0]?.key || null;
    setSelectedKey(key);
    if (selectedEventId) {
      fetchTelemetry(selectedEventId, key);
    }
  };

  // Handle Time Select
  const handleTimeSelect = (ti: number) => {
    setSelectedTimeIndex(ti);
    const key = venues[selectedVenueIndex]?.days?.[selectedDayIndex]?.times?.[ti]?.key || null;
    setSelectedKey(key);
    if (selectedEventId) {
      fetchTelemetry(selectedEventId, key);
    }
  };

  // Change Active Event
  const handleEventIdChange = (id: string) => {
    setSelectedEventId(id);
    setCurrentPage(1);
    fetchEventDetails(id);
  };

  return (
    <DashboardContext.Provider
      value={{
        events,
        selectedEventId,
        setSelectedEventId: handleEventIdChange,
        eventData,
        venues,
        selectedVenueIndex,
        selectedDayIndex,
        selectedTimeIndex,
        selectedKey,
        handleVenueSelect,
        handleDaySelect,
        handleTimeSelect,
        volume,
        ticketStatus,
        tickets,
        participants,
        dataCount,
        currentPage,
        setCurrentPage,
        loading,
        handleLogout,
        refreshData: () => fetchTelemetry(selectedEventId, selectedKey),
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
