import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function AuthCard({ title, intro, children, footer }: { title: string; intro?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-md border border-stone bg-white p-8 shadow-soft sm:p-10">
        <h1 className="text-3xl text-navy">{title}</h1>
        {intro && <p className="mt-2 text-slate">{intro}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 border-t border-stone pt-6 text-sm text-slate">{footer}</div>}
      </div>
    </Container>
  );
}
