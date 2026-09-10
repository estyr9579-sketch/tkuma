"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/auth";
import { CONTENT } from "@/lib/content";
import type { ActionResult, UserRole } from "@/lib/types";

export async function adminSetUserRole(userId: string, role: UserRole): Promise<ActionResult> {
  let admin;
  try {
    admin = await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  if (userId === admin.id) return { ok: false, error: "לא ניתן לשנות את ההרשאה של עצמך" };
  const db = createAdminClient();
  const { error } = await db.from("profiles").update({ role }).eq("id", userId);
  if (error) return { ok: false, error: "העדכון נכשל" };
  revalidatePath("/admin/users");
  return { ok: true, message: "ההרשאה עודכנה" };
}

export async function adminSetUserBlocked(userId: string, blocked: boolean): Promise<ActionResult> {
  let admin;
  try {
    admin = await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  if (userId === admin.id) return { ok: false, error: "לא ניתן לחסום את עצמך" };
  const db = createAdminClient();
  const { error } = await db.from("profiles").update({ is_blocked: blocked }).eq("id", userId);
  if (error) return { ok: false, error: "העדכון נכשל" };
  revalidatePath("/admin/users");
  return { ok: true, message: blocked ? "המשתמש נחסם" : "החסימה הוסרה" };
}

/** Deletes the auth user (profile cascades; articles keep content with created_by = null). */
export async function adminDeleteUser(userId: string): Promise<ActionResult> {
  let admin;
  try {
    admin = await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  if (userId === admin.id) return { ok: false, error: "לא ניתן למחוק את עצמך" };
  const db = createAdminClient();
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: "המחיקה נכשלה" };
  revalidatePath("/admin/users");
  return { ok: true, message: "המשתמש נמחק" };
}

/** Saves site texts. Values equal to the default are removed so the default stays live. */
export async function adminSaveContent(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const db = createAdminClient();
  const upserts: { key: string; value: string }[] = [];
  const deletes: string[] = [];
  for (const [key, v] of formData.entries()) {
    if (!(key in CONTENT) || typeof v !== "string") continue;
    const value = v.replace(/\r\n/g, "\n").trim();
    if (value === CONTENT[key].default.trim() || value === "") deletes.push(key);
    else upserts.push({ key, value: value.slice(0, 10_000) });
  }
  if (upserts.length) {
    const { error } = await db.from("site_content").upsert(upserts, { onConflict: "key" });
    if (error) return { ok: false, error: "השמירה נכשלה" };
  }
  if (deletes.length) await db.from("site_content").delete().in("key", deletes);
  revalidatePath("/", "layout");
  return { ok: true, message: "הטקסטים נשמרו" };
}
