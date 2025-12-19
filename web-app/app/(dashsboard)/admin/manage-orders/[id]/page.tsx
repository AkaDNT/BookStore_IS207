"use server";

import { getOrderById } from "@/app/(user)/actions/adminApi";
import OrderDetailClient from "./OrderDetailClient";
export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const res = await getOrderById(id);

  if ("error" in (res as any)) {
    return (
      <section className="w-full max-w-7xl mx-auto">
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {(res as any).error.message}
        </div>
      </section>
    );
  }

  const order = res as any;

  return (
    <section className="w-full max-w-7xl mx-auto space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Order Detail
      </h1>
      <OrderDetailClient order={order} />
    </section>
  );
}
