import Link from "next/link";
import { adminGetArticles } from "@/lib/data";
import { ARTICLE_STATUS_LABELS, type ArticleStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ArticleStatusBadge } from "@/components/ui/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleQuickActions } from "@/components/admin/ArticleQuickActions";

const STATUSES = Object.keys(ARTICLE_STATUS_LABELS) as ArticleStatus[];

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const valid = STATUSES.includes(status as ArticleStatus) ? status : undefined;
  const articles = await adminGetArticles(valid);
  const tab = (active: boolean) => `rounded-sm border px-3 py-1.5 text-sm ${active ? "border-navy bg-navy text-white" : "border-stone bg-white hover:border-navy"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-navy">מאמרים</h1>
        <ButtonLink href="/admin/articles/new" className="px-4 py-2 text-sm">מאמר חדש</ButtonLink>
      </div>
      <nav aria-label="סינון לפי סטטוס" className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/articles" className={tab(!valid)}>הכל</Link>
        {STATUSES.map((s) => <Link key={s} href={`/admin/articles?status=${s}`} className={tab(valid === s)}>{ARTICLE_STATUS_LABELS[s]}</Link>)}
      </nav>
      {articles.length === 0 ? <p className="mt-10 text-slate">אין מאמרים להצגה.</p> : (
        <div className="mt-8 overflow-x-auto border border-stone bg-white">
          <table className="w-full text-sm">
            <thead className="bg-mist text-right text-xs text-slate">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">כותרת</th>
                <th scope="col" className="px-4 py-3 font-medium">סוג</th>
                <th scope="col" className="px-4 py-3 font-medium">מחבר מוצג</th>
                <th scope="col" className="px-4 py-3 font-medium">סטטוס</th>
                <th scope="col" className="px-4 py-3 font-medium">עודכן</th>
                <th scope="col" className="px-4 py-3 font-medium">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone">
              {articles.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3"><Link href={`/admin/articles/${a.id}`} className="text-navy underline-offset-4 hover:underline">{a.title}</Link></td>
                  <td className="px-4 py-3 text-slate">{a.kind === "expert" ? "מומחה" : "אתר"}</td>
                  <td className="px-4 py-3">{a.display_author_name || "—"}</td>
                  <td className="px-4 py-3"><ArticleStatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-slate">{formatDate(a.updated_at)}</td>
                  <td className="px-4 py-3"><ArticleQuickActions id={a.id} status={a.status} slug={a.slug} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
