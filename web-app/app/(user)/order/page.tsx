import React from "react";
import { getCurrentUser } from "../actions/getCurrentUser";
import OrderForm from "./OrderForm";

export default async function OrderPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="text-center py-10">Please log in to place an order.</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Select a delivery address</h1>
      <OrderForm addresses={currentUser.addresses} />
    </div>
  );
}
