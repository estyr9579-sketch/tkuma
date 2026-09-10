import type { Metadata } from "next";
import { getContent, lines, paragraphs } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata: Metadata = { title: "מי אנחנו", description: "מתאם טיפול אישי – לעשות סדר בתוך הכאוס הרגשי. מי אנחנו ולמה הקמנו את השירות." };

export default async function AboutPage() {
  const c = await getContent();
  return (
    <>
      <PageHeader title={c["about.title"]} subtitle={c["about.subtitle"]} />
      <Container narrow className="py-10 sm:py-20">
        <div className="space-y-4 text-[15px] leading-7 text-ink/90 sm:text-lg sm:leading-8">
          {paragraphs(c["about.intro"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <ul className="my-8 grid gap-2 border-r-2 border-gold-accent pr-4 font-heading text-lg text-navy sm:my-10 sm:pr-6 sm:text-2xl">
          {lines(c["about.questions"]).map((q) => <li key={q}>{q}</li>)}
        </ul>
        <div className="space-y-4 text-[15px] leading-7 text-ink/90 sm:text-lg sm:leading-8">
          {paragraphs(c["about.body"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <p className="my-8 font-heading text-2xl text-navy sm:my-10 sm:text-3xl">{c["about.highlight"]}</p>
        <div className="space-y-4 text-[15px] leading-7 text-ink/90 sm:text-lg sm:leading-8">
          {paragraphs(c["about.outro"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
