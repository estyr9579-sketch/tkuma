"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { adminDeleteArticle, adminSetArticleStatus } from "@/actions/articles";
import type { ArticleStatus } from "@/lib/types";

export function ArticleQuickActions({ id, status, slug }: { id: string; status: ArticleStatus; slug: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const set = (s: ArticleStatus, note?: string) => start(async () => { await adminSetArticleStatus(id, s, note); router.refresh(); });
  const cls = "underline underline-offset-4 disabled:opacity-50";

  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {status === "pending" && <>
        <button type="button" disabled={pending} className={`${cls} text-green-800`} onClick={() => set("published")}>אישור ופרסום</button>
        <button type="button" disabled={pending} className={`${cls} text-sky-800`} onClick={() => set("approved")}>אישור בלבד</button>
        <button type="button" disabled={pending} className={`${cls} text-orange-800`} onClick={() => { const n = prompt("מה צריך לתקן? (ההערה תוצג לכותב)"); if (n !== null) set("needs_changes", n); }}>החזרה לעריכה</button>
        <button type="button" disabled={pending} className={`${cls} text-red-700`} onClick={() => { const n = prompt("סיבת הדחייה (תוצג לכותב)"); if (n !== null) set("rejected", n); }}>דחייה</button>
      </>}
      {status === "approved" && <button type="button" disabled={pending} className={`${cls} text-green-800`} onClick={() => set("published")}>פרסום</button>}
      {status === "published" && <>
        <Link href={`/articles/${slug}`} target="_blank" className={cls}>צפייה</Link>
        <button type="button" disabled={pending} className={`${cls} text-orange-800`} onClick={() => set("approved")}>ביטול פרסום</button>
      </>}
      {(status === "draft" || status === "needs_changes" || status === "rejected") && <button type="button" disabled={pending} className={`${cls} text-green-800`} onClick={() => set("published")}>פרסום</button>}
      <button type="button" disabled={pending} className={`${cls} text-red-700`} onClick={() => { if (confirm("למחוק את המאמר לצמיתות?")) start(async () => { await adminDeleteArticle(id); router.refresh(); }); }}>מחיקה</button>
    </div>
  );
}
