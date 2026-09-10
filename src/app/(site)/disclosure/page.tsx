import type { Metadata } from "next";
import { getContent, paragraphs } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "גילוי נאות", description: "מה השירות כולל, מה הוא אינו כולל, ומתי יש לפנות לגורם מקצועי מוסמך." };

export default async function DisclosurePage() {
  const c = await getContent();
  return (
    <>
      <PageHeader title="גילוי נאות והבהרות חשובות" />
      <Container narrow className="py-16">
        <div className="space-y-5 text-lg leading-9 text-ink/90">
          {paragraphs(c["roadmap.disclosure.text"]).map((p, i) => <p key={i}>{p}</p>)}
          <p className="font-medium text-navy">{c["roadmap.disclosure.bold"]}</p>
          {paragraphs(c["roadmap.disclosure.service"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <h2 className="mt-14 text-2xl text-navy">{c["notice.title"]}</h2>
        <div className="mt-4 space-y-4 text-lg leading-9 text-ink/90">
          {paragraphs(c["notice.text"]).map((p, i) => <p key={i}>{p}</p>)}
          <p className="font-medium text-navy">{c["notice.emergency"]}</p>
        </div>
      </Container>
    </>
  );
}
