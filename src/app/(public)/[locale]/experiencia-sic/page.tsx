// /app/[locale]/experiencia-sic/page.tsx
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import MediaCarousel from '@/components/MediaCarousel'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { getTranslations } from 'next-intl/server'
import { getMediaGroupByName, getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'

/* --------------------------------------------------------------------
 *  SLUGS DE SECCIONES (Coinciden con DB)
 * ------------------------------------------------------------------*/
const SECTION_SLUGS = {
  HERO: 'vida-estudiantil-hero',
  RUGBY: 'vida-estudiantil-rugby',
  DOJO: 'vida-estudiantil-dojo',
  GYM: 'vida-estudiantil-gym',
  BIENESTAR: 'vida-estudiantil-bienestar',
  PLAY: 'vida-estudiantil-play',
} as const

/**
 * Tipo mínimo consistente para carruseles (imagen/video/icono).
 * (No depende de creadoEn/actualizadoEn para evitar fricción de tipado en páginas)
 */
type MedioItem = {
  id: number
  urlArchivo: string
  urlMiniatura?: string | null
  textoAlternativo?: string | null
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
  posicion: number
  grupoMediosId: number
}

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function DeportesPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'vidaEstudiantilHome' })
  const tExperience = await getTranslations({ locale, namespace: 'experienciaSicHome' })

  /* ------------------------------ CARGA DE MEDIOS DINÁMICA ------------------------------ */
  const pageSections = await getPageContentForSlug('vida-estudiantil')
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  const getMedias = (slug: string): MedioItem[] => {
    const section = pageSections.find((s: PageContentSection) => s.slug === slug)
    return (section?.grupo?.medios ?? []) as MedioItem[]
  }

  const heroMediaRaw = getMedias(SECTION_SLUGS.HERO)
  const rugbyHockeyMediaRaw = getMedias(SECTION_SLUGS.RUGBY)
  const dojoMediaRaw = getMedias(SECTION_SLUGS.DOJO)
  const gymMediaRaw = getMedias(SECTION_SLUGS.GYM)
  const vidaMediaRaw = getMedias(SECTION_SLUGS.BIENESTAR)
  const playMediaRaw = getMedias(SECTION_SLUGS.PLAY)

  /* ------------------------------ FILTRADO SOLO IMAGEN/VIDEO Y ORDENAMIENTO ------------------------------ */
  const filterImgOrVideo = (arr: MedioItem[]) =>
    arr
      .filter((m) => m.tipo === 'IMAGEN' || m.tipo === 'VIDEO')
      .sort((a, b) => a.posicion - b.posicion)

  const heroMedia = filterImgOrVideo(heroMediaRaw)
  const rugbyHockeyMedia = filterImgOrVideo(rugbyHockeyMediaRaw)
  const dojoMedia = filterImgOrVideo(dojoMediaRaw)
  const gymMedia = filterImgOrVideo(gymMediaRaw)
  const vidaMedia = filterImgOrVideo(vidaMediaRaw)
  const playMedia = filterImgOrVideo(playMediaRaw)

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
          <div className="lg:hidden relative flex justify-between items-end h-full pt-40 pb-12 z-20 md:w-[80%] w-full">
            <Image
              src="/images/eslogan.svg"
              alt={tExperience('hero.alt')}
              width={250}
              height={250}
              className="z-40 max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Slogan (desktop) */}
          <div className="hidden lg:block">
            <Image
              src="/images/eslogan.svg"
              alt={tExperience('hero.alt')}
              width={250}
              height={250}
              className="absolute top-[65%] left-[77%] -translate-x-1/2 z-40 drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>

        {/* --- COLUMNA CARRUSEL ------------------------------------------- */}
        <div className="col-span-12 md:col-span-8 relative w-full h-[450px] md:h-[900px]">
          {heroMedia.length > 0 ? (
            <MediaCarousel items={heroMedia} altText={tExperience('hero.carouselAlt')} className="w-full h-full" />
          ) : (
            <Image src="/images/Image-deportes.webp" alt={tExperience('hero.fallbackAlt')} fill className="object-cover" />
          )}

          {/* Recuadro blanco centrado */}
          <div
            className="bg-white p-4 md:p-8 w-[90%] md:w-[550px] rounded-3xl shadow-lg 
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        z-40 lg:top-[60%] lg:left-[50%] xl:top-[70%] xl:left-[35%]"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{tExperience('hero.title')}</h1>
            <p className="text-gray-700 mb-4 text-sm md:text-base">{tExperience('hero.description')}</p>
          </div>
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

      {/* ═════════════ SECCIÓN 2 — BIENESTAR ESTUDIANTIL ═════════════ */}
      <section id="bienestar-y-acompanamiento" className="relative w-full max-w-[1200px] h-auto pt-96 md:py-10 bg-white mx-auto overflow-hidden">
        <Image
          src="/images/formas/forma-home-2.svg"
          alt=""
          width={550}
          height={300}
          className="absolute -top-5 -left-20 w-[550px] max-sm:top-0 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[600px]"
        />

        <div className="relative z-10 grid grid-cols-12 gap-8">
          {/* Texto (desktop) */}
          <div className="hidden sm:flex col-span-4 relative flex-col justify-center">
            <div className="absolute top-60 left-41 w-[490px] z-20">
              <div className="bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-2xl font-bold text-center">{tExperience('rugbyHockey.title')}</h2>
                <p className="mt-4 text-gray-700 leading-relaxed">{tExperience('rugbyHockey.description')}</p>
                <div className="mt-5 text-center">
                  <Link href="/experiencia-sic/bienestar-y-acompanamiento" className="text-black font-semibold hover:underline">
                    {tExperience('rugbyHockey.readMore')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Carrusel (desktop) */}
          <div className="hidden sm:block col-span-8">
            {rugbyHockeyMedia.length > 0 ? (
              <div className="w-full h-[645px]">
                <MediaCarousel
                  items={rugbyHockeyMedia}
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
                  items={rugbyHockeyMedia}
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
              <div className="bg-white shadow-xl rounded-xl p-8 w-full text-center">
                <h2 className="text-xl font-bold">{tExperience('rugbyHockey.title')}</h2>
                <p className="mt-4 text-gray-700">{tExperience('rugbyHockey.description')}</p>
                <div className="mt-5">
                  <Link href="/experiencia-sic/bienestar-y-acompanamiento" className="text-black font-semibold hover:underline">
                    {tExperience('rugbyHockey.readMore')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {	/* ═════════════ SECCIÓN 3 — GOOGLE REFERENCEW SCHOOL  ═════════════ */}
      <section id="google-reference-school" className="relative w-full h-auto md:py-10 pt-72 pb-16 bg-[#71af8d] overflow-hidden">
        {/* Desktop */}
        <div className="hidden sm:block relative">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt=""
            width={550}
            height={300}
            className="absolute -top-16 lg:right-44 md:-right-28 w-[550px]"
          />
          <div className="grid grid-cols-12 gap-8 max-w-[1200px] mx-auto h-full px-4">
            <div className="col-span-8 flex items-center justify-center">
              <div className="w-full h-[645px]">
                <MediaCarousel items={playMedia} altText={t('play.carouselAlt')} className="w-full h-full rounded-md shadow-md" />
              </div>
            </div>
            <div className="absolute col-span-4 z-20 top-[68%] xl:left-[30%] left-[23%]">
              <div className="bg-white shadow-xl rounded-xl p-8 absolute -top-85 lg:left-96 md:left-52 w-[550px]">
                <h2 className="text-2xl font-bold text-center">{tExperience('googleReferenceSchool.title')}</h2>
                <p className="mt-4 text-gray-700 leading-relaxed">{tExperience('googleReferenceSchool.description')}</p>
                <div className="mt-5 text-center">
                  <Link href="/experiencia-sic/google-reference-school" className="text-[#1e804b] font-semibold hover:underline">
                    {tExperience('googleReferenceSchool.readMore')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden relative">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt=""
            width={550}
            height={300}
            className="absolute -top-20 right-35 w-[550px]"
          />
          {playMedia.length > 0 ? (
            <div className="w-full h-[350px]">
              <MediaCarousel items={playMedia} altText={t('play.carouselAlt')} className="w-full h-full rounded-md shadow-md" />
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
              <h2 className="text-xl font-bold">{tExperience('googleReferenceSchool.title')}</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">{tExperience('googleReferenceSchool.description')}</p>
              <div className="mt-5">
                <Link href="/experiencia-sic/google-reference-school" className="text-[#1e804b] font-semibold hover:underline">
                  {tExperience('googleReferenceSchool.readMore')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ SECCIÓN 4 — INNOVACION Y ROBOTICA ═════════════ */}
      <section
        id="innovacion-y-robotica"
        className="relative w-full h-auto md:py-10 pt-60 pb-12 bg-white overflow-hidden"
      >
        {/* Desktop */}
        <div className="hidden sm:grid grid-cols-12 gap-8 max-w-[1200px] mx-auto">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt=""
            width={550}
            height={300}
            className="absolute top-5"
          />
          <div className="col-span-4 relative flex flex-col justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 absolute top-55 left-25 w-[550px] z-20">
              <h2 className="text-2xl font-bold text-center">{tExperience('innovacionRobotica.title')}</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">{tExperience('innovacionRobotica.description')}</p>
              <div className="text-center mt-5">
                <Link href="/experiencia-sic/innovacion-y-robotica" className="text-[#1e804b] font-semibold hover:underline">
                  {tExperience('innovacionRobotica.readMore')}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="w-full h-[645px]">
              <MediaCarousel items={vidaMedia} altText={t('vida.carouselAlt')} className="w-full h-full rounded-xl shadow-lg" />
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
            className="absolute -top-15 right-35 w-[550px]"
          />
          {vidaMedia.length > 0 ? (
            <div className="w-full h-[350px]">
              <MediaCarousel items={vidaMedia} altText={t('vida.carouselAlt')} className="w-full h-full rounded-xl shadow-lg" />
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
              <h2 className="text-xl font-bold">{tExperience('innovacionRobotica.title')}</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">{tExperience('innovacionRobotica.description')}</p>
              <div className="mt-5">
                <Link href="/experiencia-sic/innovacion-y-robotica" className="text-[#1e804b] font-semibold hover:underline">
                  {tExperience('innovacionRobotica.readMore')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ SECCIÓN 5 — SAN ISIDRO PLAY ═════════════ */}
      <section id="san-isidro-play" className="relative w-full h-auto md:py-10 pt-72 pb-16 bg-[#71af8d] overflow-hidden">
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
                  <MediaCarousel items={playMedia} altText={t('play.carouselAlt')} className="w-full h-full rounded-md shadow-md" />
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
            <div className="absolute col-span-4 z-20 top-[68%] xl:left-[30%] left-[23%]">
              <div className="bg-white shadow-xl rounded-xl p-8 absolute -top-85 lg:left-96 md:left-52 w-[550px]">
                <Image
                  src="/images/logo-SIC-play.svg"
                  alt={t('play.logoAlt')}
                  width={128}
                  height={128}
                  className="mx-auto mb-10 w-32"
                />
                <p className="mt-4 text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
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
              <MediaCarousel items={playMedia} altText={t('play.carouselAlt')} className="w-full h-full rounded-md shadow-md" />
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

      {/* ═════════════ SECCIÓN 6 — ACTIVIDADES EXTRACURRICULARES ═════════════ */}
      <section
        id="actividades-extracurriculares"
        className="relative w-full h-auto md:py-10 pt-60 pb-12 bg-white overflow-hidden"
      >
        {/* Desktop */}
        <div className="hidden sm:grid grid-cols-12 gap-8 max-w-[1200px] mx-auto">
          <Image
            src="/images/formas/forma-home-5.svg"
            alt=""
            width={550}
            height={300}
            className="absolute top-5"
          />
          <div className="col-span-4 relative flex flex-col justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 absolute top-55 left-25 w-[550px] z-20">
              <h2 className="text-2xl font-bold text-center">{tExperience('actividadesExtracurriculares.title')}</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">{tExperience('actividadesExtracurriculares.description')}</p>
              <div className="text-center mt-5">
                <Link href="/deportes" className="text-[#1e804b] font-semibold hover:underline">
                  {tExperience('actividadesExtracurriculares.readMore')}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="w-full h-[645px]">
              <MediaCarousel items={vidaMedia} altText={t('vida.carouselAlt')} className="w-full h-full rounded-xl shadow-lg" />
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
            className="absolute -top-15 right-35 w-[550px]"
          />
          {vidaMedia.length > 0 ? (
            <div className="w-full h-[350px]">
              <MediaCarousel items={vidaMedia} altText={t('vida.carouselAlt')} className="w-full h-full rounded-xl shadow-lg" />
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
              <h2 className="text-xl font-bold">{tExperience('actividadesExtracurriculares.title')}</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">{tExperience('actividadesExtracurriculares.description')}</p>
              <div className="mt-5">
                <Link href="/deportes" className="text-[#1e804b] font-semibold hover:underline">
                  {tExperience('actividadesExtracurriculares.readMore')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel genérico + contacto */}
      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </div>
  )
}
