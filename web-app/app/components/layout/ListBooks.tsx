"use client";

import React, { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import BookImage from "../ui/BookImage";
import Link from "next/link";
import { Book } from "@/app/(user)/models/Book";

interface Props {
  books: Book[];
  title: string;
}

const ITEMS_PER_PAGE = 4; // mỗi trang hiển thị 4 sản phẩm

export default function ListBooks({ books, title }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  // Tính toán phần tử bắt đầu/kết thúc để cắt mảng
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, endIndex);

  // Chuyển trang
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPage = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mx-auto w-4/5 mt-8 group">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <div className="relative">
        {/* Danh sách sản phẩm */}
        <div
          className="grid grid-cols-1 gap-6 
                      sm:grid-cols-2 
                      md:grid-cols-3 
                      lg:grid-cols-4"
        >
          {currentBooks.map((book) => (
            <div
              key={book.id}
              className="border p-4 rounded-md shadow hover:shadow-lg transition"
            >
              <div className="relative h-140 mb-4">
                <Link href={`/books/${book.id}`}>
                  <BookImage title={`${book.title}`} />
                </Link>
              </div>
              <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <div className="grid grid-cols-2 relative">
                {/* Giá tiền */}
                <p className="text-black font-semibold mb-4 text-2xl">
                  {book.price + "$"}
                </p>
              </div>
              {/* Nút Add to cart */}
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full h-12 cursor-pointer">
                Add to cart
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={goToPreviousPage}
          className={`
            absolute top-1/2 -translate-y-1/2
            -left-20 
            rounded-full border-2 border-purple-600 
            text-purple-600 p-2 
            hover:bg-purple-50 transition
            cursor-pointer
          `}
        >
          <ChevronLeft />
        </button>

        {/* Nút chuyển trang phải (nằm ngoài vùng 80%) */}
        <button
          onClick={goToNextPage}
          className={`
            absolute top-1/2 -translate-y-1/2
            -right-20
            rounded-full border-2 border-purple-600 
            text-purple-600 p-2 
            hover:bg-purple-50 transition
            cursor-pointer
          `}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Bullet phân trang */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`
              w-3 h-3 rounded-full border-2 border-purple-600 
              ${page === currentPage ? "bg-purple-600" : "bg-white"}
            `}
            />
          )
        )}
      </div>
    </div>
  );
}
