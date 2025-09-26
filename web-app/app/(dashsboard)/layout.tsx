import { PropsWithChildren } from "react";
import NavAdmin from "../components/layout/NavAdmin";
import AdminHeader from "../components/layout/AdminHeader";
import { getCurrentUser } from "../(user)/actions/getCurrentUser";

export default async function LayoutAdminPage({ children }: PropsWithChildren) {
  const user = await getCurrentUser();
  return (
    <div className="flex">
      <NavAdmin />

      <div className="flex-1 flex flex-col">
        <AdminHeader currentUser={user} />

        <main className="p-6 bg-gradient-to-r from-purple-100 via-rose-100 to-white border-b border-gray-200 shadow-md">
          {children}
        </main>
      </div>
    </div>
  );
}
