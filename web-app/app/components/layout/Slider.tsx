"use client";

import { useState, useEffect, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  // Mảng chứa dữ liệu cho 3 slide, bạn có thể tự điều chỉnh nội dung sau
  const slides = [
    {
      id: 1,
      author: "Author of August",
      title: "Eric‑Emmanuel Schmitt",
      description:
        "Awarded more than 20 literary prizes and distinctions, Eric‑Emmanuel Schmitt’s books have been translated into over 40 languages.",
      image: "/assets/book-cover.jpg",
      buttonText: "View his books",
      link: "/books",
    },
    {
      id: 2,
      author: "Placeholder Author 2",
      title: "Placeholder Title 2",
      description:
        "This is the content for slide 2. Adjust the content as needed.",
      image: "/assets/book-cover.jpg",
      buttonText: "Learn More",
      link: "/page2",
    },
    {
      id: 3,
      author: "Placeholder Author 3",
      title: "Placeholder Title 3",
      description:
        "This is the content for slide 3. Adjust the content as needed.",
      image: "/assets/book-cover.jpg",
      buttonText: "Discover",
      link: "/page3",
    },
  ];

  const changeSlide = (newIndex: SetStateAction<number>) => {
    // Bắt đầu hiệu ứng fade out
    setFade(true);
    setTimeout(() => {
      setCurrentSlide(newIndex);
      // Sau khi chuyển slide, fade in lại
      setFade(false);
    }, 300);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nextSlide = () => {
    changeSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    changeSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  // Tự động chuyển slide sau 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide, nextSlide]); // mỗi khi slide thay đổi, interval sẽ được tái khởi tạo

  return (
    <section className="relative mx-auto w-[80%] mt-[30px] mb-[30px] border-2 border-purple-600 rounded-2xl p-8 bg-white">
      <div
        className={`flex flex-col lg:flex-row items-center transition-opacity duration-500 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Left: Text */}
        <div className="w-full lg:w-1/2 pr-8 border-b lg:border-b-0 lg:border-r-2 border-purple-600 space-y-4 pb-8 lg:pb-0">
          <span className="text-xs uppercase bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
            {slides[currentSlide].author}
          </span>
          <h1 className="text-4xl font-extrabold">
            {slides[currentSlide].title}
          </h1>
          <p className="text-gray-700 leading-relaxed">
            {slides[currentSlide].description}
          </p>
          <Link href={slides[currentSlide].link}>
            <button className="px-6 py-2 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition">
              {slides[currentSlide].buttonText}
            </button>
          </Link>
        </div>

        {/* Right: Image */}
        <div className="w-full lg:w-1/2 pl-8 flex justify-center items-center">
          <Image
            src={slides[currentSlide].image}
            alt="Book Cover"
            width={400}
            height={500}
            className="rounded-lg shadow-xl object-cover"
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4">
        <button
          onClick={prevSlide}
          className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default Slider;
