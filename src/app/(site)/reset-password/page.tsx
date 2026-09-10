import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/forms/AuthCard";
import { RequestResetForm } from "@/components/forms/ResetForms";

export const metadata: Metadata = { title: "איפוס סיסמה", robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <AuthCard title="איפוס סיסמה" intro="נשלח לאימייל שלך קישור לקביעת סיסמה חדשה." footer={<Link href="/login" className="text-navy underline underline-offset-2">חזרה להתחברות</Link>}>
      <RequestResetForm />
    </AuthCard>
  );
}
