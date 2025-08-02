import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [postsCount, usersCount, commentsCount, publishedPosts] =
      await Promise.all([
        prisma.post.count(),
        prisma.user.count(),
        prisma.comment.count(),
        prisma.post.count({ where: { status: "PUBLISHED" } }),
      ]);

    return NextResponse.json({
      postsCount,
      usersCount,
      commentsCount,
      publishedPosts,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
