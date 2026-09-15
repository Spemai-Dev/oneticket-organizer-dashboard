"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { EventFilterTabs } from "../../../components/events/event-filter-tabs";
import { EventCard } from "../../../components/events/event-card";
import { MOCK_EVENTS } from "../../../lib/mock-data";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredEvents = MOCK_EVENTS.filter((evt) => {
    if (activeTab === "All") return true;
    return evt.status === activeTab;
  });

  const actionButton = (
    <button className="flex items-center gap-2 px-4 py-2 bg-[#00d07d] hover:bg-[#00b36b] text-[#041c14] rounded-xl text-xs font-bold shadow-md transition-all">
      <Plus className="h-4 w-4 stroke-[3]" />
      <span>Create Event</span>
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <TopbarHeader actionButton={actionButton} />

      {/* Filter Tabs */}
      <EventFilterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          All: MOCK_EVENTS.length,
          Live: MOCK_EVENTS.filter((e) => e.status === "Live").length,
          Upcoming: MOCK_EVENTS.filter((e) => e.status === "Upcoming").length,
          Past: MOCK_EVENTS.filter((e) => e.status === "Past").length,
          Draft: 0,
        }}
      />

      {/* Events Grid (2 columns layout as shown in screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => (
          <EventCard key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
}
