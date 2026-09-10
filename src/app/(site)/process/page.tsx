import type { Metadata } from "next";
import { getContent, lines, paragraphs } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { NoticeBox } from "@/components/site/NoticeBox";

export const metadata: Metadata = { title: "איך התהליך עובד", description: "חמישה שלבים: מיפוי והיכרות, בניית מפת דרכים אישית, טיפול נלווה, חיבור לאנשי מקצוע, ליווי ובקרה." };

export default async function ProcessPage() {
  const c = await getContent();
  const steps = [
    { title: c["process.step1.title"], text: c["process.step1.text"] },
    { title: c["process.step2.title"], text: c["process.step2.text"], items: c["process.step2.items"] },
    { title: c["process.step3.title"], text: c["process.step3.text"], items: c["process.step3.items"], note: c["process.step3.note"] },
    { title: c["process.step4.title"], text: c["process.step4.text"] },
    { title: c["process.step5.title"], text: c["process.step5.text"], items: c["process.step5.items"], note: c["process.step5.note"] },
  ];

  return (
    <>
      <PageHeader title={c["process.title"]} subtitle={c["process.subtitle"]} intro={c["process.intro"]} />
      <Container narrow className="py-16 sm:py-20">
        <ol className="space-y-14">
          {steps.map((s, i) => (
            <li key={s.title} className="grid gap-4 sm:grid-cols-[4rem_1fr]">
              <div className="font-heading text-4xl text-gold" aria-hidden="true">{i + 1}</div>
              <div>
                <h2 className="text-2xl text-navy sm:text-3xl">
                  <span className="sr-only">שלב {i + 1} – </span>{s.title}
                </h2>
                <div className="mt-4 space-y-4 text-lg leading-9 text-ink/90">
                  {paragraphs(s.text).map((p, j) => <p key={j}>{p}</p>)}
                </div>
                {s.items && (
                  <ul className="mt-4 list-disc space-y-1.5 pr-6 text-lg leading-8 text-ink/90 marker:text-gold">
                    {lines(s.items).map((it) => <li key={it}>{it}</li>)}
                  </ul>
                )}
                {s.note && (
                  <div className="mt-6 space-y-2 border-r-2 border-stone pr-5 text-[15px] leading-7 text-slate">
                    {paragraphs(s.note).map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Container>
      <NoticeBox compact />
      <CtaBand />
    </>
  );
}
