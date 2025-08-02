import { User, Post, Category, Tag, Comment } from "@prisma/client";

export type PostWithRelations = Post & {
  author: User;
  categories: Category[];
  tags: Tag[];
  comments: Comment[];
  _count: {
    comments: number;
  };
};

export type CommentWithAuthor = Comment & {
  author: User | null;
  replies: CommentWithAuthor[];
};

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: "DRAFT" | "PUBLISHED";
  categories: string[];
  tags: string[];
}
