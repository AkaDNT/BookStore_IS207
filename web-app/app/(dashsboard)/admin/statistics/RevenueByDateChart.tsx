"use client";

import dynamic from "next/dynamic";
import { Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Order } from "@/app/(user)/models/Order";

const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  {
    ssr: false,
  }
);

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export default function RevenueByDateChart({ orders }: { orders: Order[] }) {
  const revenueMap: Record<string, number> = {};

  orders.forEach((order) => {
    const dateKey = new Date(order.orderDate).toISOString().slice(0, 10);
    const amount = toNumber((order as any).totalAmount);
    revenueMap[dateKey] = (revenueMap[dateKey] || 0) + amount;
  });

  const chartData = Object.entries(revenueMap)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Revenue by Date</h2>

      <LineChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value) =>
            new Intl.NumberFormat("vi-VN").format(toNumber(value))
          }
          labelFormatter={(label) => String(label)}
        />
        <Line type="monotone" dataKey="total" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
