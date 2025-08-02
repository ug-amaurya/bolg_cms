import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Calendar, User, MessageSquare } from "lucide-react";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    publishedAt: Date | null;
    author: {
      name: string | null;
      image: string | null;
    };
    categories: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    _count: {
      comments: number;
    };
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.featuredImage && (
        <div className="relative h-48 w-full">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {post.author.name}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {post.publishedAt && formatDate(new Date(post.publishedAt))}
            </div>
          </div>

          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            {post._count.comments}
          </div>
        </div>
      </div>
    </article>
  );
}
