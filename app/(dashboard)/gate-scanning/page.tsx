"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { ScanCountCard } from "../../../components/dashboard/scan-count-card";
import { QrCode, Smartphone, CheckCircle, ShieldAlert } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export default function GateScanningPage() {
  return (
    <div className="flex flex-col gap-6">
      <TopbarHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Live Gate Scanning Control
          </h2>
          <p className="text-xs text-zinc-500">
            Monitor real-time gate entry speed, scanner app connections & ticket check-ins
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" className="gap-1 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            4 Scanners Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScanCountCard />

        {/* Scanner Hardware Status */}
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              CONNECTED GATE TERMINALS
            </span>
            <span className="text-xs font-semibold text-[#00d07d]">Nelum Pokuna Main Gate</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { id: "Gate A - VIP Lane", device: "OneScan Terminal #01", status: "Online", count: 312 },
              { id: "Gate B - General", device: "OneScan Terminal #02", status: "Online", count: 480 },
              { id: "Gate C - General", device: "OneScan Terminal #03", status: "Online", count: 442 },
              { id: "Gate D - Gold Lane", device: "Mobile App #04", status: "Idle", count: 0 },
            ].map((gate) => (
              <div
                key={gate.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#041c14] text-[#00d07d] flex items-center justify-center font-bold">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{gate.id}</h4>
                    <p className="text-[11px] text-zinc-400">{gate.device}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {gate.count} scans
                  </span>
                  <Badge variant={gate.status === "Online" ? "emerald" : "gray"}>
                    {gate.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
