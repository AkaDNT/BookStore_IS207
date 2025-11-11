"use client";
import { addToCart } from "@/app/(user)/actions/cartActions";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  bookId: string;
}

export default function AddToCartSection({ bookId }: Props) {
  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (d: number) =>
    setQuantity((p) => Math.max(1, p + d));

  const handleAddToCart = async () => {
    try {
      const res = await addToCart(bookId, quantity);
      if ("error" in res) throw new Error("Some error happened");
      toast.success("Add to cart successful");
    } catch (err) {
      toast.error("Error: " + err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center gap-4 mt-2">
          <button
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
            onClick={() => handleQuantityChange(-1)}
          >
            -
          </button>
          <span className="text-lg md:text-xl font-semibold min-w-6 text-center">
            {quantity}
          </span>
          <button
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>

      <button
        className="w-full bg-purple-600 text-white py-3 md:py-3.5 text-base md:text-lg font-medium rounded-xl shadow hover:bg-purple-700 transition"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
