import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCategories, getMyArticle } from "@/lib/data";
import { ArticleForm } from "@/components/forms/ArticleForm";
import { ArticleStatusBadge } from "@/components/ui/StatusBadge";

export default async function EditMyArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireUser();
  const [article, categories] = await Promise.all([getMyArticle(profile.id, id), getCategories()]);
  if (!article) notFound();
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl text-navy">עריכת מאמר</h2>
        <ArticleStatusBadge status={article.status} />
      </div>
      <div className="mt-8">
        <ArticleForm mode="writer" article={article} categories={categories} defaultAuthorName={profile.full_name} />
      </div>
    </div>
  );
}
