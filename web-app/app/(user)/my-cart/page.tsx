import React from "react";
import { getUsersCart } from "../actions/cartActions";
import Image from "next/image";
import Link from "next/link";

// formatter tiền tệ
const fmtMoney = (v: number, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(v);

// chọn src hợp lệ, nếu không fallback sang assets theo slug
function pickSrc(title: string, v?: string | null) {
  const slug = (title || "book").toLowerCase().trim().replace(/\s+/g, "-");
  if (
    typeof v === "string" &&
    v.trim() !== "" &&
    v !== "null" &&
    v !== "undefined"
  ) {
    return v;
  }
  return `/assets/${slug}.jpg`;
}

export default async function MyCartPage() {
  const data = await getUsersCart();

  if (!data || !Array.isArray(data.books)) {
    return <div className="text-center py-10">Failed to load cart.</div>;
  }

  // subtotal / saved
  const summary = data.books.reduce(
    (acc: { subtotal: number; saved: number }, b: any) => {
      const price = Number(b.price) || 0;
      const discount = Math.max(Number(b.discount) || 0, 0);
      const qty = Math.max(Number(b.quantity) || 0, 0);
      const finalUnit = discount > 0 ? price * (1 - discount / 100) : price;
      acc.subtotal += finalUnit * qty;
      acc.saved += Math.max(price - finalUnit, 0) * qty;
      return acc;
    },
    { subtotal: 0, saved: 0 }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Your Shopping Cart
      </h1>

      {data.books.length === 0 ? (
        <p className="text-gray-500">Your cart is currently empty.</p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {data.books.map((book: any) => {
            const price = Number(book.price) || 0;
            const discount = Math.max(Number(book.discount) || 0, 0);
            const qty = Math.max(Number(book.quantity) || 0, 0);
            const hasDiscount = discount > 0;
            const finalUnit = hasDiscount
              ? price * (1 - discount / 100)
              : price;
            const lineTotal = finalUnit * qty;
            const saved = Math.max(price - finalUnit, 0) * qty;
            const imgSrc = pickSrc(book.title, book.imageUrl);

            return (
              <div
                key={book.id}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 mx-auto sm:mx-0 flex-shrink-0">
                  <Image
                    src={imgSrc}
                    alt={book.title}
                    fill
                    className="object-cover rounded-lg border"
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                    {book.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {book.author}
                  </p>

                  <p className="text-sm mt-2 text-gray-700 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Price */}
                  <div className="mt-3 flex items-center flex-wrap gap-x-2 gap-y-1">
                    <span className="text-lg sm:text-xl font-semibold text-gray-900">
                      {fmtMoney(finalUnit)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-base sm:text-lg font-semibold text-gray-500 line-through">
                          {fmtMoney(price)}
                        </span>
                        <span
                          className="inline-flex items-center rounded-md bg-rose-50 text-rose-600 px-2 py-0.5 text-xs sm:text-sm font-bold"
                          aria-label={`-${discount}%`}
                          title={`-${discount}%`}
                        >
                          -{Math.round(discount)}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Qty & line total */}
                  <div className="mt-2 flex items-baseline justify-between gap-3">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Quantity: {qty}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                      {fmtMoney(lineTotal)}
                    </p>
                  </div>

                  {hasDiscount && saved > 0 && (
                    <p className="text-xs text-emerald-600 mt-1">
                      You save {fmtMoney(saved)} on this item
                    </p>
                  )}

                  <button className="mt-2 text-sm text-red-500 hover:underline w-fit">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="border-t pt-5 sm:pt-6 text-right space-y-1">
            {summary.saved > 0 && (
              <p className="text-xs sm:text-sm text-emerald-700">
                You save {fmtMoney(summary.saved)} in total
              </p>
            )}
            <p className="text-lg sm:text-xl font-bold">
              Total: {fmtMoney(summary.subtotal)}
            </p>
            <Link
              href="/order"
              className="inline-block px-5 sm:px-6 py-2 sm:py-2.5 bg-rose-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-rose-700 transition"
            >
              Order
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
