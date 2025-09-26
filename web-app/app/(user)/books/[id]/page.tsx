import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart } from "lucide-react";
import AddToCartSection from "@/app/components/ui/AddToCartSection";

type BookDetailProps = {
  params: { id: string };
};

export async function generateMetadata(
  props: BookDetailProps
): Promise<Metadata> {
  const { params } = await props;
  const res = await fetch(`${process.env.API_URL}/books/book?Id=${params.id}`);
  const book = await res.json();
  return {
    title: book.title,
    description: book.description,
  };
}

export default async function BookDetailPage(props: BookDetailProps) {
  const { params } = await props;
  const res = await fetch(`${process.env.API_URL}/books/book?Id=${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();
  const book = await res.json();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ">
        {/* Hình ảnh */}
        <div className="relative w-full h-[770px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src={
              "/assets/" +
              book.title.toLowerCase().replace(/\s+/g, "-") +
              ".jpg"
            }
            alt={book.title}
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Thông tin sách */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-lg text-gray-700 italic">by {book.author}</p>
          <div className="grid grid-cols-2 relative">
            {/* Giá tiền */}
            <p className="text-black font-semibold mb-4 text-2xl">
              {book.price + "$"}
            </p>
            <button className="absolute right-4 border-purple-600 cursor-pointer">
              <Heart></Heart>
            </button>
          </div>

          <div className="text-gray-800 leading-relaxed border-t pt-6">
            <p className="mb-4">{book.description}</p>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Category:</span> {book.category}
              </li>
              <li>
                <span className="font-medium">Publisher:</span> {book.publisher}
              </li>
              <li>
                <span className="font-medium">Published:</span>{" "}
                {book.publicationDate}
              </li>
              <li>
                <span className="font-medium">Language:</span> {book.language}
              </li>
              <li>
                <span className="font-medium">Reading Age:</span>{" "}
                {book.readingAge}+
              </li>
              <li>
                <span className="font-medium">Pages:</span> {book.pages}
              </li>
              <li>
                <span className="font-medium">Dimension:</span> {book.dimension}
              </li>
            </ul>
          </div>

          <AddToCartSection bookId={book.id}></AddToCartSection>
        </div>
      </div>
    </div>
  );
}
