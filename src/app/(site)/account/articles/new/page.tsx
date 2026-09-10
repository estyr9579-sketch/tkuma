import { requireUser } from "@/lib/auth";
import { getCategories } from "@/lib/data";
import { ArticleForm } from "@/components/forms/ArticleForm";
import { redirect } from "next/navigation";

export default async function NewArticlePage() {
  const profile = await requireUser();
  if (profile.role === "user") redirect("/account");
  const categories = await getCategories();
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl text-navy">מאמר חדש</h2>
      <p className="mt-2 mb-8 text-slate">אפשר לשמור כטיוטה ולחזור מאוחר יותר. לאחר שליחה לאישור המאמר ייבדק על ידי מנהל האתר.</p>
      <ArticleForm mode="writer" categories={categories} defaultAuthorName={profile.full_name} />
    </div>
  );
}
