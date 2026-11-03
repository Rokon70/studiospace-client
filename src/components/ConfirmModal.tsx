"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  danger = true,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-6 opacity-80">{message}</p>
      <div className="flex justify-end gap-3">
        <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Keep it</button>
        <button className={`btn ${danger ? "btn-error" : "btn-primary"}`} onClick={run} disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
