// /app/[locale]/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { usePageContent } from '@/lib/hooks'
import RenderMedia from '@/components/RenderMedia'
import MediaCarousel from '@/components/MediaCarousel'
import { useTranslations } from 'next-intl'
import type { NextPage } from 'next'

// SLUGS de secciones (coinciden con DB)
const SECTION_SLUGS = {
  HERO: 'home-hero',
  BIENVENIDA: 'home-bienvenida',
  INFOGRAFIA: 'home-infografia',
  SEC3_BACKGROUND: 'home-sec3-background',
  ALIANZAS: 'home-alianzas',
};

// Tipado auxiliar
type MedioMinimal = {
  id: number
  urlArchivo: string
  textoAlternativo?: string
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
  posicion: number
  grupoMediosId: number
}

const Contact = dynamic(() => import('@/components/sectionContact'), { ssr: false })
const Carousel = dynamic(() => import('@/components/sectionCarrusel'), { ssr: false })

const HomePage: NextPage = () => {
  // Hook de traducción: namespace 'home'
  const t = useTranslations('home')

  /* ------------------------------ CARGA DE MEDIOS DINÁMICA ------------------------------ */
  const { data: pageSections = [], isLoading: isAnyLoading, error } = usePageContent('home');

  const getMedias = (slug: string) => {
    const section = pageSections.find(s => s.slug === slug);
    return (section?.grupo?.medios || []) as unknown as MedioMinimal[];
  }

  // 1) Hero (carrousel)
  const heroMedia = getMedias(SECTION_SLUGS.HERO);

  // 2) Bienvenida (único)
  const bienvenidaArr = getMedias(SECTION_SLUGS.BIENVENIDA);

  // 3) Infografía íconos
  const infografiaIcons = getMedias(SECTION_SLUGS.INFOGRAFIA);

  // 4) Sección 3 fondo único
  const sec3Arr = getMedias(SECTION_SLUGS.SEC3_BACKGROUND);

  // 5) Alianzas
  const alianzasMedia = getMedias(SECTION_SLUGS.ALIANZAS);

  if (isAnyLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-600">
        {t('hero.loading')}
      </div>
    )
  }

  // Agregamos chequeo de errores
  if (error) {
    return (
      <div className="p-6 space-y-2 text-red-600">
        <h2 className="font-bold">Error al cargar algún contenido:</h2>
        <p>• {error.message}</p>
      </div>
    )
  }

  // Extraemos objetos únicos de welcome y sección 3
  const bienvenidaMedio = bienvenidaArr.length > 0 ? bienvenidaArr[0] : undefined
  const sec3Medio = sec3Arr.length > 0 ? sec3Arr[0] : undefined

  return (
    <div id="container">
      {/* ==================== SECCIÓN 1: HERO (CARRUSEL) ==================== */}
      <section className="relative w-full lg:h-screen grid grid-cols-12 overflow-hidden">
        {/* --- Columna Izquierda: texto estático sobre fondo verde --- */}
        <div className="col-span-5 flex flex-col justify-center items-start px-16 bg-[#71af8d] relative max-sm:col-span-12 max-sm:items-center max-sm:px-6 max-sm:py-24">
          <Image
            src="/images/eslogan.svg"
            alt={t('hero.alt')}
            width={250}
            height={250}
            className="absolute top-[55%] left-[80%] -translate-x-1/2 z-40
                      max-sm:relative max-sm:top-15 max-sm:-left-16 max-lg:top-60 max-lg:left-80 max-sm:translate-x-0
                      max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
          />

        </div>

        {/* --- Columna Derecha: carrusel de heroMedia --- */}
        <div className="col-span-7 relative w-full h-full max-sm:col-span-12 max-sm:h-[60vh] overflow-hidden">
          {heroMedia.length > 0 ? (
            <MediaCarousel
              items={heroMedia}
              altText={t('hero.alt')}
              className="w-full h-full"
            />
          ) : (
            <Image
              src="/images/fondo-home.webp"
              alt={t('hero.alt')}
              fill
              className="object-cover"
              priority
            />
          )}


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

      {/* =============== SECCIÓN 2: BIENVENIDA (MÉTODO UNICO) =============== */}
      <section className="relative w-full h-auto py-10 bg-white" id="bienvenida">
        <div className="grid grid-cols-12 gap-8 max-w-screen-xl mx-auto">
          {/* Columna Izquierda */}
          <div className="col-span-4 relative flex flex-col justify-center max-sm:col-span-12">
            <div className="bg-white shadow-xl rounded-xl p-8 absolute top-10 left-[55%] w-[475px] z-20 max-sm:relative max-sm:top-35 max-sm:left-0 max-sm:w-[90%] max-sm:mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                {t('bienvenida.title')}
              </h1>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {t('bienvenida.paragraph')}
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
            <RenderMedia
              medio={bienvenidaMedio}
              fallback="/images/fondo-bienvenida.webp"
              width={800}
              height={600}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* =========== SECCIÓN 3: FONDO UNICO + MARQUEE ÍCONOS =========== */}
      <section className="relative w-full bg-[#71af8d] py-10" id="infograma">
        {/* --- Fondo único via sec3Medio --- */}
        <RenderMedia
          medio={sec3Medio}
          fallback="/images/fondo-iconos.webp"
          fill
          className="object-cover -z-10 pointer-events-none"
        />

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

            {/* Imagen de fondo principal (invisible detrás del video/imagen) */}
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
                      width={100}
                      height={100}
                      className="w-[100px] h-[100px] transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ))}
                {infografiaIcons.map((m, i) => (
                  <div key={`dup-${i}`} className="inline-block px-4">
                    <RenderMedia
                      medio={m}
                      fallback="/images/icons/ico-alumnos.svg"
                      width={100}
                      height={100}
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
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
          </div>
          <div className="absolute -top-5 2xl:-right-20 -right-0 xl:w-[650px] lg:w-[550px] md:w-[475px] w-[300px] z-0 md:z-10">
            <Image
              src="/images/formas/forma-home-3.svg"
              alt=""
              width={650}
              height={100}
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
      {/* Carrusel global y Contacto */}
      <Carousel medios={alianzasMedia} />
      <Contact />
    </div>
  )
}

export default HomePage
