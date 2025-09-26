"use server";
import React from "react";
import { getAllUsers } from "@/app/(user)/actions/userAction";
import UsersClientPage from "./UsersClientPage";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
      </div>

      <UsersClientPage initialUsers={users} />
    </section>
  );
}
