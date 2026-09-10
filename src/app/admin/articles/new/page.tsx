import { getCategories } from "@/lib/data";
import { ArticleForm } from "@/components/forms/ArticleForm";

export default async function AdminNewArticlePage() {
  const categories = await getCategories();
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl text-navy">מאמר חדש</h1>
      <p className="mt-2 mb-8 text-slate">אפשר לפרסם בשם האתר או בשם איש מקצוע (גם ללא חשבון) – מלאו את פרטי "המחבר המוצג".</p>
      <div className="border border-stone bg-white p-6 sm:p-8">
        <ArticleForm mode="admin" categories={categories} />
      </div>
    </div>
  );
}
