"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteMyArticle } from "@/actions/articles";

export function DeleteMyArticleButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-sm text-red-700 underline underline-offset-4 disabled:opacity-50"
      onClick={() => {
        if (!confirm("למחוק את המאמר? פעולה זו אינה ניתנת לביטול.")) return;
        start(async () => {
          await deleteMyArticle(id);
          router.refresh();
        });
      }}
    >
      מחיקה
    </button>
  );
}
