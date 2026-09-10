import Link from "next/link";
import { getContent, lines } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/site/Reveal";

/** "What we are / what we are not" + who is behind the service. Builds trust without marketing. */
export async function TrustSection() {
  const c = await getContent();
  return (
    <section aria-labelledby="trust-title" className="bg-mist">
      <Container className="py-12 sm:py-20">
        <Reveal>
          <h2 id="trust-title" className="text-2xl text-navy sm:text-4xl">{c["home.trust.title"]}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          <Reveal className="border border-stone bg-white p-6 sm:p-8">
            <h3 className="text-lg text-navy sm:text-xl">{c["home.trust.do.title"]}</h3>
            <ul className="mt-4 space-y-3">
              {lines(c["home.trust.do"]).map((l) => (
                <li key={l} className="flex gap-3 text-[15px] leading-7 text-ink/90">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-accent" aria-hidden="true" />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="border border-stone bg-white p-6 sm:p-8">
            <h3 className="text-lg text-navy sm:text-xl">{c["home.trust.dont.title"]}</h3>
            <ul className="mt-4 space-y-3">
              {lines(c["home.trust.dont"]).map((l) => (
                <li key={l} className="flex gap-3 text-[15px] leading-7 text-ink/90">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone" aria-hidden="true" />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={120} className="mt-4 border-r-2 border-gold-accent bg-white p-6 sm:mt-6 sm:p-8">
          <h3 className="text-lg text-navy sm:text-xl">{c["home.trust.who.title"]}</h3>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-ink/90 sm:text-base sm:leading-8">{c["home.trust.who.text"]}</p>
          <Link href="/roadmap" className="mt-4 inline-block text-sm text-navy underline underline-offset-4">{c["home.trust.who.link"]}</Link>
        </Reveal>
      </Container>
    </section>
  );
}
