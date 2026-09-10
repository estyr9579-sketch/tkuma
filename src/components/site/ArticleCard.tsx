import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ article, showAuthor = false }: { article: Article; showAuthor?: boolean }) {
  const href = `/articles/${article.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden border border-stone bg-white">
      <Link href={href} className="relative block aspect-[16/10] bg-mist" aria-hidden="true" tabIndex={-1}>
        {article.cover_image_url ? (
          <Image src={article.cover_image_url} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="h-px w-16 bg-gold-accent" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate">
          {article.categories?.name && <span className="text-gold">{article.categories.name}</span>}
          {article.published_at && <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>}
        </div>
        <h3 className="text-xl text-navy">
          <Link href={href} className="hover:underline underline-offset-4">{article.title}</Link>
        </h3>
        {showAuthor && article.display_author_name && <p className="mt-2 text-sm text-slate">מאת {article.display_author_name}</p>}
        {article.excerpt && <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-ink/80">{article.excerpt}</p>}
        <div className="mt-auto pt-5">
          <Link href={href} className="text-sm font-medium text-navy underline-offset-4 hover:underline" aria-label={`קרא עוד: ${article.title}`}>
            קרא עוד
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleGrid({ articles, showAuthor = false, emptyText = "עדיין אין מאמרים בקטגוריה זו." }: { articles: Article[]; showAuthor?: boolean; emptyText?: string }) {
  if (!articles.length) return <p className="py-16 text-center text-slate">{emptyText}</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => <ArticleCard key={a.id} article={a} showAuthor={showAuthor} />)}
    </div>
  );
}
