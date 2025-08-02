"use client";

// components/blog/CategoryFilter.jsx
import React from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoryFilterProps {
  categories?: Category[];
  showAllOption?: boolean;
}

const CategoryFilter = ({
  categories = [],
  showAllOption = true,
}: CategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset to first page when changing category
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* Mobile Dropdown */}
      <div className="block md:hidden">
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {showAllOption && <option value="">All Categories</option>}
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count || 0})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Desktop Filter Pills */}
      <div className="hidden md:flex flex-wrap gap-2">
        {showAllOption && (
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === ""
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>
        )}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
            {category.count !== undefined && (
              <span className="ml-1 opacity-75">({category.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
