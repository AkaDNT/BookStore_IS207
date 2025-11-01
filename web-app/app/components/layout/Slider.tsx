"use client";

import { useState, useEffect, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  const slides = [
    {
      id: 1,
      author: "Author of August",
      title: "Eric‑Emmanuel Schmitt",
      description:
        "Awarded more than 20 literary prizes and distinctions, Eric‑Emmanuel Schmitt’s books have been translated into over 40 languages.",
      image: "https://m.media-amazon.com/images/I/71nMgMZJDaL._SY425_.jpg",
      buttonText: "View his books",
      link: "/books",
    },
    {
      id: 2,
      author: "Author of September",
      title: "Michael Connelly",
      description:
        "Michael Connelly is the bestselling author of more than forty novels and one work of nonfiction. With over eighty-nine million copies of his books sold worldwide and translated into forty-five foreign languages, he is one of the most successful writers working today. A former newspaper reporter who worked the crime beat at the Los Angeles Times and the Fort Lauderdale Sun-Sentinel, Connelly has won numerous awards for his journalism and his fiction. His very first novel, The Black Echo, won the prestigious Mystery Writers of America Edgar Award for Best First Novel in 1992. In 2002, Clint Eastwood directed and starred in the movie adaptation of Connelly's 1998 novel, Blood Work",
      image: "https://m.media-amazon.com/images/I/81CWXchKvRL._SY466_.jpg",
      buttonText: "Learn More",
      link: "/page2",
    },
    {
      id: 3,
      author: "Author of October",
      title: "Reese Witherspoon",
      description:
        "Reese Witherspoon is an award-winning actress, producer, founder and New York Times bestselling author. She won an Academy Award® for her portrayal of June Carter Cash in Walk the Line and was later nominated in that same category for Wild in 2014, which she also produced. Witherspoon also starred in beloved films Sweet Home Alabama, Legally Blonde, and Election, as well as the award-winning television series Big Little Lies, Little Fires Everywhere, and The Morning Show. Her other film credits include Disney’s A Wrinkle in Time, Universal Pictures’ animated musical comedy Sing and Sing 2",
      image: "https://m.media-amazon.com/images/I/71IujKyIE8L._SY466_.jpg",
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
          <div className="relative w-[300px] h-[380px] lg:w-[400px] lg:h-[500px] bg-transparent">
            <Image
              src={slides[currentSlide].image}
              alt="Book Cover"
              fill
              className="object-contain object-center rounded-lg shadow-xl"
              sizes="(min-width:1024px) 400px, 60vw"
            />
          </div>
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
