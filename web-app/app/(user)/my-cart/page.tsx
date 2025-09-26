import React from "react";
import { getUsersCart } from "../actions/cartActions";
import Image from "next/image";
import Link from "next/link";

export default async function MyCartPage() {
  const data = await getUsersCart();

  if (!data || !Array.isArray(data.books)) {
    return <div className="text-center py-10">Failed to load cart.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      {data.books.length === 0 ? (
        <p className="text-gray-500">Your cart is currently empty.</p>
      ) : (
        <div className="space-y-6">
          {data.books.map((book) => (
            <div
              key={book.id}
              className="flex gap-4 border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition-shadow"
            >
              <div className="w-24 h-32 relative">
                <Image
                  src={`/assets/${book.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.jpg`}
                  alt={book.title}
                  fill
                  className="object-cover rounded-lg border"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-sm mt-2 text-gray-700 line-clamp-2">
                  {book.description}
                </p>
                <p className="mt-3 text-base font-semibold text-rose-600">
                  ${book.price.toFixed(2)}
                </p>
                <p className="text-sm">Quantity: {book.quantity}</p>
                <button className="mt-2 text-sm text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="border-t pt-6 text-right">
            <p className="text-lg font-bold">
              Total: ${data.totalPrice.toFixed(2)}
            </p>
            <Link
              href="/order"
              className="inline-block px-6 py-2 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition"
            >
              Order
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
