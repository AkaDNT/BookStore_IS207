"use server";
import React from "react";
import { getAllCustomers } from "@/app/(user)/actions/userAction";
import CustomersClientPage from "./CustomerClientPage";

export default async function UsersPage() {
  const users = await getAllCustomers();

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
      </div>

      <CustomersClientPage initialUsers={users} />
    </section>
  );
}
