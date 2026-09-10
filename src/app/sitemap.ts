import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
import { getPublishedArticles } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const statics = ["", "/about", "/process", "/articles", "/experts", "/roadmap", "/contact", "/privacy", "/terms", "/accessibility", "/disclosure"];
  let site: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  let experts: typeof site = [];
  try {
    [site, experts] = await Promise.all([getPublishedArticles("site"), getPublishedArticles("expert")]);
  } catch {
    // DB not configured yet
  }
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...[...site, ...experts].map((a) => ({ url: `${base}/articles/${a.slug}`, lastModified: a.updated_at, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
