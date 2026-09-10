"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin, assertUser } from "@/lib/auth";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { makeSlug } from "@/lib/utils";
import type { ActionResult, ArticleStatus } from "@/lib/types";

const articleSchema = z.object({
  title: z.string().trim().min(3, "יש להזין כותרת (לפחות 3 תווים)").max(150, "הכותרת ארוכה מדי"),
  excerpt: z.string().trim().max(400, "התקציר ארוך מדי (עד 400 תווים)").default(""),
  content: z.string().max(200_000, "התוכן ארוך מדי").default(""),
  category_id: z.string().uuid().optional().or(z.literal("")),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  display_author_name: z.string().trim().max(100).default(""),
  display_author_bio: z.string().trim().max(600).default(""),
  display_author_image: z.string().url().optional().or(z.literal("")),
  display_author_link: z.string().url().optional().or(z.literal("")),
});

function revalidateArticles() {
  revalidatePath("/articles");
  revalidatePath("/experts");
  revalidatePath("/");
  revalidatePath("/account");
  revalidatePath("/admin/articles");
}

function normalize(d: z.infer<typeof articleSchema>) {
  return {
    title: d.title,
    excerpt: d.excerpt,
    content: sanitizeArticleHtml(d.content),
    category_id: d.category_id || null,
    cover_image_url: d.cover_image_url || null,
    display_author_name: d.display_author_name,
    display_author_bio: d.display_author_bio,
    display_author_image: d.display_author_image || null,
    display_author_link: d.display_author_link || null,
  };
}

// ============ Writer (personal area) ============

/** Create or update the writer's own article. `submit=true` sends it for approval. */
export async function saveMyArticle(id: string | null, formData: FormData, submit: boolean): Promise<ActionResult> {
  let user;
  try {
    user = await assertUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  if (user.role === "user") return { ok: false, error: "החשבון שלך אינו מורשה לשלוח מאמרים" };

  const parsed = articleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };

  const db = createAdminClient();
  const values = normalize(parsed.data);
  // Writers can only set the author name/bio – the admin controls the rest
  const status: ArticleStatus = submit ? "pending" : "draft";

  if (id) {
    const { data: existing } = await db.from("articles").select("id,status,created_by").eq("id", id).maybeSingle();
    if (!existing || existing.created_by !== user.id) return { ok: false, error: "המאמר לא נמצא" };
    if (existing.status === "published" || existing.status === "approved") {
      return { ok: false, error: "מאמר שאושר ניתן לעריכה על ידי המנהל בלבד" };
    }
    const { error } = await db.from("articles").update({ ...values, status }).eq("id", id);
    if (error) return { ok: false, error: "השמירה נכשלה" };
    revalidateArticles();
    return { ok: true, id, message: submit ? "המאמר נשלח לאישור" : "הטיוטה נשמרה" };
  }

  const { data, error } = await db
    .from("articles")
    .insert({
      ...values,
      slug: makeSlug(values.title),
      kind: "expert",
      status,
      created_by: user.id,
      display_author_name: values.display_author_name || user.full_name,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "השמירה נכשלה" };
  revalidateArticles();
  return { ok: true, id: data.id, message: submit ? "המאמר נשלח לאישור" : "הטיוטה נשמרה" };
}

export async function deleteMyArticle(id: string): Promise<ActionResult> {
  let user;
  try {
    user = await assertUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const db = createAdminClient();
  const { error } = await db.from("articles").delete().eq("id", id).eq("created_by", user.id).in("status", ["draft", "needs_changes", "rejected"]);
  if (error) return { ok: false, error: "המחיקה נכשלה" };
  revalidateArticles();
  return { ok: true, message: "נמחק" };
}

// ============ Admin ============

const adminExtra = z.object({
  kind: z.enum(["site", "expert"]).default("site"),
  admin_note: z.string().trim().max(2000).default(""),
});

/** Admin creates/updates any article, optionally attributing it to a display author. */
export async function adminSaveArticle(id: string | null, formData: FormData, status: ArticleStatus): Promise<ActionResult> {
  let admin;
  try {
    admin = await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const raw = Object.fromEntries(formData.entries());
  const parsed = articleSchema.safeParse(raw);
  const extra = adminExtra.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };
  if (!extra.success) return { ok: false, error: "נתונים לא תקינים" };

  const db = createAdminClient();
  const values = { ...normalize(parsed.data), kind: extra.data.kind, admin_note: extra.data.admin_note, status };
  const published_at = status === "published" ? new Date().toISOString() : undefined;

  if (id) {
    const { data: existing } = await db.from("articles").select("published_at").eq("id", id).maybeSingle();
    if (!existing) return { ok: false, error: "המאמר לא נמצא" };
    const { error } = await db
      .from("articles")
      .update({ ...values, ...(status === "published" ? { published_at: existing.published_at ?? published_at } : {}) })
      .eq("id", id);
    if (error) return { ok: false, error: "השמירה נכשלה" };
    revalidateArticles();
    return { ok: true, id, message: "נשמר" };
  }

  const { data, error } = await db
    .from("articles")
    .insert({ ...values, slug: makeSlug(values.title), created_by: admin.id, published_at: published_at ?? null })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "השמירה נכשלה" };
  revalidateArticles();
  return { ok: true, id: data.id, message: "נשמר" };
}

/** Quick status change from the admin list (approve / reject / return / publish / unpublish). */
export async function adminSetArticleStatus(id: string, status: ArticleStatus, admin_note?: string): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const db = createAdminClient();
  const patch: Record<string, unknown> = { status };
  if (admin_note !== undefined) patch.admin_note = admin_note.slice(0, 2000);
  if (status === "published") {
    const { data } = await db.from("articles").select("published_at").eq("id", id).maybeSingle();
    if (!data?.published_at) patch.published_at = new Date().toISOString();
  }
  const { error } = await db.from("articles").update(patch).eq("id", id);
  if (error) return { ok: false, error: "העדכון נכשל" };
  revalidateArticles();
  return { ok: true, message: "עודכן" };
}

export async function adminDeleteArticle(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const db = createAdminClient();
  const { error } = await db.from("articles").delete().eq("id", id);
  if (error) return { ok: false, error: "המחיקה נכשלה" };
  revalidateArticles();
  return { ok: true, message: "נמחק" };
}

// ============ Image upload (writers + admin) ============

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function uploadImage(formData: FormData): Promise<ActionResult & { url?: string }> {
  let user;
  try {
    user = await assertUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "לא נבחר קובץ" };
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return { ok: false, error: "ניתן להעלות JPG, PNG או WebP בלבד" };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: "הקובץ גדול מדי (עד 4MB)" };

  const path = `${user.role === "admin" ? "site" : "users/" + user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const db = createAdminClient();
  const { error } = await db.storage.from("images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { ok: false, error: "ההעלאה נכשלה" };
  const { data } = db.storage.from("images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
