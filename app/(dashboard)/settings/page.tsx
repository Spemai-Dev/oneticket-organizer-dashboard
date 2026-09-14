"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { Users, Building, ShieldCheck, Mail, Save } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <TopbarHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Team & Merchant Settings
          </h2>
          <p className="text-xs text-zinc-500">
            Manage organizer profile, staff access permissions & API integrations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col gap-6">
          <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Building className="h-4 w-4 text-emerald-500" />
            <span>Organizer Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Organization Name
              </label>
              <Input defaultValue="Confront Events" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Primary Contact Person
              </label>
              <Input defaultValue="Amila Perera" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Support Email
              </label>
              <Input defaultValue="support@confrontevents.lk" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Contact Phone Number
              </label>
              <Input defaultValue="+94 77 123 4567" />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button className="bg-[#043825] hover:bg-[#064d33] text-white font-bold h-10 text-xs px-6 gap-2">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>

        {/* Team Members List */}
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5">
          <div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-emerald-500" />
              <span>Team Members</span>
            </h3>

            <div className="flex flex-col gap-3">
              {[
                { name: "Amila Perera", role: "Owner & Admin", email: "amila@confront.lk" },
                { name: "Sahan Dias", role: "Gate Manager", email: "sahan@confront.lk" },
                { name: "Dinusha K.", role: "Finance Officer", email: "dinusha@confront.lk" },
              ].map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs"
                >
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{member.name}</p>
                    <p className="text-[11px] text-zinc-400">{member.role}</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
