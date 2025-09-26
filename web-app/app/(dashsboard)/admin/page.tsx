"use server";

import { getAllOrders } from "@/app/(user)/actions/orderActions";
import RevenueByDateChart from "./statistics/RevenueByDateChart";
import OrdersByDateChart from "./statistics/OrdersByDateChart";
import PaymentMethodsChart from "./statistics/PaymentMethodsChart";
import TopProductsChart from "./statistics/TopProductsChart";

export default async function StatisticsPage() {
  const orders = await getAllOrders();
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <div className="col-span-8 bg-white p-4 rounded-xl shadow items-center">
        <RevenueByDateChart orders={orders} />
      </div>

      <div className="col-span-4 bg-white p-4 rounded-xl shadow">
        <PaymentMethodsChart orders={orders} />
      </div>

      <div className="col-span-6 bg-white p-4 rounded-xl shadow">
        <OrdersByDateChart orders={orders} />
      </div>

      <div className="col-span-6 bg-white p-4 rounded-xl shadow">
        <TopProductsChart orders={orders} />
      </div>
    </div>
  );
}
