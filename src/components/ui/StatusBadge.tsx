import { ARTICLE_STATUS_LABELS, LEAD_STATUS_LABELS, type ArticleStatus, type LeadStatus } from "@/lib/types";

const articleColors: Record<ArticleStatus, string> = {
  draft: "bg-stone text-ink",
  pending: "bg-amber-100 text-amber-900",
  needs_changes: "bg-orange-100 text-orange-900",
  rejected: "bg-red-100 text-red-900",
  approved: "bg-sky-100 text-sky-900",
  published: "bg-green-100 text-green-900",
};
const leadColors: Record<LeadStatus, string> = {
  new: "bg-amber-100 text-amber-900",
  in_progress: "bg-sky-100 text-sky-900",
  contacted: "bg-green-100 text-green-900",
  closed: "bg-stone text-ink",
};

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  return <span className={`inline-block rounded-sm px-2.5 py-1 text-xs font-medium ${articleColors[status]}`}>{ARTICLE_STATUS_LABELS[status]}</span>;
}
export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`inline-block rounded-sm px-2.5 py-1 text-xs font-medium ${leadColors[status]}`}>{LEAD_STATUS_LABELS[status]}</span>;
}
