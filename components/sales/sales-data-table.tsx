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
import { ViewParticipantModal } from "./view-participant-modal";

const TABLE_CLASSNAME =
  "w-full min-w-[900px] border-collapse text-left [&_td]:px-4 [&_td]:py-3.5 [&_th]:px-4 [&_th]:py-3 [&_thead_tr]:border-b [&_thead_tr]:border-zinc-100 [&_thead_tr]:text-[11px] [&_thead_tr]:font-bold [&_thead_tr]:tracking-wider [&_thead_tr]:text-zinc-400 [&_thead_tr]:uppercase dark:[&_thead_tr]:border-zinc-800 [&_tbody]:text-xs [&_tbody_tr]:border-b [&_tbody_tr]:border-zinc-100 [&_tbody_tr]:transition-colors [&_tbody_tr]:hover:bg-zinc-50/80 dark:[&_tbody_tr]:border-zinc-800 dark:[&_tbody_tr]:hover:bg-zinc-800/40";

const PAGE_NAV_BTN_CLASS =
  "flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800";

interface ParticipantListRow {
  id?: number | string;
  transaction_reference?: string;
  datetime?: string;
  customer_name?: string;
  customer_email?: string;
  qr_code?: string;
  is_refund?: boolean;
  is_refund_init?: boolean;
  is_refund_rejected?: boolean;
  is_refund_request_approved?: boolean;
  refund_request_status?: string;
  total_amount?: number | string;
  is_checked_in?: boolean;
}

interface NotifyListRow {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  contact_number?: string;
  phone?: string;
  created_at?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }
  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

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
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={
              dataType === "notifies"
                ? "Search notify me by name or email..."
                : "Search ticket ref, participant name or email..."
            }
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pr-4 pl-10 text-xs text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-[#00d07d]/30 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
          />
        </div>

        {/* Filters (Participants only) */}
        {dataType === "participants" && (
          <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
            <div className="flex items-center rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
              {[
                { label: "All Check-in", value: "" },
                { label: "Checked In", value: "true" },
                { label: "Pending", value: "false" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleCheckInFilterChange(opt.value)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${checkInFilter === opt.value
                      ? "bg-[#043825] text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={transactionStatusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="h-10 cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white pr-8 pl-3 text-xs font-semibold text-zinc-800 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
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
          <table className={TABLE_CLASSNAME}>
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
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className={participantsLoading ? "opacity-60 transition-opacity" : ""}>
              {participantRows.length > 0 ? (
                participantRows.map((p, idx) => {
                  const rowKey = p.transaction_reference || String(p.id || idx);
                  const qrCode = String(p.qr_code || "").trim();
                  const isUrl = qrCode.startsWith("http://") || qrCode.startsWith("https://");
                  const isCopied = copiedRef === rowKey;
                  const refundMeta = getRefundStatusMeta(p);
                  const formattedDate = p.datetime
                    ? new Date(p.datetime).toLocaleString()
                    : "N/A";

                  return (
                    <tr key={rowKey}>
                      <td className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        <button
                          type="button"
                          onClick={() => handleOpenAction(p, "view")}
                          className="hover:text-[#00d07d] transition-colors text-left cursor-pointer"
                          title="View participant details"
                        >
                          {p.transaction_reference || "N/A"}
                        </button>
                      </td>
                      <td className="text-zinc-500">{formattedDate}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {p.customer_name || "N/A"}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {p.customer_email || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td>
                        {qrCode ? (
                          <div className="inline-flex items-center gap-1.5">
                            {isUrl ? (
                              <a
                                href={qrCode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                                title={qrCode}
                              >
                                {qrCode.length > 18 ? `${qrCode.slice(0, 18)}...` : qrCode}
                              </a>
                            ) : (
                              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300" title={qrCode}>
                                {qrCode.length > 18 ? `${qrCode.slice(0, 18)}...` : qrCode}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleCopyQr(qrCode, rowKey, e)}
                              title={isCopied ? "Copied!" : "Copy QR link"}
                              aria-label={isCopied ? "Copied" : "Copy QR link"}
                              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                              {isCopied ? (
                                <Check className="h-3.5 w-3.5 text-[#00d07d]" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                      <td>
                        <Badge variant={p.is_refund ? "red" : "emerald"}>
                          {p.is_refund ? "Refund" : "Paid"}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant={refundMeta.variant}>{refundMeta.label}</Badge>
                      </td>
                      <td className="font-mono font-extrabold text-zinc-900 dark:text-zinc-100">
                        {formatAmount(Number(p.total_amount || 0))} {currency}
                      </td>
                      <td>
                        <Badge
                          variant={p.is_checked_in ? "emerald" : "gold"}
                          className="whitespace-nowrap text-[8px]"
                        >
                          {p.is_checked_in ? "Checked in" : "Check in pending"}
                        </Badge>
                      </td>
                      <td className="relative text-right">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === rowKey ? null : rowKey)
                            }
                            className="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-all hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                            aria-label="More participant actions"
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
                  <td colSpan={9} className="py-8 text-center text-zinc-400">
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
          <table className={TABLE_CLASSNAME}>
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
                    <td className="text-zinc-600 dark:text-zinc-300c">
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
                  <td colSpan={6} className="py-10 text-center text-zinc-400">
                    No &quot;Notify Me&quot; notification requests recorded for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-3 text-xs sm:flex-row dark:border-zinc-800">
        <span className="font-medium text-zinc-500">
          Showing <span className="font-bold text-zinc-900 dark:text-zinc-100">{startItem}–{endItem}</span> of{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{totalCount}</span>{" "}
          {dataType === "notifies" ? "requests" : "participants"}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className={`${PAGE_NAV_BTN_CLASS} ${currentPage <= 1 ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          {pageNumbers.map((num, idx) =>
            typeof num === "number" ? (
              <button
                key={num}
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg font-semibold ${currentPage === num
                    ? "bg-[#043825] font-bold text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
              >
                {num}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-1.5 text-zinc-400">
                ...
              </span>
            )
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className={`${PAGE_NAV_BTN_CLASS} ${currentPage >= totalPages ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
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