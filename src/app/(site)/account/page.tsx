import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getMyArticles } from "@/lib/data";
import { ArticleStatusBadge } from "@/components/ui/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { DeleteMyArticleButton } from "@/components/forms/DeleteMyArticleButton";

export default async function AccountPage() {
  const profile = await requireUser();
  const articles = await getMyArticles(profile.id);

  if (profile.role === "user") {
    return <p className="text-slate">החשבון שלך פעיל, אך אינו מורשה לשלוח מאמרים. לבירור ניתן לפנות למנהל האתר.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-navy">המאמרים שלי</h2>
        <ButtonLink href="/account/articles/new" variant="primary" className="px-4 py-2 text-sm">מאמר חדש</ButtonLink>
      </div>
      {articles.length === 0 ? (
        <div className="mt-8 border border-dashed border-stone p-10 text-center">
          <p className="text-slate">עדיין אין מאמרים. כתבו מאמר ראשון – הוא יישלח לאישור לפני הפרסום.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-stone border-y border-stone">
          {articles.map((a) => (
            <li key={a.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/account/articles/${a.id}`} className="text-lg text-navy underline-offset-4 hover:underline">{a.title}</Link>
                <p className="mt-1 text-sm text-slate">עודכן {formatDate(a.updated_at)}</p>
                {a.admin_note && a.status !== "published" && <p className="mt-1 text-sm text-ink/80">הערת מנהל: {a.admin_note}</p>}
              </div>
              <div className="flex items-center gap-4">
                <ArticleStatusBadge status={a.status} />
                {a.status === "published" && <Link href={`/articles/${a.slug}`} className="text-sm text-navy underline underline-offset-4">צפייה באתר</Link>}
                {["draft", "needs_changes", "rejected"].includes(a.status) && <DeleteMyArticleButton id={a.id} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
