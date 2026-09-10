import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/actions/auth";
import { LogoMark } from "@/components/site/Logo";

export const metadata = { title: "מערכת ניהול", robots: { index: false, follow: false } };

const LINKS = [
  { href: "/admin", label: "סקירה" },
  { href: "/admin/leads", label: "פניות" },
  { href: "/admin/articles", label: "מאמרים" },
  { href: "/admin/users", label: "משתמשים" },
  { href: "/admin/content", label: "טקסטים באתר" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col bg-mist lg:flex-row">
      <aside className="w-full border-b border-stone bg-navy text-white lg:w-64 lg:border-b-0 lg:border-l">
        <div className="flex items-center gap-3 px-6 py-5">
          <span className="rounded-sm bg-white p-1"><LogoMark className="h-8 w-auto" /></span>
          <div>
            <p className="font-heading text-lg leading-tight">מערכת ניהול</p>
            <p className="text-xs text-white/60">{admin.full_name}</p>
          </div>
        </div>
        <nav aria-label="ניהול" className="px-3 pb-4">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-sm px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white">{l.label}</Link>
              </li>
            ))}
            <li className="lg:mt-4"><Link href="/" className="block rounded-sm px-3 py-2 text-sm text-gold-light hover:bg-white/10">לאתר הציבורי</Link></li>
            <li>
              <form action={logout}><button type="submit" className="block w-full rounded-sm px-3 py-2 text-right text-sm text-white/60 hover:bg-white/10">התנתקות</button></form>
            </li>
          </ul>
        </nav>
      </aside>
      <main id="main" className="flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
