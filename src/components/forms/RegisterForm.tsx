"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input } from "@/components/ui/Field";

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, null);
  if (state?.ok) {
    return <p role="status" className="rounded-sm border border-green-300 bg-green-50 px-4 py-4 text-green-900">{state.message}</p>;
  }
  return (
    <form action={action} className="space-y-5" noValidate>
      <Field id="full_name" label="שם מלא" required>
        <Input id="full_name" name="full_name" autoComplete="name" required maxLength={80} />
      </Field>
      <Field id="email" label="אימייל" required>
        <Input id="email" name="email" type="email" autoComplete="email" required dir="ltr" className="text-right" />
      </Field>
      <Field id="phone" label="טלפון" required>
        <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required dir="ltr" className="text-right" />
      </Field>
      <Field id="password" label="סיסמה" required hint="לפחות 8 תווים">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} dir="ltr" className="text-right" aria-describedby="password-hint" />
      </Field>
      <div className="space-y-3 text-sm text-slate">
        <div className="flex items-start gap-3">
          <input id="terms" name="terms" type="checkbox" required className="mt-1 h-4 w-4 accent-navy" />
          <label htmlFor="terms">קראתי ואני מאשר/ת את <Link href="/terms" className="text-navy underline underline-offset-2">תנאי השימוש</Link></label>
        </div>
        <div className="flex items-start gap-3">
          <input id="privacy" name="privacy" type="checkbox" required className="mt-1 h-4 w-4 accent-navy" />
          <label htmlFor="privacy">קראתי ואני מאשר/ת את <Link href="/privacy" className="text-navy underline underline-offset-2">מדיניות הפרטיות</Link></label>
        </div>
      </div>
      <FormMessage result={state} />
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "נרשם…" : "יצירת חשבון"}</Button>
    </form>
  );
}
