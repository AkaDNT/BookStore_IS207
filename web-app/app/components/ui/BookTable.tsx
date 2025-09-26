"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Book } from "@/app/(user)/models/Book";
import { useMemo } from "react";
import { deleteBook } from "@/app/(user)/actions/bookAction";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = { books: Book[] };

export default function BookTable({ books }: Props) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirm) return;

    try {
      await deleteBook(id);
      toast.success("Delete book succeeded");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book. Please try again.");
    }
  };

  const rows = useMemo(
    () =>
      books.map((b, idx) => (
        <tr key={b.id} className="odd:bg-white even:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
            {idx + 1}
          </td>
          <td className="px-4 py-3 text-sm font-medium text-gray-900">
            {b.title}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">{b.author}</td>
          <td className="px-4 py-3 text-sm text-gray-700">{b.category}</td>
          <td className="px-4 py-3 text-sm text-gray-700">
            ${b.price.toFixed(2)}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {new Date(b.publicationDate).toLocaleDateString()}
          </td>

          {/* Action buttons */}
          <td className="px-4 py-3 text-sm flex items-center gap-3">
            <Link
              href={`/admin/manage-books/update/${b.id}`}
              className="text-purple-600 hover:text-purple-800"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </Link>

            <button
              onClick={() => handleDelete(b.id)}
              className="text-rose-600 hover:text-rose-800"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )),
    [books]
  );

  if (!books.length)
    return (
      <p className="text-gray-600 italic">
        There are no books in the database.
      </p>
    );

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-purple-100">
          <tr>
            {[
              "#",
              "Title",
              "Author",
              "Category",
              "Price",
              "Publication Date",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{rows}</tbody>
      </table>
    </div>
  );
}
