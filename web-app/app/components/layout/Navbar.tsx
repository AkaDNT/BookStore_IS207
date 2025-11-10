import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ListOrdered } from "lucide-react";
import AccountDropdown from "./AccountDropdown";
import SearchBar from "../ui/SearchBar";
import { getTotalCartsItem } from "@/app/(user)/actions/cartActions";
import { CurrentUser } from "@/app/(user)/actions/getCurrentUser";

export default async function Navbar({ user }: { user: CurrentUser | null }) {
  const totalCartsItem = await getTotalCartsItem();

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className=" px-2 sm:px-4 lg:px-8">
        {/* Mobile/Tablet: flex 1 hàng; Laptop (>=lg): grid 12 cột như bản gốc */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 py-2 lg:grid lg:grid-cols-12 lg:gap-3">
          {/* Left: Logo */}
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

          {/* Center: Search */}
          <div className="flex-1 min-w-0 lg:col-span-8">
            <SearchBar />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 flex-shrink-0 flex-nowrap lg:col-span-2 lg:justify-self-end">
            {/* Cart */}
            <Link
              href="/my-cart"
              className="relative inline-flex flex-col items-center"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {totalCartsItem > 0 && (
                <span className="absolute -top-1 -right-2 md:-right-3 bg-red-500 text-white text-[10px] md:text-xs font-semibold min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center rounded-full">
                  {totalCartsItem}
                </span>
              )}
              <span className="mt-1 text-xs text-gray-700 hidden md:block">
                Cart
              </span>
              <span className="sr-only">Cart</span>
            </Link>

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
