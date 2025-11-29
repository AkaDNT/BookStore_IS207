"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { Order } from "@/app/(user)/models/Order";

type Props = {
  orders: Order[];
};

export default function OrdersByDateChart({ orders }: Props) {
  const countMap: Record<string, number> = {};

  orders.forEach((order) => {
    const rawDate = order.orderDate || order.createdAt || "";

    if (!rawDate) return;

    const dateKey = rawDate.slice(0, 10);

    countMap[dateKey] = (countMap[dateKey] || 0) + 1;
  });

  const chartData = Object.entries(countMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (chartData.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Orders by Date</h2>
        <p className="text-sm text-gray-500">No orders to display.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Orders by Date</h2>
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
