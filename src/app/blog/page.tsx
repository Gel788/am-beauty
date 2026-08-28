import type { Metadata } from "next";
import Link from "next/link";
import { getPublicCatalog } from "@/lib/catalog/runtime";

export const metadata: Metadata = {
  title: "Блог",
  description: "Гид по уходу за кожей от AM Beauty.",
};

export default async function BlogPage() {
  const { blog } = await getPublicCatalog();

  return (
    <div className="container-page section-pad">
      <div className="text-center">
        <p className="label-caps">Блог</p>
        <h1 className="headline-xl mt-4">Гид по уходу</h1>
      </div>
      <div className="mx-auto mt-16 max-w-3xl divide-y divide-border">
        {blog.map((post) => (
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
