import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, email: true } },
      categories: true,
      tags: true,
      _count: { select: { comments: true } },
    },
  });

  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  return Response.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const post = await prisma.post.update({
    where: { id: params?.id },
    data: {
      title,
      content,
      excerpt,
      featuredImage,
      status,
      publishedAt:
        status === "PUBLISHED" &&
        !(await prisma.post.findFirst({
          where: { id: params.id, publishedAt: { not: null } },
        }))
          ? new Date()
          : undefined,
      categories: {
        set: [],
        connect: categoryIds?.map((id: string) => ({ id })) || [],
      },
      tags: {
        set: [],
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

  return Response.json(post);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.post.delete({
    where: { id: params.id },
  });

  return Response.json({ success: true });
}
