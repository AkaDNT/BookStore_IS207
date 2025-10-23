import Link from "next/link";
import { Heart } from "lucide-react";
import SearchControls from "./SearchControls";
import BookImage from "@/app/components/ui/BookImage";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
}

interface ApiResponse {
  data: Book[];
  meta: {
    current_page: number;
    last_page: number;
  };
}

async function fetchBooks(searchParams: {
  [key: string]: unknown;
}): Promise<ApiResponse> {
  const queryParams = new URLSearchParams();

  if (searchParams.searchTerm) {
    queryParams.set("searchTerm", String(searchParams.searchTerm));
  }

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "searchTerm") {
      queryParams.set(key, String(value));
    }
  });

  const res = await fetch(`${process.env.API_URL}/books/search?${queryParams}`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = await fetchBooks(searchParams);

  const currentPage = Number(searchParams.page ?? 0);
  const totalPages = Number(data.meta.last_page);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) params.set(key, String(value));
    });
    params.set("page", String(page));
    return `/search?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      <SearchControls />

      <div className="grid grid-cols-4 gap-6 p-6">
        {data.data.map((book) => (
          <div
            key={book.id}
            className="border p-4 rounded-md shadow hover:shadow-lg transition"
          >
            <div className="relative h-150 mb-4">
              <Link href={`/books/${book.id}`}>
                <BookImage title={book.title} />
              </Link>
            </div>
            <h3 className="text-lg font-semibold mb-1 truncate">
              {book.title}
            </h3>
            <p className="text-gray-600 mb-2 truncate">{book.author}</p>
            <div className="grid grid-cols-2 relative">
              <p className="text-black font-semibold mb-4 text-2xl">
                ${Number(book.price).toFixed(2)}
              </p>
              <button className="absolute right-4 top-0 text-gray-600 hover:text-red-500">
                <Heart size={24} />
              </button>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full h-12 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 pb-6">
        {currentPage > 0 && (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => {
          const pageIndex = i;
          const isActive = currentPage === pageIndex;
          return (
            <Link
              key={pageIndex}
              href={createPageUrl(pageIndex)}
              className={`px-4 py-2 rounded ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {pageIndex + 1}
            </Link>
          );
        })}

        {currentPage < totalPages - 1 && (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
