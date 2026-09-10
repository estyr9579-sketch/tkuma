import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { getPublishedArticles } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArticleGrid } from "@/components/site/ArticleCard";

export const metadata: Metadata = { title: "מאמרים מאנשי מקצוע", description: "מאמרים שנכתבו על ידי אנשי מקצוע מתחומי הטיפול השונים." };

export default async function ExpertsPage() {
  const [c, articles] = await Promise.all([getContent(), getPublishedArticles("expert")]);
  return (
    <>
      <PageHeader title={c["experts.title"]} intro={c["experts.intro"]} />
      <Container className="py-10 sm:py-16">
        <ArticleGrid articles={articles} showAuthor emptyText="עדיין לא פורסמו מאמרים של אנשי מקצוע." />
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-stone pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg text-navy">{c["experts.cta"]}</p>
          <div className="flex gap-4 text-sm">
            <Link href="/register" className="underline underline-offset-4">הרשמה</Link>
            <Link href="/login" className="underline underline-offset-4">התחברות</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
