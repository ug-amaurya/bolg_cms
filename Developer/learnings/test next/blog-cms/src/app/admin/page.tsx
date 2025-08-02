"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FileText, Users, MessageSquare, Eye } from "lucide-react";

interface Stats {
  postsCount: number;
  usersCount: number;
  commentsCount: number;
  publishedPosts: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Admin Dashboard Debug:", {
      session: !!session,
      status,
      userRole: session?.user?.role
    });

    if (status === "loading") return;
    
    if (!session) {
      console.log("No session found");
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        console.log("Fetching stats from /api/admin/stats");
        const response = await fetch('/api/admin/stats');
        console.log("Stats response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Stats data:", data);
          setStats(data);
        } else {
          const errorData = await response.json();
          console.error("Stats API error:", errorData);
          setError(errorData.error || "Failed to fetch stats");
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Not authenticated</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Failed to load dashboard data</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats.postsCount,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Published Posts",
      value: stats.publishedPosts,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      title: "Users",
      value: stats.usersCount,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Comments",
      value: stats.commentsCount,
      icon: MessageSquare,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Posts</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500">
              Recent posts will be displayed here...
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Comments
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500">
              Recent comments will be displayed here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
