"use client";

// app/admin/dashboard/page.tsx
import React from "react";
import {
  Users,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Calendar,
  BarChart3,
  PlusCircle,
  Settings,
  Bell,
} from "lucide-react";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number;
  change?: string;
  changeType?: "positive" | "negative";
}

export default function AdminDashboard() {
  // Mock data - replace with real data from your API
  const stats = {
    totalUsers: 1234,
    totalPosts: 89,
    totalComments: 456,
    totalViews: 12345,
    recentPosts: [
      {
        id: 1,
        title: "Getting Started with Next.js",
        author: "John Doe",
        date: "2024-01-15",
        status: "published",
      },
      {
        id: 2,
        title: "React Best Practices",
        author: "Jane Smith",
        date: "2024-01-14",
        status: "draft",
      },
      {
        id: 3,
        title: "TypeScript Tips",
        author: "Bob Johnson",
        date: "2024-01-13",
        status: "published",
      },
    ],
    recentComments: [
      {
        id: 1,
        content: "Great article! Very helpful.",
        author: "Alice Brown",
        post: "Getting Started with Next.js",
        date: "2024-01-15",
      },
      {
        id: 2,
        content: "Thanks for sharing this.",
        author: "Charlie Wilson",
        post: "React Best Practices",
        date: "2024-01-14",
      },
      {
        id: 3,
        content: "Looking forward to more content.",
        author: "Diana Miller",
        post: "TypeScript Tips",
        date: "2024-01-13",
      },
    ],
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
    changeType = "positive",
  }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value.toLocaleString()}
          </p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${
            title.includes("Users")
              ? "bg-blue-100"
              : title.includes("Posts")
                ? "bg-green-100"
                : title.includes("Comments")
                  ? "bg-yellow-100"
                  : "bg-purple-100"
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              title.includes("Users")
                ? "text-blue-600"
                : title.includes("Posts")
                  ? "text-green-600"
                  : title.includes("Comments")
                    ? "text-yellow-600"
                    : "text-purple-600"
            }`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            change="+12% from last month"
            changeType="positive"
          />
          <StatCard
            icon={FileText}
            title="Total Posts"
            value={stats.totalPosts}
            change="+8% from last month"
            changeType="positive"
          />
          <StatCard
            icon={MessageSquare}
            title="Total Comments"
            value={stats.totalComments}
            change="+15% from last month"
            changeType="positive"
          />
          <StatCard
            icon={Eye}
            title="Total Views"
            value={stats.totalViews}
            change="+23% from last month"
            changeType="positive"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusCircle className="h-5 w-5 mr-2" />
              New Post
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Users className="h-5 w-5 mr-2" />
              Manage Users
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <MessageSquare className="h-5 w-5 mr-2" />
              Moderate Comments
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <BarChart3 className="h-5 w-5 mr-2" />
              View Analytics
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Posts
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        by {post.author} •{" "}
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Comments */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Comments
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentComments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 mb-2">"{comment.content}"</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{comment.author}</span> on{" "}
                      <span className="font-medium">{comment.post}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Activity Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chart component would go here</p>
                <p className="text-sm text-gray-500 mt-1">
                  Connect with your analytics service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
