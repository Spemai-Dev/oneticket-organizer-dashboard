"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Receipt,
  Tags,
  QrCode,
  Ticket,
  Wallet,
  Settings,
  Ticket as LogoIcon,
  X
} from "lucide-react";
import { Avatar } from "../ui/avatar";
import { useDashboard } from "../../lib/context/dashboard-context";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Events", href: "/events", icon: Calendar },
      { name: "Ticket Sales", href: "/ticket-sales", icon: Receipt },
      { name: "Ticket Tiers", href: "/ticket-tiers", icon: Tags },
    ],
  },
  {
    title: "MANAGE",
    items: [
      { name: "Gate Scanning", href: "/gate-scanning", icon: QrCode },
      { name: "Coupon Codes", href: "/coupon-codes", icon: Ticket },
      { name: "Payouts", href: "/payouts", icon: Wallet },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Team & Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { eventData, analytics, events } = useDashboard();

  const activeEvent =
    eventData ||
    analytics?.event ||
    events.find((e) => e.organizer_name || e.merchant_name || e.organizer) ||
    events[0];

  const merchantName =
    activeEvent?.organizer_name ||
    activeEvent?.merchant_name ||
    activeEvent?.organizer ||
    activeEvent?.company_name ||
    analytics?.event?.organizer_name ||
    analytics?.event?.merchant_name ||
    "Merchant Organizer";

  const userName =
    activeEvent?.contact_person ||
    activeEvent?.user_name ||
    (activeEvent?.organizer_email ? activeEvent.organizer_email.split("@")[0] : null) ||
    "Merchant Admin";

  const fallbackLetter = (userName[0] || merchantName[0] || "M").toUpperCase();

  const sidebarContent = (
    <div className="flex h-full select-none flex-col justify-between p-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/oneticket_logo.png"
              alt="OneTicket"
              className="h-10 w-auto object-contain"
            />
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-[#07281d] text-[#97bcac] transition-colors hover:text-white lg:hidden"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex max-h-[calc(100vh-220px)] flex-col gap-5 overflow-y-auto pr-1">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-1.5">
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#638b7d]">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all lg:py-2 ${
                          isActive
                            ? "bg-[#0b3829] text-white shadow-sm"
                            : "text-[#97bcac] hover:bg-[#07281d] hover:text-white"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full transition-all ${
                            isActive ? "bg-[#00d07d]" : "bg-transparent group-hover:bg-[#00d07d]/40"
                          }`}
                        />
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#0d3326] pt-3">
        <div className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-[#07281d]">
          <Avatar fallback={fallbackLetter} size="sm" className="bg-[#00d07d] text-[#041c14] font-bold" />
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-xs font-bold text-white">{userName}</span>
            <span className="truncate text-[10px] text-[#638b7d]">{merchantName}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between bg-[#041c14] text-[#a3c9bb] lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />

          <aside className="relative z-10 h-full w-72 max-w-[80vw] bg-[#041c14] text-[#a3c9bb] shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
