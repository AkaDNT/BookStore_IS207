import React from "react";
import { getUsersCart } from "../actions/cartActions";
import CartClient from "./CartClient";

export default async function MyCartPage() {
  const data = await getUsersCart();

  if (!data || !Array.isArray(data.books)) {
    return <div className="text-center py-10">Failed to load cart.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Your Shopping Cart
      </h1>

      <CartClient cart={data} />
    </div>
  );
}
