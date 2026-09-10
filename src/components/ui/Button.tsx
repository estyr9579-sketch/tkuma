import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "danger";
const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-soft",
  secondary: "border border-navy text-navy hover:bg-mist",
  ghost: "text-navy hover:bg-mist",
  gold: "bg-gold text-white hover:bg-[#75592f]",
  danger: "border border-red-700 text-red-700 hover:bg-red-50",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function Button({ variant = "primary", className = "", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({ variant = "primary", className = "", href, children }: { variant?: Variant; className?: string; href: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
