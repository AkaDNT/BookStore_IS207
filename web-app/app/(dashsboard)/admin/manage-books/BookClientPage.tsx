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
        setBooks(res);
      }
    } catch (err) {
      setError("Something went wrong: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} placeholder="Search books..." />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <BookTable books={books} />
    </div>
  );
}
