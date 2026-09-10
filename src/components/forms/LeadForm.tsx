"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input, Textarea } from "@/components/ui/Field";
import type { ActionResult } from "@/lib/types";

export function LeadForm({ action, state, pending, submitLabel = "אשמח שיחזרו אליי", consentText }: { action: (fd: FormData) => void; state: ActionResult | null; pending: boolean; submitLabel?: string; consentText?: string }) {
  return (
    <form action={action} className="space-y-5" noValidate>
      <Field id="lead-name" label="שם מלא" required>
        <Input id="lead-name" name="full_name" autoComplete="name" required maxLength={80} />
      </Field>
      <Field id="lead-phone" label="מספר טלפון" required>
        <Input id="lead-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required dir="ltr" className="text-right" />
      </Field>
      <Field id="lead-message" label="הודעה קצרה (לא חובה)" hint="אין צורך לפרט מידע רגיש – רק מה שנוח לכם לשתף.">
        <Textarea id="lead-message" name="message" maxLength={1000} aria-describedby="lead-message-hint" />
      </Field>
      {/* Honeypot – hidden from people, filled by bots */}
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="lead-website">אתר</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex items-start gap-3">
        <input id="lead-consent" name="consent" type="checkbox" required className="mt-1.5 h-4 w-4 accent-navy" />
        <label htmlFor="lead-consent" className="text-sm leading-6 text-slate">
          {consentText ?? "השארת פרטים אינה מהווה התחלת טיפול ואינה מבטיחה קבלת שירות. קראתי ואני מאשר/ת את"}{" "}
          <Link href="/privacy" className="underline underline-offset-2 text-navy">מדיניות הפרטיות</Link>
          {" ו"}
          <Link href="/terms" className="underline underline-offset-2 text-navy">תנאי השימוש</Link>.
        </label>
      </div>
      <FormMessage result={state} />
      <Button type="submit" variant="gold" className="w-full" disabled={pending}>
        {pending ? "שולח…" : submitLabel}
      </Button>
      <p className="text-xs text-slate">במצבי חירום או סכנה מיידית אין להמתין לחזרה מטעם האתר – יש לפנות לגורמי החירום המתאימים.</p>
    </form>
  );
}
