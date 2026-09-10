import type { Metadata } from "next";
import { AuthCard } from "@/components/forms/AuthCard";
import { NewPasswordForm } from "@/components/forms/ResetForms";

export const metadata: Metadata = { title: "סיסמה חדשה", robots: { index: false } };

export default function NewPasswordPage() {
  return (
    <AuthCard title="קביעת סיסמה חדשה">
      <NewPasswordForm />
    </AuthCard>
  );
}
