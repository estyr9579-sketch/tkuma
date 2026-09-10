"use client";

import { useActionState } from "react";
import { submitLead } from "@/actions/leads";
import { LeadForm } from "@/components/forms/LeadForm";

export function ContactForm({ submitLabel, consentText, successTitle, successText }: { submitLabel: string; consentText: string; successTitle: string; successText: string }) {
  const [state, action, pending] = useActionState(submitLead, null);
  if (state?.ok) {
    return (
      <div role="status" className="border border-stone bg-mist p-8">
        <h2 className="text-2xl text-navy">{successTitle}</h2>
        <p className="mt-3 text-ink/85">{successText}</p>
      </div>
    );
  }
  return <LeadForm action={action} state={state} pending={pending} submitLabel={submitLabel} consentText={consentText} />;
}
