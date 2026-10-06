"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, CalendarX } from "lucide-react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { EventFilterTabs } from "../../../components/events/event-filter-tabs";
import { EventCard } from "../../../components/events/event-card";
import { getEventsOverview } from "../../../lib/services/dashboard";
import { extractArrayData, normalizeEventData } from "../../../lib/utils/event-normalizer";
import { Event } from "../../../types";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  // Tab counts state (updated dynamically per selected tab API hit)
  const [tabCounts, setTabCounts] = useState<Record<string, number | undefined>>({});

  // Fetch events ONLY for selected active tab & current page (1 API request per tab selection)
  const loadEventsData = useCallback(
    async (tabName: string, pageNum: number) => {
      setLoading(true);
      setError(null);

      try {
        const statusQuery = tabName === "All" ? "all" : tabName.toLowerCase();
        const res: any = await getEventsOverview({
          status: statusQuery,
          page: pageNum,
          limit: limitPerPage,
        });

        if (res && (res.status === 200 || res.status === 100 || res.data)) {
          const items = extractArrayData(res);
          const serverCount =
            typeof res?.data?.count === "number"
              ? res.data.count
              : typeof res?.count === "number"
              ? res.count
              : items.length;

          if (items.length > 0) {
            const normalized = items.map(normalizeEventData);
            setEventsList(normalized);
            setTotalCount(serverCount);
          } else {
            // Explicitly set 0 items when API returns 0 records for this filter
            setEventsList([]);
            setTotalCount(0);
          }

          // Update ONLY selected tab's count badge with API response count
          setTabCounts((prev) => ({
            ...prev,
            [tabName]: serverCount,
          }));
        } else {
          setEventsList([]);
          setTotalCount(0);
        }
      } catch (err: any) {
        console.error("Failed to load events from API:", err);
        setError("Unable to load events from server. Please try again.");
        setEventsList([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [limitPerPage]
  );

  // Load events when tab or page changes (single API call for selected tab)
  useEffect(() => {
    loadEventsData(activeTab, currentPage);
  }, [activeTab, currentPage, loadEventsData]);

  // Handle Tab Selection Change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page to 1 when changing filter tab
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / limitPerPage));
  const startIndex = eventsList.length > 0 ? (currentPage - 1) * limitPerPage + 1 : 0;
  const endIndex = Math.min(startIndex + eventsList.length - 1, totalCount);

  // Smart page numbers window for responsive pagination
  const getPageNumbers = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, "...", total];
    }
    if (current >= total - 2) {
      return [1, "...", total - 2, total - 1, total];
    }
    return [1, "...", current, "...", total];
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const actionButton = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => loadEventsData(activeTab, currentPage)}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all cursor-pointer"
        title="Refresh events API"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <TopbarHeader actionButton={actionButton} />

      {error && (
        <div className="flex items-center gap-2.5 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs - Counts update ONLY on selection */}
      <EventFilterTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={tabCounts}
      />

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl animate-pulse flex items-center justify-center p-6 text-zinc-600 gap-3"
            >
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              <span className="text-xs font-medium">Loading Events Page Data...</span>
            </div>
          ))}
        </div>
      ) : eventsList.length > 0 ? (
        <>
          {/* Events Grid (2 columns layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {eventsList.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>

          {/* Fully Responsive Pagination Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-xs text-zinc-400">
            <div className="text-center md:text-left">
              Showing <span className="font-bold text-white">{startIndex}–{endIndex}</span> of{" "}
              <span className="font-bold text-white">{totalCount}</span> events
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 font-semibold rounded-xl transition-all cursor-pointer text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {pageNumbers.map((pageVal, idx) => (
                <button
                  key={idx}
                  disabled={typeof pageVal !== "number"}
                  onClick={() => typeof pageVal === "number" && setCurrentPage(pageVal)}
                  className={`h-8 min-w-[32px] px-2 rounded-xl font-bold transition-all ${
                    typeof pageVal !== "number"
                      ? "bg-transparent text-zinc-500 cursor-default"
                      : currentPage === pageVal
                      ? "bg-[#00d07d] text-[#041c14] shadow-sm cursor-pointer"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                  }`}
                >
                  {pageVal}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 font-semibold rounded-xl transition-all cursor-pointer text-xs"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Clean Zero Events Empty State */
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-center gap-3">
          <div className="p-3 bg-zinc-800 text-zinc-400 rounded-xl">
            <CalendarX className="h-8 w-8" />
          </div>
          <h4 className="text-sm font-bold text-white">No {activeTab !== "All" ? activeTab : ""} Events Found</h4>
          <p className="text-xs text-zinc-500 max-w-sm">
            There are currently no {activeTab !== "All" ? activeTab.toLowerCase() : ""} events matching your query from the server.
          </p>
        </div>
      )}
    </div>
  );
}
