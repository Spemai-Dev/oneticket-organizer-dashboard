"use client";

import React, { useState } from "react";
import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, ArrowUpRight, AlertTriangle, Send, RotateCcw } from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { MOCK_ORDERS } from "../../lib/mock-data";
import { StatusBadge } from "./status-badge";
import { formatNumber } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { TicketUpgradeModal } from "./ticket-upgrade-modal";
import { TicketCancellationModal } from "./ticket-cancellation-modal";
import { ResendConfirmationModal } from "./resend-confirmation-modal";
import { RefundRequestModal } from "./refund-request-modal";
import styles from "./sales-data-table.module.scss";

export function SalesDataTable() {
  const {
    participants,
    notifies,
    dataType,
    setDataType,
    dataCount,
    currentPage,
    setCurrentPage,
    fetchNotifies,
    selectedEventId,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("All Tiers");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Action Modals State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"upgrade" | "cancel" | "resend" | "refund" | null>(null);
  const [targetOrder, setTargetOrder] = useState<any>(null);

  // Determine if using live API participants or mock orders fallback
  const hasLiveParticipants = participants && participants.length > 0;

  const ordersToDisplay = hasLiveParticipants
    ? participants.map((p: any, idx: number) => ({
      id: p.transaction_reference || p.id || `live-${idx}`,
      transactionId: p.transaction_reference || `TXN-${idx + 1000}`,
      attendeeName: p.customer_name || "Valued Customer",
      attendeeEmail: p.customer_email || "customer@oneticket.lk",
      tier: p.ticket_name || "General",
      quantity: p.quantity || 1,
      gateway: p.gateway || "OnePay Direct",
      gatewayType: "OnePay",
      amount: Number(p.total_amount || 0),
      timestamp: p.datetime ? new Date(p.datetime).toLocaleString() : "Recently",
      status: p.is_refund ? "Refunded" : "Completed",
    }))
    : [];

  // Filter orders
  const filteredOrders = ordersToDisplay.filter((order) => {
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

  // Filter notifies
  const filteredNotifies = notifies.filter((n: any) => {
    const query = searchTerm.toLowerCase();
    const name = `${n.first_name || ""} ${n.last_name || ""}`.toLowerCase();
    const email = (n.email || "").toLowerCase();
    const phone = (n.phone_number || n.contact_number || "").toLowerCase();
    return name.includes(query) || email.includes(query) || phone.includes(query);
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

  const handleOpenAction = (order: any, action: "upgrade" | "cancel" | "resend" | "refund") => {
    setTargetOrder(order);
    setActiveModal(action);
    setActiveMenuId(null);
  };

  const totalCount = Number(dataCount || (dataType === "participants" ? participants.length : notifies.length) || 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / 10));
  const startItem = totalCount > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endItem = Math.min(currentPage * 10, totalCount);

  const pageNumbers: number[] = [];
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, Math.max(startPage + 2, Math.min(totalPages, 3)));
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.cardContainer}>
      {/* Top Tab Bar: Participants List vs Notify Me */}
      <div className="flex items-center gap-6 px-4 pt-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => {
            setDataType("participants");
            setCurrentPage(1);
          }}
          className={`font-extrabold text-sm pb-3 border-b-2 transition-all cursor-pointer ${dataType === "participants"
              ? "border-[#00d07d] text-[#00d07d]"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
        >
          Participants List ({hasLiveParticipants ? participants.length : MOCK_ORDERS.length})
        </button>
        <button
          onClick={() => {
            setDataType("notifies");
            setCurrentPage(1);
            fetchNotifies(selectedEventId, 1);
          }}
          className={`font-extrabold text-sm pb-3 border-b-2 transition-all cursor-pointer ${dataType === "notifies"
              ? "border-[#00d07d] text-[#00d07d]"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
        >
          Notify Me ({notifies.length})
        </button>
      </div>

      {/* Filter Header Bar */}
      <div className={styles.topFilterBar}>
        {/* Search Input */}
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder={
              dataType === "notifies"
                ? "Search name, email address or contact number..."
                : "Search order ID, attendee name or email..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filters (Participants only) */}
        {dataType === "participants" && (
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
        )}
      </div>

      {/* Table Container */}
      <div className={styles.tableWrapper}>
        {dataType === "participants" ? (
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
                    <td style={{ textAlign: "right", position: "relative" }}>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)}
                          className={styles.actionBtn}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {activeMenuId === order.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10 cursor-default"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-20 py-1 flex flex-col text-xs">
                              <button
                                onClick={() => handleOpenAction(order, "upgrade")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-emerald-400 hover:bg-zinc-800 text-left transition-colors"
                              >
                                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                <span>Upgrade Ticket</span>
                              </button>
                              <button
                                onClick={() => handleOpenAction(order, "cancel")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-red-400 hover:bg-zinc-800 text-left transition-colors"
                              >
                                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                                <span>Cancel Ticket</span>
                              </button>
                              <button
                                onClick={() => handleOpenAction(order, "resend")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-blue-400 hover:bg-zinc-800 text-left transition-colors"
                              >
                                <Send className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                <span>Resend Email/SMS</span>
                              </button>
                              <button
                                onClick={() => handleOpenAction(order, "refund")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-800 text-left transition-colors"
                              >
                                <RotateCcw className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                <span>Full Refund Request</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
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
        ) : (
          /* Notify Me Table */
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SERIAL NUMBER</th>
                <th>FIRST NAME</th>
                <th>LAST NAME</th>
                <th>EMAIL ADDRESS</th>
                <th>CONTACT NUMBER</th>
                <th>DATE / TIME</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifies.length > 0 ? (
                filteredNotifies.map((n: any, idx: number) => (
                  <tr key={n.id || idx}>
                    <td className="font-mono text-xs text-zinc-400">
                      #{idx + 1 + (currentPage - 1) * 10}
                    </td>
                    <td className="font-bold text-zinc-900 dark:text-white">
                      {n.first_name || n.name || "N/A"}
                    </td>
                    <td className="font-bold text-zinc-900 dark:text-white">
                      {n.last_name || "-"}
                    </td>
                    <td className="text-zinc-600 dark:text-zinc-300">
                      {n.email || "N/A"}
                    </td>
                    <td className="font-mono text-zinc-600 dark:text-zinc-300">
                      {n.phone_number || n.contact_number || n.phone || "N/A"}
                    </td>
                    <td className="text-zinc-500 text-xs">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "2.5rem 0", textAlign: "center", color: "#a1a1aa" }}>
                    No "Notify Me" notification requests recorded for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Pagination */}
      <div className={styles.paginationFooter}>
        <span className={styles.showingText}>
          Showing <span className={styles.highlight}>{startItem}–{endItem}</span> of{" "}
          <span className={styles.highlight}>{totalCount}</span> {dataType === "notifies" ? "requests" : "participants"}
        </span>

        <div className={styles.btnGroup}>
          <button
            disabled={currentPage <= 1}
            onClick={() => {
              const newPage = Math.max(1, currentPage - 1);
              setCurrentPage(newPage);
              if (dataType === "notifies") fetchNotifies(selectedEventId, newPage);
            }}
            className={`${styles.pageNavBtn} ${currentPage <= 1 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => {
                setCurrentPage(num);
                if (dataType === "notifies") fetchNotifies(selectedEventId, num);
              }}
              className={`${styles.numBtn} ${currentPage === num ? styles.activePage : ""} cursor-pointer`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => {
              const newPage = Math.min(totalPages, currentPage + 1);
              setCurrentPage(newPage);
              if (dataType === "notifies") fetchNotifies(selectedEventId, newPage);
            }}
            className={`${styles.pageNavBtn} ${currentPage >= totalPages ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Action Modals */}
      <TicketUpgradeModal
        isOpen={activeModal === "upgrade"}
        onClose={() => setActiveModal(null)}
        order={targetOrder}
        defaultTransactionId={targetOrder?.transactionId || "R0VP1192CE2B5DCE8C15C"}
        defaultCustomerEmail={targetOrder?.attendeeEmail || "customer@example.com"}
      />

      <TicketCancellationModal
        isOpen={activeModal === "cancel"}
        onClose={() => setActiveModal(null)}
        order={targetOrder}
        defaultTransactionId={targetOrder?.transactionId || "R0VP1192CE2B5DCE8C15C"}
        defaultCustomerEmail={targetOrder?.attendeeEmail || "customer@example.com"}
      />

      <ResendConfirmationModal
        isOpen={activeModal === "resend"}
        onClose={() => setActiveModal(null)}
        defaultTransactionId={targetOrder?.transactionId || "R0VP1192CE2B5DCE8C15C"}
      />

      <RefundRequestModal
        isOpen={activeModal === "refund"}
        onClose={() => setActiveModal(null)}
        defaultTransactionId={targetOrder?.transactionId || "12345"}
      />
    </div>
  );
}

