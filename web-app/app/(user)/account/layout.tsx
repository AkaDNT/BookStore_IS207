import AccountSidebar from "./AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center w-full px-2 md:px-4">
      <div className="flex w-full max-w-6xl bg-white border border-gray-200 rounded-xl shadow-sm mt-10 mb-6 overflow-hidden">
        <aside className="hidden md:block w-64 border-r border-gray-200 bg-white p-6">
          <AccountSidebar />
        </aside>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
