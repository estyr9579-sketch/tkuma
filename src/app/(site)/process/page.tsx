import type { Metadata } from "next";
import { getContent, lines, paragraphs } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { NoticeBox } from "@/components/site/NoticeBox";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = { title: "איך התהליך עובד", description: "חמישה שלבים: מיפוי והיכרות, בניית תוכנית אישית, חיבור לאנשי מקצוע, טיפול ותמיכה, ליווי ובקרה." };

export default async function ProcessPage() {
  const c = await getContent();
  const steps = [
    { title: c["process.step1.title"], text: c["process.step1.text"] },
    { title: c["process.step2.title"], text: c["process.step2.text"], items: c["process.step2.items"] },
    { title: c["process.step3.title"], text: c["process.step3.text"] },
    { title: c["process.step4.title"], text: c["process.step4.text"], items: c["process.step4.items"], note: c["process.step4.note"] },
    { title: c["process.step5.title"], text: c["process.step5.text"], items: c["process.step5.items"], note: c["process.step5.note"] },
  ];

  return (
    <>
      <PageHeader title={c["process.title"]} subtitle={c["process.subtitle"]} intro={c["process.intro"]} />

      {/* Overview timeline */}
      <section className="border-b border-stone bg-mist" aria-label="סקירת השלבים">
        <Container className="py-10 sm:py-14">
          <ProcessTimeline compact />
        </Container>
      </section>

      {/* Detailed steps */}
      <Container narrow className="py-12 sm:py-20">
        <ol className="space-y-10 sm:space-y-14">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} className="grid gap-3 sm:grid-cols-[3.5rem_1fr]">
              <div className="font-heading text-3xl text-gold sm:text-4xl" aria-hidden="true">{i + 1}</div>
              <div>
                <h2 className="text-xl text-navy sm:text-3xl">
                  <span className="sr-only">שלב {i + 1} – </span>{s.title}
                </h2>
                <div className="mt-3 space-y-3 text-[15px] leading-7 text-ink/90 sm:text-lg sm:leading-8">
                  {paragraphs(s.text).map((p, j) => <p key={j}>{p}</p>)}
                </div>
                {s.items && (
                  <ul className="mt-3 list-disc space-y-1 pr-5 text-[15px] leading-7 text-ink/90 marker:text-gold-accent sm:text-lg sm:leading-8">
                    {lines(s.items).map((it) => <li key={it}>{it}</li>)}
                  </ul>
                )}
                {s.note && (
                  <div className="mt-5 space-y-2 border-r-2 border-stone pr-4 text-sm leading-6 text-slate sm:text-[15px] sm:leading-7">
                    {paragraphs(s.note).map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
      <CtaBand />
      <NoticeBox compact />
    </>
  );
}
