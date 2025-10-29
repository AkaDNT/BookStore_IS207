import React from "react";
import { notFound } from "next/navigation";
import { getBookById } from "@/app/(user)/actions/bookAction";
import BookForm from "../../BookForm";

type Params = Promise<{ id: string }>;

export default async function UpdateBook(
  { params }: { params: Params } // 👈 params là Promise
) {
  const { id } = await params; // 👈 cần await
  const bookId = Number(id);
  if (Number.isNaN(bookId)) return notFound();

  const book = await getBookById(bookId);
  if (!book) return notFound();

  return <BookForm book={book} />;
}
