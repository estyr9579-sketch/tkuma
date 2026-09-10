"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveMyArticle, adminSaveArticle } from "@/actions/articles";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Input, Select, Textarea } from "@/components/ui/Field";
import { RichEditor } from "@/components/forms/RichEditor";
import { ImageField } from "@/components/forms/ImageField";
import type { ActionResult, Article, ArticleStatus, Category } from "@/lib/types";

type Mode = "writer" | "admin";

/**
 * One form for both the writer (personal area) and the admin.
 * Writer: save draft / submit for approval.
 * Admin: save as draft / publish / unpublish; can set display author + kind + note.
 */
export function ArticleForm({ mode, article, categories, defaultAuthorName = "" }: { mode: Mode; article?: Article | null; categories: Category[]; defaultAuthorName?: string }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  function submitWith(status: ArticleStatus | "submit" | "draft") {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      const form = e.currentTarget.form;
      if (!form) return;
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      start(async () => {
        let res: ActionResult;
        if (mode === "writer") res = await saveMyArticle(article?.id ?? null, fd, status === "submit");
        else res = await adminSaveArticle(article?.id ?? null, fd, status as ArticleStatus);
        setResult(res);
        if (res.ok) {
          const base = mode === "writer" ? "/account/articles" : "/admin/articles";
          if (!article?.id && res.id) router.replace(`${base}/${res.id}`);
          router.refresh();
        }
      });
    };
  }

  const canEdit = mode === "admin" || !article || ["draft", "needs_changes", "rejected", "pending"].includes(article.status);

  return (
    <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
      {article?.admin_note && mode === "writer" && (
        <div className="border-r-2 border-gold-accent bg-mist p-4 text-sm">
          <p className="font-medium text-navy">הערת המנהל</p>
          <p className="mt-1 whitespace-pre-line text-ink/85">{article.admin_note}</p>
        </div>
      )}

      <Field id="title" label="כותרת" required>
        <Input id="title" name="title" required minLength={3} maxLength={150} defaultValue={article?.title ?? ""} />
      </Field>

      <Field id="excerpt" label="תקציר" hint="2–3 משפטים שמופיעים בכרטיס המאמר ובתוצאות חיפוש (עד 400 תווים).">
        <Textarea id="excerpt" name="excerpt" maxLength={400} defaultValue={article?.excerpt ?? ""} aria-describedby="excerpt-hint" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="category_id" label="קטגוריה">
          <Select id="category_id" name="category_id" defaultValue={article?.category_id ?? ""}>
            <option value="">ללא קטגוריה</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </Field>
        {mode === "admin" && (
          <Field id="kind" label="סוג מאמר">
            <Select id="kind" name="kind" defaultValue={article?.kind ?? "site"}>
              <option value="site">מאמר של האתר</option>
              <option value="expert">מאמר מומחה</option>
            </Select>
          </Field>
        )}
      </div>

      <ImageField name="cover_image_url" label="תמונה ראשית" initialUrl={article?.cover_image_url} />

      <div>
        <p className="mb-1.5 text-sm font-medium text-navy">תוכן המאמר</p>
        <RichEditor initialHtml={article?.content ?? ""} />
      </div>

      <fieldset className="space-y-5 border-t border-stone pt-7">
        <legend className="mb-2 text-lg text-navy">המחבר המוצג באתר</legend>
        <p className="text-sm text-slate">
          {mode === "admin" ? "אפשר לפרסם מאמר בשם אדם אחר (למשל איש מקצוע ללא חשבון). השדות מתייחסים למחבר כפי שיוצג לקוראים." : "כך יוצג שמך לצד המאמר."}
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="display_author_name" label="שם המחבר">
            <Input id="display_author_name" name="display_author_name" maxLength={100} defaultValue={article?.display_author_name || defaultAuthorName} />
          </Field>
          <Field id="display_author_link" label="קישור לאתר (לא חובה)">
            <Input id="display_author_link" name="display_author_link" type="url" dir="ltr" className="text-right" placeholder="https://" defaultValue={article?.display_author_link ?? ""} />
          </Field>
        </div>
        <Field id="display_author_bio" label="ביוגרפיה קצרה">
          <Textarea id="display_author_bio" name="display_author_bio" maxLength={600} defaultValue={article?.display_author_bio ?? ""} />
        </Field>
        <ImageField name="display_author_image" label="תמונת המחבר" initialUrl={article?.display_author_image} round />
      </fieldset>

      {mode === "admin" && (
        <Field id="admin_note" label="הערה לכותב (מוצגת לו באזור האישי)">
          <Textarea id="admin_note" name="admin_note" maxLength={2000} defaultValue={article?.admin_note ?? ""} />
        </Field>
      )}

      <FormMessage result={result} />

      {!canEdit ? (
        <p className="text-sm text-slate">המאמר אושר. לשינויים יש לפנות למנהל האתר.</p>
      ) : mode === "writer" ? (
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={pending} onClick={submitWith("draft")}>שמירת טיוטה</Button>
          <Button type="button" disabled={pending} onClick={submitWith("submit")}>{pending ? "שומר…" : "שליחה לאישור"}</Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={pending} onClick={submitWith("draft")}>שמירה כטיוטה</Button>
          {article && article.status !== "published" && article.created_by && (
            <Button type="button" variant="secondary" disabled={pending} onClick={submitWith("needs_changes")}>החזרה לעריכה</Button>
          )}
          <Button type="button" disabled={pending} onClick={submitWith("published")}>{pending ? "שומר…" : "שמירה ופרסום"}</Button>
          {article?.status === "published" && (
            <Button type="button" variant="ghost" disabled={pending} onClick={submitWith("approved")}>ביטול פרסום</Button>
          )}
        </div>
      )}
    </form>
  );
}
