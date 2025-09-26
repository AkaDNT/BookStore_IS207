"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type Order = {
  orderDate: Date;
};

export default function OrdersByDateChart({ orders }: { orders: Order[] }) {
  const countMap: Record<string, number> = {};

  orders.forEach((order) => {
    const dateKey = new Date(order.orderDate).toISOString().slice(0, 10);
    countMap[dateKey] = (countMap[dateKey] || 0) + 1;
  });

  const chartData = Object.entries(countMap).map(([date, count]) => ({
    date,
    count,
  }));

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
