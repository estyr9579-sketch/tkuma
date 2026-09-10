import { getContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { LeadDialogButton } from "@/components/site/LeadDialog";

export async function CtaBand() {
  const c = await getContent();
  return (
    <section className="bg-navy text-white" aria-labelledby="cta-title">
      <Container className="py-12 sm:py-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="mb-5 h-px w-10 bg-gold-accent" aria-hidden="true" />
          <h2 id="cta-title" className="text-2xl sm:text-4xl">{c["home.hero.cta"]}</h2>
          <p className="mt-3 text-white/75">{c["home.hero.cta_sub"]}</p>
          <div className="mt-7">
            <LeadDialogButton label={c["nav.cta"]} size="lg" />
          </div>
          <p className="mt-4 text-xs text-white/50">ללא התחייבות. השארת פרטים אינה מהווה התחלת טיפול.</p>
        </div>
      </Container>
    </section>
  );
}
