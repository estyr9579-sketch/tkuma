import { getContent } from "@/lib/content";
import { Reveal } from "@/components/site/Reveal";

/** Vertical 5-step timeline – the visual centrepiece of the service. Mobile-first. */
export async function ProcessTimeline({ compact = false }: { compact?: boolean }) {
  const c = await getContent();
  const steps = [1, 2, 3, 4, 5].map((n) => ({
    n,
    title: c[`process.step${n}.title` as keyof typeof c],
    short: c[`process.step${n}.short` as keyof typeof c],
  }));

  return (
    <ol className="relative mx-auto max-w-2xl">
      {/* connecting line */}
      <div className="absolute top-3 bottom-3 right-[1.35rem] w-px bg-gradient-to-b from-gold-accent/0 via-gold-accent to-gold-accent/0 sm:right-[1.6rem]" aria-hidden="true" />
      {steps.map((s, i) => (
        <Reveal as="li" key={s.n} delay={i * 70} className={`relative flex gap-5 sm:gap-7 ${compact ? "pb-7" : "pb-10"} last:pb-0`}>
          <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-accent bg-white font-heading text-xl text-gold sm:h-13 sm:w-13 sm:text-2xl" aria-hidden="true">
            {s.n}
          </div>
          <div className="pt-1.5">
            <h3 className="text-lg text-navy sm:text-xl">
              <span className="sr-only">שלב {s.n}: </span>{s.title}
            </h3>
            <p className="mt-1 text-[15px] leading-7 text-slate">{s.short}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
