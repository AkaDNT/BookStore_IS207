import Link from "next/link";
import React from "react";
import { getCurrentUser } from "../../actions/getCurrentUser";

export default async function page() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="p-6 text-red-600">User not found.</div>;
  }

  return (
    <div className="p-6 flex flex-col min-h-[300px] space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-rose-600 mb-4">
          Profile Information
        </h1>

        <div className="space-y-2">
          <div className="text-base">
            <span className="font-medium text-gray-700">Username: </span>
            <span className="text-gray-900">{user.userName}</span>
          </div>
          <div className="text-base">
            <span className="font-medium text-gray-700">Email: </span>
            <span className="text-gray-900">{user.email}</span>
          </div>
          <div className="text-base">
            <span className="font-medium text-gray-700">Phone Number: </span>
            <span className="text-gray-900">{user.phoneNumber}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-auto">
        <Link
          href="/account/profile/update"
          className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Update Info
        </Link>
      </div>
    </div>
  );
}
