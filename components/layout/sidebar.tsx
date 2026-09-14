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
  Plus,
  Ticket as LogoIcon,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar } from "../ui/avatar";

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

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 select-none">
      <div className="flex flex-col gap-6">
        {/* Brand Logo & Mobile Close */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#00d07d] flex items-center justify-center text-[#041c14]">
              <LogoIcon className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">OneTicket</span>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden h-8 w-8 rounded-lg bg-[#07281d] text-[#97bcac] hover:text-white flex items-center justify-center"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 no-scrollbar">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-1.5">
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-[#638b7d] uppercase">
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
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 lg:py-2 rounded-xl text-xs font-semibold transition-all duration-200 group",
                          isActive
                            ? "bg-[#0b3829] text-white shadow-sm"
                            : "text-[#97bcac] hover:bg-[#07281d] hover:text-white"
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full transition-all",
                            isActive ? "bg-[#00d07d]" : "bg-transparent group-hover:bg-[#00d07d]/40"
                          )}
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

      {/* Bottom Actions & Profile */}
      <div className="flex flex-col gap-4 pt-3 border-t border-[#0d3326]">
        <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#00d07d] hover:bg-[#00b36b] text-[#041c14] font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>New event</span>
        </button>

        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-[#07281d] cursor-pointer transition-colors">
          <Avatar fallback="A" size="sm" className="bg-[#00d07d] text-[#041c14] font-bold" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-white truncate">Amila</span>
            <span className="text-[10px] text-[#638b7d] truncate">Confront Events</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#041c14] text-[#a3c9bb] flex-col justify-between h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-out drawer */}
          <aside className="relative w-72 max-w-[80vw] bg-[#041c14] text-[#a3c9bb] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
