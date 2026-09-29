"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  /** A red confirm button for actions that stop work. */
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Asks before an action that changes something. A native modal <dialog>: the
 * page behind is inert, Esc closes it, and "Go back" comes first so it has focus.
 */
export function ConfirmDialog({ open, title, text, confirmLabel, danger = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="ak-dialog"
      aria-labelledby={titleId}
      onClose={(event) => {
        if (open && event.target === event.currentTarget) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      {open && (
        <div className="ak-dialog__body">
          <h2 id={titleId} className="ak-dialog__title">
            {title}
          </h2>
          <p className="ak-dialog__text">{text}</p>
          <div className="ak-dialog__actions">
            <Button variant="secondary" onClick={onCancel}>
              Go back
            </Button>
            <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
