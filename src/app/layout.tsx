import type { Metadata } from "next";
import "./globals.css";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: c["site.name"], template: `%s | ${c["site.name"]}` },
    description: c["site.tagline"],
    openGraph: { type: "website", locale: "he_IL", siteName: c["site.name"], title: c["site.name"], description: c["site.tagline"] },
    robots: { index: true, follow: true },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;600&family=Heebo:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="skip-link">דילוג לתוכן הראשי</a>
        {children}
      </body>
    </html>
  );
}
