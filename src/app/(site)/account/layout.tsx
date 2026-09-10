import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { logout } from "@/actions/auth";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "אזור אישי", robots: { index: false } };

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireUser();
  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 flex flex-col gap-4 border-b border-stone pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate">אזור אישי</p>
          <h1 className="text-3xl text-navy">שלום, {profile.full_name || "משתמש"}</h1>
        </div>
        <nav aria-label="אזור אישי" className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="/account" className="text-navy underline-offset-4 hover:underline">המאמרים שלי</Link>
          <Link href="/account/articles/new" className="text-navy underline-offset-4 hover:underline">מאמר חדש</Link>
          <Link href="/account/settings" className="text-navy underline-offset-4 hover:underline">פרטים אישיים</Link>
          {profile.role === "admin" && <Link href="/admin" className="text-gold underline-offset-4 hover:underline">מערכת ניהול</Link>}
          <form action={logout}><button type="submit" className="text-slate underline-offset-4 hover:underline">התנתקות</button></form>
        </nav>
      </div>
      {children}
    </Container>
  );
}
