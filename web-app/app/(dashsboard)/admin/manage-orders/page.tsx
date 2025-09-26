"use server";

import { getAllOrders } from "@/app/(user)/actions/orderActions";
import OrderTable from "@/app/components/ui/OrderTable";
import React from "react";

export default async function OrdersPage() {
  const orders = await getAllOrders();

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Orders</h1>
      </div>

      <OrderTable orders={orders} />
    </section>
  );
}
