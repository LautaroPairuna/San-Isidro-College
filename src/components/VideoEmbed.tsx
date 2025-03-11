"use client";

import { useState } from "react";
import Image from "next/image";

interface VideoEmbedProps {
  videoId: string;
  placeholderSrc: string;
}

export default function VideoEmbed({ videoId, placeholderSrc }: VideoEmbedProps) {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <div className="aspect-w-16 aspect-h-9 relative mb-8">
      {showIframe ? (
        <iframe
          className="w-full h-full rounded shadow"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Video de las instalaciones del colegio"
          frameBorder="0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div
          className="cursor-pointer relative w-full h-full"
          onClick={() => setShowIframe(true)}
        >
          <Image
            src={placeholderSrc}
            alt="Previsualización del video"
            layout="fill"
            objectFit="cover"
            className="rounded shadow"
          />
          {/* Overlay con ícono de play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="30" fill="rgba(0,0,0,0.5)" />
              <polygon points="25,20 45,30 25,40" fill="#fff" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
