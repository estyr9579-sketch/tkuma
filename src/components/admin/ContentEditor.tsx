"use client";

import { useActionState, useMemo, useState } from "react";
import { adminSaveContent } from "@/actions/admin";
import { Button } from "@/components/ui/Button";
import { FormMessage, Input, Textarea } from "@/components/ui/Field";

type F = { key: string; label: string; page: string; multiline: boolean; value: string; isDefault: boolean };

export function ContentEditor({ fields }: { fields: F[] }) {
  const pages = useMemo(() => Array.from(new Set(fields.map((f) => f.page))), [fields]);
  const [page, setPage] = useState(pages[0]);
  const [state, action, pending] = useActionState(adminSaveContent, null);
  const visible = fields.filter((f) => f.page === page);

  return (
    <form action={action}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="עמודים">
        {pages.map((p) => (
          <button key={p} type="button" role="tab" aria-selected={page === p} onClick={() => setPage(p)} className={`rounded-sm border px-3 py-1.5 text-sm ${page === p ? "border-navy bg-navy text-white" : "border-stone bg-white hover:border-navy"}`}>{p}</button>
        ))}
      </div>

      {/* All fields are rendered (hidden when not on the active tab) so one save covers every page */}
      <div className="mt-6 space-y-6 border border-stone bg-white p-6">
        {fields.map((f) => (
          <div key={f.key} hidden={f.page !== page}>
            <label htmlFor={`c-${f.key}`} className="mb-1.5 flex items-center gap-2 text-sm font-medium text-navy">
              {f.label}
              {!f.isDefault && <span className="rounded-sm bg-gold/15 px-1.5 py-0.5 text-[11px] font-normal text-gold">שונה מהמקור</span>}
            </label>
            {f.multiline ? (
              <Textarea id={`c-${f.key}`} name={f.key} defaultValue={f.value} rows={Math.min(14, Math.max(3, f.value.split("\n").length + 1))} />
            ) : (
              <Input id={`c-${f.key}`} name={f.key} defaultValue={f.value} />
            )}
          </div>
        ))}
        {visible.length === 0 && <p className="text-slate">אין שדות בעמוד זה.</p>}
      </div>

      <div className="sticky bottom-0 mt-6 flex items-center gap-4 border-t border-stone bg-mist py-4">
        <Button type="submit" disabled={pending}>{pending ? "שומר…" : "שמירת כל השינויים"}</Button>
        <FormMessage result={state} />
      </div>
    </form>
  );
}
