/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchControls() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentParams = new URLSearchParams(searchParams.toString());
  const sort = currentParams.get("sort") || "";
  const categoryFilter = currentParams.get("filter_category_eq") || "";
  const priceFilter = currentParams.get("filter_price_lte") || "";

  const updateParams = (params: URLSearchParams) => {
    params.set("page", "0");
    router.push(`/search?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = new URLSearchParams(currentParams);
    const v = e.target.value;
    v ? p.set("sort", v) : p.delete("sort");
    updateParams(p);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = new URLSearchParams(currentParams);
    const v = e.target.value;
    v ? p.set("filter_category_eq", v) : p.delete("filter_category_eq");
    updateParams(p);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = new URLSearchParams(currentParams);
    const v = e.target.value;
    v ? p.set("filter_price_lte", v) : p.delete("filter_price_lte");
    updateParams(p);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 border-b">
      <select
        value={sort}
        onChange={handleSortChange}
        className="border rounded-md px-3 py-2 w-full sm:w-56 sm:min-w-[14rem]"
      >
        <option value="">Order By</option>
        <option value="price,asc">Price: Low to High</option>
        <option value="price,desc">Price: High to Low</option>
      </select>

      <select
        value={categoryFilter}
        onChange={handleCategoryChange}
        className="border rounded-md px-3 py-2 w-full sm:w-56 sm:min-w-[14rem]"
      >
        <option value="">All Categories</option>
        <option value="Fiction">Fiction</option>
        <option value="Non-Fiction">Non-Fiction</option>
      </select>

      <select
        value={priceFilter}
        onChange={handlePriceChange}
        className="border rounded-md px-3 py-2 w-full sm:w-56 sm:min-w-[14rem]"
      >
        <option value="">Price Range</option>
        <option value="20">Under $20</option>
        <option value="30">Under $30</option>
        <option value="50">Under $50</option>
      </select>
    </div>
  );
}
