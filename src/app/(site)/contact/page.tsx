import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = { title: "צור קשר", description: "השאירו פרטים ונחזור אליכם לשיחה ראשונית קצרה." };

export default async function ContactPage() {
  const c = await getContent();
  return (
    <>
      <PageHeader title={c["contact.title"]} intro={c["contact.text"]} />
      <Container className="py-10 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="max-w-xl">
            <ContactForm submitLabel={c["contact.submit"]} consentText={c["contact.consent"]} successTitle={c["contact.success.title"]} successText={c["contact.success.text"]} />
          </div>
          <aside className="space-y-6 border-r border-stone pr-8 text-[15px] leading-7 text-ink/85">
            {(c["site.phone"] || c["site.email"]) && (
              <div>
                <h2 className="text-xl text-navy">דרכים נוספות ליצירת קשר</h2>
                <ul className="mt-3 space-y-1">
                  {c["site.phone"] && <li><a href={`tel:${c["site.phone"]}`} className="underline underline-offset-4" dir="ltr">{c["site.phone"]}</a></li>}
                  {c["site.email"] && <li><a href={`mailto:${c["site.email"]}`} className="underline underline-offset-4">{c["site.email"]}</a></li>}
                </ul>
              </div>
            )}
            <div>
              <h2 className="text-xl text-navy">מה קורה אחרי שמשאירים פרטים?</h2>
              <p className="mt-3">נחזור אליכם לשיחה ראשונית קצרה, כדי להבין במה מדובר ולבדוק יחד אם השירות יכול לעזור. אין התחייבות.</p>
            </div>
            <div className="text-slate">
              <p>{c["notice.emergency"]}</p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
