export type UserRole = "user" | "writer" | "admin";
export type ArticleKind = "site" | "expert";
export type ArticleStatus = "draft" | "pending" | "needs_changes" | "rejected" | "approved" | "published";
export type LeadStatus = "new" | "in_progress" | "contacted" | "closed";

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: UserRole;
  is_blocked: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  kind: ArticleKind;
  status: ArticleStatus;
  created_by: string | null;
  display_author_name: string;
  display_author_bio: string;
  display_author_image: string | null;
  display_author_link: string | null;
  admin_note: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: { name: string; slug: string } | null;
}

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  message: string;
  status: LeadStatus;
  admin_note: string;
  created_at: string;
}

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: "טיוטה",
  pending: "ממתין לאישור",
  needs_changes: "הוחזר לעריכה",
  rejected: "נדחה",
  approved: "אושר (לא פורסם)",
  published: "פורסם",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "חדש",
  in_progress: "בטיפול",
  contacted: "חזרנו ללקוח",
  closed: "נסגר",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "משתמש",
  writer: "כותב",
  admin: "מנהל",
};

export type ActionResult = { ok: true; message?: string; id?: string } | { ok: false; error: string };
