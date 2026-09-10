"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { isValidIsraeliPhone } from "@/lib/utils";
import { assertAdmin } from "@/lib/auth";
import type { ActionResult, LeadStatus } from "@/lib/types";

const leadSchema = z.object({
  full_name: z.string().trim().min(2, "יש להזין שם מלא").max(80, "השם ארוך מדי"),
  phone: z.string().trim().refine(isValidIsraeliPhone, "יש להזין מספר טלפון ישראלי תקין"),
  message: z.string().trim().max(1000, "ההודעה ארוכה מדי (עד 1000 תווים)").default(""),
  consent: z.literal("on", { error: "יש לאשר את תנאי השימוש ומדיניות הפרטיות" }),
  website: z.string().max(0).optional(), // honeypot – must stay empty
});

export async function submitLead(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return { ok: true }; // bot – pretend success, store nothing
  }
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`lead:${ip}`, 5, 10 * 60 * 1000)) {
    return { ok: false, error: "נשלחו יותר מדי פניות. נסו שוב מאוחר יותר." };
  }

  const db = createAdminClient();
  const { error } = await db.from("leads").insert({
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
    message: parsed.data.message,
  });
  if (error) return { ok: false, error: "אירעה שגיאה בשמירה. נסו שוב." };

  await notifyAdmin(parsed.data.full_name, parsed.data.phone, parsed.data.message);
  revalidatePath("/admin/leads");
  return { ok: true };
}

async function notifyAdmin(name: string, phone: string, message: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "leads@resend.dev",
        to,
        subject: `פנייה חדשה מהאתר – ${name}`,
        text: `שם: ${name}\nטלפון: ${phone}\nהודעה: ${message || "-"}`,
      }),
    });
  } catch {
    // notification is best-effort
  }
}

export async function updateLead(id: string, status: LeadStatus, admin_note: string): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const db = createAdminClient();
  const { error } = await db.from("leads").update({ status, admin_note: admin_note.slice(0, 2000) }).eq("id", id);
  if (error) return { ok: false, error: "השמירה נכשלה" };
  revalidatePath("/admin/leads");
  return { ok: true, message: "נשמר" };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const db = createAdminClient();
  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: "המחיקה נכשלה" };
  revalidatePath("/admin/leads");
  return { ok: true, message: "נמחק" };
}
