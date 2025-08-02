// "use client";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/blog/BlogCard";
import SearchBar from "@/components/blog/SearchBar";
import CategoryFilter from "@/components/blog/CategoryFilter";
import Pagination from "@/components/ui/Pagination";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
  }>;
}

async function getBlogData(searchParams: BlogPageProps["searchParams"]) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 9;
  const search = params.search;
  const categoryId = params.category;

  const where: any = { status: "PUBLISHED" };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categories = {
      some: { id: categoryId },
    };
  }

  const [posts, totalPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true, image: true } },
        categories: true,
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total: totalPosts,
      pages: Math.ceil(totalPosts / limit),
    },
    categories,
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { posts, pagination, categories } = await getBlogData(searchParams);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover insights, tutorials, and stories from our community of
          writers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-8">
            <SearchBar />
            <CategoryFilter categories={categories} />
          </div>
        </aside>

        <main className="lg:col-span-3">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  baseUrl="/blog"
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found.</p>
              {(await searchParams).search && (
                <p className="text-gray-400 mt-2">
                  Try adjusting your search terms or filters.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
