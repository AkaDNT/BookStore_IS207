import React from "react";
import { notFound } from "next/navigation";
import { getBookById } from "@/app/(user)/actions/bookAction";
import BookForm from "../../BookForm";

export default async function UpdateBook({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const book = await getBookById(id);
  console.log(book);

  if (!book) return notFound();

  return <BookForm book={book} />;
}
