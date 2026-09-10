import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { getCategories, getPublishedArticles } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArticleGrid } from "@/components/site/ArticleCard";

export const metadata: Metadata = { title: "מאמרים ומידע", description: "מאמרים על עולם הטיפול הרגשי, סוגי טיפולים, בחירת מטפל, ויסות רגשי ועוד." };

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [c, cats, articles] = await Promise.all([getContent(), getCategories(), getPublishedArticles("site", category)]);

  return (
    <>
      <PageHeader title={c["articles.title"]} intro={c["articles.intro"]} />
      <Container className="py-14 sm:py-16">
        <nav aria-label="סינון לפי קטגוריה" className="mb-10 flex flex-wrap gap-2">
          <Link href="/articles" aria-current={!category ? "page" : undefined} className={`rounded-sm border px-4 py-1.5 text-sm ${!category ? "border-navy bg-navy text-white" : "border-stone text-ink hover:border-navy"}`}>הכל</Link>
          {cats.map((cat) => (
            <Link key={cat.id} href={`/articles?category=${cat.slug}`} aria-current={category === cat.slug ? "page" : undefined} className={`rounded-sm border px-4 py-1.5 text-sm ${category === cat.slug ? "border-navy bg-navy text-white" : "border-stone text-ink hover:border-navy"}`}>
              {cat.name}
            </Link>
          ))}
        </nav>
        <ArticleGrid articles={articles} emptyText="עדיין אין מאמרים כאן. בקרוב." />
      </Container>
    </>
  );
}
