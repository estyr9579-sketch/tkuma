"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input } from "@/components/ui/Field";

export function LoginForm({ next, linkError }: { next?: string; linkError?: boolean }) {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {linkError && <p role="alert" className="rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">הקישור אינו תקף או שפג תוקפו. נסו להתחבר או לבקש קישור חדש.</p>}
      <Field id="email" label="אימייל" required>
        <Input id="email" name="email" type="email" autoComplete="email" required dir="ltr" className="text-right" />
      </Field>
      <Field id="password" label="סיסמה" required>
        <Input id="password" name="password" type="password" autoComplete="current-password" required dir="ltr" className="text-right" />
      </Field>
      <FormMessage result={state} />
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "מתחבר…" : "התחברות"}</Button>
    </form>
  );
}
