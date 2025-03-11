// app/page.tsx
import Contact from '@/components/sectionContact'; // Ajusta la ruta según tu estructura
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
                      max-sm:relative max-sm:top-15 max-sm:-left-7 max-lg:top-60 max-lg:left-80 max-sm:translate-x-0
                      max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px]"
          />
          {/* Botón para móvil */}
          <button className="max-sm:absolute max-sm:bottom-4 max-sm:right-4 flex items-center gap-3 px-2 py-1 bg-[#1e804b] text-white rounded-full shadow-lg transition z-40 sm:hidden">
            <Image
              src="/images/ico-admisiones.svg"
              alt="Ver Admisiones"
              width={24}
              height={24}
              sizes="(max-width: 640px) 24px, 24px"
            />
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
              target="_blank"
            >
              ADMISIONES
            </Link>
          </button>
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
            <Image
              src="/images/ico-admisiones.svg"
              alt="Ver Admisiones"
              width={32}
              height={32}
              sizes="32px"
            />
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
              target="_blank"
            >
              ADMISIONES
            </Link>
          </button>
        </div>

        {/* Figura decorativa */}
        <Image
          src="/images/formas/forma-home-1.svg"
          alt="Forma decorativa"
          width={1000}
          height={1000}
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 100vw"
          className="absolute top-0 left-4/12 transform -translate-x-1/2 h-full pointer-events-none max-sm:w-3/4 max-sm:-top-35 max-sm:left-40 max-sm:-translate-x-1/2"
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
              width={550}
              height={300}
              sizes="(max-width: 640px) 600px, (max-width: 1024px) 550px, 550px"
              className="absolute -top-5 -left-60 w-[550px] max-sm:absolute max-sm:top-0 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[600px]"
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
        {/* Forma decorativa detrás */}
        <Image
          src="/images/formas/forma-home-3.svg"
          alt="Forma decorativa"
          width={800}
          height={500}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 750px, 1000px"
          className="absolute top-25 md:-top-5 -right-0 w-[1000px] md:w-[750px] z-10"
        />

        {/* Contenedor */}
        <div className="relative max-w-screen-xl mx-auto h-full px-4">
          {/* Escritorio (>= sm) */}
          <div className="hidden sm:grid grid-cols-12 gap-8 h-full relative">
            {/* Iconos (arriba de la imagen) */}
            <div className="absolute col-span-4 flex items-center justify-center z-20 top-[65%] left-[2%] lg:gap-30 md:gap-20 w-full">
              <Image
                src="/images/icons/ico-alumnos.svg"
                alt="Alumnos"
                width={150}
                height={150}
              />
              <Image
                src="/images/icons/ico-hectarias.svg"
                alt="Hectáreas"
                width={150}
                height={150}
              />
              <Image
                src="/images/icons/ico-m3-construidos.svg"
                alt="M3 Construidos"
                width={150}
                height={150}
              />
              <Image
                src="/images/icons/ico-alumnos-extranjeros.svg"
                alt="Alumnos Extranjeros"
                width={150}
                height={150}
              />
              <Image
                src="/images/icons/ico-certificados-internacionales.svg"
                alt="Certificados Internacionales"
                width={150}
                height={150}
              />
            </div>

            {/* Imagen principal */}
            <div className="col-span-8 flex items-center justify-center z-10">
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

          {/* Móvil (< sm) */}
          <div className="sm:hidden flex flex-col items-center justify-start relative z-10 w-full h-full">
            {/* Iconos arriba de la imagen */}
            <div className="grid grid-cols-3 gap-4 w-full px-4 mt-4 mb-4">
              <Image
                src="/images/icons/ico-alumnos.svg"
                alt="Alumnos"
                width={100}
                height={100}
                className="w-full aspect-square object-contain"
              />
              <Image
                src="/images/icons/ico-hectarias.svg"
                alt="Hectáreas"
                width={100}
                height={100}
                className="w-full aspect-square object-contain"
              />
              <Image
                src="/images/icons/ico-m3-construidos.svg"
                alt="M3 Construidos"
                width={100}
                height={100}
                className="w-full aspect-square object-contain"
              />
              <Image
                src="/images/icons/ico-alumnos-extranjeros.svg"
                alt="Alumnos Extranjeros"
                width={100}
                height={100}
                className="w-full aspect-square object-contain"
              />
              <Image
                src="/images/icons/ico-certificados-internacionales.svg"
                alt="Certificados Internacionales"
                width={100}
                height={100}
                className="w-full aspect-square object-contain"
              />
            </div>
            {/* Imagen principal debajo de los iconos en móvil */}
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
      </section>

      {/* Sección 4: Mapa y datos de contacto */}
      <Contact />
    </div>
  );
}
