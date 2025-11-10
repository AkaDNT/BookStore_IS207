"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Sync với URL params khi load
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
    params.delete("page"); // về trang 1 khi tìm
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full relative">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          aria-label="Search"
          className="
            w-full border border-gray-300 rounded-full
            pl-4 pr-12 md:pr-14
            h-10 sm:h-10 md:h-11 lg:h-12
            text-sm md:text-base
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
        <button
          onClick={handleSearch}
          type="button"
          className="
            absolute right-3 sm:right-4
            top-1/2 -translate-y-1/2
            p-2 md:p-2.5
            rounded-full
            text-gray-500 hover:text-blue-600
            transition-colors
          "
          aria-label="Execute search"
        >
          <Search className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
