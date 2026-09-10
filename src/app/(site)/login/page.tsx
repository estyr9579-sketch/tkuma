import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/forms/AuthCard";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = { title: "התחברות", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return (
    <AuthCard
      title="התחברות"
      intro="לאזור האישי ולניהול המאמרים שלך."
      footer={
        <div className="flex flex-col gap-2">
          <span>אין לך חשבון? <Link href="/register" className="text-navy underline underline-offset-2">הרשמה</Link></span>
          <Link href="/reset-password" className="text-navy underline underline-offset-2">שכחתי סיסמה</Link>
        </div>
      }
    >
      <LoginForm next={next} linkError={error === "link"} />
    </AuthCard>
  );
}
