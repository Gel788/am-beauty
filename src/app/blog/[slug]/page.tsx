import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicCatalog } from "@/lib/catalog/runtime";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { blog } = await getPublicCatalog();
  const post = blog.find((p) => p.slug === slug);
  if (!post) return { title: "Статья" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { blog } = await getPublicCatalog();
  const post = blog.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="container-narrow section-pad">
      <Link href="/blog" className="link-underline text-[10px] tracking-[0.2em] uppercase">
        ← Блог
      </Link>
      <time className="mt-8 block text-[10px] tracking-[0.24em] text-grey uppercase">
        {post.date}
      </time>
      <h1 className="headline-xl mt-4">{post.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-grey">{post.excerpt}</p>
      <div className="prose prose-neutral mt-12 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-grey">
        {post.body}
      </div>
    </article>
  );
}
