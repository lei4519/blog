import { source } from "@/lib/source";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lex's Blog - 首页",
  description: "分享、记录技术与生活",
  alternates: {
    canonical: "https://lei4519.github.io/blog",
  },
};

export default function HomePage() {
  const pages = source
    .getPages()
    .filter((page) => page.path !== "index.mdx")
    .sort((a, b) => {
      const dateA = a.data.created || new Date(0);
      const dateB = b.data.created || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <main className="container max-w-4xl py-12 px-4 mx-auto">
      <h1 className="text-3xl font-bold mb-2">Lex&apos;s Blog</h1>
      <p className="text-fd-muted-foreground mb-8">{metadata.description}</p>

      <section>
        <h2 className="text-xl font-semibold mb-4">最新文章</h2>
        <ul className="space-y-3">
          {pages.map((page, i) => (
            <li
              key={page.url}
              className={`flex justify-between gap-4 items-baseline ${i > 20 ? "hidden" : ""}`}
            >
              <Link
                href={page.url}
                className="text-fd-foreground hover:text-fd-primary transition-colors truncate"
              >
                {page.data.title}
              </Link>
              <time className="text-sm text-fd-muted-foreground font-mono flex-none">
                {page.data.created?.toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>

        {pages.length > 20 && (
          <div className="mt-8 text-center">
            <Link href="/docs" className="text-fd-primary hover:underline">
              查看全部 {pages.length} 篇文章 →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
