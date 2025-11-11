"use server";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { getMyOrders } from "../../actions/orderActions";

function pickSrc(title: string, v?: string | null) {
  const slug = (title || "book").toLowerCase().trim().replace(/\s+/g, "-");
  if (
    typeof v === "string" &&
    v.trim() !== "" &&
    v !== "null" &&
    v !== "undefined"
  ) {
    return v;
  }
  return `/assets/${slug}.jpg`;
}

export default async function OrdersPage() {
  const orders = await getMyOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-3 sm:mb-6">
          Your Orders
        </h1>
        <p className="text-gray-500">You don&apos;t have any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4 sm:mb-6">
        Your Orders
      </h1>

      <div className="space-y-5 sm:space-y-6 md:space-y-8">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="border-2 border-purple-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-md bg-white
                       hover:shadow-lg hover:border-purple-300 transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 border-b pb-3 sm:pb-4 mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-purple-700">
                {format(new Date(order.orderDate), "MMMM dd, yyyy")}
              </h2>

              <div className="text-right">
                <p className="text-lg sm:text-xl font-semibold text-red-700">
                  ${Number(order.totalAmount).toFixed(2)}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-1 font-bold rounded-full text-[10px] sm:text-xs
                    ${
                      order.orderStatus.toLowerCase().includes("accepted")
                        ? "bg-purple-100 text-green-600"
                        : "bg-rose-100 text-rose-600"
                    }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3 sm:space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 border-b pb-3 sm:pb-4 last:border-0 last:pb-0"
                >
                  <div className="relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 flex-shrink-0">
                    <Image
                      src={pickSrc(item.title, item.imageUrl)}
                      alt={item.title}
                      fill
                      sizes="(max-width:640px) 64px, (max-width:768px) 80px, 96px"
                      className="object-cover rounded-lg border"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 break-words">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {item.author}
                    </p>

                    <div className="mt-2 sm:mt-3 flex flex-col gap-1">
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                        <span className="text-base sm:text-lg font-semibold text-purple-700">
                          ${Number(item.orderedBookPrice).toFixed(2)} ×{" "}
                          {item.quantity}
                        </span>
                        <span className="text-xs sm:text-sm text-rose-600">
                          Discount: {Number(item.discount)}%
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Line total
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-purple-700">
                          $
                          {(
                            Number(item.orderedBookPrice) *
                            Number(item.quantity) *
                            Number(1 - item.discount / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t text-xs sm:text-sm">
              <p className="flex items-center justify-between">
                <span className="text-gray-500">Payment method:</span>
                <span className="font-medium text-purple-700">
                  {order.payment.paymentMethod}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
