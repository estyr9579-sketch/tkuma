import { Container } from "./Container";

export function PageHeader({ title, subtitle, intro }: { title: string; subtitle?: string; intro?: string }) {
  return (
    <section className="bg-navy text-white">
      <Container className="py-16 sm:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 h-px w-14 bg-gold-accent" aria-hidden="true" />
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-5 font-heading text-xl text-gold-light sm:text-2xl">{subtitle}</p>}
          {intro && <p className="mt-6 max-w-2xl text-lg text-white/80">{intro}</p>}
        </div>
      </Container>
    </section>
  );
}
