"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Don't apply authentication checks to login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    console.log("Admin Layout Debug:", {
      session: !!session,
      status,
      pathname,
      isLoginPage,
    });

    if (status === "loading") return;
    if (!session && !isLoginPage) {
      console.log("Redirecting to login...");
      router.push("/admin/login");
    }
  }, [session, status, router, isLoginPage]);

  // If it's the login page, render without authentication checks
  if (isLoginPage) {
    console.log("Rendering login page...");
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    console.log("Showing loading state...");
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading authentication...</div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    console.log("No session, showing redirect message...");
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  console.log("Rendering admin layout with session...");
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
