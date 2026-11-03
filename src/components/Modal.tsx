"use client";

import { ReactNode, useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-box max-h-[90vh]">
        <h3 className="mb-4 text-xl font-bold">{title}</h3>
        {children}
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </div>
  );
}
