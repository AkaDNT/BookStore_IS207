import React from "react";
import { Truck, Star, BookOpen } from "lucide-react";

const InfoRow = () => {
  return (
    <section className="mx-auto w-[80%] my-6">
      <div className="flex items-center w-full">
        {/* Mục 1 */}
        <div className="flex-1 flex justify-center items-center space-x-2">
          <Truck className="w-6 h-6 text-black" />
          <span className="font-bold text-lg text-black">
            Free shipping over 50$
          </span>
        </div>

        <div className="border-l-2 border-purple-600 h-8 mx-4" />

        {/* Mục 2 */}
        <div className="flex-1 flex justify-center items-center space-x-2">
          <Star className="w-6 h-6 text-black" />
          <span className="font-bold text-lg text-black">
            Save with loyalty points
          </span>
        </div>

        <div className="border-l-2 border-purple-600 h-8 mx-4" />

        {/* Mục 3 */}
        <div className="flex-1 flex justify-center items-center space-x-2">
          <BookOpen className="w-6 h-6 text-black" />
          <span className="font-bold text-lg text-black">Read a few pages</span>
        </div>
      </div>
    </section>
  );
};

export default InfoRow;
