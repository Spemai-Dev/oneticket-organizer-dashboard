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
import { Avatar } from "../ui/avatar";
import styles from "./sidebar.module.scss";

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
    <div className={styles.sidebarWrapper}>
      <div className={styles.topContent}>
        {/* Brand Logo & Mobile Close */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/oneticket_logo.png"
              alt="OneTicket"
              className={styles.brandLogoImg}
            />
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className={styles.closeBtn}
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className={styles.navContainer}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className={styles.navSection}>
              <h4 className={styles.sectionTitle}>
                {section.title}
              </h4>
              <ul className={styles.navList}>
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                      >
                        <span className={styles.indicatorDot} />
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
      <div className={styles.bottomSection}>
        <button className={styles.newEventBtn}>
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>New event</span>
        </button>

        <div className={styles.profileCard}>
          <Avatar fallback="A" size="sm" className="bg-[#00d07d] text-[#041c14] font-bold" />
          <div className={styles.profileInfo}>
            <span className={styles.userName}>Amila</span>
            <span className={styles.orgName}>Confront Events</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={styles.desktopSidebar}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className={styles.mobileDrawer}>
          {/* Dark backdrop */}
          <div
            className={styles.backdrop}
            onClick={onCloseMobile}
          />

          {/* Slide-out drawer */}
          <aside className={styles.drawerContent}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
