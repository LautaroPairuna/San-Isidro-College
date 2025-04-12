// app/page.tsx
"use client";
import Contact from '@/components/sectionContact'; // Ajusta la ruta según tu estructura
import Carousel from '@/components/sectionCarrusel';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div id="container">
      {/* Sección 1: Imagen de fondo y texto */}
      <section className="relative w-full h-auto grid grid-cols-12">
        {/* Columna Izquierda: Contenido superpuesto */}
        <div className="col-span-5 flex flex-col justify-center items-start px-16 bg-[#71af8d] relative max-sm:col-span-12 max-sm:items-center max-sm:px-6 max-sm:py-24">
          <Image 
            src="/images/eslogan.svg" 
            alt="I am because we are" 
            width={250}
            height={250}
            className="absolute top-[55%] left-[80%] transform -translate-x-1/2 z-40
                      max-sm:relative max-sm:top-15 max-sm:-left-16 max-lg:top-60 max-lg:left-80 max-sm:translate-x-0
                      max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
          />
          {/* Botón para móvil */}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
            target="_blank"
            className="max-sm:absolute max-sm:bottom-4 max-sm:right-4 flex items-center text-center gap-3 px-2 py-1 bg-[#1e804b] text-white rounded-full shadow-lg transition sm:hidden z-10"
          >
            <Image
              src="/images/ico-admisiones.svg"
              alt="Ver Admisiones"
              width={24}
              height={24}
              sizes="(max-width: 640px) 24px, 24px"
            />
            <span className="leading-none">ADMISIONES</span>
          </Link>
        </div>

        {/* Columna Derecha: Imagen de fondo (LCP) y botón */}
        <div className="col-span-7 relative w-full h-full max-sm:col-span-12">
          <Image
            src="/images/fondo-home.webp"
            alt="Imagen de fondo"
            width={1920}
            height={1080}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1000px"
            className="w-full h-full object-cover"
            priority
          />
          <button className="absolute bottom-6 right-6 items-center gap-3 px-6 py-3 bg-[#1e804b] text-white rounded-full shadow-lg transition z-40 hidden sm:flex">
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
              target="_blank"
              className='flex items-center gap-2'
            >
              <Image
                src="/images/ico-admisiones.svg"
                alt="Ver Admisiones"
                width={32}
                height={32}
                sizes="32px"
              />
              ADMISIONES
            </Link>
          </button>
        </div>

        {/* Figura decorativa (LCP optimizada) */}
        <Image
          src="/images/formas/forma-home-1.svg"
          alt="Forma decorativa"
          width={1000}
          height={1000}
          priority
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 100vw"
          className="absolute top-0 left-4/12 transform -translate-x-1/2 h-full pointer-events-none
                     max-sm:w-3/4 max-sm:-top-35 max-sm:left-40 max-sm:-translate-x-1/2"
        />
      </section>

      {/* Sección 2: Bienvenida */}
      <section className="relative w-full h-auto py-10 bg-white">
        <div className="grid grid-cols-12 gap-8 max-w-screen-xl mx-auto">
          {/* Columna Izquierda */}
          <div className="col-span-4 relative flex flex-col justify-center max-sm:col-span-12">
            <div className="bg-white shadow-xl rounded-xl p-8 absolute top-10 left-[55%] w-[450px] z-20 max-sm:relative max-sm:top-35 max-sm:left-0 max-sm:w-[90%] max-sm:mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                BIENVENIDOS A SAN ISIDRO
              </h1>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Somos conscientes de que, probablemente, una de las decisiones
                más importantes a la que como padres se enfrentan, es la elección
                de un Colegio para sus hijos, instancia que generará gran impacto
                en sus vidas. Por ello, es vital tomar la decisión correcta.
              </p>
            </div>
            {/* Línea decorativa */}
            <Image
              src="/images/formas/forma-home-2.svg"
              alt="Decoración"
              width={650}
              height={350}
              className="absolute -top-0 -left-0 w-[650px] max-sm:absolute max-sm:top-0 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[600px]"
            />
          </div>

          {/* Columna Derecha */}
          <div className="col-span-8 max-sm:col-span-12 z-10">
            <Image
              src="/images/fondo-bienvenida.webp"
              alt="Imagen del colegio"
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Sección 3: Fondo verde con íconos e imagen */}
      <section className="relative w-full bg-[#71af8d] py-10">
      {/* Imagen decorativa detrás */}
      <Image
        src="/images/formas/forma-home-3.svg"
        alt="Forma decorativa"
        width={800}
        height={300}
        sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 100vw"
        className="absolute top-25 md:-top-5 right-[5%] 2xl:w-[750px] xl:w-[700px] w-[500px] lg:z-20 z-10 pointer-events-none"
      />

      {/* Contenedor principal de la sección */}
      <div className="relative max-w-screen-xl mx-auto px-4">
        {/* --- VERSIÓN ESCRITORIO (>= md) --- */}
        <div className="hidden md:grid grid-cols-12 gap-8 h-full relative">
          {/* Carrusel de íconos, en posición absoluta sobre la imagen */}
          <div
            className="absolute col-span-4 z-20 top-[65%] left-[2%] w-[95%] overflow-hidden"
            style={{ whiteSpace: 'nowrap' }}
          >
            <div className="inline-block animate-marquee whitespace-nowrap">
              {/* Primer set de íconos */}
              {[
                { src: '/images/icons/ico-alumnos.svg', alt: 'Alumnos' },
                { src: '/images/icons/ico-hectarias.svg', alt: 'Hectáreas' },
                { src: '/images/icons/ico-m3-construidos.svg', alt: 'M3 Construidos' },
                { src: '/images/icons/ico-alumnos-extranjeros.svg', alt: 'Alumnos Extranjeros' },
                { src: '/images/icons/ico-certificados-internacionales.svg', alt: 'Certificados Internacionales' },
              ].map((icon, i) => (
                <div key={i} className="inline-block px-8">
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={150}
                    height={150}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
              {/* Segundo set duplicado para efecto infinito */}
              {[
                { src: '/images/icons/ico-alumnos.svg', alt: 'Alumnos' },
                { src: '/images/icons/ico-hectarias.svg', alt: 'Hectáreas' },
                { src: '/images/icons/ico-m3-construidos.svg', alt: 'M3 Construidos' },
                { src: '/images/icons/ico-alumnos-extranjeros.svg', alt: 'Alumnos Extranjeros' },
                { src: '/images/icons/ico-certificados-internacionales.svg', alt: 'Certificados Internacionales' },
              ].map((icon, i) => (
                <div key={`dup-${i}`} className="inline-block px-8">
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={150}
                    height={150}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Imagen principal de la sección (col-span-8) */}
          <div className="col-span-8 flex items-center justify-center z-10 pointer-events-none">
            <Image
              src="/images/fondo-iconos.webp"
              alt="Imagen principal"
              width={800}
              height={600}
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
        </div>

        {/* --- VERSIÓN MÓVIL (< md) --- */}
        <div className="md:hidden flex flex-col items-center justify-start relative z-10 w-full">
          {/* Carrusel de íconos en móvil */}
          <div className="overflow-hidden relative w-full" style={{ whiteSpace: 'nowrap', fontSize: 0 }}>
            <div className="inline-block animate-marquee whitespace-nowrap">
              {/* Primer set de íconos (tamaños reducidos para móvil) */}
              {[
                { src: '/images/icons/ico-alumnos.svg', alt: 'Alumnos' },
                { src: '/images/icons/ico-hectarias.svg', alt: 'Hectáreas' },
                { src: '/images/icons/ico-m3-construidos.svg', alt: 'M3 Construidos' },
                { src: '/images/icons/ico-alumnos-extranjeros.svg', alt: 'Alumnos Extranjeros' },
                { src: '/images/icons/ico-certificados-internacionales.svg', alt: 'Certificados Internacionales' },
              ].map((icon, i) => (
                <div key={i} className="inline-block px-4">
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={100}
                    height={100}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
              {/* Segundo set duplicado */}
              {[
                { src: '/images/icons/ico-alumnos.svg', alt: 'Alumnos' },
                { src: '/images/icons/ico-hectarias.svg', alt: 'Hectáreas' },
                { src: '/images/icons/ico-m3-construidos.svg', alt: 'M3 Construidos' },
                { src: '/images/icons/ico-alumnos-extranjeros.svg', alt: 'Alumnos Extranjeros' },
                { src: '/images/icons/ico-certificados-internacionales.svg', alt: 'Certificados Internacionales' },
              ].map((icon, i) => (
                <div key={`dup-${i}`} className="inline-block px-4">
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={100}
                    height={100}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Imagen principal debajo del carrusel en móvil */}
          <div className="mt-4 flex justify-center">
            <Image
              src="/images/fondo-iconos.webp"
              alt="Imagen principal"
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
    </section>

      <Carousel />
      {/* Sección 4: Mapa y datos de contacto */}
      <Contact />
    </div>
  );
}
