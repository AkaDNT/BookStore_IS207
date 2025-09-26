"use server";

import React from "react";
import { getCurrentUser } from "../../actions/getCurrentUser";
import { Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";

export default async function UserAddresses() {
  const user = await getCurrentUser();
  const addresses = user?.addresses || [];

  return (
    <main className="p-4 sm:p-6 w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-rose-600">
        Your Addresses
      </h1>

      <div className="space-y-4">
        {addresses.length === 0 && (
          <p className="text-gray-500 italic">You have no saved addresses.</p>
        )}
        {addresses.map((addr, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold">
                {addr.street}, {addr.buildingName}
              </p>
              <p className="text-sm text-gray-500">
                {addr.ward}, {addr.district}, {addr.city}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/account/addresses/update/${String(addr.id)}`}
                className="p-2 rounded-full hover:bg-rose-100 text-rose-600 transition"
                aria-label="Edit Address"
              >
                <Pencil size={18} />
              </Link>
              <button
                className="p-2 rounded-full hover:bg-rose-100 text-rose-600 transition"
                aria-label="Delete Address"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add address button */}
      <div className="flex justify-end mt-6">
        <button
          className=" bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg shadow transition"
          aria-label="Add Address"
        >
          <Link
            href={"/account/addresses/new"}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Address</span>
          </Link>
        </button>
      </div>
    </main>
  );
}
