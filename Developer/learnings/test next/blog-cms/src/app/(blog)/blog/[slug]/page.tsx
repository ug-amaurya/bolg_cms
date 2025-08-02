import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import CommentSection from "@/components/comments/CommentSection";
// import RelatedPosts from "@/components/blog/RelatedPosts";
// import ShareButtons from "@/components/blog/ShareButtons";
import { Calendar, User, Tag, Folder } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      author: { select: { name: true, image: true, bio: true } },
      categories: true,
      tags: true,
      comments: {
        where: { status: "APPROVED" },
        include: {
          author: { select: { name: true, image: true } },
          replies: {
            include: {
              author: { select: { name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (post) {
    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  }

  return post;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.featuredImage ? [post.featuredImage] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name || "Unknown Author"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200"
            >
              <Folder className="w-3 h-3 mr-1" />
              {category.name}
            </Link>
          ))}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-gray-200">
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
              )}
              <User className="w-4 h-4 mr-1" />
              <span className="font-medium">{post.author.name}</span>
            </div>

            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {post.publishedAt && formatDate(new Date(post.publishedAt))}
            </div>

            <div className="text-sm">{post.views} views</div>
          </div>

          {/* <ShareButtons
            title={post.title}
            url={`${process.env.NEXTAUTH_URL}/blog/${post.slug}`}
          /> */}
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.name}`}
                className="inline-flex items-center bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      {post.author.bio && (
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <div className="flex items-start space-x-4">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name || "Author"}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                About {post.author.name}
              </h3>
              <p className="text-gray-600">{post.author.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentSection postId={post.id} comments={post.comments} />

      {/* Related Posts */}
      {/* <RelatedPosts currentPostId={post.id} categories={post.categories} /> */}
    </article>
  );
}
