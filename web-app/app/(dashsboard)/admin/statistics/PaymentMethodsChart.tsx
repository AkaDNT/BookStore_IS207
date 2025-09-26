"use client";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

type Order = {
  payment: {
    paymentMethod: string;
  };
};

export default function PaymentMethodsChart({ orders }: { orders: Order[] }) {
  const methodMap: Record<string, number> = {};

  orders.forEach((order) => {
    const method = order.payment.paymentMethod.toUpperCase();
    methodMap[method] = (methodMap[method] || 0) + 1;
  });

  const chartData = Object.entries(methodMap).map(([method, count]) => ({
    name: method,
    value: count,
  }));

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
