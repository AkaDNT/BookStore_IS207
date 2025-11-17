import Image from "next/image";
import Link from "next/link";
import { ListOrdered } from "lucide-react";
import AccountDropdown from "./AccountDropdown";
import SearchBar from "../ui/SearchBar";
import { getTotalCartsItem } from "@/app/(user)/actions/cartActions";
import { CurrentUser } from "@/app/(user)/actions/getCurrentUser";
import CartButton from "./CartButton"; // 👈 thêm

export default async function Navbar({ user }: { user: CurrentUser | null }) {
  const totalCartsItem = await getTotalCartsItem();

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className=" px-2 sm:px-4 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 py-2 lg:grid lg:grid-cols-12 lg:gap-3">
          {/* Logo */}
          <div className="flex-shrink-0 lg:col-span-2 lg:mr-20">
            <Link href="/" aria-label="Go to homepage">
              <Image
                className="h-8 sm:h-10 w-auto cursor-pointer"
                src="/logo.png"
                alt="Logo"
                width={120}
                height={50}
                priority
              />
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-0 lg:col-span-8">
            <SearchBar />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 flex-shrink-0 flex-nowrap lg:col-span-2 lg:justify-self-end">
            {/* Cart với animation */}
            <CartButton totalCartsItem={totalCartsItem} />

            {/* Order History */}
            <Link
              href="/order/my-orders"
              className="inline-flex flex-col items-center"
              aria-label="Order history"
            >
              <ListOrdered className="w-5 h-5 md:w-6 md:h-6" />
              <span className="mt-1 text-xs text-gray-700 hidden md:block">
                Order History
              </span>
              <span className="sr-only">Order History</span>
            </Link>

            {/* Account */}
            <div className="inline-flex flex-col items-center">
              <AccountDropdown user={user} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
