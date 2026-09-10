"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead } from "@/actions/leads";
import { Button, buttonClass } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";

/** Button that opens the "leave details" dialog. Used in the header, hero and CTA bands. */
export function LeadDialogButton({ label, size = "md", full = false, onOpen, variant = "gold" }: { label: string; size?: "sm" | "md" | "lg"; full?: boolean; onOpen?: () => void; variant?: "gold" | "primary" | "secondary" }) {
  const [open, setOpen] = useState(false);
  const sizeCls = size === "sm" ? "px-4 py-2 text-sm" : size === "lg" ? "px-8 py-4 text-lg" : "";
  return (
    <>
      <button
        type="button"
        className={buttonClass(variant, `${sizeCls} ${full ? "w-full" : ""}`)}
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
      >
        {label}
      </button>
      {open && <LeadDialog onClose={() => setOpen(false)} />}
    </>
  );
}

export function LeadDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(submitLead, null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    d.addEventListener("cancel", onCancel); // Escape key
    return () => d.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="lead-dialog-title"
      className="m-auto w-[min(92vw,34rem)] rounded-sm bg-white p-0 text-ink shadow-soft backdrop:bg-navy-deep/70"
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="p-7 sm:p-9">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id="lead-dialog-title" className="text-2xl text-navy">השארת פרטים</h2>
          <button type="button" onClick={onClose} aria-label="סגירה" className="rounded-sm p-1 text-slate hover:text-navy">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {state?.ok ? (
          <div role="status" className="space-y-4">
            <p className="text-lg text-navy">הפרטים התקבלו. תודה.</p>
            <p className="text-slate">נחזור אליכם בהקדם. אם מדובר במצב חירום, אנא פנו מיד לגורמי החירום המתאימים.</p>
            <Button type="button" variant="secondary" onClick={onClose}>סגירה</Button>
          </div>
        ) : (
          <LeadForm action={action} state={state} pending={pending} />
        )}
      </div>
    </dialog>
  );
}
