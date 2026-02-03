"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function MapEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
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
      {loaded ? (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.0870169140185!2d-65.4864963!3d-24.7924737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941be9dda29c6329%3A0x960b145b5c2957ed!2sSAN%20ISIDRO%20COLLEGE!5e0!3m2!1ses-419!2sar!4v1738620563995!5m2!1ses-419!2sar"
          className="w-full h-full border-0 rounded-lg shadow-lg"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación del colegio"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg shadow-lg flex items-center justify-center">
          <span className="text-gray-400">Cargando mapa...</span>
        </div>
      )}
    </div>
  );
}
