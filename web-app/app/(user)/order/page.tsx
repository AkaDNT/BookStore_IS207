import React from "react";
import { getCurrentUser } from "../actions/getCurrentUser";
import OrderForm from "./OrderForm";

export default async function OrderPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center text-gray-700">
          <p className="text-base sm:text-lg">
            Please log in to place an order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Select a delivery address
      </h1>
      <OrderForm addresses={currentUser.addresses} />
    </div>
  );
}
