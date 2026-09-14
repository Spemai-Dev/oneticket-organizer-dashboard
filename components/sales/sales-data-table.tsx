"use client";

import React, { useState } from "react";
import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_ORDERS } from "../../lib/mock-data";
import { Order } from "../../types";
import { StatusBadge } from "./status-badge";
import { formatNumber } from "../../lib/utils";
import { Badge } from "../ui/badge";

export function SalesDataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("All Tiers");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter orders
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      order.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.attendeeEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier =
      selectedTier === "All Tiers" || order.tier === selectedTier;

    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "Gold":
        return <Badge variant="gold" className="bg-amber-400 text-amber-950 font-bold">Gold</Badge>;
      case "VIP":
        return <Badge variant="purple" className="bg-purple-900 text-purple-100 font-bold">VIP</Badge>;
      case "General":
        return <Badge variant="emerald" className="bg-[#043825] text-emerald-300 font-bold">General</Badge>;
      default:
        return <Badge variant="gray">{tier}</Badge>;
    }
  };

  const getGatewayDot = (gatewayType: string) => {
    if (gatewayType.includes("OnePay")) return <span className="h-2 w-2 rounded-full bg-emerald-500" />;
    if (gatewayType.includes("KOKO")) return <span className="h-[#8b5cf6] h-2 w-2 rounded-full bg-purple-500" />;
    if (gatewayType.includes("Mintpay")) return <span className="h-2 w-2 rounded-full bg-amber-500" />;
    return <span className="h-2 w-2 rounded-full bg-blue-500" />;
  };

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col gap-5">
      {/* Top Filter Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search order ID, attendee name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Tier Tabs */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            {["All Tiers", "General", "VIP", "Gold"].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedTier === tier
                    ? "bg-[#043825] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Status Select Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none h-10 px-3 pr-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="All">Status: All</option>
              <option value="Completed">Status: Completed</option>
              <option value="Refunded">Status: Refunded</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">TRAN ID</th>
              <th className="py-3 px-4">ATTENDEE</th>
              <th className="py-3 px-4">TIER</th>
              <th className="py-3 px-4">QTY</th>
              <th className="py-3 px-4">GATEWAY</th>
              <th className="py-3 px-4">AMOUNT</th>
              <th className="py-3 px-4">TIMESTAMP</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {order.transactionId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {order.attendeeName}
                      </span>
                      <span className="text-[11px] text-zinc-400">{order.attendeeEmail}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getTierBadge(order.tier)}</td>
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    {order.quantity}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                      {getGatewayDot(order.gatewayType)}
                      <span>{order.gateway}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-zinc-900 dark:text-zinc-100">
                    Rs. {formatNumber(order.amount)}.00
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500">{order.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="h-8 w-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center ml-auto transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-zinc-400">
                  No orders found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
        <span className="text-zinc-500 font-medium">
          Showing <span className="font-bold text-zinc-900 dark:text-zinc-100">1–{filteredOrders.length}</span> of{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">1,420</span> orders
        </span>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentPage(1)}
            className="h-8 w-8 rounded-lg bg-[#043825] text-white font-bold flex items-center justify-center shadow-sm"
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold flex items-center justify-center"
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold flex items-center justify-center"
          >
            3
          </button>
          <span className="px-1 text-zinc-400 font-bold">...</span>
          <button className="h-8 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold flex items-center justify-center">
            237
          </button>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
