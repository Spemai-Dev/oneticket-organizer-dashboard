"use client";

import React from "react";
import { Event } from "../../types";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { formatNumber } from "../../lib/utils";
import { Calendar, MapPin, Ticket, ArrowUpRight } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const percentSold = Math.round((event.soldCount / event.totalCapacity) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live":
        return <Badge variant="emerald" className="animate-pulse">🟢 Live Now</Badge>;
      case "Upcoming":
        return <Badge variant="blue">Upcoming</Badge>;
      case "Past":
        return <Badge variant="gray">Completed</Badge>;
      case "Draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <div className="group rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Banner Image */}
      <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {getStatusBadge(event.status)}
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono border border-white/20">
            {event.code}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {event.category}
          </span>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-1">{event.subtitle}</p>

          <div className="flex flex-col gap-1.5 mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span>{event.date} · {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>

        {/* Sell through progress */}
        <div className="flex flex-col gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-500">Sell-through</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {formatNumber(event.soldCount)} / {formatNumber(event.totalCapacity)} ({percentSold}%)
            </span>
          </div>
          <Progress value={percentSold} barClassName="bg-[#00d07d]" className="h-2" />
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-xs">
            <Ticket className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-zinc-500">From</span>
            <span className="font-extrabold text-zinc-900 dark:text-white">
              Rs. {formatNumber(event.ticketTiers[0]?.price || 0)}
            </span>
          </div>

          <button className="flex items-center gap-1 text-xs font-bold text-[#043825] dark:text-[#00d07d] hover:underline group-hover:translate-x-0.5 transition-transform">
            <span>Manage</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
