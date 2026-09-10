"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { LeadDialog } from "@/components/site/LeadDialog";
import { buttonClass } from "@/components/ui/Button";

export function MobileNav({ links, accountHref, accountLabel, ctaLabel }: { links: { href: string; label: string }[]; accountHref: string; accountLabel: string; ctaLabel: string }) {
  const [open, setOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="rounded-sm p-2 text-navy"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div id={id} className="fixed inset-x-0 top-20 bottom-0 z-50 overflow-y-auto border-t border-stone bg-white">
          <nav aria-label="ניווט ראשי (מובייל)" className="px-6 py-6">
            <ul className="divide-y divide-stone">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-4 text-lg text-ink" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={accountHref} className="block py-4 text-lg text-slate" onClick={() => setOpen(false)}>
                  {accountLabel}
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <button type="button" className={buttonClass("gold", "w-full")} onClick={() => { setOpen(false); setLeadOpen(true); }}>
                {ctaLabel}
              </button>
            </div>
          </nav>
        </div>
      )}
      {/* Rendered outside the panel so it survives the menu closing */}
      {leadOpen && <LeadDialog onClose={() => setLeadOpen(false)} />}
    </div>
  );
}
