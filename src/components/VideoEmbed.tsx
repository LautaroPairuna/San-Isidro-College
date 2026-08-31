"use client";

import { useState, useRef, useEffect } from "react";

interface VideoEmbedProps {
  videoId: string;
  placeholderSrc: string;
}

export default function VideoEmbed({ videoId, placeholderSrc }: VideoEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loadIframe, setLoadIframe] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full">
      {loadIframe ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Video de las instalaciones del colegio"
          className="w-full h-full border-0 rounded-lg shadow-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <img src={placeholderSrc} alt="Previsualización del vídeo" style={{ objectFit: "cover" }} className="absolute inset-0 h-full w-full rounded-lg shadow-lg" />
      )}
    </div>
  );
}
