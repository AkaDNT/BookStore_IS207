"use client";

import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import type { Order } from "@/app/(user)/models/Order";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

type Props = {
  orders: Order[];
};

export default function PaymentMethodsChart({ orders }: Props) {
  const methodMap: Record<string, number> = {};

  orders.forEach((order) => {
    // payment có thể null, nên phải check
    const rawMethod = order.payment?.paymentMethod ?? "UNKNOWN";
    const method = rawMethod.toUpperCase();

    methodMap[method] = (methodMap[method] || 0) + 1;
  });

  const chartData = Object.entries(methodMap).map(([method, count]) => ({
    name: method,
    value: count,
  }));

  if (chartData.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
        <p className="text-sm text-gray-500">No payment data.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
      <PieChart width={600} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
