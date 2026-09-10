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
      <Container narrow className="py-16 sm:py-20">
        <div className="space-y-5 text-lg leading-9 text-ink/90">
          {paragraphs(c["about.intro"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <ul className="my-10 space-y-2 border-r-2 border-gold-accent pr-6 font-heading text-xl text-navy sm:text-2xl">
          {lines(c["about.questions"]).map((q) => <li key={q}>{q}</li>)}
        </ul>
        <div className="space-y-5 text-lg leading-9 text-ink/90">
          {paragraphs(c["about.body"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <p className="my-10 font-heading text-3xl text-navy">{c["about.highlight"]}</p>
        <div className="space-y-5 text-lg leading-9 text-ink/90">
          {paragraphs(c["about.outro"]).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
