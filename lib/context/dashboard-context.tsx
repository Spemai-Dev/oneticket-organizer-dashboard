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

export interface FetchParticipantsOptions {
  page?: number;
  searchText?: string;
  transactionStatus?: string;
  isCheckedIn?: string;
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
  participantsCount: number;
  participantsLoading: boolean;
  analytics: any;
  notifications: any[];
  notifies: any[];
  notifiesCount: number;
  dataType: "participants" | "notifies";
  setDataType: (type: "participants" | "notifies") => void;
  dataCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  transactionStatusFilter: string;
  setTransactionStatusFilter: (status: string) => void;
  checkInFilter: string;
  setCheckInFilter: (status: string) => void;
  loading: boolean;
  handleLogout: () => void;
  refreshData: () => void;
  fetchParticipants: (options?: FetchParticipantsOptions) => Promise<void>;
  fetchNotifies: (overrideEventId?: string, pageNum?: number, overrideSearchText?: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

function sanitizeVenueKey(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
  return trimmed;
}

function extractEventId(item: any): string {
  const candidates = [item?.event_details, item?.id, item?.event_id];
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && typeof candidate !== "object") {
      const str = String(candidate).trim();
      if (str && str !== "null" && str !== "undefined") return str;
    }
  }
  return "";
}

function normalizeVenues(rawVenues: any): Venue[] {
  if (!Array.isArray(rawVenues)) return [];
  return rawVenues.map((v: any) => {
    const rawDays = Array.isArray(v?.days)
      ? v.days
      : Array.isArray(v?.times)
        ? [{ day: v?.day || "", times: v.times }]
        : [];
    const days: VenueDay[] = rawDays.map((d: any) => ({
      day: d?.day || "",
      times: Array.isArray(d?.times)
        ? d.times.map((t: any) => ({
            start_time: t?.start_time || "",
            end_time: t?.end_time || "",
            key: sanitizeVenueKey(t?.key ?? t?.venue_key) || "",
          }))
        : [],
    }));
    return {
      venue: v?.venue || v?.venue_name || v?.name || "",
      days,
    };
  });
}

function findFirstVenueSelection(
  venueList: Venue[],
  venueIdx?: number,
  dayIdx?: number
): { venueIndex: number; dayIndex: number; timeIndex: number; key: string } | null {
  const vStart = venueIdx ?? 0;
  const vEnd = venueIdx !== undefined ? Math.min(venueIdx + 1, venueList.length) : venueList.length;

  for (let vi = vStart; vi < vEnd; vi++) {
    const days = venueList[vi]?.days || [];
    const dStart = dayIdx ?? 0;
    const dEnd = dayIdx !== undefined ? Math.min(dayIdx + 1, days.length) : days.length;

    for (let di = dStart; di < dEnd; di++) {
      const times = days[di]?.times || [];
      for (let ti = 0; ti < times.length; ti++) {
        const key = sanitizeVenueKey(times[ti]?.key);
        if (key) {
          return { venueIndex: vi, dayIndex: di, timeIndex: ti, key };
        }
      }
    }
  }
  return null;
}

function extractVenuesAndKey(source: any) {
  const rawVenues = source?.venues || source?.event?.venues || source?.data?.venues;
  const venues = normalizeVenues(rawVenues);
  const selection = findFirstVenueSelection(venues);
  const directKey = sanitizeVenueKey(
    source?.venue_key ?? source?.event?.venue_key ?? source?.selected_venue_key
  );
  const rawVenueArray = Array.isArray(rawVenues) ? rawVenues : [];
  const fallbackArrayKey =
    rawVenueArray
      .flatMap((v: any) => [
        v?.key,
        v?.venue_key,
        ...(Array.isArray(v?.days)
          ? v.days.flatMap((d: any) => [d?.key, d?.venue_key])
          : []),
      ])
      .map(sanitizeVenueKey)
      .find(Boolean) || null;
  return {
    venues,
    selection,
    key: selection?.key || directKey || fallbackArrayKey || null,
  };
}

function isValidApiResponse(res: any): boolean {
  if (!res || res instanceof Error || res?.isAxiosError) return false;
  const body = res?.data;
  if (body && typeof body === "object" && !Array.isArray(body)) {
    if (typeof body.status === "number" && body.status >= 400) return false;
  }
  return true;
}

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
  const [participantsCount, setParticipantsCount] = useState<number>(0);
  const [participantsLoading, setParticipantsLoading] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifies, setNotifies] = useState<any[]>([]);
  const [notifiesCount, setNotifiesCount] = useState<number>(0);
  const [dataType, setDataType] = useState<"participants" | "notifies">("participants");
  const [dataCount, setDataCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<string>("");
  const [checkInFilter, setCheckInFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const telemetryRequestIdRef = useRef(0);
  const participantsRequestIdRef = useRef(0);
  const eventDetailsRequestIdRef = useRef(0);
  const switchSeqRef = useRef(0);
  const isSwitchingEventRef = useRef(false);
  const selectedKeyRef = useRef<string | null>(selectedKey);
  const venuesRef = useRef<Venue[]>(venues);
  const eventDataRef = useRef<any>(eventData);
  const searchTextRef = useRef<string>(searchText);
  const transactionStatusRef = useRef<string>(transactionStatusFilter);
  const checkInRef = useRef<string>(checkInFilter);

  useEffect(() => {
    selectedKeyRef.current = selectedKey;
    venuesRef.current = venues;
    eventDataRef.current = eventData;
    searchTextRef.current = searchText;
    transactionStatusRef.current = transactionStatusFilter;
    checkInRef.current = checkInFilter;
  }, [selectedKey, venues, eventData, searchText, transactionStatusFilter, checkInFilter]);

  // Logout Action
  const handleLogout = useCallback(() => {
    deleteToken();
    router.push("/");
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
  const fetchNotifies = useCallback(async (
    overrideEventId?: string,
    pageNum?: number,
    overrideSearchText?: string
  ) => {
    const activeId = overrideEventId || selectedEventId;
    if (!activeId) return;

    try {
      const query = (overrideSearchText ?? searchTextRef.current).trim();
      const params: Record<string, any> = {
        event_details: activeId,
        page: pageNum || currentPage || 1,
        limit: 10,
        search_text: query,
      };
      const activeKey =
        sanitizeVenueKey(selectedKeyRef.current) ||
        findFirstVenueSelection(venuesRef.current)?.key ||
        sanitizeVenueKey(eventDataRef.current?.venue_key);
      if (activeKey) {
        params.venue_key = activeKey;
      }
      const res: any = await getNotifiesDetails(jsonToUrlParams(params));
      if (isValidApiResponse(res)) {
        const items = extractArrayData(res);
        if (items.length > 0 || res?.data) {
          const notifyData = items.length > 0 ? items : res?.data?.data || [];
          const count = Number(res?.data?.count ?? res?.data?.total ?? notifyData.length) || 0;
          setNotifies(notifyData);
          setNotifiesCount(count);
          if (dataType === "notifies") {
            setDataCount(count);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching notifies:", err);
    }
  }, [selectedEventId, currentPage, dataType]);

  // Fetch Participants list (event-participants API, requires venue_key)
  const fetchParticipants = useCallback(async (options?: FetchParticipantsOptions) => {
    if (!selectedEventId) return;

    const activeKey =
      sanitizeVenueKey(selectedKeyRef.current) ||
      findFirstVenueSelection(venuesRef.current)?.key ||
      sanitizeVenueKey(eventDataRef.current?.venue_key);

    if (!activeKey) {
      setParticipants([]);
      setParticipantsCount(0);
      if (dataType === "participants") {
        setDataCount(0);
      }
      return;
    }

    const requestId = ++participantsRequestIdRef.current;
    const pageNum = options?.page ?? currentPage ?? 1;
    const query = (options?.searchText ?? searchTextRef.current).trim();
    const txStatus = options?.transactionStatus ?? transactionStatusRef.current;
    const checkedIn = options?.isCheckedIn ?? checkInRef.current;

    setParticipantsLoading(true);
    try {
      const partParams: Record<string, any> = {
        page: pageNum,
        limit: 10,
        id: selectedEventId,
        search_text: query,
        venue_key: activeKey,
      };
      if (txStatus) partParams.transaction_status = txStatus;
      if (checkedIn) partParams.is_checked_in = checkedIn;

      const partRes: any = await getPartiDetails(jsonToUrlParams(partParams));
      if (requestId !== participantsRequestIdRef.current) return;

      if (isValidApiResponse(partRes) && partRes?.data) {
        const partItems = extractArrayData(partRes);
        const partList =
          partItems.length > 0
            ? partItems
            : Array.isArray(partRes?.data?.data)
              ? partRes.data.data
              : [];
        const count = Number(partRes?.data?.count ?? partRes?.data?.total ?? partList.length) || 0;
        setParticipants(partList);
        setParticipantsCount(count);
        if (dataType === "participants") {
          setDataCount(count);
        }
      } else {
        setParticipants([]);
        setParticipantsCount(0);
        if (dataType === "participants") {
          setDataCount(0);
        }
      }
    } catch (err) {
      if (requestId !== participantsRequestIdRef.current) return;
      console.error("Error fetching participants:", err);
      setParticipants([]);
      setParticipantsCount(0);
      if (dataType === "participants") {
        setDataCount(0);
      }
    } finally {
      if (requestId === participantsRequestIdRef.current) {
        setParticipantsLoading(false);
      }
    }
  }, [selectedEventId, currentPage, dataType]);

  // Fetch telemetry for specific event & venue_key
  const fetchTelemetry = useCallback(async (
    eventId: string,
    venueKey?: string | null,
    pageOverride?: number
  ) => {
    if (!eventId) return;

    const requestId = ++telemetryRequestIdRef.current;
    const pageNum = pageOverride ?? currentPage;

    let activeKey =
      venueKey !== undefined
        ? sanitizeVenueKey(venueKey)
        : sanitizeVenueKey(selectedKeyRef.current) ||
          findFirstVenueSelection(venuesRef.current)?.key ||
          sanitizeVenueKey(eventDataRef.current?.venue_key);

    try {
      // If no venue_key was found from event-detail, check event-analytics for venues/venue_key first
      let preFetchedAnalyticsRes: any = null;
      if (!activeKey) {
        preFetchedAnalyticsRes = await getEventAnalytics(jsonToUrlParams({ id: eventId }));
        if (requestId !== telemetryRequestIdRef.current) return;

        if (isValidApiResponse(preFetchedAnalyticsRes) && preFetchedAnalyticsRes?.data) {
          const preAnalyticsData = preFetchedAnalyticsRes.data.data || preFetchedAnalyticsRes.data;
          const discovered = extractVenuesAndKey(preAnalyticsData);
          if (discovered.venues.length > 0) {
            setVenues(discovered.venues);
          }
          if (discovered.key) {
            activeKey = discovered.key;
            if (discovered.selection) {
              setSelectedVenueIndex(discovered.selection.venueIndex);
              setSelectedDayIndex(discovered.selection.dayIndex);
              setSelectedTimeIndex(discovered.selection.timeIndex);
            }
            setSelectedKey(discovered.key);
          }
        }
      }

      // 1. Fetch Volume
      const volParams: Record<string, any> = { id: eventId };
      if (activeKey) volParams.venue_key = activeKey;
      const volRes: any = await geteventVolume(jsonToUrlParams(volParams));
      if (requestId !== telemetryRequestIdRef.current) return;
      if (isValidApiResponse(volRes) && volRes?.data) {
        setVolume(volRes.data.data || volRes.data);
      }

      // 2. Fetch Analytics (reusing pre-fetched response if no venue_key exists)
      const analyticsRes: any =
        !activeKey && preFetchedAnalyticsRes
          ? preFetchedAnalyticsRes
          : await getEventAnalytics(
              jsonToUrlParams(activeKey ? { id: eventId, venue_key: activeKey } : { id: eventId })
            );
      if (requestId !== telemetryRequestIdRef.current) return;
      if (isValidApiResponse(analyticsRes) && analyticsRes?.data) {
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

      // 3, 4, 5. Endpoints requiring venue_key:
      // Only call event-checking-status, tickets-by-slot, and event-participants when venue_key is set.
      if (activeKey) {
        // Fetch Checking Status (event-checking-status)
        const statusRes: any = await getEventS(
          jsonToUrlParams({ event_id: eventId, venue_key: activeKey })
        );
        if (requestId !== telemetryRequestIdRef.current) return;
        if (isValidApiResponse(statusRes)) {
          const statusItems = extractArrayData(statusRes);
          if (statusItems.length > 0) {
            setTicketStatus(statusItems);
          } else if (Array.isArray(statusRes?.data?.data)) {
            setTicketStatus(statusRes.data.data);
          } else if (statusRes?.data?.data && typeof statusRes.data.data === "object") {
            setTicketStatus(statusRes.data.data);
          } else {
            setTicketStatus([]);
          }
        } else {
          setTicketStatus(null);
        }

        // Fetch Tickets by Slot (tickets-by-slot)
        const ticketRes: any = await getTickent(
          jsonToUrlParams({ event_id: eventId, venue_key: activeKey })
        );
        if (requestId !== telemetryRequestIdRef.current) return;
        if (isValidApiResponse(ticketRes)) {
          const ticketItems = extractArrayData(ticketRes);
          if (ticketItems.length > 0) {
            setTickets(ticketItems);
          } else if (Array.isArray(ticketRes?.data?.data)) {
            setTickets(ticketRes.data.data);
          } else {
            setTickets([]);
          }
        } else {
          setTickets([]);
        }

        // Fetch Participants (event-participants)
        const partParams: Record<string, any> = {
          page: pageNum,
          limit: 10,
          id: eventId,
          search_text: searchTextRef.current.trim(),
          venue_key: activeKey,
        };
        if (transactionStatusRef.current) partParams.transaction_status = transactionStatusRef.current;
        if (checkInRef.current) partParams.is_checked_in = checkInRef.current;

        const partRes: any = await getPartiDetails(jsonToUrlParams(partParams));
        if (requestId !== telemetryRequestIdRef.current) return;
        if (isValidApiResponse(partRes) && partRes?.data) {
          const partItems = extractArrayData(partRes);
          const partList =
            partItems.length > 0
              ? partItems
              : Array.isArray(partRes?.data?.data)
                ? partRes.data.data
                : [];
          const count = Number(partRes?.data?.count ?? partRes?.data?.total ?? partList.length) || 0;
          setParticipants(partList);
          setParticipantsCount(count);
          if (dataType === "participants") {
            setDataCount(count);
          }
        } else {
          setParticipants([]);
          setParticipantsCount(0);
          if (dataType === "participants") {
            setDataCount(0);
          }
        }
      } else {
        setTicketStatus(null);
        setTickets([]);
        setParticipants([]);
        setParticipantsCount(0);
        if (dataType === "participants") {
          setDataCount(0);
        }
      }

      // 6. Fetch Dashboard Notifications (Notify Me list)
      try {
        const notifyParams: Record<string, any> = {
          event_details: eventId,
          page: pageNum,
          limit: 10,
          search_text: searchTextRef.current.trim(),
        };
        if (activeKey) notifyParams.venue_key = activeKey;
        const notifyRes: any = await getNotifiesDetails(jsonToUrlParams(notifyParams));
        if (requestId !== telemetryRequestIdRef.current) return;
        if (isValidApiResponse(notifyRes)) {
          const notifyItems = extractArrayData(notifyRes);
          if (notifyItems.length > 0 || notifyRes?.data?.data) {
            const nList = notifyItems.length > 0 ? notifyItems : notifyRes?.data?.data || [];
            const nCount = Number(notifyRes?.data?.count ?? notifyRes?.data?.total ?? nList.length) || 0;
            setNotifications(nList);
            setNotifies(nList);
            setNotifiesCount(nCount);
            if (dataType === "notifies") {
              setDataCount(nCount);
            }
          } else {
            setNotifications([]);
            setNotifies([]);
            setNotifiesCount(0);
            if (dataType === "notifies") {
              setDataCount(0);
            }
          }
        }
      } catch (notifyErr) {
        console.error("Error fetching notifies:", notifyErr);
      }
    } catch (err) {
      console.error("Error fetching telemetry:", err);
    }
  }, [currentPage, dataType]);

  // Fetch details for selected event
  const fetchEventDetails = useCallback(async (eventId: string, fallbackEvent?: any) => {
    const requestId = ++eventDetailsRequestIdRef.current;
    try {
      const data: any = await getEventDetails(eventId);
      if (requestId !== eventDetailsRequestIdRef.current) return;

      const rawDetails = data?.data?.data ?? data?.data;
      const details = Array.isArray(rawDetails) ? rawDetails[0] : rawDetails;
      const validDetails =
        details &&
        typeof details === "object" &&
        !(
          typeof details.status === "number" &&
          details.status >= 400 &&
          !details.id &&
          !details.event_name &&
          !details.venues
        )
          ? details
          : null;

      if (validDetails) {
        setEventData((prev: any) => ({
          ...(prev || {}),
          ...validDetails,
        }));
      }

      const fromDetails = extractVenuesAndKey(validDetails);
      const fromFallback = !fromDetails.key ? extractVenuesAndKey(fallbackEvent) : null;
      const resolvedVenues =
        fromDetails.venues.length > 0 ? fromDetails.venues : fromFallback?.venues || [];
      const resolvedSelection = fromDetails.selection || fromFallback?.selection || null;
      const resolvedKey = fromDetails.key || fromFallback?.key || null;

      venuesRef.current = resolvedVenues;
      selectedKeyRef.current = resolvedKey;
      setVenues(resolvedVenues);

      if (resolvedKey) {
        setSelectedVenueIndex(resolvedSelection?.venueIndex ?? 0);
        setSelectedDayIndex(resolvedSelection?.dayIndex ?? 0);
        setSelectedTimeIndex(resolvedSelection?.timeIndex ?? 0);
        setSelectedKey(resolvedKey);
        await fetchTelemetry(eventId, resolvedKey, 1);
        return;
      }

      setSelectedKey(null);
      await fetchTelemetry(eventId, null, 1);
    } catch (err) {
      if (requestId !== eventDetailsRequestIdRef.current) return;
      console.error("Error fetching event details:", err);
      const fromFallback = extractVenuesAndKey(fallbackEvent);
      venuesRef.current = fromFallback.venues;
      selectedKeyRef.current = fromFallback.key;
      setVenues(fromFallback.venues);
      setSelectedKey(fromFallback.key);
      await fetchTelemetry(eventId, fromFallback.key, 1);
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
        const key = extractEventId(e);
        if (key) mergedMap.set(key, e);
      });
      overviewList.forEach((e) => {
        const key = extractEventId(e);
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

        const firstEventId = extractEventId(fallbackList[0]);
        if (firstEventId) {
          setSelectedEventId(firstEventId);
          setEventData(fallbackList[0]);
          await fetchEventDetails(firstEventId, fallbackList[0]);
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
  const prevEventIdRef = useRef(selectedEventId);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevEventIdRef.current = selectedEventId;
      return;
    }

    const eventChanged = prevEventIdRef.current !== selectedEventId;
    const pageChanged = prevPageRef.current !== currentPage;
    const dataTypeChanged = prevDataTypeRef.current !== dataType;

    prevEventIdRef.current = selectedEventId;
    prevPageRef.current = currentPage;
    prevDataTypeRef.current = dataType;

    if (eventChanged || isSwitchingEventRef.current) {
      return;
    }

    if ((pageChanged || dataTypeChanged) && selectedEventId) {
      if (dataType === "participants") {
        fetchParticipants({ page: currentPage });
      } else {
        fetchNotifies(selectedEventId, currentPage);
      }
    }
  }, [currentPage, dataType, selectedEventId, fetchParticipants, fetchNotifies]);

  const resetTableFilters = () => {
    searchTextRef.current = "";
    transactionStatusRef.current = "";
    checkInRef.current = "";
    setSearchText("");
    setTransactionStatusFilter("");
    setCheckInFilter("");
  };

  // Handle Venue Select
  const handleVenueSelect = (vi: number) => {
    const selection = findFirstVenueSelection(venues, vi);
    const key = selection?.key || null;
    selectedKeyRef.current = key;
    setSelectedVenueIndex(vi);
    setSelectedDayIndex(selection?.dayIndex ?? 0);
    setSelectedTimeIndex(selection?.timeIndex ?? 0);
    setSelectedKey(key);
    resetTableFilters();
    prevPageRef.current = 1;
    setCurrentPage(1);
    if (selectedEventId) {
      fetchTelemetry(selectedEventId, key, 1);
    }
  };

  // Handle Day Select
  const handleDaySelect = (di: number) => {
    const selection = findFirstVenueSelection(venues, selectedVenueIndex, di);
    const key = selection?.key || null;
    selectedKeyRef.current = key;
    setSelectedDayIndex(di);
    setSelectedTimeIndex(selection?.timeIndex ?? 0);
    setSelectedKey(key);
    resetTableFilters();
    prevPageRef.current = 1;
    setCurrentPage(1);
    if (selectedEventId) {
      fetchTelemetry(selectedEventId, key, 1);
    }
  };

  // Handle Time Select
  const handleTimeSelect = (ti: number) => {
    setSelectedTimeIndex(ti);
    const key = sanitizeVenueKey(venues[selectedVenueIndex]?.days?.[selectedDayIndex]?.times?.[ti]?.key);
    selectedKeyRef.current = key;
    setSelectedKey(key);
    resetTableFilters();
    prevPageRef.current = 1;
    setCurrentPage(1);
    if (selectedEventId) {
      fetchTelemetry(selectedEventId, key, 1);
    }
  };

  // Change Active Event from Dropdown
  const handleEventIdChange = useCallback(async (id: string) => {
    if (!id) return;
    const switchSeq = ++switchSeqRef.current;
    telemetryRequestIdRef.current += 1;
    participantsRequestIdRef.current += 1;
    isSwitchingEventRef.current = true;
    prevPageRef.current = 1;

    setSelectedEventId(id);
    setCurrentPage(1);
    resetTableFilters();
    setLoading(true);

    // Clear stale telemetry for old event
    setAnalytics(null);
    setVolume(null);
    setTicketStatus(null);
    setTickets([]);
    setParticipants([]);
    setParticipantsCount(0);
    setNotifies([]);
    setNotifiesCount(0);
    setDataCount(0);
    setVenues([]);
    venuesRef.current = [];
    setSelectedVenueIndex(0);
    setSelectedDayIndex(0);
    setSelectedTimeIndex(0);
    setSelectedKey(null);
    selectedKeyRef.current = null;

    // Immediately match selected event from events list for quick UI title update
    const matched = events.find((e) => extractEventId(e) === String(id));
    if (matched) {
      setEventData(matched);
    } else {
      setEventData(null);
    }

    try {
      await fetchEventDetails(id, matched);
    } catch (err) {
      console.error("Error switching event:", err);
    } finally {
      if (switchSeq === switchSeqRef.current) {
        isSwitchingEventRef.current = false;
        setLoading(false);
      }
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
        participantsCount,
        participantsLoading,
        analytics,
        notifications,
        notifies,
        notifiesCount,
        dataType,
        setDataType,
        dataCount,
        currentPage,
        setCurrentPage,
        searchText,
        setSearchText,
        transactionStatusFilter,
        setTransactionStatusFilter,
        checkInFilter,
        setCheckInFilter,
        loading,
        handleLogout,
        refreshData: () => fetchTelemetry(selectedEventId, selectedKey),
        fetchParticipants,
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
