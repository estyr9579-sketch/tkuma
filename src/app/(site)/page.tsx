import Link from "next/link";
import { getContent, lines } from "@/lib/content";
import { getLatestArticles } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { LeadDialogButton } from "@/components/site/LeadDialog";
import { ArticleGrid } from "@/components/site/ArticleCard";
import { NoticeBox } from "@/components/site/NoticeBox";
import { LogoFull } from "@/components/site/Logo";
import { Reveal } from "@/components/site/Reveal";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { TrustSection } from "@/components/site/TrustSection";
import { CtaBand } from "@/components/site/CtaBand";

/**
 * Home – the journey: problem → confusion → understanding → order → plan → guidance → contact.
 * Sections: Hero · Journey strip · Who it's for · Process timeline · Trust · Articles · CTA · Notice
 */
export default async function HomePage() {
  const [c, latest] = await Promise.all([getContent(), getLatestArticles(3)]);
  const who = lines(c["home.who.items"]);
  const journey = lines(c["home.journey.items"]);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(ellipse_at_left,rgba(176,141,87,0.14),transparent_60%)]" aria-hidden="true" />
        <Container className="relative grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:py-24">
          <div className="max-w-2xl">
            <p className="font-heading text-2xl font-semibold text-gold-light sm:text-4xl">{c["home.hero.title"]}</p>
            <p className="mt-1.5 text-[13px] text-white/65 sm:text-base">{c["home.hero.tagline"]}</p>

            <h1 className="mt-6 text-[1.75rem] leading-[1.25] sm:mt-8 sm:text-4xl lg:text-5xl">{c["home.hero.subtitle"]}</h1>

            <div className="mt-6 space-y-1.5 border-r-2 border-gold-accent pr-4 font-heading text-lg text-white/90 sm:mt-8 sm:pr-6 sm:text-2xl">
              <p>{c["home.hero.line1"]}</p>
              <p>{c["home.hero.line2"]}</p>
            </div>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{c["home.hero.text"]}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div>
                <LeadDialogButton label={c["home.hero.cta"]} size="lg" full />
                <p className="mt-2 text-center text-xs text-white/60 sm:text-right sm:text-sm">{c["home.hero.cta_sub"]}</p>
              </div>
              <Link href="/process" className="self-center px-2 py-2 text-sm text-white/85 underline-offset-4 hover:underline sm:self-start sm:pt-3">
                {c["home.hero.secondary"]}
              </Link>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <div className="rounded-sm bg-[#f8f4ea] p-8 shadow-soft">
              <LogoFull className="w-64" />
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Journey strip ---------- */}
      <section aria-labelledby="journey-title" className="border-b border-stone">
        <Container className="py-10 sm:py-14">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div>
              <h2 id="journey-title" className="text-2xl text-navy sm:text-3xl">{c["home.journey.title"]}</h2>
              <p className="mt-3 text-[15px] leading-7 text-slate sm:text-base">{c["home.journey.text"]}</p>
            </div>
            <ol className="flex flex-wrap items-center gap-y-3 font-heading text-lg text-navy sm:text-xl" aria-label="שלבי המסע">
              {journey.map((step, i) => (
                <li key={step} className="flex items-center whitespace-nowrap">
                  <span className={i === journey.length - 1 ? "text-gold" : ""}>{step}</span>
                  {i < journey.length - 1 && <span className="mx-2.5 text-gold-accent" aria-hidden="true">←</span>}
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      {/* ---------- Who is it for ---------- */}
      <section aria-labelledby="who-title">
        <Container className="py-12 sm:py-20">
          <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
            <Reveal>
              <h2 id="who-title" className="text-2xl text-navy sm:text-4xl">{c["home.who.title"]}</h2>
              <p className="mt-3 text-slate">{c["home.who.intro"]}</p>
            </Reveal>
            <Reveal delay={80}>
              <ul className="grid gap-px overflow-hidden border border-stone bg-stone sm:grid-cols-2">
                {who.map((item, i) => (
                  <li key={item} className={`flex gap-3 bg-white px-5 py-4 text-[15px] leading-7 text-ink/90 ${who.length % 2 === 1 && i === who.length - 1 ? "sm:col-span-2" : ""}`}>
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- Process timeline (centrepiece) ---------- */}
      <section className="bg-mist" aria-labelledby="steps-title">
        <Container className="py-12 sm:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 h-px w-10 bg-gold-accent" aria-hidden="true" />
            <h2 id="steps-title" className="text-2xl text-navy sm:text-4xl">{c["process.title"]}</h2>
            <p className="mt-3 text-[15px] leading-7 text-slate sm:text-base">{c["home.process.intro"]}</p>
          </Reveal>
          <div className="mt-10 sm:mt-14">
            <ProcessTimeline compact />
          </div>
          <div className="mt-8 text-center">
            <Link href="/process" className="text-sm text-navy underline underline-offset-4 sm:text-base">לפירוט מלא של כל שלב</Link>
          </div>
        </Container>
      </section>

      {/* ---------- Trust ---------- */}
      <TrustSection />

      {/* ---------- Latest articles ---------- */}
      {latest.length > 0 && (
        <section aria-labelledby="latest-title">
          <Container className="py-12 sm:py-20">
            <Reveal className="flex items-end justify-between">
              <h2 id="latest-title" className="text-2xl text-navy sm:text-4xl">{c["articles.title"]}</h2>
              <Link href="/articles" className="text-sm text-navy underline underline-offset-4">לכל המאמרים</Link>
            </Reveal>
            <div className="mt-8">
              <ArticleGrid articles={latest} showAuthor />
            </div>
          </Container>
        </section>
      )}

      {/* ---------- Principle + CTA ---------- */}
      <section className="border-t border-stone">
        <Container className="py-12 sm:py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl leading-snug text-navy sm:text-3xl">{c["home.principle.title"]}</h2>
            <p className="mt-4 font-heading text-lg text-gold sm:text-xl">{c["home.principle.text"]}</p>
          </Reveal>
        </Container>
      </section>
      <CtaBand />
      <NoticeBox compact />
    </>
  );
}
