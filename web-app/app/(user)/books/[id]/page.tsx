import { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToCartSection from "@/app/components/ui/AddToCartSection";
import BookImage from "@/app/components/ui/BookImage";

type Params = Promise<{ id: string }>;

// Formatter tiền tệ (đổi currency/locale nếu cần)
const fmtMoney = (v: number, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(v);

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params; // 👈 await params
  const res = await fetch(`${process.env.API_URL}/books/book?Id=${id}`);
  const book = await res.json();

  return {
    title: book.title,
    description: book.description,
  };
}

export default async function BookDetailPage({ params }: { params: Params }) {
  const { id } = await params; // 👈 await params
  const res = await fetch(`${process.env.API_URL}/books/book?Id=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();
  const data = await res.json();
  const book = data.data;

  // Tính giá & giảm giá
  const price = Number(book?.price) || 0; // giá gốc
  const discount = Math.max(Number(book?.discount) || 0, 0);
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;
  const saved = Math.max(price - finalPrice, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Hình ảnh */}
        <div className="relative mb-3 sm:mb-4 aspect-[3/4]">
          <BookImage
            title={book.title}
            imageUrl={book.imageUrl}
            fit="contain"
          />
        </div>

        {/* Thông tin sách */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-lg text-gray-700 italic">by {book.author}</p>

          <div className="grid grid-cols-2 relative">
            {/* Cụm giá theo chuẩn TMĐT */}
            <div className="col-span-2">
              <div className="flex items-center flex-wrap gap-3 mb-1">
                {/* Giá sau giảm (đen, nổi bật) */}
                <span className="text-4xl font-bold text-gray-900">
                  {fmtMoney(finalPrice)}
                </span>

                {/* Giá gốc gạch ngang (xám) */}
                {hasDiscount && (
                  <span className="text-4xl font-semibold text-gray-500 line-through">
                    {fmtMoney(price)}
                  </span>
                )}

                {/* Chip % OFF */}
                {hasDiscount && (
                  <span
                    className="
                      inline-flex items-center rounded-md
                      bg-rose-50 text-rose-600
                      px-3 py-1 text-4xl font-bold
                    "
                    aria-label={`-${discount}%`}
                    title={`-${discount}%`}
                  >
                    -{Math.round(discount)}%
                  </span>
                )}
              </div>

              {/* Tiết kiệm … */}
              {hasDiscount && (
                <div className="text-sm text-gray-600">
                  Save {fmtMoney(saved)}
                </div>
              )}
            </div>
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

          <AddToCartSection bookId={book.id} />
        </div>
      </div>
    </div>
  );
}
