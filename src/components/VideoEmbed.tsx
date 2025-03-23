"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface VideoEmbedProps {
  videoId: string;
  placeholderSrc: string;
}

export default function VideoEmbed({ videoId, placeholderSrc }: VideoEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      {loaded ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Video de las instalaciones del colegio"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <Image
          src={placeholderSrc}
          alt="Previsualización del video"
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="/placeholder.png"
        />
      )}
    </div>
  );
}
