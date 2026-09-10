import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { LeadDialogButton } from "@/components/site/LeadDialog";
import { MobileNav } from "@/components/site/MobileNav";
import { NAV_LINKS } from "@/components/site/nav-links";
import { LogoMark } from "@/components/site/Logo";

export async function Header() {
  const [profile, content] = await Promise.all([getCurrentProfile(), getContent()]);
  const accountHref = profile ? (profile.role === "admin" ? "/admin" : "/account") : "/login";
  const accountLabel = profile ? (profile.role === "admin" ? "ניהול" : "אזור אישי") : "התחברות";

  return (
    <header className="sticky top-0 z-40 border-b border-stone bg-white">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${content["site.name"]} – דף הבית`}>
          <LogoMark className="h-12 w-auto" />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-xl font-semibold text-navy">{content["site.name"]}</span>
            <span className="text-xs text-slate">{content["site.subname"]}</span>
          </span>
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[15px] text-ink hover:text-navy">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href={accountHref} className="text-[15px] text-slate hover:text-navy">
            {accountLabel}
          </Link>
          <LeadDialogButton label={content["nav.cta"]} size="sm" />
        </div>

        <MobileNav links={NAV_LINKS} accountHref={accountHref} accountLabel={accountLabel} ctaLabel={content["nav.cta"]} />
      </Container>
    </header>
  );
}
