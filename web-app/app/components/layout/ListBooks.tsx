"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookImage from "../ui/BookImage";
import Link from "next/link";
import { Book } from "@/app/(user)/models/Book";
import AddOneToCartSection from "../ui/AddOneToCartSection";

interface Props {
  books: Book[];
  title: string;
}

const ITEMS_PER_PAGE = 4;

// Formatter tiền tệ (đổi currency/locale nếu cần)
const fmtMoney = (v: number, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(v);

export default function ListBooks({ books, title }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, endIndex);

  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const goToPage = (n: number) => setCurrentPage(n);

  return (
    <div className="mx-auto w-[92%] md:w-4/5 mt-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>

      <div className="relative">
        {/* Danh sách sản phẩm */}
        <div
          className="
            grid gap-4 sm:gap-6
            grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
          "
        >
          {currentBooks.map((book) => {
            const price = Number(book.price) || 0; // giá gốc
            const discount = Math.max(Number(book.discount) || 0, 0);
            const hasDiscount = discount > 0;
            const finalPrice = hasDiscount
              ? price * (1 - discount / 100)
              : price;
            const saved = Math.max(price - finalPrice, 0);

            return (
              <div
                key={book.id}
                className="
                  group border rounded-lg shadow-sm hover:shadow-md transition
                  p-3 sm:p-4 bg-white
                "
              >
                {/* Ảnh: giữ sạch, không overlay badge */}
                <div className="relative mb-3 sm:mb-4 aspect-[3/4]">
                  <Link href={`/books/${book.id}`} className="block h-full">
                    <BookImage
                      title={book.title}
                      imageUrl={book.imageUrl}
                      fit="contain"
                    />
                  </Link>
                </div>

                {/* Tiêu đề & tác giả */}
                <h3 className="text-sm sm:text-base font-semibold line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mb-2">
                  {book.author}
                </p>

                {/* Giá theo chuẩn TMĐT */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                    {/* Giá sau giảm (đen, nổi bật) */}
                    <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                      {fmtMoney(finalPrice)}
                    </span>

                    {/* Giá gốc gạch ngang (xám) */}
                    {hasDiscount && (
                      <span className="text-lg sm:text-xl text-gray-500 line-through">
                        {fmtMoney(price)}
                      </span>
                    )}

                    {/* Chip % OFF */}
                    {hasDiscount && (
                      <span
                        className="
                          inline-flex items-center rounded-md
                          bg-rose-50 text-rose-600
                          px-1.5 sm:px-2 py-0.5
                          text-[30px] sm:text-sm font-semibold
                        "
                        aria-label={`-${discount}%`}
                        title={`-${discount}%`}
                      >
                        -{Math.round(discount)}%
                      </span>
                    )}
                  </div>

                  {/* Tiết kiệm … (ẩn ở màn rất nhỏ) */}
                  {hasDiscount && (
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-1 hidden xs:block">
                      Save {fmtMoney(saved)}
                    </div>
                  )}
                </div>

                {/* Nút Add to cart */}
                <AddOneToCartSection
                  bookId={String(book.id)}
                ></AddOneToCartSection>
              </div>
            );
          })}
        </div>

        {/* Nút chuyển trang trái */}
        <button
          onClick={goToPreviousPage}
          className="
            hidden md:flex
            absolute top-1/2 -translate-y-1/2 -left-20
            rounded-full border-2 border-gray-800 text-gray-800
            p-2 hover:bg-gray-50 transition
          "
          aria-label="Trang trước"
        >
          <ChevronLeft />
        </button>

        {/* Nút chuyển trang phải */}
        <button
          onClick={goToNextPage}
          className="
            hidden md:flex
            absolute top-1/2 -translate-y-1/2 -right-20
            rounded-full border-2 border-gray-800 text-gray-800
            p-2 hover:bg-gray-50 transition
          "
          aria-label="Trang sau"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Bullet phân trang */}
      <div className="flex justify-center items-center mt-5 sm:mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`
              w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2
              ${
                page === currentPage
                  ? "bg-purple-600 border-purple-600"
                  : "bg-white border-purple-600"
              }
            `}
            aria-label={`Trang ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
