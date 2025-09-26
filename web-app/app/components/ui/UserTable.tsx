"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { UserResponseForAdmin } from "@/app/(user)/models/UserResponseForAdmin";

export default function UserTable({
  users,
}: {
  users: UserResponseForAdmin[];
}) {
  if (!users.length)
    return <p className="text-gray-600 italic">No users found.</p>;

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-purple-100">
          <tr>
            {["#", "Username", "Email", "Roles", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((u, idx) => (
            <tr key={u.id} className="odd:bg-white even:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {u.userName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {u.roles.map((r) => r.roleName.replace("ROLE_", "")).join(", ")}
              </td>
              <td className="px-4 py-3 text-sm flex items-center gap-3">
                <Link
                  href={`/users/${u.id}/edit`}
                  className="text-purple-600 hover:text-purple-800"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <Link
                  href={`/users/${u.id}/delete`}
                  className="text-rose-600 hover:text-rose-800"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
