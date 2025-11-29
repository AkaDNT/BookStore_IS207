"use client";

import React, { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteBookFromCart, addOrDeleteItem } from "../actions/cartActions";
import toast from "react-hot-toast";
import type { CartResponse } from "../models/CartResponse";

const fmtMoney = (v: number, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(v);

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

type Props = {
  cart: CartResponse;
};

export default function CartClient({ cart }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = (bookId: string) => {
    startTransition(async () => {
      try {
        await deleteBookFromCart(bookId);

        toast.success("Item removed from cart");

        router.refresh();
      } catch (error) {
        toast.error("Error removing item: " + error);
      }
    });
  };

  const handleChangeQty = (bookId: string, action: "delete" | "add") => {
    startTransition(async () => {
      try {
        const title =
          action === "delete" ? "Quantity decreased" : "Quantity increased";
        await addOrDeleteItem(bookId, action);
        toast.success(title);

        router.refresh();
      } catch (error) {
        toast.error("Error updating quantity: " + error);
      }
    });
  };

  if (!cart.books || cart.books.length === 0) {
    return <p className="text-gray-500">Your cart is currently empty.</p>;
  }

  const summary = cart.books.reduce(
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
    <div className="space-y-4 sm:space-y-6">
      {cart.books.map((book: any) => {
        const price = Number(book.price) || 0;
        const discount = Math.max(Number(book.discount) || 0, 0);
        const qty = Math.max(Number(book.quantity) || 0, 0);
        const hasDiscount = discount > 0;
        const finalUnit = hasDiscount ? price * (1 - discount / 100) : price;
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
              <p className="text-xs sm:text-sm text-gray-500">{book.author}</p>

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

              {/* Qty & line total + +/- buttons */}
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleChangeQty(book.id, "delete")}
                    className="h-5 w-5 flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-purple-600 text-base font-semibold cursor-pointer shadow-sm
                 transition-transform transition-colors duration-150 ease-out
                 hover:bg-rose-100 hover:border-purple-300 hover:-translate-y-0.5
                 active:scale-95
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-1
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>

                  <span className="min-w-[2.5rem] text-center px-3 py-1 border border-gray-200 rounded-lg text-sm bg-gray-50">
                    {qty}
                  </span>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleChangeQty(book.id, "add")}
                    className="h-5 w-5 flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-purple-600 text-base font-semibold cursor-pointer shadow-sm
                 transition-transform transition-colors duration-150 ease-out
                 hover:bg-rose-100 hover:border-purple-300 hover:-translate-y-0.5
                 active:scale-95
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-1
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {fmtMoney(lineTotal)}
                </p>
              </div>

              {hasDiscount && saved > 0 && (
                <p className="text-xs text-emerald-600 mt-1">
                  You save {fmtMoney(saved)} on this item
                </p>
              )}

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleRemove(book.id)}
                className="mt-2 text-sm text-red-500 hover:underline w-fit cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
  );
}
