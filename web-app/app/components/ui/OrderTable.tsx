"use client";

import { Order } from "@/app/(user)/models/Order";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function OrderTable({ orders }: { orders: Order[] }) {
  if (!orders.length)
    return <p className="text-gray-600 italic">No orders found.</p>;

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-purple-100">
          <tr>
            {[
              "#",
              "Customer",
              "Books",
              "Total",
              "Date",
              "Status",
              "Payment",
              "Action",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {orders.map((order, idx) => (
            <tr key={order.orderId} className="odd:bg-white even:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>

              <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                {order.email}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700">
                {order.orderItems
                  .map((item) => `${item.book.title} x${item.quantity}`)
                  .join(", ")}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700">
                ${order.totalAmount.toFixed(2)}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700">
                {new Date(order.orderDate).toLocaleDateString()}
              </td>

              <td className="px-4 py-3 text-sm text-purple-700 font-semibold">
                {order.orderStatus}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700">
                {order.payment.paymentMethod.toUpperCase()}
              </td>

              <td className="px-4 py-3 text-sm">
                <Link
                  href={`/orders/${order.orderId}`}
                  className="text-indigo-600 hover:text-indigo-800"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
