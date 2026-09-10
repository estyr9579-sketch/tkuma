import { adminGetContentOverrides } from "@/lib/data";
import { CONTENT } from "@/lib/content";
import { ContentEditor } from "@/components/admin/ContentEditor";

export default async function AdminContentPage() {
  const overrides = await adminGetContentOverrides();
  const fields = Object.entries(CONTENT).map(([key, f]) => ({ key, label: f.label, page: f.page, multiline: !!f.multiline, value: overrides[key] ?? f.default, isDefault: !(key in overrides) }));
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl text-navy">טקסטים באתר</h1>
      <p className="mt-2 text-sm text-slate">כל טקסט באתר ניתן לעריכה כאן ללא צורך במתכנת. השאירו שדה ריק כדי לחזור לטקסט המקורי. ברשימות – כל שורה היא פריט.</p>
      <div className="mt-8">
        <ContentEditor fields={fields} />
      </div>
    </div>
  );
}
