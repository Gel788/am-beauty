import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Блог",
  description: "Гид по уходу за кожей от AM Beauty.",
};

const posts = [
  {
    slug: "ritual-triple",
    title: "Три сыворотки — один ритуал: как сочетать AM Beauty",
    excerpt: "Ночь, утро и восстановление: пошаговый гид для идеального ухода.",
    date: "2026-07-01",
  },
  {
    slug: "spf-everyday",
    title: "SPF каждый день: почему это важнее сыворотки",
    excerpt: "Разбираем мифы и показываем, как вписать защиту в утренний ритуал.",
    date: "2026-06-12",
  },
  {
    slug: "sensitive-skin",
    title: "Чувствительная кожа: с чего начать",
    excerpt: "Минималистичный набор из трёх продуктов для спокойной кожи.",
    date: "2026-05-20",
  },
];

export default function BlogPage() {
  return (
    <div className="container-page section-pad">
      <div className="text-center">
        <p className="label-caps">Блог</p>
        <h1 className="headline-xl mt-4">Гид по уходу</h1>
      </div>
      <div className="mx-auto mt-16 max-w-3xl divide-y divide-border">
        {posts.map((post) => (
          <article key={post.slug} className="py-10">
            <time className="text-[10px] tracking-[0.24em] text-grey uppercase">{post.date}</time>
            <h2 className="headline-lg mt-4 !text-left !normal-case">
              <Link href={`/blog/${post.slug}`} className="transition-opacity hover:opacity-50">
                {post.title}
              </Link>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-grey">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="link-underline mt-6 inline-block">
              Читать
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
