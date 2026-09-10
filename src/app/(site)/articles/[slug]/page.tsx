import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticleBySlug } from "@/lib/data";
import { getContent } from "@/lib/content";
import { formatDate, siteUrl } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/site/CtaBand";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getPublishedArticleBySlug(slug);
  if (!a) return { title: "המאמר לא נמצא" };
  return {
    title: a.title,
    description: a.excerpt || undefined,
    openGraph: { type: "article", title: a.title, description: a.excerpt || undefined, images: a.cover_image_url ? [a.cover_image_url] : undefined, publishedTime: a.published_at ?? undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [a, c] = await Promise.all([getPublishedArticleBySlug(slug), getContent()]);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.published_at,
    dateModified: a.updated_at,
    image: a.cover_image_url ?? undefined,
    author: a.display_author_name ? { "@type": "Person", name: a.display_author_name } : { "@type": "Organization", name: c["site.name"] },
    publisher: { "@type": "Organization", name: c["site.name"] },
    mainEntityOfPage: `${siteUrl()}/articles/${a.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="bg-navy text-white">
          <Container narrow className="py-16 sm:py-20">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gold-light">
              <Link href={a.kind === "expert" ? "/experts" : "/articles"} className="hover:underline underline-offset-4">{a.kind === "expert" ? c["experts.title"] : c["articles.title"]}</Link>
              {a.categories?.name && <span>{a.categories.name}</span>}
              {a.published_at && <time dateTime={a.published_at}>{formatDate(a.published_at)}</time>}
            </div>
            <h1 className="mt-5 text-3xl leading-tight sm:text-5xl">{a.title}</h1>
            {a.excerpt && <p className="mt-6 text-lg text-white/80">{a.excerpt}</p>}
          </Container>
        </header>

        <Container narrow className="py-12 sm:py-16">
          {a.cover_image_url && (
            <div className="relative -mt-24 mb-12 aspect-[16/9] overflow-hidden bg-mist shadow-soft sm:-mt-28">
              <Image src={a.cover_image_url} alt="" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          )}
          <div className="prose-he" dangerouslySetInnerHTML={{ __html: a.content }} />

          {a.display_author_name && (
            <aside aria-label="על הכותב" className="mt-16 flex gap-5 border-t border-stone pt-8">
              {a.display_author_image && (
                <Image src={a.display_author_image} alt="" width={72} height={72} className="h-18 w-18 shrink-0 rounded-full object-cover" />
              )}
              <div>
                <p className="text-sm text-slate">מאת</p>
                <p className="text-xl text-navy">{a.display_author_name}</p>
                {a.display_author_bio && <p className="mt-2 text-[15px] leading-7 text-ink/85">{a.display_author_bio}</p>}
                {a.display_author_link && (
                  <a href={a.display_author_link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-navy underline underline-offset-4">
                    לאתר של {a.display_author_name}
                  </a>
                )}
              </div>
            </aside>
          )}
        </Container>
      </article>
      <CtaBand />
    </>
  );
}
