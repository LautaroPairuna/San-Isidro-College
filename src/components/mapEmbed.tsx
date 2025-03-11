"use client";

import { useState } from "react";
import Image from "next/image";

const MapEmbed = () => {
  const [showMap, setShowMap] = useState(false);

  const handleClick = () => {
    setShowMap(true);
  };

  return (
    <div className="w-full h-full relative">
      {showMap ? (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.0870169140185!2d-65.48649632374536!3d-24.79247370797458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941be9dda29c6329%3A0x960b145b5c2957ed!2sSAN%20ISIDRO%20COLLEGE!5e0!3m2!1ses-419!2sar!4v1738620563995!5m2!1ses-419!2sar"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación del colegio"
        ></iframe>
      ) : (
        <div
          onClick={handleClick}
          className="cursor-pointer w-full h-full relative"
          title="Haga clic para cargar el mapa interactivo"
        >
          {/* Imagen estática del mapa */}
          <Image
            src="/ruta/a/tu/imagen-estatica-del-mapa.jpg"
            alt="Mapa del colegio (vista previa)"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
          {/* Overlay con ícono para indicar que se puede activar */}
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
};

export default MapEmbed;
