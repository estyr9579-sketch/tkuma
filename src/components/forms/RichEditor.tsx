"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import { useCallback, useRef, useState } from "react";
import { uploadImage } from "@/actions/articles";

/**
 * Simple rich-text editor (Tiptap). Emits HTML through a hidden input named `content`.
 * The server sanitizes the HTML again before saving.
 */
export function RichEditor({ name = "content", initialHtml = "" }: { name?: string; initialHtml?: string }) {
  const [html, setHtml] = useState(initialHtml);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }), ImageExt.configure({ inline: false })],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: { attributes: { class: "tiptap prose-he", dir: "rtl", "aria-label": "תוכן המאמר" } },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  const onPickImage = useCallback(async (file: File) => {
    if (!editor) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    setUploading(false);
    if (!res.ok) return setError(res.error);
    editor.chain().focus().setImage({ src: res.url ?? "", alt: "" }).run();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("כתובת הקישור (https://…)");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return <div className="min-h-90 border border-stone bg-mist" aria-busy="true" />;

  const btn = (active: boolean) =>
    `rounded-sm px-2.5 py-1 text-sm ${active ? "bg-navy text-white" : "text-ink hover:bg-mist"}`;

  return (
    <div className="border border-stone bg-white">
      <div role="toolbar" aria-label="עיצוב טקסט" className="flex flex-wrap gap-1 border-b border-stone bg-mist p-2">
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} aria-pressed={editor.isActive("bold")}><strong>מודגש</strong></button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-pressed={editor.isActive("italic")}><em>נטוי</em></button>
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-pressed={editor.isActive("heading", { level: 2 })}>כותרת</button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-pressed={editor.isActive("heading", { level: 3 })}>כותרת משנה</button>
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-pressed={editor.isActive("bulletList")}>רשימה</button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-pressed={editor.isActive("orderedList")}>רשימה ממוספרת</button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-pressed={editor.isActive("blockquote")}>ציטוט</button>
        <button type="button" className={btn(editor.isActive("link"))} onClick={addLink}>קישור</button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()}>קו מפריד</button>
        <button type="button" className={btn(false)} onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "מעלה…" : "תמונה"}</button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" aria-label="בחירת תמונה להוספה" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickImage(f); e.target.value = ""; }} />
      </div>
      <EditorContent editor={editor} />
      {error && <p role="alert" className="border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{error}</p>}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
