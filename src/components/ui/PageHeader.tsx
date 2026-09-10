import { Container } from "./Container";

export function PageHeader({ title, subtitle, intro }: { title: string; subtitle?: string; intro?: string }) {
  return (
    <section className="bg-navy text-white">
      <Container className="py-10 sm:py-16">
        <div className="max-w-3xl">
          <div className="mb-4 h-px w-10 bg-gold-accent sm:mb-5 sm:w-14" aria-hidden="true" />
          <h1 className="text-3xl sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 font-heading text-lg text-gold-light sm:mt-4 sm:text-2xl">{subtitle}</p>}
          {intro && <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{intro}</p>}
        </div>
      </Container>
    </section>
  );
}
