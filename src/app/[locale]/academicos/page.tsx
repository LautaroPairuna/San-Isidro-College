// /app/[locale]/vida-estudiantil/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import { useResourcesByIds } from '@/lib/hooks'

/* ╭────────────── Tipos y constantes ──────────────╮ */
type MedioType = {
  id: number
  urlArchivo: string
  urlMiniatura?: string
  textoAlternativo?: string
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
}

const IDS = {
  KINDER: 1,
  PRIMARY: 2,
  SECOND: 3,
} as const

const FALLBACKS = {
  KINDER: '/images/image-kindergarten.webp',
  PRIMARY: '/images/fondo-iconos.webp',
  SECOND: '/images/image-kindergarten.webp',
}
/* ╰───────────────────────────────────────────────╯ */

/* Renderiza imagen o video según `tipo` */
function RenderMedia({
  medio,
  fallback,
  width,
  height,
  className = '',
}: {
  medio?: MedioType
  fallback: string
  width: number
  height: number
  className?: string
}) {
  if (!medio) {
    return (
      <Image
        src={fallback}
        alt="fallback"
        width={width}
        height={height}
        className={className}
      />
    )
  }

  const src = `/images/medios/${medio.urlArchivo}`

  if (medio.tipo === 'VIDEO') {
    return (
      <video
        src={src}
        width={width}
        height={height}
        className={`${className} object-cover rounded-md shadow-md`}
        poster={
          medio.urlMiniatura
            ? `/images/medios/${medio.urlMiniatura}`
            : undefined
        }
        muted
        playsInline
        controls
      />
    )
  }

  return (
    <Image
      src={src}
      alt={medio.textoAlternativo ?? 'Imagen'}
      width={width}
      height={height}
      className={className}
    />
  )
}

export default function VidaEstudiantilPage() {
  const t = useTranslations('academicosHome')

  const { dataById, errorById, isLoading } = useResourcesByIds<MedioType>(
    'Medio',
    Object.values(IDS)
  )

  const kinderImg = dataById[IDS.KINDER]
  const primaryImg = dataById[IDS.PRIMARY]
  const secondImg = dataById[IDS.SECOND]

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-600">
        {t('loading')}
      </div>
    )
  }

  const errs = Object.values(errorById).filter(Boolean) as Error[]
  if (errs.length) {
    return (
      <div className="p-6 space-y-2 text-red-600">
        <h2 className="font-bold">{t('errorTitle')}</h2>
        {errs.map((e, i) => (
          <p key={i}>• {e.message}</p>
        ))}
      </div>
    )
  }

  return (
    <div id="container">
      {/* ───────────────────── HERO VERDE ───────────────────── */}
      <section className="relative w-full h-[640px] lg:h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Columna izquierda */}
        <div className="relative col-span-1 md:col-span-4 bg-[#71af8d] flex items-end justify-end">
          <Image
            src="/images/eslogan.svg"
            alt={t('hero.alt')}
            width={250}
            height={250}
            className="hidden lg:block absolute top-[60%] left-[77%] -translate-x-1/2 z-40 drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
          />
          <div className="flex lg:hidden p-6 z-20 justify-between items-start mt-28 relative w-full">
            <Image
              src="/images/eslogan.svg"
              alt={t('hero.alt')}
              width={250}
              height={250}
              className="transform z-40 max-sm:w-[110px] max-sm:h-[120px] max-lg:w-[150px] max-lg:h-[150px] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
            />
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
              target="_blank"
              className="max-sm:absolute max-sm:bottom-4 max-sm:right-4 flex items-center text-center gap-3 px-2 py-2 bg-[#1e804b] text-white rounded-full shadow-lg transition sm:hidden z-10"
            >
              <Image src="/images/ico-admisiones.svg" alt={t('admissions.alt')} width={24} height={24} />
              <span className="leading-none">{t('admissions.label')}</span>
            </Link>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="relative col-span-1 md:col-span-8 bg-[#71af8d] w-full h-full flex flex-col items-center md:items-start">
          <div className="hidden md:block absolute 2xl:top-[70%] 2xl:left-[30%] top-[60%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-40 bg-white p-6 md:p-8 w-[400px] md:w-[550px] rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-left">
              {t('hero.title')}
            </h2>
            <p className="text-gray-700 mb-4">
              {t('hero.description')}
            </p>
            <div className="text-left mt-5">
              <Link href="/academicos-mas-info">
                <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                  {t('hero.readMore')}
                </span>
              </Link>
            </div>
          </div>

          <div className="block md:hidden mt-auto mb-6 bg-white p-6 w-[90%] rounded-3xl shadow-lg z-40">
            <h2 className="text-xl font-bold mb-2 text-left">
              {t('hero.title')}
            </h2>
            <p className="text-gray-700 mb-4 text-sm">
              {t('hero.description')}
            </p>
            <div className="text-left mt-5">
              <Link href="/academicos-mas-info">
                <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                  {t('hero.readMore')}
                </span>
              </Link>
            </div>
          </div>

          <button className="hidden md:flex absolute bottom-6 right-6 items-center gap-3 px-6 py-3 bg-[#1e804b] text-white rounded-full shadow-lg transition z-40">
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
              target="_blank"
              className="flex items-center gap-3"
            >
              <Image src="/images/ico-admisiones.svg" alt={t('admissions.alt')} width={32} height={32} />
              {t('admissions.label')}
            </Link>
          </button>
        </div>

        <div className="absolute top-0 left-[32%] -translate-x-1/2 h-full pointer-events-none">
          <Image
            src="/images/formas/forma-home-1.svg"
            alt=""
            width={800}
            height={800}
            className="h-full w-auto"
            priority
          />
        </div>
      </section>

      {/* ─────────────────── KINDERGARTEN ─────────────────── */}
      <section
        id="kindergarten"
        className="relative w-full h-auto py-10 bg-white overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 2xl:max-w-[1400px] max-w-[1200px] mx-auto">
          {/* Texto y decoraciones (idéntico pero traducido) */}
          <div className="col-span-1 md:col-span-4 relative flex flex-col justify-center order-1 md:order-none">
            {/* Desktop */}
            <div className="hidden lg:block">
              <div className="absolute top-[15%] left-[75%] w-[450px] z-20">
                <h2 className="text-5xl font-bold text-white text-left text-shadow-bold mb-5">
                  {t('kinder.title')}
                </h2>
                <div className="bg-white shadow-xl rounded-3xl p-8 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {t('kinder.p1')}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {t('kinder.p2')}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {t('kinder.p3')}
                  </p>
                  <Link href="/academicos-mas-info#kindergarten">
                    <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                      {t('kinder.readMore')}
                    </span>
                  </Link>
                </div>
              </div>
              <Image
                src="/images/cuadro-kindergarten.svg"
                alt={t('kinder.decorAlt')}
                width={250}
                height={250}
                className="absolute top-10 left-5 z-20"
              />
              <div className="absolute -top-5 2xl:-left-20 -left-15 w-[650px] z-10">
                <Image
                  src="/images/formas/forma-home-6.svg"
                  alt=""
                  width={650}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="block lg:hidden w-full px-4 mt-32">
              <div className="relative z-10">
                <h2 className="text-5xl font-bold text-left mb-5 text-shadow-bold-movil space-y-4">
                  {t('kinder.title')}
                </h2>
                <div className="bg-white shadow-xl rounded-3xl p-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {t('kinder.p1')}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {t('kinder.mobileBrief')}
                  </p>
                  <Link href="/academicos-mas-info#kindergarten">
                    <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                      {t('kinder.readMore')}
                    </span>
                  </Link>
                </div>
              </div>
              <div className="absolute -top-5 -left-30 w-[550px] z-0">
                <Image
                  src="/images/formas/forma-home-6.svg"
                  alt=""
                  width={550}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>
            <Image
              src="/images/cuadro-kindergarten-movil.svg"
              alt={t('kinder.decorAltMobile')}
              width={500}
              height={300}
              className="block lg:hidden w-full px-5 mt-5 mb-3 z-10"
            />
          </div>

          {/* Media dinámico */}
          <div className="col-span-1 md:col-span-8 order-2 md:order-none px-5">
            <RenderMedia
              medio={kinderImg}
              fallback={FALLBACKS.KINDER}
              width={800}
              height={600}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────── PRIMARY ─────────────────── */}
      <section id="primary" className="bg-white overflow-hidden">
        {/* Desktop */}
        <div className="hidden lg:block relative w-full h-screen">
          <Image
            src="/images/formas/forma-home-3.svg"
            alt=""
            width={750}
            height={500}
            className="absolute 2xl:top-30 2xl:right-45 top-5 -right-10 w-[650px] h-auto z-10 pointer-events-none"
          />
          <div className="grid grid-cols-12 gap-8 2xl:max-w-[1400px] max-w-[1200px] mx-auto h-full px-4">
            <div className="col-span-8 flex items-center justify-center">
              <RenderMedia
                medio={primaryImg}
                fallback={FALLBACKS.PRIMARY}
                width={800}
                height={600}
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>

            <div className="absolute 2xl:top-[20%] 2xl:left-[45%] top-[20%] left-[40%] w-[550px] z-20">
              <h2 className="text-5xl font-bold text-white text-end text-shadow-bold mb-5">
                {t('primary.title')}
              </h2>
              <div className="bg-white shadow-xl rounded-3xl p-8 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {t('primary.p1')}
                </p>
                <Link href="/academicos-mas-info#primary">
                  <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                    {t('primary.readMore')}
                  </span>
                </Link>
              </div>
            </div>

            <div className="absolute col-span-4 flex items-center justify-center z-20 top-[60%] left-[50%] pointer-events-none">
              <Image
                src="/images/cuadro-primary.svg"
                alt={t('primary.decorAlt')}
                width={450}
                height={450}
                className="w-[450px] h-auto"
              />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="block lg:hidden relative w-full">
          <div className="absolute top-15 -left-30 w-[650px] z-0">
            <Image
              src="/images/formas/forma-home-6.svg"
              alt=""
              width={650}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 px-5">
            <h2 className="text-5xl font-bold text-left mb-5 mt-10 text-shadow-bold-movil">
              {t('primary.title')}
            </h2>
            <div className="bg-white shadow-xl rounded-3xl p-6 mb-6 space-y-4">
              <p className="leading-relaxed text-gray-800">
                {t('primary.p1')}
              </p>
              <Link href="/academicos-mas-info#primary">
                <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                  {t('primary.readMore')}
                </span>
              </Link>
            </div>

            <Image
              src="/images/cuadro-primary.svg"
              alt={t('primary.decorAlt')}
              width={450}
              height={450}
              className="w-[450px] mx-auto h-auto mb-6"
            />

            <RenderMedia
              medio={primaryImg}
              fallback={FALLBACKS.PRIMARY}
              width={800}
              height={600}
              className="w-full h-auto rounded-md shadow-md mb-6"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────── SECONDARY ─────────────────── */}
      <section
        id="secondary"
        className="relative w-full h-auto py-10 bg-white overflow-hidden"
      >
        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8 2xl:max-w-[1400px] max-w-[1200px] mx-auto">
            <div className="col-span-4 relative">
              <div className="absolute top-[10%] left-[75%] w-[450px] z-20 flex flex-col justify-center">
                <h2 className="text-5xl font-bold text-white text-left text-shadow-bold mb-5">
                  {t('secondary.title')}
                </h2>
                <div className="bg-white shadow-xl rounded-3xl p-8 space-y-4">
                  <h4 className="font-bold text-xl">{t('secondary.subtitle')}</h4>
                  <p className="leading-relaxed text-gray-800">
                    {t('secondary.p1')}
                  </p>
                  <Link href="/academicos-mas-info#secondary">
                    <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                      {t('secondary.readMore')}
                    </span>
                  </Link>
                </div>
              </div>
              <div className="absolute 2xl:top-40 2xl:-left-20 top-10 left-0 2xl:w-[355px] w-[255px] z-20 bg-white/80 p-4 rounded-xl text-[#1e804b]">
                <h4 className="font-bold text-xl text-center">
                  {t('secondary.dualTitle')}
                </h4>
                <p className="2xl:text-justify text-left">
                  {t('secondary.dualText')}
                </p>
                <Image
                  src="/images/logo-academia-internatiional-studies.svg"
                  alt={t('secondary.dualLogoAlt')}
                  width={128}
                  height={128}
                  className="mx-auto mt-5"
                />
              </div>
              <div className="absolute -top-5 2xl:-left-20 -left-15 w-[650px]">
                <Image
                  src="/images/formas/forma-home-6.svg"
                  alt=""
                  width={650}
                  height={100}
                  className="w-full h-full pointer-events-none"
                />
              </div>
            </div>

            <div className="col-span-8">
              <RenderMedia
                medio={secondImg}
                fallback={FALLBACKS.SECOND}
                width={800}
                height={600}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="block lg:hidden relative w-full">
          <div className="absolute top-15 -left-30 w-[650px] z-0">
            <Image
              src="/images/formas/forma-home-6.svg"
                  alt=""
                  width={650}
                  height={400}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
              <div className="relative z-10 px-5">
                <h2 className="text-5xl font-bold text-left text-shadow-bold-movil mb-5 mt-10">
                  {t('secondary.title')}
                </h2>
                <div className="bg-white shadow-xl rounded-3xl p-6 mb-6 space-y-4">
                  <h4 className="font-bold text-xl text-left">
                    {t('secondary.subtitle')}
                  </h4>
                  <p className="leading-relaxed text-gray-800">
                    {t('secondary.p1')}
                  </p>
                  <Link href="/academicos-mas-info#secondary">
                    <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                      {t('secondary.readMore')}
                    </span>
                  </Link>
                </div>

                <Image
                  src="/images/cuadro-primary.svg"
                  alt={t('secondary.decorAlt')}
                  width={450}
                  height={450}
                  className="w-[450px] mx-auto h-auto mb-6"
                />

                <RenderMedia
                  medio={secondImg}
                  fallback={FALLBACKS.SECOND}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-md shadow-md mb-6"
                />

                <div className="bg-white/80 shadow-xl rounded-xl p-4 text-[#1e804b] mb-6">
                  <h4 className="font-bold text-xl text-center">
                    {t('secondary.dualTitle')}
                  </h4>
                  <p className="text-justify mt-2">
                    {t('secondary.dualText')}
                  </p>
                  <Image
                    src="/images/logo-academia-internatiional-studies.svg"
                    alt={t('secondary.dualLogoAlt')}
                    width={96}
                    height={96}
                    className="mx-auto mt-4"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─────────────────── Extras ─────────────────── */}
          <SectionCarrusel />
          <Contact />
        </div>
  )
}
