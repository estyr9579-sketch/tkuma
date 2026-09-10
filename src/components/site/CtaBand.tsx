import { getContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { LeadDialogButton } from "@/components/site/LeadDialog";

export async function CtaBand({ title, text }: { title?: string; text?: string }) {
  const c = await getContent();
  return (
    <section className="bg-navy text-white">
      <Container className="flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl">{title ?? "רוצה שנעזור לך לעשות סדר?"}</h2>
          <p className="mt-2 text-white/75">{text ?? "השאירו פרטים ונחזור אליכם לשיחה ראשונית קצרה, ללא התחייבות."}</p>
        </div>
        <LeadDialogButton label={c["home.hero.cta"]} size="lg" />
      </Container>
    </section>
  );
}
