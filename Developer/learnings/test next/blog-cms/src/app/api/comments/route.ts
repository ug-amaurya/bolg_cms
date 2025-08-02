import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, postId, parentId } = await request.json();

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      parentId: parentId || null,
      authorId: session.user.id,
      status: "APPROVED", // Auto-approve for now, implement moderation later
    },
    include: {
      author: { select: { name: true, image: true } },
    },
  });

  return Response.json(comment, { status: 201 });
}
