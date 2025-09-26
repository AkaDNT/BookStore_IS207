"use client";

import React, { useState } from "react";
import { CreditCard, Truck } from "lucide-react";
import { orderItemsInCart } from "../actions/orderActions";
import { UserAddress } from "../models/Address";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  addresses: UserAddress[];
};

const paymentMethods = [
  { label: "CARD", icon: "CreditCard" },
  { label: "COD", icon: "Truck" },
  { label: "PAYPAL", icon: "DollarSign" },
];

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
      <div className="p-6 border rounded-xl text-center space-y-4 bg-yellow-50 border-yellow-300">
        <h2 className="text-xl font-semibold text-gray-700">
          You don&apos;t have any address yet.
        </h2>
        <p className="text-gray-600">
          Please add a delivery address before placing an order.
        </p>
        <button
          onClick={() => router.push("/account/addresses")}
          className="px-6 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition"
        >
          Add Address
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Address */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select address</h2>
        {addresses.map((addr) => (
          <label
            key={addr.id}
            className="block border rounded-xl p-4 cursor-pointer has-[:checked]:border-blue-600 border-gray-300 mb-2"
          >
            <input
              type="radio"
              name="addressId"
              value={addr.id}
              required
              className="mr-3 peer"
            />
            <div className="peer-checked:font-semibold">
              <p>
                {addr.buildingName}, {addr.street}
              </p>
              <p className="text-sm text-gray-500">
                {addr.ward}, {addr.district}, {addr.city}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Payment method */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select payment method</h2>
        <div className="flex gap-4">
          {paymentMethods.map((method) => (
            <label
              key={method.label}
              className="flex items-center px-4 py-2 border rounded-xl transition has-[:checked]:bg-blue-600 has-[:checked]:text-white bg-white text-gray-700 border-gray-300 cursor-pointer"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.label}
                defaultChecked={method.label === "CARD"}
                className="hidden"
              />
              <span className="flex items-center">
                {method.label === "CARD" && (
                  <CreditCard className="w-4 h-4 inline mr-2" />
                )}
                {method.label === "COD" && (
                  <Truck className="w-4 h-4 inline mr-2" />
                )}
                {method.label === "PAYPAL" && <span className="mr-2">💸</span>}
                {method.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment-gateway details */}
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
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.label}</label>
            <input
              type="text"
              name={field.name}
              required
              className="w-full border px-3 py-2 rounded-lg"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {pending ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
