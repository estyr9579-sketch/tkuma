"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSessionClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { isValidIsraeliPhone, siteUrl } from "@/lib/utils";
import type { ActionResult } from "@/lib/types";

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

const registerSchema = z.object({
  full_name: z.string().trim().min(2, "יש להזין שם מלא").max(80),
  email: z.string().trim().email("יש להזין אימייל תקין").max(120),
  phone: z.string().trim().refine(isValidIsraeliPhone, "יש להזין מספר טלפון ישראלי תקין"),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים").max(72),
  terms: z.literal("on", { error: "יש לאשר את תנאי השימוש" }),
  privacy: z.literal("on", { error: "יש לאשר את מדיניות הפרטיות" }),
});

export async function register(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!rateLimit(`register:${await clientIp()}`, 5, 15 * 60 * 1000)) {
    return { ok: false, error: "יותר מדי ניסיונות. נסו שוב מאוחר יותר." };
  }
  const parsed = registerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  const { full_name, email, phone, password } = parsed.data;

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, phone }, emailRedirectTo: `${siteUrl()}/auth/callback` },
  });
  if (error) {
    const msg = /already|registered/i.test(error.message) ? "האימייל כבר רשום במערכת" : "ההרשמה נכשלה. נסו שוב.";
    return { ok: false, error: msg };
  }
  // Make sure the profile has the phone even if the trigger ran before metadata (defensive)
  if (data.user) {
    const admin = createAdminClient();
    await admin.from("profiles").upsert({ id: data.user.id, full_name, phone, email }, { onConflict: "id" });
  }
  if (data.session) redirect("/account");
  return { ok: true, message: "נשלח אליכם אימייל לאימות. לאחר האימות ניתן להתחבר." };
}

const loginSchema = z.object({
  email: z.string().trim().email("יש להזין אימייל תקין"),
  password: z.string().min(1, "יש להזין סיסמה"),
  next: z.string().optional(),
});

export async function login(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!rateLimit(`login:${await clientIp()}`, 10, 15 * 60 * 1000)) {
    return { ok: false, error: "יותר מדי ניסיונות. נסו שוב מאוחר יותר." };
  }
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) {
    if (/not confirmed/i.test(error.message)) return { ok: false, error: "האימייל טרם אומת. בדקו את תיבת הדואר." };
    return { ok: false, error: "אימייל או סיסמה שגויים" };
  }
  const next = parsed.data.next && parsed.data.next.startsWith("/") && !parsed.data.next.startsWith("//") ? parsed.data.next : "/account";
  redirect(next);
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!rateLimit(`reset:${await clientIp()}`, 5, 15 * 60 * 1000)) {
    return { ok: false, error: "יותר מדי ניסיונות. נסו שוב מאוחר יותר." };
  }
  const email = z.string().trim().email().safeParse(formData.get("email"));
  if (!email.success) return { ok: false, error: "יש להזין אימייל תקין" };
  const supabase = await createSessionClient();
  await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: `${siteUrl()}/auth/callback?next=/reset-password/new` });
  // Always the same message – do not reveal whether the email exists
  return { ok: true, message: "אם האימייל רשום במערכת, נשלח אליו קישור לאיפוס סיסמה." };
}

export async function setNewPassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const password = z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים").max(72).safeParse(formData.get("password"));
  if (!password.success) return { ok: false, error: password.error.issues[0]?.message ?? "סיסמה לא תקינה" };
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) return { ok: false, error: "עדכון הסיסמה נכשל. ייתכן שהקישור פג תוקף." };
  redirect("/account");
}

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "יש להזין שם מלא").max(80),
  phone: z.string().trim().refine(isValidIsraeliPhone, "יש להזין מספר טלפון ישראלי תקין"),
});

export async function updateProfile(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "יש להתחבר" };
  const parsed = profileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update(parsed.data).eq("id", user.id);
  if (error) return { ok: false, error: "השמירה נכשלה" };
  return { ok: true, message: "הפרטים עודכנו" };
}
