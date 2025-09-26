"use server";
import React from "react";
import { getAllEmployees } from "@/app/(user)/actions/userAction";
import EmployeesClientPage from "./EmployeeClientPage";

export default async function UsersPage() {
  const users = await getAllEmployees();

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
      </div>

      <EmployeesClientPage initialUsers={users} />
    </section>
  );
}
