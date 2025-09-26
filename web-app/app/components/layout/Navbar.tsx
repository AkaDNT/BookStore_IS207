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
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <Link href="/">
          <Image
            className="h-10 cursor-pointer"
            src="/logo.png"
            alt="Logo"
            width={120}
            height={50}
          />
        </Link>
      </div>

      {/* Center: Search */}
      <SearchBar></SearchBar>

      {/* Right: Icons */}
      <div className="flex space-x-8 items-center relative">
        <Link
          href="/my-cart"
          className="relative flex flex-col items-center cursor-pointer"
        >
          <ShoppingCart size={24} />
          {totalCartsItem > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
              {totalCartsItem}
            </span>
          )}
          <span className="text-sm mt-1">Cart</span>
        </Link>

        <div className="flex flex-col items-center cursor-pointer">
          <Link
            href={"/order/my-orders"}
            className="flex flex-col items-center cursor-pointer"
          >
            <ListOrdered size={24} />
            <span className="text-sm mt-1">Order History</span>
          </Link>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <AccountDropdown user={user} />
        </div>
      </div>
    </nav>
  );
}
