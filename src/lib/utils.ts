import slugify from "slugify";

export function makeSlug(title: string) {
  const s = slugify(title, { lower: true, strict: true, locale: "he" });
  // Hebrew titles produce an empty latin slug – fall back to a readable random id
  return (s && s.length > 2 ? s : "article") + "-" + Math.random().toString(36).slice(2, 8);
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export function isValidIsraeliPhone(p: string) {
  const d = p.replace(/[^0-9]/g, "");
  return /^0(5[0-9]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/.test(d) || /^972[0-9]{8,9}$/.test(d);
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
