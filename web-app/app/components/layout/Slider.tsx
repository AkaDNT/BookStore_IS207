"use client";

import { useState, useEffect, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  const slides = [
    {
      id: 1,
      author: "Author of August",
      title: "Eric-Emmanuel Schmitt",
      description:
        "Awarded more than 20 literary prizes and distinctions, Eric-Emmanuel Schmitt’s books have been translated into over 40 languages.",
      image: "https://m.media-amazon.com/images/I/71nMgMZJDaL._SY425_.jpg",
      buttonText: "View his books",
      link: "/books",
    },
    {
      id: 2,
      author: "Author of September",
      title: "Michael Connelly",
      description:
        "Michael Connelly is the bestselling author of more than forty novels and one work of nonfiction. With over eighty-nine million copies of his books sold worldwide…",
      image: "https://m.media-amazon.com/images/I/81CWXchKvRL._SY466_.jpg",
      buttonText: "Learn More",
      link: "/page2",
    },
    {
      id: 3,
      author: "Author of October",
      title: "Reese Witherspoon",
      description:
        "Reese Witherspoon is an award-winning actress, producer, founder and New York Times bestselling author…",
      image: "https://m.media-amazon.com/images/I/71IujKyIE8L._SY466_.jpg",
      buttonText: "Discover",
      link: "/page3",
    },
  ];

  const changeSlide = (newIndex: SetStateAction<number>) => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide(newIndex);
      setFade(false);
    }, 300);
  };

  const nextSlide = () => changeSlide((currentSlide + 1) % slides.length);
  const prevSlide = () =>
    changeSlide((currentSlide - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  return (
    <section
      className="relative mx-auto
  w-full max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-2rem)] lg:max-w-none lg:w-[80%]
  mt-6 mb-6 sm:mt-8 sm:mb-8
  border-2 border-purple-600 rounded-2xl p-4 sm:p-6 lg:p-8 bg-white"
    >
      <div
        className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-8 transition-opacity duration-500 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Left: Text */}
        <div className="w-full lg:w-1/2 lg:pr-8 border-b lg:border-b-0 lg:border-r-2 border-purple-600 space-y-3 sm:space-y-4 pb-6 lg:pb-0">
          <span className="text-[10px] sm:text-xs uppercase bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
            {slides[currentSlide].author}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
            {slides[currentSlide].title}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {slides[currentSlide].description}
          </p>

          {/* CTA: center trên mobile, trái ở laptop */}
          <div className="mt-2 flex justify-center lg:justify-start">
            <Link href={slides[currentSlide].link}>
              <button className="h-11 sm:h-12 px-5 sm:px-6 bg-purple-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-purple-700 transition">
                {slides[currentSlide].buttonText}
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div className="w-full lg:w-1/2 lg:pl-8 flex justify-center items-center mt-2 lg:mt-0">
          <div className="relative w-[260px] h-[340px] sm:w-[300px] sm:h-[380px] lg:w-[400px] lg:h-[500px]">
            <Image
              src={slides[currentSlide].image}
              alt="Book Cover"
              fill
              className="object-contain object-center rounded-lg shadow-xl"
              sizes="(min-width:1024px) 400px, (min-width:640px) 70vw, 85vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* Controls + bullets (mt lớn hơn ở mobile/tablet) */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-5 mt-8 sm:mt-10 md:mt-12 lg:mt-5">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="bg-purple-600 text-white p-2 sm:p-3 rounded-full hover:bg-purple-700 transition"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Bullets kiểu ListBooks: vòng tròn border-2, active fill tím */}
        <div className="flex items-center gap-2 sm:gap-3">
          {slides.map((_, i) => {
            const active = i === currentSlide;
            return (
              <button
                key={i}
                onClick={() => changeSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 ${
                  active
                    ? "bg-purple-600 border-purple-600"
                    : "bg-white border-purple-600 hover:bg-purple-100"
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="bg-purple-600 text-white p-2 sm:p-3 rounded-full hover:bg-purple-700 transition"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
};

export default Slider;
