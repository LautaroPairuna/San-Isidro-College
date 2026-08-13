// /app/[locale]/page.tsx
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import RenderMedia from '@/components/RenderMedia'
import MediaCarousel from '@/components/MediaCarousel'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import PilaresEducativos from '@/components/PilaresEducativos'
import { getTranslations } from 'next-intl/server'
import { getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'
import { ADMISSIONS_FORM_URL } from '@/lib/siteConfig'

// SLUGS de secciones (coinciden con DB)
const SECTION_SLUGS = {
  HERO: 'home-hero',
  BIENVENIDA: 'home-bienvenida',
  INFOGRAFIA: 'home-infografia',
  SEC3_BACKGROUND: 'home-sec3-background',
  ALIANZAS: 'home-alianzas',
  CONOCERNOS: 'home-conocernos',
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

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
}

const HomePage = async ({ params }: PageProps) => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  /* ------------------------------ CARGA DE MEDIOS DINÁMICA ------------------------------ */
  const pageSections = await getPageContentForSlug('home')

  const getMedias = (slug: string) => {
    const section = pageSections.find((s: PageContentSection) => s.slug === slug);
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

  // 6) "Los invitamos a conocernos" (único)
  const conocernosMedio =
    pageSections.find((s: PageContentSection) => s.slug === SECTION_SLUGS.CONOCERNOS)?.medio

  // Extraemos objeto único para sección 3
  const sec3Medio = sec3Arr.length > 0 ? sec3Arr[0] : undefined

  // Niveles educativos enlazados desde "Descubrí nuestra propuesta"
  const NIVELES = [
    { key: 'kindergarden', href: '/kindergarden' },
    { key: 'primary', href: '/primary' },
    { key: 'secondary', href: '/secondary' },
  ] as const

  return (
    <div id="container">
      {/* ==================== SECCIÓN 1: HERO (CARRUSEL) ==================== */}
      <section className="relative w-full lg:h-screen grid grid-cols-12 max-lg:flex max-lg:flex-col overflow-hidden">
        {/* --- Columna Izquierda: texto estático sobre fondo verde --- */}
        <div className="col-span-5 flex flex-col justify-center items-start px-16 bg-[#71af8d] relative max-sm:items-center max-sm:px-6 max-sm:py-24 max-lg:w-full max-lg:h-[300px]">
          <Image
            src="/images/eslogan.svg"
            alt={t('hero.alt')}
            width={250}
            height={250}
            className="absolute top-[55%] left-[80%] -translate-x-1/2 z-40
                      max-sm:relative max-sm:top-15 max-sm:-left-16 max-lg:top-[50%] max-lg:left-[80%] max-sm:translate-x-0
                      max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
          />

        </div>

        {/* --- Columna Derecha: carrusel de heroMedia --- */}
        <div className="col-span-7 relative w-full h-full max-sm:h-[60vh] max-lg:h-[500px] overflow-hidden">
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
      <section className="relative w-full py-10 bg-white lg:min-h-[720px]" id="bienvenida">
        <div className="grid grid-cols-12 gap-8 max-w-screen-xl mx-auto">
          {/* Columna Izquierda */}
          <div className="col-span-4 relative flex flex-col justify-center max-lg:col-span-12">
            <div className="bg-white shadow-xl rounded-xl p-8 absolute top-10 left-[55%] w-[475px] z-20 max-lg:relative max-lg:top-35 max-lg:left-0 max-lg:w-[90%] max-lg:mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                {t('bienvenida.title')}
              </h1>
              <div className="mt-4 space-y-3 text-gray-700 italic leading-relaxed text-[15px]">
                <p>{t('bienvenida.greeting')}</p>
                <p>{t('bienvenida.p1')}</p>
                <p>{t('bienvenida.p2')}</p>
                <p>{t('bienvenida.p3')}</p>
              </div>
            </div>
            {/* Línea decorativa */}
            <Image
              src="/images/formas/forma-home-2.svg"
              alt="Decoración"
              width={650}
              height={350}
              className="absolute -top-0 -left-0 w-[650px] max-lg:absolute max-lg:top-0 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:w-[600px]"
            />
          </div>

          {/* Columna Derecha */}
          <div className="col-span-8 max-lg:col-span-12 z-10 relative h-[300px] sm:h-[420px] lg:h-[560px]">
            {bienvenidaArr.length > 0 ? (
              <MediaCarousel
                items={bienvenidaArr}
                altText={t('bienvenida.title')}
                className="w-full h-full rounded-xl shadow-lg"
              />
            ) : (
              <div className="relative w-full h-full rounded-xl shadow-lg overflow-hidden">
                <Image
                  src="/images/fondo-bienvenida.webp"
                  alt={t('bienvenida.title')}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =============== SECCIÓN 2 BIS: PILARES (FORMACIÓN INTEGRAL) =============== */}
      <section className="relative w-full bg-white py-12 lg:py-20 overflow-hidden" id="pilares">
        {/* Trazo decorativo (solo desktop) */}
        <Image
          src="/images/formas/forma-home-4.svg"
          alt=""
          width={650}
          height={600}
          aria-hidden="true"
          className="hidden lg:block absolute top-0 right-0 w-[550px] h-auto pointer-events-none opacity-90"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-screen-xl mx-auto px-4">
          {/* Rueda de pilares */}
          <div className="lg:col-span-7 flex justify-center">
            <PilaresEducativos className="w-full max-w-[560px] h-auto" />
          </div>

          {/* Texto introductorio */}
          <div className="lg:col-span-5">
            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
              <p className="text-gray-700 italic leading-relaxed">
                {t('pilares.intro')}
              </p>
            </div>
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
                width={665}
                height={546}
                className="w-full h-auto rounded-md shadow-md"
                sizes="(max-width: 768px) 100vw, 665px"
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
              loading="lazy"
            />
          </div>
        </div>
      </section>
      {/* Carrusel global */}
      <SectionCarrusel medios={alianzasMedia} />

      {/* =========== SECCIÓN 4: DESCUBRÍ NUESTRA PROPUESTA =========== */}
      <section className="relative w-full bg-[#dfeadf] py-14 lg:py-20" id="propuesta">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#294161]">
            {t('propuesta.title')}
          </h2>
          <p className="mt-2 text-gray-700 italic">
            {t('propuesta.subtitle')}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
            {/* Niveles educativos */}
            <div className="flex flex-col justify-between md:px-8 md:first:pl-0">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#1e804b]">
                  {t('propuesta.niveles.title')}
                </h3>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('propuesta.niveles.description')}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {NIVELES.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    className="inline-flex items-center gap-2 font-semibold text-[#294161] hover:text-[#1e804b] transition-colors"
                  >
                    {t(`propuesta.niveles.${key}`)}
                    <span aria-hidden="true" className="text-[#c19516]">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Experiencia SIC */}
            <div className="flex flex-col justify-between md:px-8 md:border-l md:border-[#1e804b]/30">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#1e804b]">
                  {t('propuesta.experiencia.title')}
                </h3>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('propuesta.experiencia.description')}
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/experiencia-sic"
                  className="inline-flex items-center gap-2 font-semibold text-[#294161] hover:text-[#1e804b] transition-colors"
                >
                  {t('propuesta.experiencia.cta')}
                  <span aria-hidden="true" className="text-[#c19516]">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Deportes */}
            <div className="flex flex-col justify-between md:px-8 md:border-l md:border-[#1e804b]/30 md:last:pr-0">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#1e804b]">
                  {t('propuesta.deportes.title')}
                </h3>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('propuesta.deportes.description')}
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/deportes"
                  className="inline-flex items-center gap-2 font-semibold text-[#294161] hover:text-[#1e804b] transition-colors"
                >
                  {t('propuesta.deportes.cta')}
                  <span aria-hidden="true" className="text-[#c19516]">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========== SECCIÓN 5: LOS INVITAMOS A CONOCERNOS =========== */}
      <section className="relative w-full bg-white py-14 lg:py-20 overflow-hidden" id="conocernos">
        {/* Trazo decorativo (solo desktop) */}
        <Image
          src="/images/formas/forma-home-5.svg"
          alt=""
          width={600}
          height={700}
          aria-hidden="true"
          className="hidden lg:block absolute -top-10 -left-24 w-[600px] h-auto pointer-events-none"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-screen-xl mx-auto px-4">
          {/* Columna izquierda: tarjeta de texto */}
          <div className="lg:col-span-5 relative z-20 flex items-center">
            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 w-full lg:w-[480px] lg:absolute lg:left-[10%] space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#294161]">
                {t('conocernos.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('conocernos.p1')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t('conocernos.p2')}
              </p>
              <a
                href={ADMISSIONS_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#1e804b] font-semibold hover:underline"
              >
                {t('conocernos.cta')}
              </a>
            </div>
          </div>

          {/* Columna derecha: imagen */}
          <div className="lg:col-span-7 relative z-10 h-[280px] sm:h-[400px] lg:h-[560px]">
            <RenderMedia
              medio={conocernosMedio}
              fallback="/images/fondo-bienvenida.webp"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <Contact />
    </div>
  )
}

export default HomePage
