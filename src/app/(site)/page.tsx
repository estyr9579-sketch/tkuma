import Link from "next/link";
import { getContent, lines } from "@/lib/content";
import { getLatestArticles } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { LeadDialogButton } from "@/components/site/LeadDialog";
import { ArticleGrid } from "@/components/site/ArticleCard";
import { NoticeBox } from "@/components/site/NoticeBox";
import { LogoFull } from "@/components/site/Logo";

export default async function HomePage() {
  const [c, latest] = await Promise.all([getContent(), getLatestArticles(3)]);
  const who = lines(c["home.who.items"]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(ellipse_at_left,rgba(176,141,87,0.14),transparent_60%)]" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.35fr_1fr] lg:py-32">
          <div className="max-w-3xl">
            <p className="font-heading text-4xl font-semibold text-gold-light sm:text-5xl">{c["home.hero.title"]}</p>
            <p className="mt-2 text-sm text-white/70 sm:text-base">{c["home.hero.tagline"]}</p>
            <h1 className="mt-8 text-3xl leading-tight sm:text-4xl lg:text-5xl">{c["home.hero.subtitle"]}</h1>
            <div className="mt-10 space-y-2 border-r-2 border-gold-accent pr-6 font-heading text-xl text-white/90 sm:text-2xl">
              <p>{c["home.hero.line1"]}</p>
              <p>{c["home.hero.line2"]}</p>
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80">{c["home.hero.text"]}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <LeadDialogButton label={c["home.hero.cta"]} size="lg" />
              <Link href="/process" className="inline-flex items-center gap-2 px-2 py-3 text-white/85 underline-offset-4 hover:underline">
                {c["home.hero.secondary"]}
              </Link>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <div className="rounded-sm bg-[#f8f4ea] p-8 shadow-soft">
              <LogoFull className="w-72" />
            </div>
          </div>
        </Container>
      </section>

      {/* Principle */}
      <section className="border-b border-stone">
        <Container className="grid gap-10 py-20 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl leading-snug text-navy sm:text-4xl">{c["home.principle.title"]}</h2>
            <p className="mt-6 text-xl leading-9 text-ink/85">{c["home.principle.text"]}</p>
          </div>
          <blockquote className="border-r-2 border-gold-accent pr-6 font-heading text-2xl leading-relaxed text-navy sm:text-3xl">
            "{c["home.principle.quote"]}"
          </blockquote>
        </Container>
      </section>

      {/* Who is it for */}
      <section aria-labelledby="who-title">
        <Container className="py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 id="who-title" className="text-3xl text-navy sm:text-4xl">{c["home.who.title"]}</h2>
              <p className="mt-4 text-slate">{c["home.who.intro"]}</p>
              <div className="mt-8 hidden md:block">
                <Link href="/roadmap" className="text-navy underline underline-offset-4">מי עומד מאחורי השירות</Link>
              </div>
            </div>
            <ul className="divide-y divide-stone border-y border-stone">
              {who.map((item) => (
                <li key={item} className="py-4 text-lg leading-8 text-ink/90">{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Steps teaser */}
      <section className="bg-mist" aria-labelledby="steps-title">
        <Container className="py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="steps-title" className="text-3xl text-navy sm:text-4xl">{c["process.title"]}</h2>
            <p className="max-w-md text-slate">{c["process.intro"]}</p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="bg-white p-6">
                <span className="font-heading text-3xl text-gold">{n}</span>
                <h3 className="mt-3 text-lg text-navy">{c[`process.step${n}.title` as keyof typeof c]}</h3>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Link href="/process" className="text-navy underline underline-offset-4">לפירוט מלא של התהליך</Link>
          </div>
        </Container>
      </section>

      {/* Latest articles */}
      {latest.length > 0 && (
        <section aria-labelledby="latest-title">
          <Container className="py-20">
            <div className="flex items-end justify-between">
              <h2 id="latest-title" className="text-3xl text-navy sm:text-4xl">{c["articles.title"]}</h2>
              <Link href="/articles" className="text-navy underline underline-offset-4">לכל המאמרים</Link>
            </div>
            <div className="mt-10">
              <ArticleGrid articles={latest} showAuthor />
            </div>
          </Container>
        </section>
      )}

      <NoticeBox compact />
    </>
  );
}
