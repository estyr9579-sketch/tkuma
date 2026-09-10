import Link from "next/link";
import { adminGetLeads } from "@/lib/data";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/types";
import { LeadRow } from "@/components/admin/LeadRow";

const STATUSES = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const valid = STATUSES.includes(status as LeadStatus) ? status : undefined;
  const leads = await adminGetLeads(valid);
  const tab = (active: boolean) => `rounded-sm border px-3 py-1.5 text-sm ${active ? "border-navy bg-navy text-white" : "border-stone bg-white hover:border-navy"}`;

  return (
    <div>
      <h1 className="text-3xl text-navy">פניות מהאתר</h1>
      <nav aria-label="סינון לפי סטטוס" className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/leads" className={tab(!valid)}>הכל</Link>
        {STATUSES.map((s) => <Link key={s} href={`/admin/leads?status=${s}`} className={tab(valid === s)}>{LEAD_STATUS_LABELS[s]}</Link>)}
      </nav>
      {leads.length === 0 ? <p className="mt-10 text-slate">אין פניות להצגה.</p> : (
        <ul className="mt-8 space-y-4">
          {leads.map((l) => <LeadRow key={l.id} lead={l} />)}
        </ul>
      )}
    </div>
  );
}
