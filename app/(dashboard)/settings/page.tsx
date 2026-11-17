"use client";

import React from "react";
import { TopbarHeader } from "../../../components/layout/topbar-header";
import { Building, Phone, Globe, Calendar, Clock, Info, ShieldCheck } from "lucide-react";
import { useDashboard } from "../../../lib/context/dashboard-context";
import { environment } from "../../../lib/environment";
import { EventOrganizer } from "../../../types/api";

const getImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${environment.IMAGE_BASE_URL}${cleanPath}`;
};

export default function SettingsPage() {
  const { eventData, loading } = useDashboard();

  const organizer: EventOrganizer | undefined =
    eventData?.event_organizer ||
    (eventData as { organizer?: EventOrganizer })?.organizer;

  const organizerName = organizer?.name || eventData?.organizer_name || "Organizer Name";
  const contactNumber = organizer?.contact_number || eventData?.contact_number || "Not provided";
  const country = organizer?.country || "Sri Lanka";
  const description = organizer?.description || "No description available for this organizer.";
  const bannerUrl = getImageUrl(organizer?.organizer_banner);
  const profileUrl = getImageUrl(organizer?.profile_image);

  const eventName = eventData?.event_name || "Active Event";
  const eventDateTime = eventData?.event_datetime;
  const eventExpireOn = eventData?.event_expire_on;

  const socialLinks = organizer?.social_media_links && typeof organizer.social_media_links === "object"
    ? Object.entries(organizer.social_media_links)
    : [];

  const initialLetter = (organizerName[0] || "O").toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <TopbarHeader />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Organizer Details
          </h2>
          <p className="text-xs text-zinc-500">
            Real-time organization profile and event manager details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organizer Profile Card */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-emerald-500" />
              <span>Organizer Profile</span>
            </h3>
            {organizer?.id && (
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                Organizer ID #{organizer.id}
              </span>
            )}
          </div>

          {/* Banner & Avatar section */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50">
            {bannerUrl ? (
              <div className="h-36 sm:h-44 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerUrl}
                  alt={organizerName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-[#041c14] via-[#072d20] to-[#0a4230]" />
            )}

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
              {profileUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileUrl}
                  alt={organizerName}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
                  {initialLetter}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {organizerName}
                  </h4>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Organizer
                  </span>
                </div>
                {organizer?.organizer_slug && (
                  <p className="text-xs text-zinc-400 font-mono">@{organizer.organizer_slug}</p>
                )}
              </div>
            </div>
          </div>

          {/* Organizer Detail Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Organizer Name
              </span>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {organizerName}
              </p>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-emerald-500" />
                <span>Contact Phone Number</span>
              </span>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {contactNumber}
              </p>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-emerald-500" />
                <span>Country</span>
              </span>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {country}
              </p>
            </div>

            <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-3 w-3 text-emerald-500" />
                <span>Organizer Bio / Description</span>
              </span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {description}
              </p>
            </div>
          </div>

          {/* Social Media Links */}
          {socialLinks.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Social Media Links
              </span>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(([network, url]) => (
                  <a
                    key={network}
                    href={String(url)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 transition-colors"
                  >
                    <span className="font-semibold capitalize">{network}:</span> {String(url)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Event Context Card */}
        <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span>Current Event Context</span>
            </h3>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs flex flex-col gap-1 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Event Title</span>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{eventName}</p>
              </div>

              {eventDateTime && (
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs flex flex-col gap-1 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-500" />
                    <span>Event Date & Time</span>
                  </span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{eventDateTime}</p>
                </div>
              )}

              {eventExpireOn && (
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs flex flex-col gap-1 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Expires On</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{eventExpireOn}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-4 text-xs text-emerald-800 dark:text-emerald-300">
            <p className="font-semibold">Live Organization Sync</p>
            <p className="text-[11px] mt-0.5 text-emerald-700 dark:text-emerald-400">
              Details are synchronized with the active event organizer configuration.
            </p>
          </div>
        </div>

        {/*
          Team member not real - commented out for UI as requested by user.
          Only real organizer data is displayed.

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
        */}
      </div>
    </div>
  );
}
