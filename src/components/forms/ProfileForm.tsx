"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input } from "@/components/ui/Field";

export function ProfileForm({ fullName, phone }: { fullName: string; phone: string }) {
  const [state, action, pending] = useActionState(updateProfile, null);
  return (
    <form action={action} className="space-y-5" noValidate>
      <Field id="full_name" label="שם מלא" required>
        <Input id="full_name" name="full_name" required defaultValue={fullName} maxLength={80} />
      </Field>
      <Field id="phone" label="טלפון" required>
        <Input id="phone" name="phone" type="tel" required defaultValue={phone} dir="ltr" className="text-right" />
      </Field>
      <FormMessage result={state} />
      <Button type="submit" disabled={pending}>{pending ? "שומר…" : "שמירת שינויים"}</Button>
    </form>
  );
}
