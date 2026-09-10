import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/forms/AuthCard";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = { title: "הרשמה", robots: { index: false } };

export default function RegisterPage() {
  return (
    <AuthCard
      title="יצירת חשבון"
      intro="אנשי מקצוע יכולים לשלוח מאמרים לפרסום באתר. כל מאמר עובר אישור לפני פרסום."
      footer={<span>כבר יש לך חשבון? <Link href="/login" className="text-navy underline underline-offset-2">התחברות</Link></span>}
    >
      <RegisterForm />
    </AuthCard>
  );
}
