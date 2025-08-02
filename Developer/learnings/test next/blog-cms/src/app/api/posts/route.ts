import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: any = {};

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true, email: true } },
        categories: true,
        tags: true,
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return Response.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    content,
    excerpt,
    featuredImage,
    status,
    categoryIds,
    tagNames,
  } = body;

  const slug = generateSlug(title);

  // Check if slug exists
  const existingPost = await prisma.post.findUnique({ where: { slug } });
  if (existingPost) {
    return Response.json(
      { error: "A post with this title already exists" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId: session?.user?.id,
      categories: {
        connect: categoryIds?.map((id: string) => ({ id })) || [],
      },
      tags: {
        connectOrCreate:
          tagNames?.map((name: string) => ({
            where: { name },
            create: { name },
          })) || [],
      },
    },
    include: {
      author: { select: { name: true, email: true } },
      categories: true,
      tags: true,
    },
  });

  return Response.json(post, { status: 201 });
}
