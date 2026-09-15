"use client";

import React, { useState } from "react";
import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_ORDERS } from "../../lib/mock-data";
import { StatusBadge } from "./status-badge";
import { formatNumber } from "../../lib/utils";
import { Badge } from "../ui/badge";
import styles from "./sales-data-table.module.scss";

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
    if (gatewayType.includes("KOKO")) return <span className="h-2 w-2 rounded-full bg-purple-500" />;
    if (gatewayType.includes("Mintpay")) return <span className="h-2 w-2 rounded-full bg-amber-500" />;
    return <span className="h-2 w-2 rounded-full bg-blue-500" />;
  };

  return (
    <div className={styles.cardContainer}>
      {/* Top Filter Header Bar */}
      <div className={styles.topFilterBar}>
        {/* Search Input */}
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search order ID, attendee name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div className={styles.filterGroup}>
          {/* Tier Tabs */}
          <div className={styles.tierTabs}>
            {["All Tiers", "General", "VIP", "Gold"].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`${styles.tierBtn} ${selectedTier === tier ? styles.active : ""}`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Status Select Dropdown */}
          <div className={styles.selectWrapper}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">Status: All</option>
              <option value="Completed">Status: Completed</option>
              <option value="Refunded">Status: Refunded</option>
            </select>
            <ChevronDown className={styles.selectChevron} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>TRAN ID</th>
              <th>ATTENDEE</th>
              <th>TIER</th>
              <th>QTY</th>
              <th>GATEWAY</th>
              <th>AMOUNT</th>
              <th>TIMESTAMP</th>
              <th>STATUS</th>
              <th style={{ textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.tranId}>
                    {order.transactionId}
                  </td>
                  <td>
                    <div className={styles.attendeeCell}>
                      <span className={styles.name}>
                        {order.attendeeName}
                      </span>
                      <span className={styles.email}>{order.attendeeEmail}</span>
                    </div>
                  </td>
                  <td>{getTierBadge(order.tier)}</td>
                  <td style={{ fontWeight: 700 }}>
                    {order.quantity}
                  </td>
                  <td>
                    <div className={styles.gatewayCell}>
                      {getGatewayDot(order.gatewayType)}
                      <span>{order.gateway}</span>
                    </div>
                  </td>
                  <td className={styles.amount}>
                    Rs. {formatNumber(order.amount)}.00
                  </td>
                  <td style={{ color: "#71717a" }}>{order.timestamp}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className={styles.actionBtn}>
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ padding: "2rem 0", textAlign: "center", color: "#a1a1aa" }}>
                  No orders found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className={styles.paginationFooter}>
        <span className={styles.showingText}>
          Showing <span className={styles.highlight}>1–{filteredOrders.length}</span> of{" "}
          <span className={styles.highlight}>1,420</span> orders
        </span>

        <div className={styles.btnGroup}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={styles.pageNavBtn}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentPage(1)}
            className={`${styles.numBtn} ${styles.activePage}`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={styles.numBtn}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={styles.numBtn}
          >
            3
          </button>
          <span style={{ padding: "0 0.25rem", color: "#a1a1aa", fontWeight: 700 }}>...</span>
          <button className={styles.numBtn}>
            237
          </button>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className={styles.pageNavBtn}
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
