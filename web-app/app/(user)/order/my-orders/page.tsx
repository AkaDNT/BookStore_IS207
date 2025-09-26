"use server";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { getMyOrders } from "../../actions/orderActions";

export default async function OrdersPage() {
  const orders = await getMyOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-purple-600 mb-6">Your Orders</h1>
        <p className="text-gray-500">You don&apos;t have any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-purple-600 mb-6">Your Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="border-4 border-purple-300 rounded-xl p-6 shadow-lg bg-white 
             hover:shadow-xl hover:border-purple-400 transition-all duration-300
             hover:-translate-y-1"
          >
            {/* Order header */}
            <div className="flex flex-wrap justify-between items-center border-b pb-4 mb-4">
              <div>
                <h2 className="text-lg font-sans font-bold text-purple-700">
                  {format(new Date(order.orderDate), "MMMM dd, yyyy")}
                </h2>
              </div>

              <div className="text-right">
                <p className="font-semibold text-purple-700">
                  ${order.totalAmount.toFixed(2)}
                </p>
                <span
                  className={`px-2 py-1 font-bold rounded-full text-xs ${
                    order.orderStatus.toLowerCase().includes("accepted")
                      ? "bg-purple-100 text-purple-600"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Order items */}
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-20 h-28 relative flex-shrink-0">
                    <Image
                      src={`/assets/${item.book.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}.jpg`}
                      alt={item.book.title}
                      fill
                      sizes="80px"
                      className="object-cover rounded-lg border"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.book.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.book.author}</p>
                    <div className="flex justify-between mt-2">
                      <p className="text-purple-700">
                        ${item.orderedBookPrice.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="font-medium text-purple-700">
                        ${(item.orderedBookPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment info */}
            <div className="mt-6 pt-4 border-t text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500">Payment method:</span>
                <span className="font-medium text-purple-700">
                  {order.payment.paymentMethod}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Payment status:</span>
                <span className="font-medium capitalize text-rose-700">
                  {order.payment.pgStatus.toLowerCase()}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
