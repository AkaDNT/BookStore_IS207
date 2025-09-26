"use server";

import { getAllBooks } from "@/app/(user)/actions/bookAction";
import BookClientPage from "./BookClientPage";
import Link from "next/link";

export default async function BooksPage() {
  const books = await getAllBooks();

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Books</h1>

        <Link
          href="/admin/manage-books/new"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition-colors"
        >
          + Add Book
        </Link>
      </div>

      <BookClientPage initialBooks={books} />
    </section>
  );
}
