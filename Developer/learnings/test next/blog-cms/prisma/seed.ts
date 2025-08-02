import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@blogcms.com" },
    update: {},
    create: {
      email: "admin@blogcms.com",
      name: "Admin User",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  // Create categories
  const tech = await prisma.category.upsert({
    where: { slug: "technology" },
    update: {},
    create: {
      name: "Technology",
      slug: "technology",
      description: "Posts about technology and programming",
    },
  });

  const lifestyle = await prisma.category.upsert({
    where: { slug: "lifestyle" },
    update: {},
    create: {
      name: "Lifestyle",
      slug: "lifestyle",
      description: "Posts about lifestyle and personal development",
    },
  });

  // Create sample post
  const post = await prisma.post.upsert({
    where: { slug: "welcome-to-blogcms" },
    update: {},
    create: {
      title: "Welcome to BlogCMS",
      slug: "welcome-to-blogcms",
      content:
        "This is your first blog post! You can edit or delete this post from the admin dashboard.",
      excerpt: "Welcome to your new blog platform built with Next.js",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      categories: {
        connect: [{ id: tech.id }],
      },
    },
  });

  console.log("Seed data created:", { admin, tech, lifestyle, post });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
