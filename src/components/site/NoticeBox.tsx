import { getContent, paragraphs } from "@/lib/content";
import { Container } from "@/components/ui/Container";

/** "חשוב לדעת" – the disclosure block shown on several pages. */
export async function NoticeBox({ compact = false }: { compact?: boolean }) {
  const c = await getContent();
  const ps = paragraphs(c["notice.text"]);
  return (
    <section aria-labelledby="notice-title" className="bg-mist">
      <Container narrow className={compact ? "py-10 sm:py-12" : "py-12 sm:py-16"}>
        <div className="border-r-2 border-gold-accent pr-4 sm:pr-8">
          <h2 id="notice-title" className="text-xl text-navy sm:text-2xl">{c["notice.title"]}</h2>
          <div className="mt-3 space-y-2.5 text-sm leading-6 sm:text-[15px] sm:leading-7 text-ink/85">
            {(compact ? ps.slice(0, 2) : ps).map((p, i) => <p key={i}>{p}</p>)}
            <p className="font-medium text-navy">{c["notice.emergency"]}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
