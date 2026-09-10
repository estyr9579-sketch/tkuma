"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { adminDeleteUser, adminSetUserBlocked, adminSetUserRole } from "@/actions/admin";
import { ROLE_LABELS, type Profile, type UserRole } from "@/lib/types";

export function UserRow({ user, isSelf, joined }: { user: Profile; isSelf: boolean; joined: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const cls = "text-xs underline underline-offset-4 disabled:opacity-50";

  return (
    <tr className={user.is_blocked ? "bg-red-50/60" : ""}>
      <td className="px-4 py-3">{user.full_name || "—"}{isSelf && <span className="mr-2 text-xs text-gold">(אני)</span>}</td>
      <td className="px-4 py-3" dir="ltr"><span className="block text-right">{user.email}</span></td>
      <td className="px-4 py-3" dir="ltr"><span className="block text-right">{user.phone}</span></td>
      <td className="px-4 py-3 text-slate">{joined}</td>
      <td className="px-4 py-3">
        {isSelf || user.role === "admin" ? (
          <span>{ROLE_LABELS[user.role]}</span>
        ) : (
          <>
            <label htmlFor={`role-${user.id}`} className="sr-only">הרשאה</label>
            <select id={`role-${user.id}`} value={user.role} disabled={pending} className="rounded-sm border border-stone px-2 py-1 text-sm" onChange={(e) => start(async () => { await adminSetUserRole(user.id, e.target.value as UserRole); router.refresh(); })}>
              <option value="writer">{ROLE_LABELS.writer}</option>
              <option value="user">{ROLE_LABELS.user}</option>
            </select>
          </>
        )}
        {user.is_blocked && <span className="mr-2 text-xs text-red-700">חסום</span>}
      </td>
      <td className="px-4 py-3">
        {!isSelf && user.role !== "admin" && (
          <div className="flex gap-3">
            <button type="button" disabled={pending} className={`${cls} ${user.is_blocked ? "text-green-800" : "text-orange-800"}`} onClick={() => start(async () => { await adminSetUserBlocked(user.id, !user.is_blocked); router.refresh(); })}>{user.is_blocked ? "הסרת חסימה" : "חסימה"}</button>
            <button type="button" disabled={pending} className={`${cls} text-red-700`} onClick={() => { if (confirm(`למחוק את המשתמש ${user.email}? המאמרים שלו יישארו ללא שיוך.`)) start(async () => { await adminDeleteUser(user.id); router.refresh(); }); }}>מחיקה</button>
          </div>
        )}
      </td>
    </tr>
  );
}
