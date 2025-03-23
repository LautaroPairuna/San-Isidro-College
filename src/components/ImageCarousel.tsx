"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  images: string[];
  altText?: string;
  className?: string;
  autoPlayInterval?: number;
}

const useInterval = (callback: () => void, delay: number | null) => {
  const saved = useRef(callback);
  useEffect(() => { saved.current = callback }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default function ImageCarousel({
  images,
  altText = "",
  className = "",
  autoPlayInterval = 5000,
}: Props) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const go = useCallback((i: number) => setIndex((i + total) % total), [total]);

  useInterval(() => go(index + 1), total > 1 ? autoPlayInterval : null);

  if (!total) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-full">
            <Image
              src={src}
              alt={altText}
              fill
              style={{ objectFit: "cover" }}
              placeholder="blur"
              blurDataURL="/placeholder.png"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-4 bg-black/50 px-4 py-2 rounded-full">
        <button aria-label="Previous slide" onClick={() => go(index - 1)}>
          <FiChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-transform ${
                i === index ? "scale-110 bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
        <button aria-label="Next slide" onClick={() => go(index + 1)}>
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
