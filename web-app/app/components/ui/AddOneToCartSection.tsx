"use client";
import { addToCart } from "@/app/(user)/actions/cartActions";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  bookId: string;
}

export default function AddOneToCartSection({ bookId }: Props) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleAddToCart = async () => {
    try {
      const res = await addToCart(bookId, 1);
      if ("error" in res) throw new Error("Some error happened");
      toast.success("Add to cart successful");

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        window.dispatchEvent(
          new CustomEvent("fly-to-cart", {
            detail: { from: rect },
          })
        );
      }

      router.refresh();
    } catch (err: any) {
      toast.error("Error: " + (err?.message ?? "Unknown error"));
    }
  };

  return (
    <div className="space-y-4">
      <button
        ref={buttonRef}
        className="w-full bg-purple-600 text-white py-3 md:py-3.5 text-base md:text-lg font-medium rounded-xl shadow hover:bg-purple-700 transition cursor-pointer"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
