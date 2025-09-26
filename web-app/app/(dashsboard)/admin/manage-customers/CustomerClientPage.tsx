"use client";

import { useState } from "react";
import UserTable from "@/app/components/ui/UserTable";
import { UserResponseForAdmin } from "@/app/(user)/models/UserResponseForAdmin";
import { searchCustomers } from "@/app/(user)/actions/userAction";
import SearchBar from "@/app/components/ui/SearchBarReusable";

export default function CustomersClientPage({
  initialUsers,
}: {
  initialUsers: UserResponseForAdmin[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await searchCustomers(term);
      if ("error" in res) {
        setError(res.error.message);
        setUsers([]);
      } else {
        setUsers(res);
      }
    } catch (err) {
      setError("Something went wrong." + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} placeholder="Search users..." />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <UserTable users={users} />
    </div>
  );
}
