import React, { useEffect, useRef, useState } from 'react';

const Carousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const totalSlides = 3; // Número total de slides

  // Función para cambiar el slide (circularmente)
  const showSlide = (i: number) => {
    const newIndex = (i + totalSlides) % totalSlides;
    setIndex(newIndex);
  };

  // Autoavance: se actualiza el índice cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Cada vez que cambia el índice se actualiza la transformación del contenedor
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  return (
    <div className="relative w-full mx-auto overflow-hidden py-10 border-t-4 border-b-4 border-[#71af8d]">
      {/* Contenedor de slides */}
      <div ref={carouselRef} className="flex transition-transform duration-500 ease-in-out">
        {/* Slide 1 */}
        <div className="min-w-full flex justify-center items-center">
          <img
            src="/images/google-education-logo.webp"
            alt="Google for Education"
            className="h-16 object-contain"
          />
        </div>
        {/* Slide 2 */}
        <div className="min-w-full flex justify-center items-center">
          <img
            src="/images/epea-logo.webp"
            alt="EPEA"
            className="h-16 object-contain"
          />
        </div>
        {/* Slide 3 */}
        <div className="min-w-full flex justify-center items-center">
          <img
            src="/images/science-bits-logo.webp"
            alt="Science Bits"
            className="h-16 object-contain"
          />
        </div>
      </div>
      
      {/* Botón Izquierdo */}
      <button
        onClick={() => showSlide(index - 1)}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md"
      >
        &#10094;
      </button>
      
      {/* Botón Derecho */}
      <button
        onClick={() => showSlide(index + 1)}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
