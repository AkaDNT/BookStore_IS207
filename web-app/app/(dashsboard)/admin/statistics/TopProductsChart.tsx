"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type Order = {
  orderItems: {
    book: { title: string };
    quantity: number;
  }[];
};

export default function TopProductsChart({ orders }: { orders: Order[] }) {
  const productMap: Record<string, number> = {};

  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const title = item.book.title;
      productMap[title] = (productMap[title] || 0) + item.quantity;
    });
  });

  const chartData = Object.entries(productMap).map(([title, quantity]) => ({
    title,
    quantity,
  }));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Top Products</h2>
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantity" fill="#ffc658" />
      </BarChart>
    </div>
  );
}
