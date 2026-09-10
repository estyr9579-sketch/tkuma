import type { Metadata } from "next";
import { getContent, lines, paragraphs } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { NoticeBox } from "@/components/site/NoticeBox";

export const metadata: Metadata = { title: "מפת הדרכים", description: "הסיפור האישי מאחורי השירות, ומה אנחנו – ומה אנחנו לא." };

export default async function RoadmapPage() {
  const c = await getContent();
  return (
    <>
      <PageHeader title={c["roadmap.title"]} subtitle={c["roadmap.subtitle"]} />
      <Container narrow className="py-10 sm:py-20">
        <div className="space-y-4 text-[15px] leading-7 text-ink/90 sm:text-lg sm:leading-8">
          {paragraphs(c["roadmap.intro"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <ul className="my-8 grid gap-2 border-r-2 border-gold-accent pr-4 font-heading text-lg text-navy sm:my-10 sm:pr-6 sm:text-2xl">
          {lines(c["roadmap.questions"]).map((q) => <li key={q}>{q}</li>)}
        </ul>
        <div className="space-y-4 text-[15px] leading-7 text-ink/90 sm:text-lg sm:leading-8">
          {paragraphs(c["roadmap.body"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <p className="my-8 font-heading text-xl leading-relaxed text-navy sm:my-10 sm:text-3xl">{c["roadmap.highlight"]}</p>

        <section aria-labelledby="disclosure-title" className="mt-10 border border-stone bg-mist p-5 sm:mt-16 sm:p-10">
          <h2 id="disclosure-title" className="text-2xl text-navy">{c["roadmap.disclosure.title"]}</h2>
          <div className="mt-3 space-y-3 text-[15px] leading-7 text-ink/90 sm:text-lg sm:leading-8">
            {paragraphs(c["roadmap.disclosure.text"]).map((p, i) => <p key={i}>{p}</p>)}
            <p className="font-medium text-navy">{c["roadmap.disclosure.bold"]}</p>
            {paragraphs(c["roadmap.disclosure.service"]).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>
      </Container>
      <NoticeBox compact />
      <CtaBand />
    </>
  );
}
