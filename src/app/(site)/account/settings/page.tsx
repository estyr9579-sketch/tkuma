import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/forms/ProfileForm";

export default async function SettingsPage() {
  const profile = await requireUser();
  return (
    <div className="max-w-md">
      <h2 className="text-2xl text-navy">פרטים אישיים</h2>
      <p className="mt-2 mb-8 text-slate">האימייל: <span dir="ltr">{profile.email}</span>. לשינוי סיסמה השתמשו ב"שכחתי סיסמה" בעמוד ההתחברות.</p>
      <ProfileForm fullName={profile.full_name} phone={profile.phone} />
    </div>
  );
}
