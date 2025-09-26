"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
  initialSearchTerm?: string;
  placeholder?: string;
  onSearch: (term: string) => void;
  className?: string;
}

export default function SearchBar({
  initialSearchTerm = "",
  placeholder = "Search...",
  onSearch,
  className = "",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`flex-grow relative ${className}`}>
      <div className="flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-12 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="absolute right-4 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
