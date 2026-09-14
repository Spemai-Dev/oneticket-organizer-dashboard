"use client";

import React, { useState } from "react";
import { Sidebar } from "../../components/layout/sidebar";
import { Menu, Ticket as LogoIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f4f6f8] dark:bg-[#0a0a0a] font-sans antialiased text-zinc-900 dark:text-zinc-100">
      {/* Sidebar Component (Handles Desktop + Mobile Drawer) */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar (Visible on mobile/tablet `< lg`) */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#041c14] text-white px-4 py-3 flex items-center justify-between shadow-md border-b border-[#0d3326]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl bg-[#07281d] text-[#00d07d] hover:bg-[#0b3829] transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#00d07d] flex items-center justify-center text-[#041c14]">
                <LogoIcon className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">OneTicket</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-400 bg-[#07281d] px-2.5 py-1 rounded-full border border-[#0d4432]">
              Amila
            </span>
          </div>
        </header>

        {/* Main Content Wrapper */}
        <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
