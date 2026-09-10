import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { h: string; ps: string[] }[] }) {
  return (
    <>
      <PageHeader title={title} intro={`עודכן לאחרונה: ${updated}`} />
      <Container narrow className="py-16">
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-2xl text-navy">{s.h}</h2>
              <div className="mt-3 space-y-3 text-[17px] leading-8 text-ink/90">
                {s.ps.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
