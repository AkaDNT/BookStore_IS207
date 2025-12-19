import React from "react";
import BookForm from "../BookForm";

export default function Page() {
  return (
    <section className="w-full max-w-7xl mx-auto space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Add New Book
      </h1>
      <BookForm />
    </section>
  );
}
