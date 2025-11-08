import React from "react";
import { getUsersCart } from "../actions/cartActions";
import Image from "next/image";
import Link from "next/link";

// formatter tiền tệ
const fmtMoney = (v: number, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(v);

// giống BookImage: chọn src hợp lệ, nếu không fallback sang assets theo slug
function pickSrc(title: string, v?: string | null) {
  const slug = (title || "book").toLowerCase().trim().replace(/\s+/g, "-");
  console.log(v);
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

  // Tính lại subtotal/tiết kiệm theo discount từ client (phòng khi backend chưa áp dụng)
  const summary = data.books.reduce(
    (acc: { subtotal: number; saved: number }, b: any) => {
      const price = Number(b.price) || 0; // giá gốc
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

      {data.books.length === 0 ? (
        <p className="text-gray-500">Your cart is currently empty.</p>
      ) : (
        <div className="space-y-6">
          {data.books.map((book: any) => {
            const price = Number(book.price) || 0; // giá gốc
            const discount = Math.max(Number(book.discount) || 0, 0);
            const qty = Math.max(Number(book.quantity) || 0, 0);
            const hasDiscount = discount > 0;
            const finalUnit = hasDiscount
              ? price * (1 - discount / 100)
              : price;
            const lineTotal = finalUnit * qty;
            const saved = Math.max(price - finalUnit, 0) * qty;

            // chọn ảnh theo logic BookImage
            const imgSrc = pickSrc(book.title, book.imageUrl);

            return (
              <div
                key={book.id}
                className="flex gap-4 border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-32 relative">
                  <Image
                    src={imgSrc}
                    alt={book.title}
                    fill
                    className="object-cover rounded-lg border"
                    sizes="96px"
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

                  {/* Cụm giá: giá sau giảm (đen), giá gốc (xám gạch), chip %-OFF */}
                  <div className="mt-3 flex items-center flex-wrap gap-2">
                    <span className="text-xl font-semibold text-gray-900">
                      {fmtMoney(finalUnit)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xl font-semibold text-gray-500 line-through">
                          {fmtMoney(price)}
                        </span>
                        <span
                          className="inline-flex items-center rounded-md bg-rose-50 text-rose-600 px-2 py-0.5 text-xl font-bold"
                          aria-label={`-${discount}%`}
                          title={`-${discount}%`}
                        >
                          -{Math.round(discount)}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Số lượng & line total */}
                  <div className="mt-1 flex items-baseline justify-between">
                    <p className="text-sm text-gray-600">Quantity: {qty}</p>
                    <p className="text-base font-semibold text-gray-900">
                      {fmtMoney(lineTotal)}
                    </p>
                  </div>

                  {/* Tiết kiệm cho item */}
                  {hasDiscount && saved > 0 && (
                    <p className="text-xs text-emerald-600 mt-1">
                      You save {fmtMoney(saved)} on this item
                    </p>
                  )}

                  <button className="mt-2 text-sm text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Tóm tắt giỏ hàng */}
          <div className="border-t pt-6 text-right space-y-1">
            {summary.saved > 0 && (
              <p className="text-sm text-emerald-700">
                You save {fmtMoney(summary.saved)} in total
              </p>
            )}
            <p className="text-lg font-bold">
              Total: {fmtMoney(summary.subtotal)}
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
