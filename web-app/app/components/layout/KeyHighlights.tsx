import React from "react";
import { Truck, Star, BookOpen } from "lucide-react";

const InfoRow = () => {
  return (
    <section className="mx-auto w-full lg:w-[80%] px-4 sm:px-6 my-6">
      <div className="bg-white rounded-2xl border-2 border-purple-600 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 sm:gap-0 sm:divide-x-2 sm:divide-purple-600">
          <div className="flex items-center justify-center gap-2 px-2 py-1">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            <span className="font-bold text-base sm:text-lg text-black">
              Free shipping over 50$
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 px-2 py-1">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            <span className="font-bold text-base sm:text-lg text-black">
              Save with loyalty points
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 px-2 py-1">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            <span className="font-bold text-base sm:text-lg text-black">
              Read a few pages
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoRow;
