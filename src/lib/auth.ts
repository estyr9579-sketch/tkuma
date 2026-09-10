import { cache } from "react";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/types";

/** Returns the current user's profile (or null). Cached per request. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return null;

  // Admin is identified by the phone number and/or email configured on the server (never in client code).
  const adminPhone = normalizePhone(process.env.ADMIN_PHONE ?? "");
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const isAdminPhone = !!adminPhone && normalizePhone(profile.phone) === adminPhone;
  const isAdminEmail = !!adminEmail && (profile.email || user.email || "").toLowerCase() === adminEmail;
  if ((isAdminPhone || isAdminEmail) && profile.role !== "admin") {
    await admin.from("profiles").update({ role: "admin", is_blocked: false }).eq("id", user.id);
    profile.role = "admin";
    profile.is_blocked = false;
  }
  return profile as Profile;
});

export function normalizePhone(p: string) {
  return p.replace(/[^0-9]/g, "").replace(/^972/, "0");
}

/** Require a logged-in, non-blocked user. Redirects otherwise. */
export async function requireUser(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/account");
  if (profile.is_blocked) redirect("/blocked");
  return profile;
}

/** Require admin role. Redirects to home otherwise (admin URL stays hidden). */
export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin" || profile.is_blocked) redirect("/");
  return profile;
}

/** Non-redirecting variants for server actions. */
export async function assertAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin" || profile.is_blocked) throw new Error("אין הרשאה");
  return profile;
}
export async function assertUser(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.is_blocked) throw new Error("יש להתחבר");
  return profile;
}
