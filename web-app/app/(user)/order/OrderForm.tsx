"use client";

import React, { useState } from "react";
import { Truck, QrCode } from "lucide-react";
import { orderItemsInCart } from "../actions/orderActions";
import { createVnpayPayment } from "../actions/paymentAction";
import { UserAddress } from "../models/Address";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = { addresses: UserAddress[] };

export default function OrderForm({ addresses }: Props) {
  const [pending, setPending] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    addresses[0]?.id ?? null
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const addressId = Number(formData.get("addressId"));
    const paymentMethod = formData.get("paymentMethod") as
      | "COD"
      | "VNPAY"
      | null;

    if (!addressId || Number.isNaN(addressId)) {
      toast.error("Please select a delivery address before placing an order.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    const data = {
      addressId,
      paymentMethod,
      pgName: paymentMethod,
      pgPaymentId: "",
      pgStatus: "",
      pgResponseMessage: "",
    };

    try {
      setPending(true);

      if (paymentMethod === "COD") {
        await orderItemsInCart(data, paymentMethod);
        toast.success("Order placed successfully!");
        router.push("/order/my-orders");
        return;
      }

      if (paymentMethod === "VNPAY") {
        const res: any = await createVnpayPayment(addressId);

        if ("error" in res) {
          toast.error(res.error.message || "VNPAY payment failed.");
          return;
        }

        if (!res.data) {
          toast.error("Payment URL from VNPAY is missing.");
          return;
        }

        toast.success("Redirecting to VNPAY payment page...");
        window.location.href = res.data;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(message);
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="p-6 sm:p-8 border rounded-xl text-center space-y-3 bg-slate-50 border-slate-200">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
          You don&apos;t have any address yet.
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Please add a delivery address before placing an order.
        </p>
        <button
          onClick={() => router.push("/account/addresses")}
          className="px-5 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
        >
          Add Address
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-slate-800">
          Select address
        </h2>
        <div className="space-y-3">
          {addresses.map((addr) => (
            <label key={addr.id} className="block cursor-pointer">
              <input
                type="radio"
                name="addressId"
                value={addr.id}
                required
                className="peer sr-only"
                onChange={() => setSelectedAddressId(addr.id)}
                defaultChecked={addr.id === addresses[0].id}
              />
              <div
                className="border border-slate-200 rounded-xl p-4 bg-white transition
                           peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:ring-1 peer-checked:ring-rose-200"
              >
                <p className="font-medium text-slate-800">
                  {addr.buildingName}, {addr.street}
                </p>
                <p className="text-sm text-slate-600">
                  {addr.ward}, {addr.district}, {addr.city}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => router.push("/account/addresses/new")}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl
                       border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            + Add new address
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-slate-800">
          Select payment method
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            { label: "COD", icon: <Truck className="w-4 h-4 mr-2" /> },
            { label: "VNPAY", icon: <QrCode className="w-4 h-4 mr-2" /> },
          ].map((m) => (
            <label
              key={m.label}
              className="flex items-center justify-center px-4 py-2 border rounded-xl bg-white
                         text-slate-700 border-slate-200 cursor-pointer transition
                         has-[input:checked]:bg-rose-50 has-[input:checked]:text-rose-700
                         has-[input:checked]:border-rose-500"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.label}
                defaultChecked={m.label === "COD"}
                className="hidden"
              />
              <span className="flex items-center text-sm sm:text-base">
                {m.icon}
                {m.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending || !selectedAddressId}
        className="w-full h-11 sm:h-12 rounded-xl text-white
                   bg-rose-500 hover:bg-rose-600 transition
                   disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {pending ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
