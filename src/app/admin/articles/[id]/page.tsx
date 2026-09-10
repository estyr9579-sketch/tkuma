import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetArticle, getCategories } from "@/lib/data";
import { ArticleForm } from "@/components/forms/ArticleForm";
import { ArticleStatusBadge } from "@/components/ui/StatusBadge";
import { ArticleQuickActions } from "@/components/admin/ArticleQuickActions";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminEditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([adminGetArticle(id), getCategories()]);
  if (!article) notFound();

  let creator: { full_name: string; email: string } | null = null;
  if (article.created_by) {
    const { data } = await createAdminClient().from("profiles").select("full_name,email").eq("id", article.created_by).maybeSingle();
    creator = data;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-3xl text-navy">עריכת מאמר</h1>
        <ArticleStatusBadge status={article.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate">
        {creator && <span>נוצר במערכת על ידי: {creator.full_name} (<span dir="ltr">{creator.email}</span>)</span>}
        {article.status === "published" && <Link href={`/articles/${article.slug}`} target="_blank" className="underline underline-offset-4">צפייה באתר</Link>}
      </div>
      <div className="mt-4 border border-stone bg-white px-4 py-3">
        <ArticleQuickActions id={article.id} status={article.status} slug={article.slug} />
      </div>
      <div className="mt-6 border border-stone bg-white p-6 sm:p-8">
        <ArticleForm mode="admin" article={article} categories={categories} />
      </div>
    </div>
  );
}
