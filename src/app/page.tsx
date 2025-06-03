// app/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { useMedios } from '@/lib/hooks'
import RenderMedia from '@/components/RenderMedia'
import MediaCarousel from '@/components/MediaCarousel'

const Contact = dynamic(() => import('@/components/sectionContact'), { ssr: false })
const Carousel = dynamic(() => import('@/components/sectionCarrusel'), { ssr: false })

/**
 * Ahora TODOS los IDs corresponden a grupos (GrupoMedios), incluso
 * los “únicos” (UNICO) que actúan como medio individual.
 *
 * HERO_GROUP_ID:      GrupoMedios tipo CARRUSEL → carrusel de fondos.
 * BIENVENIDA_GROUP_ID: GrupoMedios tipo UNICO  → un único medio de bienvenida.
 * INFOGRAFIA_GROUP_ID: GrupoMedios tipo GALERIA/CARRUSEL → íconos de infografía.
 * SEC3_GROUP_ID:      GrupoMedios tipo UNICO  → un único fondo para sección 3.
 */
const HERO_GROUP_ID = 4
const BIENVENIDA_GROUP_ID = 5
const INFOGRAFIA_GROUP_ID = 6
const SEC3_GROUP_ID = 7


export default function HomePage() {
  // 1) HERO: todos los medios dentro de HERO_GROUP_ID
  const {
    data: heroMedia = [],
    isLoading: loadingHero,
    error: errorHero,
  } = useMedios(HERO_GROUP_ID)

  // 2) BIENVENIDA: todos los medios dentro de BIENVENIDA_GROUP_ID
  //    (en el caso UNICO, el arreglo tendrá a lo más 1 elemento)
  const {
    data: bienvenidaArr = [],
    isLoading: loadingBienvenida,
    error: errorBienvenida,
  } = useMedios(BIENVENIDA_GROUP_ID)

  // 3) INFOGRAFÍA ÍCONOS: todos los medios dentro de INFOGRAFIA_GROUP_ID
  const {
    data: infografiaIcons = [],
    isLoading: loadingInfografia,
    error: errorInfografia,
  } = useMedios(INFOGRAFIA_GROUP_ID)

  // 4) SECCIÓN 3 FONDO: todos los medios dentro de SEC3_GROUP_ID
  const {
    data: sec3Arr = [],
    isLoading: loadingSec3,
    error: errorSec3,
  } = useMedios(SEC3_GROUP_ID)

  const isAnyLoading =
    loadingHero || loadingBienvenida || loadingInfografia || loadingSec3

  if (isAnyLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-600">
        Cargando Home…
      </div>
    )
  }

  // Extraemos de los arreglos el medio único (si existe). Si no existe, queda undefined.
  const bienvenidaMedio = bienvenidaArr.length > 0 ? bienvenidaArr[0] : undefined
  const sec3Medio = sec3Arr.length > 0 ? sec3Arr[0] : undefined

  // Chequeo de errores agrupados
  const errores = [
    errorHero && `Hero: ${errorHero.message}`,
    errorBienvenida && `Bienvenida: ${errorBienvenida.message}`,
    errorInfografia && `Infografía Icons: ${errorInfografia.message}`,
    errorSec3 && `Sección 3 Fondo: ${errorSec3.message}`,
  ].filter(Boolean)

  if (errores.length > 0) {
    return (
      <div className="p-6 space-y-2 text-red-600">
        <h2 className="font-bold">Error al cargar algún contenido:</h2>
        {errores.map((msg, idx) => (
          <p key={idx}>• {msg}</p>
        ))}
      </div>
    )
  }

  return (
    <div id="container">
      {/* ==================== SECCIÓN 1: HERO (CARRUSEL) ==================== */}
      <section className="relative w-full h-[640px] lg:h-screen grid grid-cols-12 overflow-hidden">
        {/* --- Columna Izquierda: texto estático sobre fondo verde --- */}
        <div className="col-span-5 flex flex-col justify-center items-start px-16 bg-[#71af8d] relative max-sm:col-span-12 max-sm:items-center max-sm:px-6 max-sm:py-24">
          <Image
            src="/images/eslogan.svg"
            alt="I am because we are"
            width={250}
            height={250}
            className="absolute top-[55%] left-[80%] -translate-x-1/2 z-40
                       max-sm:relative max-sm:top-15 max-sm:-left-16 max-lg:top-60 max-lg:left-80 max-sm:translate-x-0
                       max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
          />
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
            target="_blank"
            className="max-sm:absolute max-sm:bottom-4 max-sm:right-4 flex items-center gap-3 px-2 py-1 bg-[#1e804b] text-white rounded-full shadow-lg transition sm:hidden z-10"
          >
            <Image
              src="/images/ico-admisiones.svg"
              alt="Ver Admisiones"
              width={24}
              height={24}
            />
            <span className="leading-none">ADMISIONES</span>
          </Link>
        </div>

        {/* --- Columna Derecha: carrusel de heroMedia --- */}
        <div className="col-span-7 relative w-full h-full max-sm:col-span-12">
          {heroMedia.length > 0 ? (
            <MediaCarousel
              medias={heroMedia.map((m) => `/images/medios/${m.urlArchivo}`)}
              altText="Hero Carousel"
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src="/images/fondo-home.webp"
              alt="Hero Fallback"
              fill
              className="object-contain"
              priority
            />
          )}

          <button className="absolute bottom-6 right-6 items-center gap-3 px-6 py-3 bg-[#1e804b] text-white rounded-full shadow-lg transition z-40 hidden sm:flex">
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
              target="_blank"
              className="flex items-center gap-2"
            >
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

        {/* --- SVG decorativo encima del carrusel --- */}
        <Image
          src="/images/formas/forma-home-1.svg"
          alt="Forma decorativa"
          width={1000}
          height={1000}
          priority
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 100vw"
          className="absolute top-0 left-4/12 -translate-x-1/2 h-full pointer-events-none
                     max-sm:w-3/4 max-sm:-top-35 max-sm:left-40 max-sm:-translate-x-1/2"
        />
      </section>

      {/* ==================== SECCIÓN 2: BIENVENIDA (UNICO VIA GRUPO) ==================== */}
      <section className="relative w-full h-auto py-10 bg-white" id="bienvenida">
        <div className="grid grid-cols-12 gap-8 max-w-screen-xl mx-auto">
          {/* Columna Izquierda */}
          <div className="col-span-4 relative flex flex-col justify-center max-sm:col-span-12">
            <div className="bg-white shadow-xl rounded-xl p-8 absolute top-10 left-[55%] w-[475px] z-20 max-sm:relative max-sm:top-35 max-sm:left-0 max-sm:w-[90%] max-sm:mx-auto">
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
            {bienvenidaMedio ? (
              bienvenidaMedio.tipo === 'VIDEO' ? (
                <video
                  src={`/images/medios/${bienvenidaMedio.urlArchivo}`}
                  className="w-full h-auto rounded-xl shadow-lg"
                  controls
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={`/images/medios/${bienvenidaMedio.urlArchivo}`}
                  alt={bienvenidaMedio.textoAlternativo ?? 'Bienvenida Image'}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              )
            ) : (
              <Image
                src="/images/fondo-bienvenida.webp"
                alt="Bienvenida Fallback"
                width={800}
                height={600}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            )}
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN 3: FONDO UNICO + MARQUEE ÍCONOS ==================== */}
      <section className="relative w-full bg-[#71af8d] py-10" id="infograma">
        {/* --- Fondo único via grupo SEC3_GROUP_ID --- */}
        {sec3Medio ? (
          sec3Medio.tipo === 'VIDEO' ? (
            <video
              src={`/images/medios/${sec3Medio.urlArchivo}`}
              className="absolute inset-0 w-full h-full object-cover -z-10"
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={`/images/medios/${sec3Medio.urlArchivo}`}
              alt={sec3Medio.textoAlternativo ?? 'Sección 3 Fondo'}
              fill
              className="object-cover -z-10"
            />
          )
        ) : (
          <Image
            src="/images/fondo-iconos.webp"
            alt="Sección 3 Fallback"
            fill
            className="object-cover -z-10"
          />
        )}

        <div className="relative max-w-screen-xl mx-auto px-4">
          {/* --- Desktop Infografía con marquee --- */}
          <div className="hidden md:grid grid-cols-12 gap-8 h-full relative">
            {infografiaIcons.length > 0 && (
              <div
                className="absolute col-span-4 z-20 top-[65%] left-[2%] w-[95%] overflow-hidden"
                style={{ whiteSpace: 'nowrap' }}
              >
                <div className="inline-block animate-marquee whitespace-nowrap">
                  {infografiaIcons.map((m, i) => (
                    <div key={i} className="inline-block px-8">
                      <RenderMedia
                        medio={m}
                        fallback="/images/icons/ico-alumnos.svg"
                        className="w-[150px] h-[150px] transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                  {/* Duplicado para efecto infinito */}
                  {infografiaIcons.map((m, i) => (
                    <div key={`dup-${i}`} className="inline-block px-8">
                      <RenderMedia
                        medio={m}
                        fallback="/images/icons/ico-alumnos.svg"
                        className="w-[150px] h-[150px] transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Imagen de fondo principal (invisible detrás del video/imágen) */}
            <div className="col-span-8 flex items-center justify-center z-10 pointer-events-none">
              <Image
                src="/images/fondo-iconos.webp"
                alt="Imagen infograma"
                width={800}
                height={600}
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
          </div>

          {/* --- Mobile Infografía con marquee reducido --- */}
          <div className="md:hidden flex flex-col items-center justify-start relative z-10 w-full">
            <div className="overflow-hidden relative w-full" style={{ whiteSpace: 'nowrap', fontSize: 0 }}>
              <div className="inline-block animate-marquee whitespace-nowrap">
                {infografiaIcons.map((m, i) => (
                  <div key={i} className="inline-block px-4">
                    <RenderMedia
                      medio={m}
                      fallback="/images/icons/ico-alumnos.svg"
                      className="w-[100px] h-[100px] transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ))}
                {infografiaIcons.map((m, i) => (
                  <div key={`dup-${i}`} className="inline-block px-4">
                    <RenderMedia
                      medio={m}
                      fallback="/images/icons/ico-alumnos.svg"
                      className="w-[100px] h-[100px] transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Image
                src="/images/fondo-iconos.webp"
                alt="Imagen infograma móvil"
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN 4: Galería de Logos (si aplica) ==================== */}
      <section className="my-10" id="galeria-logos">
        {/*
          // Si tienes un GrupoMedios con logos:
          // const { data: logos = [] } = useMedios(LOGOS_GROUP_ID)
          // <MediaCarousel medias={logos.map(m => `/images/medios/${m.urlArchivo}`)} …/>
        */}
      </section>

      {/* Carrusel global y Contacto */}
      <Carousel />
      <Contact />
    </div>
  )
}
