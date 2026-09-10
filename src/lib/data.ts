import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Article, ArticleKind, Category, Lead, Profile } from "@/lib/types";

const ARTICLE_COLS = "*, categories(name, slug)";

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = createAdminClient();
  const { data } = await db.from("categories").select("*").order("sort_order");
  return (data ?? []) as Category[];
});

export const getPublishedArticles = cache(async (kind: ArticleKind, category?: string): Promise<Article[]> => {
  const db = createAdminClient();
  let q = db.from("articles").select(ARTICLE_COLS).eq("status", "published").eq("kind", kind).order("published_at", { ascending: false });
  const { data } = await q;
  let rows = (data ?? []) as Article[];
  if (category) rows = rows.filter((a) => a.categories?.slug === category);
  return rows;
});

export const getPublishedArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const db = createAdminClient();
  const { data } = await db.from("articles").select(ARTICLE_COLS).eq("slug", slug).eq("status", "published").maybeSingle();
  return (data as Article) ?? null;
});

export const getLatestArticles = cache(async (limit = 3): Promise<Article[]> => {
  const db = createAdminClient();
  const { data } = await db.from("articles").select(ARTICLE_COLS).eq("status", "published").order("published_at", { ascending: false }).limit(limit);
  return (data ?? []) as Article[];
});

// ---- User area ----
export async function getMyArticles(userId: string): Promise<Article[]> {
  const db = createAdminClient();
  const { data } = await db.from("articles").select(ARTICLE_COLS).eq("created_by", userId).order("updated_at", { ascending: false });
  return (data ?? []) as Article[];
}

export async function getMyArticle(userId: string, id: string): Promise<Article | null> {
  const db = createAdminClient();
  const { data } = await db.from("articles").select(ARTICLE_COLS).eq("id", id).eq("created_by", userId).maybeSingle();
  return (data as Article) ?? null;
}

// ---- Admin ----
export async function adminGetArticles(status?: string): Promise<Article[]> {
  const db = createAdminClient();
  let q = db.from("articles").select(ARTICLE_COLS).order("updated_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []) as Article[];
}

export async function adminGetArticle(id: string): Promise<Article | null> {
  const db = createAdminClient();
  const { data } = await db.from("articles").select(ARTICLE_COLS).eq("id", id).maybeSingle();
  return (data as Article) ?? null;
}

export async function adminGetLeads(status?: string): Promise<Lead[]> {
  const db = createAdminClient();
  let q = db.from("leads").select("*").order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []) as Lead[];
}

export async function adminGetUsers(): Promise<Profile[]> {
  const db = createAdminClient();
  const { data } = await db.from("profiles").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Profile[];
}

export async function adminGetCounts() {
  const db = createAdminClient();
  const [pending, newLeads, users, published] = await Promise.all([
    db.from("articles").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    db.from("profiles").select("id", { count: "exact", head: true }),
    db.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);
  return {
    pending: pending.count ?? 0,
    newLeads: newLeads.count ?? 0,
    users: users.count ?? 0,
    published: published.count ?? 0,
  };
}

export async function adminGetContentOverrides(): Promise<Record<string, string>> {
  const db = createAdminClient();
  const { data } = await db.from("site_content").select("key,value");
  const out: Record<string, string> = {};
  for (const r of data ?? []) out[r.key] = r.value;
  return out;
}
