"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
  Send,
  RotateCcw,
  Eye,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { useDashboard } from "../../lib/context/dashboard-context";
import { formatAmount } from "../../lib/utils";
import { getRefundStatusMeta } from "../../lib/utils/participant-helpers";
import { Badge } from "../ui/badge";
import { TicketUpgradeModal } from "./ticket-upgrade-modal";
import { TicketCancellationModal } from "./ticket-cancellation-modal";
import { ResendConfirmationModal } from "./resend-confirmation-modal";
import { RefundRequestModal } from "./refund-request-modal";
import styles from "./sales-data-table.module.scss";

export function SalesDataTable() {
  const {
    participants,
    participantsCount,
    participantsLoading,
    notifies,
    notifiesCount,
    dataType,
    setDataType,
    currentPage,
    setCurrentPage,
    searchText,
    setSearchText,
    transactionStatusFilter,
    setTransactionStatusFilter,
    checkInFilter,
    setCheckInFilter,
    fetchParticipants,
    fetchNotifies,
    selectedEventId,
    selectedKey,
    eventData,
    analytics,
  } = useDashboard();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<
    "view" | "upgrade" | "cancel" | "resend" | "refund" | null
  >(null);
  const [targetRow, setTargetRow] = useState<ParticipantListRow | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const currency =
    analytics?.event?.currency ||
    eventData?.tickets_currency ||
    eventData?.currency ||
    "LKR";

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    searchTimerRef.current = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
      if (dataType === "participants") {
        fetchParticipants({ page: 1, searchText: value });
      } else {
        fetchNotifies(selectedEventId, 1, value);
      }
    }, 400);
  };

  const handleCheckInFilterChange = (value: string) => {
    setCheckInFilter(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    fetchParticipants({ page: 1, isCheckedIn: value });
  };

  const handleStatusFilterChange = (value: string) => {
    setTransactionStatusFilter(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    fetchParticipants({ page: 1, transactionStatus: value });
  };

  const handleManualRefresh = async () => {
    if (!selectedEventId) return;
    setIsRefreshing(true);
    try {
      if (dataType === "participants") {
        await fetchParticipants({ page: currentPage });
      } else {
        await fetchNotifies(selectedEventId, currentPage);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyQr = async (qrCode: string, rowKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!qrCode) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(qrCode);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = qrCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedRef(rowKey);
      setTimeout(() => {
        setCopiedRef((prev) => (prev === rowKey ? null : prev));
      }, 1500);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleOpenAction = (
    row: ParticipantListRow,
    action: "view" | "upgrade" | "cancel" | "resend" | "refund"
  ) => {
    setTargetRow(row);
    setActiveModal(action);
    setActiveMenuId(null);
  };

  const participantRows: ParticipantListRow[] = Array.isArray(participants)
    ? (participants as ParticipantListRow[])
    : [];
  const notifyRows: NotifyListRow[] = Array.isArray(notifies)
    ? (notifies as NotifyListRow[])
    : [];

  const totalCount =
    dataType === "participants"
      ? Number(participantsCount || participantRows.length || 0)
      : Number(notifiesCount || notifyRows.length || 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / 10));
  const activeItemsLength =
    dataType === "participants" ? participantRows.length : notifyRows.length;
  const startItem = activeItemsLength > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endItem = activeItemsLength > 0 ? Math.min(startItem + activeItemsLength - 1, totalCount) : 0;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const targetOrderContext = targetRow
    ? {
      id: targetRow.id ?? targetRow.transaction_reference,
      transactionId: targetRow.transaction_reference || String(targetRow.id || ""),
      transaction_reference: targetRow.transaction_reference || String(targetRow.id || ""),
      attendeeName: targetRow.customer_name || "",
      attendeeEmail: targetRow.customer_email || "",
      customer_email: targetRow.customer_email || "",
    }
    : undefined;

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Top Tab Bar: Participants List vs Notify Me */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2 pt-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
              setDataType("participants");
              setCurrentPage(1);
            }}
            className={`font-extrabold text-sm pb-3 border-b-2 transition-all cursor-pointer ${dataType === "participants"
              ? "border-[#00d07d] text-[#00d07d]"
              : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
          >
            Participants List ({participantsCount || participantRows.length})
          </button>
          <button
            type="button"
            onClick={() => {
              if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
              setDataType("notifies");
              setCurrentPage(1);
            }}
            className={`font-extrabold text-sm pb-3 border-b-2 transition-all cursor-pointer ${dataType === "notifies"
              ? "border-[#00d07d] text-[#00d07d]"
              : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
          >
            Notify Me ({notifiesCount || notifyRows.length})
          </button>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={isRefreshing || !selectedEventId || (dataType === "participants" && !selectedKey)}
          className="mb-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/70 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#00d07d] transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing || participantsLoading ? "animate-spin text-[#00d07d]" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Filter Header Bar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={
              dataType === "notifies"
                ? "Search notify me by name or email..."
                : "Search ticket ref, participant name or email..."
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
                  {opt.label}
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
                <option value="">Status: All</option>
                <option value="completed">Status: Completed</option>
                <option value="refunded">Status: Refunded</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {dataType === "participants" ? (
          <table className="w-full min-w-[900px] border-collapse text-left [&_td]:px-4 [&_td]:py-3.5 [&_th]:px-4 [&_th]:py-3 [&_thead_tr]:border-b [&_thead_tr]:border-zinc-100 [&_thead_tr]:text-[11px] [&_thead_tr]:font-bold [&_thead_tr]:tracking-wider [&_thead_tr]:text-zinc-400 [&_thead_tr]:uppercase dark:[&_thead_tr]:border-zinc-800 [&_tbody]:text-xs [&_tbody_tr]:border-b [&_tbody_tr]:border-zinc-100 [&_tbody_tr]:transition-colors [&_tbody_tr]:hover:bg-zinc-50/80 dark:[&_tbody_tr]:border-zinc-800 dark:[&_tbody_tr]:hover:bg-zinc-800/40">
            <thead>
              <tr>
                <th>TICKET REFERENCE</th>
                <th>DATE / TIME</th>
                <th>PARTICIPANT</th>
                <th>QR LINK</th>
                <th>STATUS</th>
                <th>REFUND STATUS</th>
                <th>PAID AMOUNT</th>
                <th>CHECK-IN</th>
                <th >ACTIONS</th>
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

                        {activeMenuId === rowKey && (
                          <>
                            <div
                              className="fixed inset-0 z-10 cursor-default"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-20 py-1 flex flex-col text-xs">
                              <button
                                type="button"
                                onClick={() => handleOpenAction(p, "view")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-emerald-400 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                <span>View Participant</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAction(p, "upgrade")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-emerald-400 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                              >
                                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                <span>Upgrade Ticket</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAction(p, "cancel")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-red-400 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                              >
                                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                                <span>Cancel Ticket</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAction(p, "resend")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-blue-400 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                              >
                                <Send className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                <span>Resend Email/SMS</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAction(p, "refund")}
                                className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
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
                );
                })
              ) : (
              <tr>
                <td colSpan={9} style={{ padding: "2rem 0", textAlign: "center", color: "#a1a1aa" }}>
                  {!selectedKey
                    ? "No venue slot key selected. Select a venue/time slot to view participants."
                    : participantsLoading
                      ? "Loading participants..."
                      : "No participants found matching your criteria."}
                </td>
              </tr>
              )}
            </tbody>
          </table>
        ) : (
          /* Notify Me Table */
          <table className="w-full min-w-[900px] border-collapse text-left [&_td]:px-4 [&_td]:py-3.5 [&_th]:px-4 [&_th]:py-3 [&_thead_tr]:border-b [&_thead_tr]:border-zinc-100 [&_thead_tr]:text-[11px] [&_thead_tr]:font-bold [&_thead_tr]:tracking-wider [&_thead_tr]:text-zinc-400 [&_thead_tr]:uppercase dark:[&_thead_tr]:border-zinc-800 [&_tbody]:text-xs [&_tbody_tr]:border-b [&_tbody_tr]:border-zinc-100 [&_tbody_tr]:transition-colors [&_tbody_tr]:hover:bg-zinc-50/80 dark:[&_tbody_tr]:border-zinc-800 dark:[&_tbody_tr]:hover:bg-zinc-800/40">
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
              {notifyRows.length > 0 ? (
                notifyRows.map((n, idx) => (
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
                    No &quot;Notify Me&quot; notification requests recorded for this event.
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

        <div className="flex items-center gap-1.5">
          <button
            type="button"
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
            type="button"
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

      {/* View Participant Detail Drawer */}
      {activeModal === "view" && targetRow?.transaction_reference && (
        <ViewParticipantModal
          key={targetRow.transaction_reference}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          eventId={selectedEventId}
          transactionReference={targetRow.transaction_reference}
          rowData={targetRow}
          onActionSuccess={() => fetchParticipants({ page: currentPage })}
        />
      )}

      {/* Row Action Modals */}
      <TicketUpgradeModal
        isOpen={activeModal === "upgrade"}
        onClose={() => setActiveModal(null)}
        order={targetOrderContext}
        onSuccess={() => fetchParticipants({ page: currentPage })}
        defaultTransactionId={targetOrderContext?.transactionId || ""}
        defaultCustomerEmail={targetOrderContext?.attendeeEmail || ""}
      />

      <TicketCancellationModal
        isOpen={activeModal === "cancel"}
        onClose={() => setActiveModal(null)}
        order={targetOrderContext}
        onSuccess={() => fetchParticipants({ page: currentPage })}
        defaultTransactionId={targetOrderContext?.transactionId || ""}
        defaultCustomerEmail={targetOrderContext?.attendeeEmail || ""}
      />

      {activeModal === "resend" && (
        <ResendConfirmationModal
          key={`resend-${targetOrderContext?.transactionId || "none"}`}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          defaultTransactionId={targetOrderContext?.transactionId || ""}
        />
      )}

      {activeModal === "refund" && (
        <RefundRequestModal
          key={`refund-${targetOrderContext?.id || "none"}`}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          defaultTransactionId={String(targetOrderContext?.id || "")}
        />
      )}
    </div>
  );
}
