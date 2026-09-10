import Link from "next/link";
import { getContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { NAV_LINKS } from "@/components/site/nav-links";
import { LogoFull } from "@/components/site/Logo";

const LEGAL_LINKS = [
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/terms", label: "תנאי שימוש" },
  { href: "/accessibility", label: "הצהרת נגישות" },
  { href: "/disclosure", label: "גילוי נאות" },
];

export async function Footer() {
  const c = await getContent();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-deep text-white/80">
      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="inline-block rounded-sm bg-[#f8f4ea] p-4">
              <LogoFull className="w-44" />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7">{c["footer.text"]}</p>
            <p className="mt-4 text-sm text-white/60">ייעוץ, הכוונה וניווט טיפולי אישי (Care Navigation). השירות אינו טיפול רפואי או נפשי.</p>
          </div>
          <nav aria-label="קישורי עמודים">
            <h2 className="mb-4 font-body text-sm font-medium text-gold-light">עמודים</h2>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="mb-4 font-body text-sm font-medium text-gold-light">צור קשר ומידע</h2>
            <ul className="space-y-2.5 text-sm">
              {c["site.phone"] && <li><a href={`tel:${c["site.phone"]}`} className="hover:text-white" dir="ltr">{c["site.phone"]}</a></li>}
              {c["site.email"] && <li><a href={`mailto:${c["site.email"]}`} className="hover:text-white">{c["site.email"]}</a></li>}
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {c["site.name"]}. כל הזכויות שמורות.</span>
          <Link href="/accessibility" className="underline underline-offset-4 hover:text-white">נגישות</Link>
        </div>
      </Container>
    </footer>
  );
}
