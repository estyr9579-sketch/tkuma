"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteLead, updateLead } from "@/actions/leads";
import { LEAD_STATUS_LABELS, type Lead, type LeadStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { LeadStatusBadge } from "@/components/ui/StatusBadge";
import { Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function LeadRow({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [note, setNote] = useState(lead.admin_note);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <li className="border border-stone bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg text-navy">{lead.full_name}</span>
            <a href={`tel:${lead.phone}`} className="text-navy underline underline-offset-4" dir="ltr">{lead.phone}</a>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-1 text-xs text-slate">התקבל {formatDate(lead.created_at)}</p>
          {lead.message && <p className="mt-3 whitespace-pre-line text-sm text-ink/85">{lead.message}</p>}
        </div>
        <div className="w-full sm:w-72 space-y-2">
          <label htmlFor={`status-${lead.id}`} className="sr-only">סטטוס</label>
          <Select id={`status-${lead.id}`} value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className="py-2 text-sm">
            {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
          </Select>
          <label htmlFor={`note-${lead.id}`} className="sr-only">הערה פנימית</label>
          <Textarea id={`note-${lead.id}`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="הערה פנימית" className="min-h-16 py-2 text-sm" />
          <div className="flex items-center gap-3">
            <Button type="button" className="px-4 py-2 text-sm" disabled={pending} onClick={() => start(async () => { const r = await updateLead(lead.id, status, note); setMsg(r.ok ? "נשמר" : r.error); router.refresh(); })}>שמירה</Button>
            <button type="button" className="text-sm text-red-700 underline underline-offset-4" disabled={pending} onClick={() => { if (confirm("למחוק את הפנייה?")) start(async () => { await deleteLead(lead.id); router.refresh(); }); }}>מחיקה</button>
            {msg && <span role="status" className="text-xs text-slate">{msg}</span>}
          </div>
        </div>
      </div>
    </li>
  );
}
