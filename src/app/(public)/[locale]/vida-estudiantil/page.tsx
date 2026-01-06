// /app/[locale]/deportes/page.tsx
'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useMedios } from '@/lib/hooks'
import MediaCarousel from '@/components/MediaCarousel'

const Contact = dynamic(() => import('@/components/sectionContact'), { ssr: false })
const SectionCarrusel = dynamic(() => import('@/components/sectionCarrusel'), { ssr: false })

/* --------------------------------------------------------------------
 *  GRUPOS DE MEDIOS  (reemplaza los IDs por los que hayas creado
 *  en tu panel de administración).
 * ------------------------------------------------------------------*/
const HERO_GROUP_ID             = 8   // carrusel “Deportes” (hero)
const RUGBY_HOCKEY_GROUP_ID     = 9   // carrusel Club de Rugby y Hockey
const DOJO_GROUP_ID             = 10  // carrusel SIC Dojo
const VIDA_ESTUDIANTIL_GROUP_ID = 11  // carrusel Vida Estudiantil
const PLAY_GROUP_ID             = 12  // carrusel San Isidro Play

/*  Tipado mínimo para que TypeScript esté contento  */
type MedioMinimal = {
  id: number
  urlArchivo: string
  textoAlternativo?: string
  tipo: 'IMAGEN' | 'VIDEO'
  posicion: number
  grupoMediosId: number
}

export default function DeportesPage() {
  const t = useTranslations('vidaEstudiantilHome')

  /* ------------------------------ CARGA DE MEDIOS ------------------------------ */
  const {
    data: heroMediaRaw          = [],
    isLoading: lHero,
    error: eHero,
  } = useMedios(HERO_GROUP_ID)
  const {
    data: rugbyHockeyMediaRaw   = [],
    isLoading: lRH,
    error: eRH,
  } = useMedios(RUGBY_HOCKEY_GROUP_ID)
  const {
    data: dojoMediaRaw          = [],
    isLoading: lDojo,
    error: eDojo,
  } = useMedios(DOJO_GROUP_ID)
  const {
    data: vidaMediaRaw          = [],
    isLoading: lVida,
    error: eVida,
  } = useMedios(VIDA_ESTUDIANTIL_GROUP_ID)
  const {
    data: playMediaRaw          = [],
    isLoading: lPlay,
    error: ePlay,
  } = useMedios(PLAY_GROUP_ID)

  const isLoading = lHero || lRH || lDojo || lVida || lPlay
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-600">
        {t('loading')}
      </div>
    )
  }

  const errores = [
    eHero  && t('errors.hero', { msg: eHero.message }),
    eRH    && t('errors.rugbyHockey', { msg: eRH.message }),
    eDojo  && t('errors.dojo', { msg: eDojo.message }),
    eVida  && t('errors.vidaEstudiantil', { msg: eVida.message }),
    ePlay  && t('errors.play', { msg: ePlay.message }),
  ].filter(Boolean)

  if (errores.length > 0) {
    return (
      <div className="p-6 space-y-2 text-red-600">
        <h2 className="font-bold">{t('errors.title')}</h2>
        {errores.map((msg, idx) => (
          <p key={idx}>• {msg}</p>
        ))}
      </div>
    )
  }

  /* ------------------------------ FILTRADO SOLO IMAGEN/VIDEO ------------------------------ */
  const filterImgOrVideo = (arr: typeof heroMediaRaw) =>
    (arr as MedioMinimal[]).filter(m => m.tipo === 'IMAGEN' || m.tipo === 'VIDEO')

  const heroMedia        = filterImgOrVideo(heroMediaRaw)
  const rugbyHockeyMedia = filterImgOrVideo(rugbyHockeyMediaRaw)
  const dojoMedia        = filterImgOrVideo(dojoMediaRaw)
  const vidaMedia        = filterImgOrVideo(vidaMediaRaw)
  const playMedia        = filterImgOrVideo(playMediaRaw)

  /* ------------------------------ HELPERS ------------------------------ */
  const mapUrls = (arr: MedioMinimal[]) =>
    arr
      .sort((a, b) => a.posicion - b.posicion)
      .map((m) => `/images/medios/${m.urlArchivo}`)

  return (
    <div id="container">
      {/* ═════════════ SECCIÓN 1 — HERO ═════════════ */}
      <section className="relative w-full h-auto grid grid-cols-12 overflow-hidden" id="deportes">
        {/* --- COLUMNA VERDE ------------------------------------------------ */}
        <div className="col-span-12 md:col-span-4 bg-[#71af8d] relative flex justify-center items-center px-4 md:px-16">
          {/* Forma decorativa móvil */}
          <div className="block lg:hidden absolute inset-0 pointer-events-none">
            <Image src="/images/formas/forma-home-1.svg" alt="" fill className="object-cover" />
          </div>

          {/* Slogan + botón (móvil) */}
          <div className="lg:hidden relative flex justify-between items-end h-full pt-32 pb-12 z-20 md:w-[80%] w-full">
            <Image
              src="/images/eslogan.svg"
              alt={t('hero.alt')}
              width={250}
              height={250}
              className="z-40 max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
            />
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
              target="_blank"
              className="inline-flex items-center gap-3 px-4 py-2 bg-[#1e804b] text-white rounded-full shadow-lg transition"
            >
              <Image src="/images/ico-admisiones.svg" alt={t('admissions.alt')} width={24} height={24} />
              {t('admissions.label')}
            </Link>
          </div>

          {/* Slogan (desktop) */}
          <div className="hidden lg:block">
            <Image
              src="/images/eslogan.svg"
              alt={t('hero.alt')}
              width={250}
              height={250}
              className="absolute top-[65%] left-[77%] -translate-x-1/2 z-40 drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>

        {/* --- COLUMNA CARRUSEL ------------------------------------------- */}
        <div className="col-span-12 md:col-span-8 relative w-full h-[450px] md:h-[900px]">
          {heroMedia.length > 0 ? (
            <MediaCarousel
              medias={mapUrls(heroMedia)}
              altText={t('hero.carouselAlt')}
              className="w-full h-full"
            />
          ) : (
            <Image
              src="/images/Image-deportes.webp"
              alt={t('hero.fallbackAlt')}
              fill
              className="object-cover"
            />
          )}

          {/* Recuadro blanco centrado */}
          <div
            className="bg-white p-4 md:p-8 w-[90%] md:w-[550px] rounded-3xl shadow-lg 
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        z-40 lg:top-[60%] lg:left-[50%] xl:top-[70%] xl:left-[35%]"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t('hero.title')}
            </h1>
            <p className="text-gray-700 mb-4 text-sm md:text-base">
              {t('hero.description')}
            </p>
            <div className="text-center mt-5">
              <Link
                href="/vida-estudiantil-mas-info"
                className="text-[#1e804b] font-semibold hover:underline"
              >
                {t('hero.readMore')}
              </Link>
            </div>
          </div>

          {/* Botón admisiones (desktop) */}

        </div>

        {/* Forma decorativa escritorio */}
        <Image
          src="/images/formas/forma-home-1.svg"
          alt=""
          width={700}
          height={700}
          className="hidden lg:block absolute top-0 left-[32%] -translate-x-1/2 pointer-events-none z-0"
        />
      </section>

      {/* ═════════════ SECCIÓN 2 — RUGBY & HOCKEY ═════════════ */}
      <section
        className="relative w-full max-w-[1200px] h-auto pt-96 md:py-10 bg-white mx-auto overflow-hidden"
      >
        <Image
          src="/images/formas/forma-home-2.svg"
          alt=""
          width={550}
          height={300}
          className="absolute -top-5 -left-0 w-[550px] max-sm:top-0 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[600px]"
        />

        <div className="relative z-10 grid grid-cols-12 gap-8">
          {/* Texto (desktop) */}
          <div className="hidden sm:flex col-span-4 relative flex-col justify-center">
            <div className="absolute top-32 left-41 w-[490px] z-20">
              <Image
                src="/images/logo-club-rugby-hockey.svg"
                alt={t('rugbyHockey.logoAlt')}
                width={128}
                height={128}
                className="mx-auto mb-5"
              />
              <div className="bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-2xl font-bold text-center">
                  {t('rugbyHockey.title')}
                </h2>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('rugbyHockey.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Carrusel (desktop) */}
          <div className="hidden sm:block col-span-8">
            {rugbyHockeyMedia.length > 0 ? (
              <div className="w-full h-[645px]">
                <MediaCarousel
                  medias={mapUrls(rugbyHockeyMedia)}
                  altText={t('rugbyHockey.carouselAlt')}
                  className="w-full h-full rounded-xl shadow-lg"
                />
              </div>
            ) : (
              <Image
                src="/images/Image-SIC-hockey.webp"
                alt={t('rugbyHockey.fallbackAlt')}
                width={800}
                height={600}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            )}
          </div>

          {/* Móvil */}
          <div className="sm:hidden col-span-12 relative pt-16">
            {rugbyHockeyMedia.length > 0 ? (
              <div className="w-full h-[300px]">
                <MediaCarousel
                  medias={mapUrls(rugbyHockeyMedia)}
                  altText={t('rugbyHockey.carouselAlt')}
                  className="w-full h-full rounded-md shadow-lg"
                />
              </div>
            ) : (
              <Image
                src="/images/Image-SIC-hockey.webp"
                alt={t('rugbyHockey.fallbackAlt')}
                width={800}
                height={600}
                className="w-full h-auto rounded-md shadow-lg"
              />
            )}

            <div className="absolute -top-20 left-0 w-full px-4 z-20 -translate-y-1/2">
              <Image
                src="/images/logo-club-rugby-hockey.svg"
                alt={t('rugbyHockey.logoAlt')}
                width={128}
                height={128}
                className="mx-auto mb-5 w-32"
              />
              <div className="bg-white shadow-xl rounded-xl p-8 w-full text-center">
                <h2 className="text-xl font-bold">
                  {t('rugbyHockey.title')}
                </h2>
                <p className="mt-4 text-gray-700">
                  {t('rugbyHockey.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ SECCIÓN 3 — SIC DOJO ═════════════ */}
      <section className="relative w-full bg-white md:py-5 pt-80 pb-12 overflow-hidden">
        {/* Desktop */}
        <div className="hidden sm:block max-w-[1200px] mx-auto relative">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt=""
            width={550}
            height={300}
            className="absolute top-5 -right-24 w-[550px]"
          />
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8">
              {dojoMedia.length > 0 ? (
                <div className="w-full h-[645px]">
                  <MediaCarousel
                    medias={mapUrls(dojoMedia)}
                    altText={t('dojo.carouselAlt')}
                    className="w-full h-full rounded-md shadow-md"
                  />
                </div>
              ) : (
                <Image
                  src="/images/Image-SIC-dojo.webp"
                  alt={t('dojo.fallbackAlt')}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-md shadow-md"
                />
              )}
            </div>
            <div className="absolute col-span-4 top-65 left-[37%] z-20">
              <div className="absolute -top-[180px] left-[115px] w-[475px]">
                <Image
                  src="/images/logo-dojo.svg"
                  alt={t('dojo.logoAlt')}
                  width={128}
                  height={128}
                  className="mx-auto mb-5 w-32"
                />
                <div className="bg-white shadow-xl rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-center">
                    {t('dojo.title')}
                  </h2>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {t('dojo.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden relative min-h-[350px]">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt=""
            width={550}
            height={300}
            className="absolute -top-72 -right-0 w-[550px]"
          />
          {dojoMedia.length > 0 ? (
            <div className="w-full h-[350px]">
              <MediaCarousel
                medias={mapUrls(dojoMedia)}
                altText={t('dojo.carouselAlt')}
                className="w-full h-full rounded-md shadow-md"
              />
            </div>
          ) : (
            <Image
              src="/images/Image-SIC-dojo.webp"
              alt={t('dojo.fallbackAlt')}
              width={800}
              height={600}
              className="w-full h-auto rounded-md shadow-md"
            />
          )}
          <div className="absolute -top-8 left-0 w-full px-4 z-20 -translate-y-1/2">
            <Image
              src="/images/logo-dojo.svg"
              alt={t('dojo.logoAlt')}
              width={128}
              height={128}
              className="mx-auto mb-5 w-24"
            />
            <div className="bg-white shadow-xl rounded-xl p-4 text-center">
              <h2 className="text-xl font-bold">
                {t('dojo.title')}
              </h2>
              <p className="mt-4 text-gray-700">
                {t('dojo.descriptionMobile')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ SECCIÓN 4 — VIDA ESTUDIANTIL ═════════════ */}
      <section
        id="bienestar-estudiantil"
        className="relative w-full h-auto md:py-10 pt-60 pb-12 bg-[#71af8d] overflow-hidden"
      >
        {/* Desktop */}
        <div className="hidden sm:grid grid-cols-12 gap-8 max-w-[1200px] mx-auto">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt=""
            width={550}
            height={300}
            className="absolute top-5 left-24 w-[550px]"
          />
          <div className="col-span-4 relative flex flex-col justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 absolute top-65 left-45 w-[550px] z-20">
              <h2 className="text-2xl font-bold text-center">
                {t('vida.title')}
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {t('vida.description')}
              </p>
              <div className="text-center mt-5">
                <Link
                  href="/vida-estudiantil-mas-info/#bienestar"
                  className="text-[#1e804b] font-semibold hover:underline"
                >
                  {t('vida.readMore')}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            {vidaMedia.length > 0 ? (
              <div className="w-full h-[645px]">
                <MediaCarousel
                  medias={mapUrls(vidaMedia)}
                  altText={t('vida.carouselAlt')}
                  className="w-full h-full rounded-xl shadow-lg"
                />
              </div>
            ) : (
              <Image
                src="/images/Image-vida-estudiantil.webp"
                alt={t('vida.fallbackAlt')}
                width={800}
                height={600}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden relative min-h-[350px]">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt=""
            width={550}
            height={300}
            className="absolute -top-15 right-35 w-[550px]"
          />
          {vidaMedia.length > 0 ? (
            <div className="w-full h-[350px]">
              <MediaCarousel
                medias={mapUrls(vidaMedia)}
                altText={t('vida.carouselAlt')}
                className="w-full h-full rounded-xl shadow-lg"
              />
            </div>
          ) : (
            <Image
              src="/images/Image-vida-estudiantil.webp"
              alt={t('vida.fallbackAlt')}
              width={800}
              height={600}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          )}
          <div className="absolute top-0 left-0 w-full px-4 z-20 -translate-y-1/2">
            <div className="bg-white shadow-xl rounded-xl p-4 text-center">
              <h2 className="text-xl font-bold">
                {t('vida.title')}
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {t('vida.descriptionMobile')}
              </p>
              <div className="mt-5">
                <Link
                  href="/vida-estudiantil-mas-info/#bienestar"
                  className="text-[#1e804b] font-semibold hover:underline"
                >
                  {t('vida.readMore')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ SECCIÓN 5 — SAN ISIDRO PLAY ═════════════ */}
      <section
        id="play-habilidades-steam"
        className="relative w-full h-auto md:py-10 pt-72 pb-16 bg-white overflow-hidden"
      >
        {/* Desktop */}
        <div className="hidden sm:block relative">
          <Image
            src="/images/formas/forma-home-2.svg"
            alt=""
            width={550}
            height={300}
            className="absolute -top-16 lg:right-44 md:-right-28 w-[550px] z-10"
          />
          <div className="grid grid-cols-12 gap-8 max-w-[1200px] mx-auto h-full px-4">
            <div className="col-span-8 flex items-center justify-center">
              {playMedia.length > 0 ? (
                <div className="w-full h-[645px]">
                  <MediaCarousel
                    medias={mapUrls(playMedia)}
                    altText={t('play.carouselAlt')}
                    className="w-full h-full rounded-md shadow-md"
                  />
                </div>
              ) : (
                <Image
                  src="/images/image-SIC-play.webp"
                  alt={t('play.fallbackAlt')}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-md shadow-md"
                />
              )}
            </div>
            <div className="absolute col-span-4 z-20 top-[65%] xl:left-[22%] left-[23%]">
              <div className="bg-white shadow-xl rounded-xl p-8 absolute -top-85 lg:left-96 md:left-52 w-[550px]">
                <Image
                  src="/images/logo-SIC-play.svg"
                  alt={t('play.logoAlt')}
                  width={128}
                  height={128}
                  className="mx-auto mb-10 w-32"
                />
                <p className="mt-4 text-gray-700 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                  <strong>San Isidro Play</strong> {t('play.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden relative">
          <Image
            src="/images/formas/forma-home-2.svg"
            alt=""
            width={550}
            height={300}
            className="absolute top-5 right-35 w-[550px]"
          />
          {playMedia.length > 0 ? (
            <div className="w-full h-[350px]">
              <MediaCarousel
                medias={mapUrls(playMedia)}
                altText={t('play.carouselAlt')}
                className="w-full h-full rounded-md shadow-md"
              />
            </div>
          ) : (
            <Image
              src="/images/image-SIC-play.webp"
              alt={t('play.fallbackAlt')}
              width={800}
              height={600}
              className="w-full h-auto rounded-md shadow-md"
            />
          )}
          <div className="absolute -top-10 left-0 w-full px-4 z-20 -translate-y-1/2">
            <div className="bg-white shadow-xl rounded-xl p-4 text-center">
              <Image
                src="/images/logo-SIC-play.svg"
                alt={t('play.logoAlt')}
                width={128}
                height={128}
                className="mx-auto mb-10 w-32"
              />
              <p className="mt-4 text-gray-700 leading-relaxed">
                <strong>San Isidro Play</strong> {t('play.descriptionMobile')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel genérico + contacto */}
      <SectionCarrusel />
      <Contact />
    </div>
  )
}
