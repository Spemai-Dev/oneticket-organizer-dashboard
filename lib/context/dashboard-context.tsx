"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { deleteToken, getToken } from "../auth";
import {
  getALLevent,
  getEventsOverview,
  getEventDetails,
  getEventAnalytics,
  geteventVolume,
  getEventS,
  getTickent,
  getPartiDetails,
  getNotifiesDetails,
} from "../services/dashboard";
import { extractArrayData } from "../utils/event-normalizer";

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
  eventsOverview: any[];
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
  analytics: any;
  notifications: any[];
  notifies: any[];
  dataType: "participants" | "notifies";
  setDataType: (type: "participants" | "notifies") => void;
  dataCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  loading: boolean;
  handleLogout: () => void;
  refreshData: () => void;
  fetchNotifies: (overrideEventId?: string, pageNum?: number) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [eventsOverview, setEventsOverview] = useState<any[]>([]);
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
  const [analytics, setAnalytics] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifies, setNotifies] = useState<any[]>([]);
  const [dataType, setDataType] = useState<"participants" | "notifies">("participants");
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

  // Fetch Notify Me list (list-dashboard API)
  const fetchNotifies = useCallback(async (overrideEventId?: string, pageNum?: number) => {
    const activeId = overrideEventId || selectedEventId;
    if (!activeId) return;

    try {
      const params: Record<string, any> = {
        event_details: activeId,
        page: pageNum || currentPage || 1,
        limit: 10,
        search_text: "",
      };
      if (selectedKey) {
        params.venue_key = selectedKey;
      }
      const res: any = await getNotifiesDetails(jsonToUrlParams(params));
      const items = extractArrayData(res);
      if (items.length > 0 || res?.data) {
        const notifyData = items.length > 0 ? items : res?.data?.data || [];
        setNotifies(notifyData);
        if (dataType === "notifies") {
          setDataCount(res?.data?.count || res?.data?.total || notifyData.length);
        }
      }
    } catch (err) {
      console.error("Error fetching notifies:", err);
    }
  }, [selectedEventId, currentPage, dataType, selectedKey]);

  // Fetch telemetry for specific event & venue_key
  const fetchTelemetry = useCallback(async (eventId: string, venueKey?: string | null) => {
    if (!eventId) return;

    const activeKey = venueKey !== undefined ? venueKey : selectedKey;

    try {
      // 1. Fetch Volume
      const volParams: Record<string, any> = { id: eventId };
      if (activeKey) volParams.venue_key = activeKey;
      const volRes: any = await geteventVolume(jsonToUrlParams(volParams));
      if (volRes?.data) {
        setVolume(volRes.data.data || volRes.data);
      }

      // 2. Fetch Checking Status (event-checking-status)
      const statusParams: Record<string, any> = { event_id: eventId };
      if (activeKey) statusParams.venue_key = activeKey;
      const statusRes: any = await getEventS(jsonToUrlParams(statusParams));
      const statusItems = extractArrayData(statusRes);
      if (statusItems.length > 0) {
        setTicketStatus(statusItems);
      } else if (statusRes?.data?.data) {
        setTicketStatus(statusRes.data.data);
      } else if (statusRes?.data) {
        setTicketStatus(statusRes.data);
      }

      // 3. Fetch Analytics
      const analyticsParams: Record<string, any> = { id: eventId };
      if (activeKey) analyticsParams.venue_key = activeKey;
      const analyticsRes: any = await getEventAnalytics(jsonToUrlParams(analyticsParams));
      if (analyticsRes?.data) {
        const analyticsData = analyticsRes.data.data || analyticsRes.data;
        setAnalytics(analyticsData);

        // Merge analytics event details into eventData if present
        if (analyticsData?.event) {
          setEventData((prev: any) => ({
            ...(prev || {}),
            ...analyticsData.event,
          }));
        }
      }

      // 4. Fetch Tickets by Slot (tickets-by-slot)
      const ticketParams: Record<string, any> = { event_id: eventId };
      if (activeKey) ticketParams.venue_key = activeKey;
      const ticketRes: any = await getTickent(jsonToUrlParams(ticketParams));
      const ticketItems = extractArrayData(ticketRes);
      if (ticketItems.length > 0) {
        setTickets(ticketItems);
      } else if (ticketRes?.data?.data) {
        setTickets(ticketRes.data.data);
      }

      // 5. Fetch Participants (event-participants)
      const partParams: Record<string, any> = {
        page: currentPage,
        limit: 10,
        id: eventId,
        search_text: "",
      };
      if (activeKey) partParams.venue_key = activeKey;
      const partRes: any = await getPartiDetails(jsonToUrlParams(partParams));
      const partItems = extractArrayData(partRes);
      if (partItems.length > 0 || partRes?.data) {
        setParticipants(partItems.length > 0 ? partItems : partRes?.data?.data || []);
        if (dataType === "participants") {
          setDataCount(partRes?.data?.count || partRes?.data?.total || partItems.length);
        }
      }

      // 6. Fetch Dashboard Notifications (Notify Me list)
      const notifyParams: Record<string, any> = {
        event_details: eventId,
        page: currentPage,
        limit: 10,
        search_text: "",
      };
      if (activeKey) notifyParams.venue_key = activeKey;
      const notifyRes: any = await getNotifiesDetails(jsonToUrlParams(notifyParams));
      const notifyItems = extractArrayData(notifyRes);
      if (notifyItems.length > 0 || notifyRes?.data?.data) {
        const nList = notifyItems.length > 0 ? notifyItems : notifyRes?.data?.data || [];
        setNotifications(nList);
        setNotifies(nList);
      }
    } catch (err) {
      console.error("Error fetching telemetry:", err);
    }
  }, [currentPage, dataType, selectedKey]);

  // Fetch details for selected event
  const fetchEventDetails = useCallback(async (eventId: string) => {
    try {
      const data: any = await getEventDetails(eventId);
      const details = data?.data?.data || data?.data;
      if (details && typeof details === "object" && !Array.isArray(details)) {
        setEventData((prev: any) => ({
          ...(prev || {}),
          ...details,
        }));

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
          return;
        }
      }

      setSelectedKey(null);
      await fetchTelemetry(eventId, null);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setSelectedKey(null);
      await fetchTelemetry(eventId, null);
    }
  }, [fetchTelemetry]);

  const hasLoadedEventsRef = useRef(false);

  // Initial Load: Fetch ALL events (combining getALLevent and getEventsOverview)
  const loadDashboardData = useCallback(async () => {
    if (hasLoadedEventsRef.current) return;
    hasLoadedEventsRef.current = true;
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      let allEventsList: any[] = [];
      try {
        const legacyRes: any = await getALLevent();
        allEventsList = extractArrayData(legacyRes);
      } catch (e) {
        console.warn("getALLevent failed:", e);
      }

      let overviewList: any[] = [];
      try {
        const overviewRes: any = await getEventsOverview({ status: "all", page: 1, limit: 1000 });
        overviewList = extractArrayData(overviewRes);
      } catch (e) {
        console.warn("getEventsOverview failed:", e);
      }

      // Merge events so all events are loaded without truncation
      const mergedMap = new Map<string, any>();
      allEventsList.forEach((e) => {
        const key = String(e.event_details || e.id || e.event_id);
        if (key) mergedMap.set(key, e);
      });
      overviewList.forEach((e) => {
        const key = String(e.event_details || e.id || e.event_id);
        if (key) {
          const existing = mergedMap.get(key);
          mergedMap.set(key, { ...(existing || {}), ...e });
        }
      });

      const finalEvents = Array.from(mergedMap.values());
      const fallbackList = finalEvents.length > 0 ? finalEvents : (allEventsList.length > 0 ? allEventsList : overviewList);

      if (fallbackList.length > 0) {
        setEvents(fallbackList);
        setEventsOverview(overviewList.length > 0 ? overviewList : fallbackList);

        const firstEventId = fallbackList[0]?.event_details || fallbackList[0]?.id || fallbackList[0]?.event_id;
        if (firstEventId) {
          setSelectedEventId(String(firstEventId));
          setEventData(fallbackList[0]);
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
  }, []);

  const isInitialMount = useRef(true);
  const prevPageRef = useRef(currentPage);
  const prevDataTypeRef = useRef(dataType);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const pageChanged = prevPageRef.current !== currentPage;
    const dataTypeChanged = prevDataTypeRef.current !== dataType;

    prevPageRef.current = currentPage;
    prevDataTypeRef.current = dataType;

    if ((pageChanged || dataTypeChanged) && selectedEventId) {
      if (dataType === "participants") {
        fetchTelemetry(selectedEventId, selectedKey);
      } else {
        fetchNotifies(selectedEventId, currentPage);
      }
    }
  }, [currentPage, dataType, selectedEventId, selectedKey, fetchTelemetry, fetchNotifies]);

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

  // Change Active Event from Dropdown
  const handleEventIdChange = useCallback(async (id: string) => {
    if (!id) return;
    setSelectedEventId(id);
    setCurrentPage(1);
    setLoading(true);

    // Clear stale telemetry for old event
    setAnalytics(null);
    setVolume(null);
    setTicketStatus(null);
    setTickets([]);
    setParticipants([]);
    setNotifies([]);
    setVenues([]);
    setSelectedVenueIndex(0);
    setSelectedDayIndex(0);
    setSelectedTimeIndex(0);
    setSelectedKey(null);

    // Immediately match selected event from events list for quick UI title update
    const matched = events.find((e) => String(e.event_details || e.id || e.event_id) === String(id));
    if (matched) {
      setEventData(matched);
    } else {
      setEventData(null);
    }

    try {
      await fetchEventDetails(id);
    } catch (err) {
      console.error("Error switching event:", err);
    } finally {
      setLoading(false);
    }
  }, [events, fetchEventDetails]);

  return (
    <DashboardContext.Provider
      value={{
        events,
        eventsOverview,
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
        analytics,
        notifications,
        notifies,
        dataType,
        setDataType,
        dataCount,
        currentPage,
        setCurrentPage,
        loading,
        handleLogout,
        refreshData: () => fetchTelemetry(selectedEventId, selectedKey),
        fetchNotifies,
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
