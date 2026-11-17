"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function QrEnableSwitch({
  enabled,
  busy,
  label,
  onChange,
}: {
  enabled: boolean;
  busy?: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={busy}
        onClick={() => onChange(!enabled)}
        className={`inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors disabled:cursor-wait disabled:opacity-60 ${
          enabled ? "bg-[#00d07d]" : "bg-zinc-300 dark:bg-zinc-700"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function QrDisableControl({
  enabled,
  reason,
  busy,
  enabledLabel,
  disabledLabel,
  onSave,
}: {
  enabled: boolean;
  reason?: string | null;
  busy?: boolean;
  enabledLabel: string;
  disabledLabel: string;
  onSave: (enabled: boolean, reason?: string) => void;
}) {
  const [asking, setAsking] = useState(false);
  const [draft, setDraft] = useState("");
  const showingDisabled = !enabled || asking;

  useEffect(() => {
    if (!enabled) setAsking(false);
  }, [enabled]);

  return (
    <div className="flex flex-col gap-2">
      <QrEnableSwitch
        enabled={!showingDisabled}
        busy={busy}
        label={showingDisabled ? disabledLabel : enabledLabel}
        onChange={(next) => {
          if (next) {
            setAsking(false);
            setDraft("");
            onSave(true);
            return;
          }
          setDraft(reason || "");
          setAsking(true);
        }}
      />
      {asking
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => {
                if (busy) return;
                setAsking(false);
                setDraft("");
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="qr-disable-title"
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 id="qr-disable-title" className="text-sm font-bold text-zinc-900 dark:text-white">
                      Disable QR
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Add a comment for why this QR is being disabled.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAsking(false);
                      setDraft("");
                    }}
                    className="cursor-pointer rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={255}
                  rows={4}
                  autoFocus
                  placeholder="Write a comment"
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#00d07d] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setAsking(false);
                      setDraft("");
                    }}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={busy || !draft.trim()}
                    onClick={() => onSave(false, draft.trim())}
                    className="cursor-pointer rounded-lg bg-[#043825] px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
      {!asking && !enabled && reason ? (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-400">Comment </span>
          {reason}
        </p>
      ) : null}
    </div>
  );
}
