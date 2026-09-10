"use client";

import { useActionState } from "react";
import { requestPasswordReset, setNewPassword } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input } from "@/components/ui/Field";

export function RequestResetForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  return (
    <form action={action} className="space-y-5" noValidate>
      <Field id="email" label="אימייל" required>
        <Input id="email" name="email" type="email" autoComplete="email" required dir="ltr" className="text-right" />
      </Field>
      <FormMessage result={state} />
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "שולח…" : "שליחת קישור לאיפוס"}</Button>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(setNewPassword, null);
  return (
    <form action={action} className="space-y-5" noValidate>
      <Field id="password" label="סיסמה חדשה" required hint="לפחות 8 תווים">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} dir="ltr" className="text-right" />
      </Field>
      <FormMessage result={state} />
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "מעדכן…" : "עדכון סיסמה"}</Button>
    </form>
  );
}
