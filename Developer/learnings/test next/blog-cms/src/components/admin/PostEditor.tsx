"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { Save, Eye, ArrowLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface PostEditorProps {
  postId?: string;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    status: "DRAFT",
    categoryIds: [] as string[],
    tagNames: [] as string[],
  });

  useEffect(() => {
    fetchCategories();
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const post = await response.json();
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        featuredImage: post.featuredImage || "",
        status: post.status,
        categoryIds: post.categories.map((c: Category) => c.id),
        tagNames: post.tags.map((t: any) => t.name),
      });
    } catch (error) {
      console.error("Failed to fetch post:", error);
    }
  };

  const handleSubmit = async (status: string) => {
    setLoading(true);
    try {
      const url = postId ? `/api/posts/${postId}` : "/api/posts";
      const method = postId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status }),
      });

      if (response.ok) {
        router.push("/admin/posts");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save post");
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {postId ? "Edit Post" : "New Post"}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Input
              placeholder="Post title..."
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              className="text-2xl font-bold border-none shadow-none text-gray-900 placeholder-gray-400 px-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => updateFormData("content", content)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              placeholder="Brief description of your post..."
              value={formData.excerpt}
              onChange={(e) => updateFormData("excerpt", e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900 mb-4">Publish</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateFormData("status", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleSubmit("DRAFT")}
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSubmit("PUBLISHED")}
                  disabled={loading}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900 mb-4">Featured Image</h3>
            <Input
              placeholder="Image URL..."
              value={formData.featuredImage}
              onChange={(e) => updateFormData("featuredImage", e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={(e) => {
                      const categoryIds = e.target.checked
                        ? [...formData.categoryIds, category.id]
                        : formData.categoryIds.filter(
                            (id) => id !== category.id
                          );
                      updateFormData("categoryIds", categoryIds);
                    }}
                    className="mr-2"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900 mb-4">Tags</h3>
            <Input
              placeholder="Add tags (comma separated)..."
              value={formData.tagNames.join(", ")}
              onChange={(e) =>
                updateFormData(
                  "tagNames",
                  e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
