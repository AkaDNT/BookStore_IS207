"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Sync with URL params on initial load
  useEffect(() => {
    const term = searchParams.get("searchTerm") || "";
    setSearchTerm(term);
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      params.set("searchTerm", searchTerm.trim());
    } else {
      params.delete("searchTerm");
    }

    // Reset to first page when searching
    params.delete("page");

    router.push(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex-grow mx-8 relative">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-12 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="absolute right-4 text-gray-500 hover:text-blue-600 
            transition-colors"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
