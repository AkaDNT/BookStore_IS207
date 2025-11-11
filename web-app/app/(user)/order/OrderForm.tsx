"use client";

import React, { useState } from "react";
import { CreditCard, Truck } from "lucide-react";
import { orderItemsInCart } from "../actions/orderActions";
import { UserAddress } from "../models/Address";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = { addresses: UserAddress[] };

export default function OrderForm({ addresses }: Props) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      addressId: Number(formData.get("addressId")),
      paymentMethod: formData.get("paymentMethod") as string,
      pgName: formData.get("pgName") as string,
      pgPaymentId: formData.get("pgPaymentId") as string,
      pgStatus: formData.get("pgStatus") as string,
      pgResponseMessage: formData.get("pgResponseMessage") as string,
    };

    try {
      setPending(true);
      await orderItemsInCart(data, data.paymentMethod);
      toast.success("Order placed successfully!");
      router.push("/order/my-orders");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred, please try again.";
      toast.error(message);
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="p-6 sm:p-8 border rounded-xl text-center space-y-3 bg-yellow-50 border-yellow-300">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          You don&apos;t have any address yet.
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Please add a delivery address before placing an order.
        </p>
        <button
          onClick={() => router.push("/account/addresses")}
          className="px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition"
        >
          Add Address
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Addresses */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3">
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
              />
              <div
                className="border border-gray-300 rounded-xl p-4 bg-white transition
                           peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-200"
              >
                <p className="font-medium">
                  {addr.buildingName}, {addr.street}
                </p>
                <p className="text-sm text-gray-500">
                  {addr.ward}, {addr.district}, {addr.city}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-2">
          Select payment method
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "CARD", icon: <CreditCard className="w-4 h-4 mr-2" /> },
            { label: "COD", icon: <Truck className="w-4 h-4 mr-2" /> },
            { label: "PAYPAL", icon: <span className="mr-2">💸</span> },
          ].map((m) => (
            <label
              key={m.label}
              className="flex items-center justify-center px-4 py-2 border rounded-xl bg-white text-gray-700
                         border-gray-300 cursor-pointer transition
                         has-[input:checked]:bg-blue-600 has-[input:checked]:text-white"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.label}
                defaultChecked={m.label === "CARD"}
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

      {/* Payment-gateway fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            name: "pgName",
            label: "PG Name",
            placeholder: "Stripe / PayPal / VNPay...",
          },
          {
            name: "pgPaymentId",
            label: "PG Payment ID",
            placeholder: "pi_1adsnakdnads",
          },
          {
            name: "pgStatus",
            label: "PG Status",
            placeholder: "succeeded / failed",
          },
          {
            name: "pgResponseMessage",
            label: "PG Response Message",
            placeholder: "Payment successful",
          },
        ].map((f) => (
          <div key={f.name}>
            <label className="block mb-1 font-medium text-sm sm:text-base">
              {f.label}
            </label>
            <input
              type="text"
              name={f.name}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full h-11 sm:h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {pending ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
