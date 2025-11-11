import Link from "next/link";
import { Heart } from "lucide-react";
import SearchControls from "./SearchControls";
import BookImage from "@/app/components/ui/BookImage";
import { Book } from "../models/Book";

interface ApiResponse {
  data: Book[];
  meta: { current_page: number; last_page: number };
}

type SearchParams = Record<string, string | string[] | undefined>;

function toURLSearchParams(obj: SearchParams) {
  const qp = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (!value) continue;
    if (Array.isArray(value)) value.forEach((v) => qp.append(key, String(v)));
    else qp.set(key, String(value));
  }
  return qp;
}

async function fetchBooks(searchParams: SearchParams): Promise<ApiResponse> {
  const queryParams = toURLSearchParams(searchParams);
  const res = await fetch(`${process.env.API_URL}/books/search?${queryParams}`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const data = await fetchBooks(sp);

  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const currentPage = Number(pageParam ?? 0);
  const totalPages = Number(data.meta.last_page);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key === "page" || value == null) continue;
      if (Array.isArray(value))
        value.forEach((v) => params.append(key, String(v)));
      else params.set(key, String(value));
    }
    params.set("page", String(page));
    return `/search?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      <SearchControls />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
        {data.data.map((book) => (
          <div
            key={book.id}
            className="border p-3 sm:p-4 rounded-md shadow bg-white hover:shadow-lg transition"
          >
            <div className="relative mb-3 sm:mb-4 aspect-[3/4]">
              <Link href={`/books/${book.id}`}>
                <BookImage
                  title={book.title}
                  imageUrl={book.imageUrl}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  fit="cover"
                />
              </Link>
              <button
                className="absolute right-2 top-2 text-gray-600 hover:text-red-500"
                aria-label="Add to wishlist"
              >
                <Heart size={22} />
              </button>
            </div>

            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 truncate">
              {book.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">
              {book.author}
            </p>

            <p className="text-lg sm:text-xl font-semibold mb-3">
              ${Number(book.price).toFixed(2)}
            </p>

            <button className="bg-purple-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-purple-700 w-full h-11 sm:h-12 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pb-6 px-4">
        {currentPage > 0 && (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="px-3 sm:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
              className={`px-3 sm:px-4 py-2 rounded ${
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
            className="px-3 sm:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
