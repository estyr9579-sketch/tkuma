import Link from "next/link";
import { adminGetCounts, adminGetLeads, adminGetArticles } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { ArticleStatusBadge, LeadStatusBadge } from "@/components/ui/StatusBadge";

export default async function AdminHome() {
  const [counts, leads, pending] = await Promise.all([adminGetCounts(), adminGetLeads("new"), adminGetArticles("pending")]);
  const cards = [
    { label: "פניות חדשות", value: counts.newLeads, href: "/admin/leads?status=new" },
    { label: "מאמרים ממתינים לאישור", value: counts.pending, href: "/admin/articles?status=pending" },
    { label: "מאמרים מפורסמים", value: counts.published, href: "/admin/articles?status=published" },
    { label: "משתמשים רשומים", value: counts.users, href: "/admin/users" },
  ];
  return (
    <div>
      <h1 className="text-3xl text-navy">סקירה</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="border border-stone bg-white p-6 hover:border-navy">
            <p className="font-heading text-4xl text-navy">{c.value}</p>
            <p className="mt-1 text-sm text-slate">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-8 xl:grid-cols-2">
        <section className="border border-stone bg-white">
          <div className="flex items-center justify-between border-b border-stone px-6 py-4">
            <h2 className="text-lg text-navy">פניות אחרונות</h2>
            <Link href="/admin/leads" className="text-sm underline underline-offset-4">לכל הפניות</Link>
          </div>
          {leads.length === 0 ? <p className="p-6 text-sm text-slate">אין פניות חדשות.</p> : (
            <ul className="divide-y divide-stone">
              {leads.slice(0, 6).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                  <div><span className="font-medium">{l.full_name}</span> <span className="text-slate" dir="ltr">{l.phone}</span></div>
                  <div className="flex items-center gap-3"><span className="text-slate">{formatDate(l.created_at)}</span><LeadStatusBadge status={l.status} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="border border-stone bg-white">
          <div className="flex items-center justify-between border-b border-stone px-6 py-4">
            <h2 className="text-lg text-navy">ממתינים לאישור</h2>
            <Link href="/admin/articles" className="text-sm underline underline-offset-4">לכל המאמרים</Link>
          </div>
          {pending.length === 0 ? <p className="p-6 text-sm text-slate">אין מאמרים שממתינים לאישור.</p> : (
            <ul className="divide-y divide-stone">
              {pending.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                  <Link href={`/admin/articles/${a.id}`} className="underline-offset-4 hover:underline">{a.title}</Link>
                  <div className="flex items-center gap-3"><span className="text-slate">{a.display_author_name}</span><ArticleStatusBadge status={a.status} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
