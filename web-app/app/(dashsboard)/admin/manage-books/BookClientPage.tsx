"use client";

import { useState } from "react";
import BookTable from "@/app/components/ui/BookTable";
import { Book } from "@/app/(user)/models/Book";
import SearchBar from "@/app/components/ui/SearchBarReusable";
import { searchBooks } from "@/app/(user)/actions/bookAction";

export default function BookClientPage({
  initialBooks,
}: {
  initialBooks: Book[];
}) {
  const [books, setBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await searchBooks(term);
      if ("error" in res) {
        setError(res.error.message);
        setBooks([]);
      } else {
        setBooks(res.data);
      }
    } catch (err) {
      setError("Something went wrong: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex-1 min-w-0">
          <SearchBar onSearch={handleSearch} placeholder="Search books..." />
        </div>

        {/* Optional status */}
        <div className="text-sm text-gray-600">
          {loading ? "Loading..." : ""}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table wrapper for responsiveness */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <div className="min-w-[900px]">
          <BookTable books={books} />
        </div>
      </div>
    </div>
  );
}
