import { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToCartSection from "@/app/components/ui/AddToCartSection";
import BookImage from "@/app/components/ui/BookImage";

type Params = Promise<{ id: string }>;

const fmtMoney = (v: number, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(v);

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${process.env.API_URL}/books/book?Id=${id}`);
  const book = await res.json();
  return { title: book.title, description: book.description };
}

export default async function BookDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const res = await fetch(`${process.env.API_URL}/books/book?Id=${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return notFound();
  const data = await res.json();
  const book = data.data;

  const price = Number(book?.price) || 0;
  const discount = Math.max(Number(book?.discount) || 0, 0);
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;
  const saved = Math.max(price - finalPrice, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start">
        {/* Image */}
        <div className="relative mb-3 sm:mb-4 aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none">
          <BookImage
            title={book.title}
            imageUrl={book.imageUrl}
            fit="contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Info */}
        <div className="space-y-5 md:space-y-6 lg:space-y-8 lg:sticky lg:top-24">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words">
            {book.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-700 italic">
            by {book.author}
          </p>

          {/* Price block */}
          <div>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {fmtMoney(finalPrice)}
              </span>

              {hasDiscount && (
                <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-500 line-through">
                  {fmtMoney(price)}
                </span>
              )}

              {hasDiscount && (
                <span
                  className="inline-flex items-center rounded-md bg-rose-50 text-rose-600 px-2 py-0.5
                             text-sm sm:text-base font-semibold"
                  aria-label={`-${discount}%`}
                  title={`-${discount}%`}
                >
                  -{Math.round(discount)}%
                </span>
              )}
            </div>

            {hasDiscount && (
              <div className="text-sm text-gray-600">
                Save {fmtMoney(saved)}
              </div>
            )}
          </div>

          {/* Description & specs */}
          <div className="text-gray-800 border-t pt-5 md:pt-6">
            <p className="mb-4 text-sm sm:text-base leading-relaxed">
              {book.description}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-base">
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
              <li className="sm:col-span-2">
                <span className="font-medium">Dimension:</span> {book.dimension}
              </li>
            </ul>
          </div>

          <AddToCartSection bookId={book.id} />
        </div>
      </div>
    </div>
  );
}
