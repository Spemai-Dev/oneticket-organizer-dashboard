import React from "react";
import { Ticket as LogoIcon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#041c14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#00d07d]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#00d07d]/15 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-[#00d07d] flex items-center justify-center text-[#041c14] shadow-lg shadow-[#00d07d]/20">
          <LogoIcon className="h-6 w-6 stroke-[2.5]" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">OneTicket</span>
      </div>

      {/* Centered Auth Card Container */}
      <div className="w-full max-w-md bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-[#638b7d]">
        © 2026 OneTicket Merchant Portal. All rights reserved.
      </footer>
    </div>
  );
}
