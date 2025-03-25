"use client";

// app/deportes/page.tsx
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

const Contact = dynamic(() => import("@/components/sectionContact"), { ssr: false });
const Carousel = dynamic(() => import("@/components/sectionCarrusel"), { ssr: false });
const ImageCarousel = dynamic(() => import("@/components/ImageCarousel"), { ssr: false });

export default function DeportesPage() {
  return (
    <div id="container">
      {/* Sección 1: Imagen de fondo y texto */}
      <section className="relative w-full h-auto grid grid-cols-12 overflow-hidden">
        {/* ────────────── COL. VERDE ────────────── */}
        <div className="col-span-12 md:col-span-4 bg-[#71af8d] relative flex justify-center items-center px-4 md:px-16">
          {/* Versión MÓVIL: Forma decorativa abarcando toda la columna */}
          <div className="block lg:hidden absolute inset-0 pointer-events-none">
            <Image
              src="/images/formas/forma-home-1.svg"
              alt="Forma decorativa móvil"
              fill
              className="object-cover"
            />
          </div>
          {/* Versión MÓVIL: Contenido con slogan y botón */}
          <div className="lg:hidden relative flex justify-between items-end h-full pt-32 pb-12 z-20 md:w-[80%] w-full">
            <Image 
              src="/images/eslogan.svg" 
              alt="I am because we are" 
              width={250}
              height={250}
              className="z-40 max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px]"
            />
            <div className="text-center">
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
                target="_blank"
                className="inline-flex items-center gap-3 px-4 py-2 bg-[#1e804b] text-white rounded-full shadow-lg transition"
              >
                <Image
                  src="/images/ico-admisiones.svg"
                  alt="Ver Admisiones"
                  width={24}
                  height={24}
                />
                ADMISIONES
              </Link>
            </div>
          </div>
          {/* Versión ESCRITORIO: Se mantiene la posición original */}
          <div className="hidden lg:block">
            <Image 
              src="/images/eslogan.svg" 
              alt="I am because we are" 
              width={250}
              height={250}
              className="absolute top-[65%] left-[77%] transform -translate-x-1/2 z-40
                         max-sm:relative max-sm:top-15 max-sm:-left-7 max-lg:top-60 max-lg:left-80
                         max-sm:translate-x-0 max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px]"
            />
          </div>
        </div>

        {/* ────────────── COL. DE LA IMAGEN ────────────── */}
        <div className="col-span-12 md:col-span-8 relative w-full h-[450px] md:h-[900px]">
          <div className="relative w-full h-full">
            <Image
              src="/images/Image-deportes.webp"
              alt="Imagen de fondo"
              fill
              className="object-cover"
            />
          </div>

          {/* Recuadro blanco con texto */}
          <div className="bg-white p-4 md:p-8 w-[90%] md:w-[550px] rounded-3xl shadow-lg 
                          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          z-40 lg:top-[60%] lg:left-[50%] xl:top-[70%] xl:left-[35%]">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Deportes</h1>
            <p className="text-gray-700 mb-4 text-sm md:text-base">
              San Isidro College, ubicado en un marco natural privilegiado,
              desarrolla un variado programa en el área de Educación Física.
              Como parte del Proyecto Pedagógico, se propone contribuir a la
              elaboración de un proyecto de vida.
            </p>
            <div className="text-center mt-5">
              <a
                href="/deportes-mas-info"
                className="text-[#1e804b] font-semibold hover:underline"
              >
                Leer más
              </a>
            </div>
          </div>

          {/* Versión ESCRITORIO: Botón ADMISIONES en esquina inferior derecha */}
          <div className="hidden lg:block">
            <button className="hidden lg:flex absolute bottom-6 right-6 items-center gap-3 px-6 py-3 bg-[#1e804b] text-white rounded-full shadow-lg transition z-40">
              <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform" target="_blank" className='flex items-center gap-3'>
                <Image
                  src="/images/ico-admisiones.svg"
                  alt="Ver Admisiones"
                  width={32}
                  height={32}
                />
                ADMISIONES
              </Link>
            </button>
          </div>
        </div>

        {/* ────────────── FORMA DECORATIVA ESCRITORIO ────────────── */}
        <div className="hidden lg:block absolute top-0 left-[32%] transform -translate-x-1/2 pointer-events-none z-0">
          <Image
            src="/images/formas/forma-home-1.svg"
            alt="Forma decorativa escritorio"
            width={700}
            height={700}
            className="object-contain"
          />
        </div>
      </section>

      {/* Sección 2: Bienvenida – Club de Rugby y Hockey */}
      <section className="relative w-full max-w-[1200px] h-auto pt-96 md:py-10 bg-white overflow-hidden mx-auto">
        {/* Forma decorativa */}
        <Image
          src="/images/formas/forma-home-2.svg"
          alt="Decoración"
          width={550}
          height={300}
          sizes="(max-width: 640px) 600px, (max-width: 1024px) 550px, 550px"
          className="absolute -top-5 left-32 w-[550px] max-sm:absolute max-sm:top-0 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[600px]"
        />
        
        {/* Contenedor de contenido */}
        <div className="relative z-10 grid grid-cols-12 gap-8 max-w-screen-xl mx-auto">
          {/* Versión Escritorio */}
          <div className="hidden sm:flex col-span-4 relative flex-col justify-center">
            <div className="absolute top-55 left-41 w-[550px] z-20">
              <Image
                src="/images/logo-club-rugby-hockey.svg"
                alt="Logo Club Rugby y Hockey"
                width={128}
                height={128}
                className="mx-auto mb-5"
              />
              <div className="bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  CLUB DE RUGBY Y HOCKEY
                </h2>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Colegio y Club unidos, construyendo y sembrando valores que trascienden la cancha. Una comunidad fuerte y comprometida en beneficio de nuestros chicos.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block col-span-8">
            <ImageCarousel
              images={[
                "/images/Image-SIC-hockey.webp",
                "/images/Image-SIC-hockey.webp",
                "/images/Image-SIC-hockey.webp",
              ]}
              altText="Imagen del colegio"
              className="rounded-xl shadow-lg"
            />
          </div>
          
          {/* Versión Móvil */}
          <div className="sm:hidden col-span-12 relative pt-16">
            <ImageCarousel
              images={[
                "/images/Image-SIC-hockey.webp",
                "/images/Image-SIC-hockey.webp",
                "/images/Image-SIC-hockey.webp",
              ]}
              altText="Imagen del colegio"
              className="w-full h-auto rounded-md shadow-lg"
            />
            <div className="absolute -top-35 left-0 w-full px-4 z-20 transform -translate-y-1/2">
              <Image
                src="/images/logo-club-rugby-hockey.svg"
                alt="Logo Club Rugby y Hockey"
                width={128}
                height={128}
                className="mx-auto mb-5 w-32"
              />
              <div className="bg-white shadow-xl rounded-xl p-8 w-full">
                <div className="flex flex-col items-center">
                  <h2 className="text-2xl font-bold text-gray-900 text-center">
                    CLUB DE RUGBY Y HOCKEY
                  </h2>
                  <p className="mt-4 text-gray-700 leading-relaxed text-center">
                    Colegio y Club unidos, construyendo y sembrando valores que trascienden la cancha. Una comunidad fuerte y comprometida en beneficio de nuestros chicos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Sección de iconos y estadísticas */}
      <section className="relative w-full bg-white md:py-5 pt-80 pb-12 overflow-hidden h-auto sm:h-auto">
        {/* Versión Escritorio */}
        <div className="hidden sm:block max-w-[1200px] mx-auto">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt="Decoración"
            width={550}
            height={300}
            sizes="(max-width: 640px) 600px, (max-width: 1024px) 550px, 550px"
            className="absolute top-5 right-35 w-[550px] h-auto max-sm:hidden"
          />
          <div className="grid grid-cols-12 gap-8 mx-auto h-full">
            {/* Columna Izquierda: Carrusel */}
            <div className="col-span-8">
              <ImageCarousel
                images={[
                  "/images/Image-SIC-dojo.webp",
                  "/images/Image-SIC-dojo.webp",
                  "/images/Image-SIC-dojo.webp",
                ]}
                altText="Imagen principal"
                className="rounded-md shadow-md"
              />
            </div>
            {/* Columna Derecha: Cuadro flotante */}
            <div className="absolute col-span-4 flex items-center justify-center z-20 top-65 left-[37%]">
              <div className="absolute -top-[80px] left-[103px] w-[650px] z-20">
                <Image
                  src="/images/logo-dojo.svg"
                  alt="Logo Dojo"
                  width={128}
                  height={128}
                  className="mx-auto mb-5 w-20 sm:w-24 md:w-32 lg:w-40"
                />
                <div className="bg-white shadow-xl rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 text-center">
                    SAN ISIDRO COLLEGE DOJO
                  </h2>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    El San Isidro Dojo es el espacio donde nuestros estudiantes desarrollan disciplina, respeto y fortaleza a través del judo. Como parte de nuestra formación integral, promovemos valores esenciales y fomentamos el crecimiento físico y emocional en un ambiente de camaradería y esfuerzo. ¡Un lugar para aprender, crecer y superarse cada día!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Versión Móvil */}
        <div className="sm:hidden relative min-h-[350px]">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt="Decoración"
            width={550}
            height={300}
            sizes="(max-width: 640px) 600px, (max-width: 1024px) 550px, 550px"
            className="absolute top-5 right-35 w-[550px] h-auto max-sm:absolute max-sm:-top-75 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[600px]"
          />
          <ImageCarousel
            images={[
              "/images/Image-SIC-dojo.webp",
              "/images/Image-SIC-dojo.webp",
              "/images/Image-SIC-dojo.webp",
            ]}
            altText="Imagen principal"
            className="w-full h-auto rounded-md shadow-md pt-56"
          />
          <div className="absolute top-0 left-0 w-full px-4 z-20 transform -translate-y-1/2">
            <Image
              src="/images/logo-dojo.svg"
              alt="Logo Dojo"
              width={128}
              height={128}
              className="mx-auto mb-5 w-20 sm:w-24 md:w-32 lg:w-40"
            />
            <div className="bg-white shadow-xl rounded-xl p-8 w-full">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  SAN ISIDRO COLLEGE DOJO
                </h2>
                <p className="mt-4 text-gray-700 leading-relaxed text-center">
                  El San Isidro Dojo es el espacio donde nuestros estudiantes desarrollan disciplina, respeto y fortaleza a través del judo. Como parte de nuestra formación integral, promovemos valores esenciales y fomentamos el crecimiento físico y emocional en un ambiente de camaradería y esfuerzo. ¡Un lugar para aprender, crecer y superarse cada día!
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:absolute inset-0 z-0">
            <Image
              src="/images/formas/forma-home-5.svg"
              alt="Decoración"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección 4: VIDA ESTUDIANTIL */}
      <section className="relative w-full h-auto md:py-10 pt-60 pb-12 bg-[#71af8d] overflow-hidden">
        {/* Versión Escritorio */}
        <div className="hidden sm:grid grid-cols-12 gap-8 max-w-[1200px] mx-auto">
          {/* Columna Izquierda */}
          <div className="col-span-4 relative flex flex-col justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 absolute top-65 left-45 w-[550px] z-20">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                VIDA ESTUDIANTIL
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                San Isidro College fomenta un ambiente positivo y dinámico donde los estudiantes pueden desarrollarse plenamente, guiados por valores fundamentales. Preparamos a nuestros alumnos para el siglo XXI enseñándoles a manejar el estrés, ser resilientes y estar listos para los exámenes, con el apoyo del departamento de Servicios Estudiantiles y tutorías.
              </p>
              <div className="text-center mt-5">
                <a
                  href="/deportes-mas-info"
                  className="text-[#1e804b] font-semibold hover:underline"
                >
                  Leer más
                </a>
              </div>
            </div>
            <div className="absolute -top-5 -left-36 w-[550px]">
              <Image
                src="/images/formas/forma-home-5.svg"
                alt="Decoración"
                width={550}
                height={300}
                className="w-full h-full"
              />
            </div>
          </div>
          {/* Columna Derecha */}
          <div className="col-span-8">
            <ImageCarousel
              images={[
                "/images/Image-vida-estudiantil.webp",
                "/images/Image-vida-estudiantil.webp",
                "/images/Image-vida-estudiantil.webp",
              ]}
              altText="Imagen del colegio"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Versión Móvil */}
        <div className="sm:hidden relative min-h-[350px]">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt="Decoración"
            width={550}
            height={300}
            sizes="(max-width: 640px) 600px, (max-width: 1024px) 550px, 550px"
            className="absolute top-5 right-35 w-[550px] h-auto max-sm:absolute max-sm:-top-55 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[600px]"
          />
          <ImageCarousel
            images={[
              "/images/Image-vida-estudiantil.webp",
              "/images/Image-vida-estudiantil.webp",
              "/images/Image-vida-estudiantil.webp",
            ]}
            altText="Imagen del colegio"
            className="w-full h-auto rounded-xl shadow-lg pt-36"
          />
          <div className="absolute top-0 left-0 w-full px-4 z-20 transform -translate-y-1/2">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  VIDA ESTUDIANTIL
                </h2>
                <p className="mt-4 text-gray-700 leading-relaxed text-center">
                  San Isidro College fomenta un ambiente positivo y dinámico donde los estudiantes pueden desarrollarse plenamente, guiados por valores fundamentales. Preparamos a nuestros alumnos para el siglo XXI enseñándoles a manejar el estrés, ser resilientes y estar listos para los exámenes.
                </p>
                <div className="text-center mt-5">
                  <a
                    href="/deportes-mas-info"
                    className="text-[#1e804b] font-semibold hover:underline"
                  >
                    Leer más
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:absolute inset-0 z-0">
            <Image
              src="/images/formas/forma-home-5.svg"
              alt="Decoración"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección 5: Imagen principal e iconos */}
      <section className="relative w-full h-auto md:py-10 pt-72 pb-16 bg-white overflow-hidden">
        {/* Versión Escritorio */}
        <div className="hidden sm:block ">
          <Image
            src="/images/formas/forma-home-2.svg"
            alt="Forma decorativa"
            width={550}
            height={300}
            sizes="(max-width: 640px) 600px, (max-width: 1024px) 550px, 550px"
            className="absolute top-25 right-25 w-[550px] h-auto z-10 max-sm:hidden"
          />
          <div className="grid grid-cols-12 gap-8 mx-auto h-full px-4 max-w-[1200px]">
            <div className="col-span-8 max-sm:col-span-12 flex items-center justify-center">
              <ImageCarousel
                images={[
                  "/images/image-SIC-play.webp",
                  "/images/image-SIC-play.webp",
                  "/images/image-SIC-play.webp",
                ]}
                altText="Imagen principal"
                className="rounded-md shadow-md"
              />
            </div>
            <div className="absolute col-span-4 flex items-center justify-center z-20 top-[65%] xl:left-[22%] left-[23%]
                            max-sm:relative max-sm:top-10 max-sm:left-0 max-sm:mx-auto max-sm:w-full max-sm:px-4">
              <div className="bg-white shadow-xl rounded-xl p-8 absolute -top-85 left-110 w-[550px] z-20
                              max-sm:relative max-sm:top-0 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[90%] max-sm:mx-auto">
                <Image
                  src="/images/logo-SIC-play.svg"
                  alt="Logo San Isidro Play"
                  width={128}
                  height={128}
                  className="mx-auto mb-10 w-20 sm:w-24 md:w-32 lg:w-40"
                />
                <p className="mt-4 text-gray-700 leading-relaxed">
                  <strong>San Isidro Play</strong> es la obra de teatro anual en inglés protagonizada por los talentosos alumnos del San Isidro College. Este evento combina actuación, canto y baile, destacando no solo el dominio del idioma inglés, sino también la creatividad y habilidades artísticas de nuestros estudiantes.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Una tradición esperada cada año, San Isidro Play celebra el talento y esfuerzo de nuestra comunidad educativa, ofreciendo un espectáculo inolvidable para toda la familia. ¡Te esperamos para vivir esta mágica experiencia!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Versión Móvil */}
        <div className="sm:hidden relative">
          <Image
            src="/images/formas/forma-home-2.svg"
            alt="Decoración"
            width={550}
            height={300}
            sizes="(max-width: 640px) 600px, (max-width: 1024px) 550px, 550px"
            className="absolute top-5 right-35 w-[550px] h-auto max-sm:absolute max-sm:-top-70 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[600px]"
          />
          <div className="relative w-full">
            <ImageCarousel
              images={[
                "/images/image-SIC-play.webp",
                "/images/image-SIC-play.webp",
                "/images/image-SIC-play.webp",
              ]}
              altText="Imagen principal"
              className="w-full h-full object-cover rounded-md shadow-md pt-56"
            />
          </div>
          <div className="absolute top-0 left-0 w-full px-4 z-20 transform -translate-y-1/2">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full">
              <div className="flex flex-col items-center">
                <Image
                  src="/images/logo-SIC-play.svg"
                  alt="Logo San Isidro Play"
                  width={128}
                  height={128}
                  className="mx-auto mb-10 w-20 sm:w-24 md:w-32 lg:w-40"
                />
                <p className="mt-4 text-gray-700 leading-relaxed text-center">
                  <strong>San Isidro Play</strong> es la obra de teatro anual en inglés protagonizada por los talentosos alumnos del San Isidro College. Este evento combina actuación, canto y baile, destacando no solo el dominio del idioma inglés, sino también la creatividad y habilidades artísticas de nuestros estudiantes.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed text-center">
                  Una tradición esperada cada año, San Isidro Play celebra el talento y esfuerzo de nuestra comunidad educativa, ofreciendo un espectáculo inolvidable para toda la familia. ¡Te esperamos para vivir esta mágica experiencia!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Carousel />
      <Contact />
    </div>
  );
}
