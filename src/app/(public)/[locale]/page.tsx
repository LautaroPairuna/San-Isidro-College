// /app/[locale]/page.tsx
import { Link } from '@/i18n/navigation'
import RenderMedia from '@/components/RenderMedia'
import MediaCarousel from '@/components/MediaCarousel'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import PilaresEducativos from '@/components/PilaresEducativos'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'
import { ADMISSIONS_FORM_URL } from '@/lib/siteConfig'

// SLUGS de secciones (coinciden con DB)
const SECTION_SLUGS = {
  HERO: 'home-hero',
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

// ISR: se renderiza una vez y se sirve desde caché (menos RAM/CPU por request).
// El admin regenera al instante con revalidatePath(); 1h es solo el respaldo.
export const revalidate = 3600

type PageProps = {
  params: Promise<{ locale: string }>
}

const HomePage = async ({ params }: PageProps) => {
  const { locale } = await params
  // Habilita el render estático (ISR) fijando el locale sin leer headers().
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })

  /* ------------------------------ CARGA DE MEDIOS DINÁMICA ------------------------------ */
  const pageSections = await getPageContentForSlug('home')

  const getMedias = (slug: string) => {
    const section = pageSections.find((s: PageContentSection) => s.slug === slug);
    return (section?.grupo?.medios || []) as unknown as MedioMinimal[];
  }

  // 1) Hero (carrousel)
  const heroMedia = getMedias(SECTION_SLUGS.HERO);

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
          <img src="/images/eslogan.svg" alt={t('hero.alt')} width={250} height={250} className="absolute top-[55%] left-[80%] -translate-x-1/2 z-40
                      max-sm:relative max-sm:top-15 max-sm:-left-16 max-lg:top-[50%] max-lg:left-[80%] max-sm:translate-x-0
                      max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.9)]" />

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
            <img src="/images/fondo-home.webp" alt={t('hero.alt')} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          )}


        </div>

        {/* --- SVG decorativo encima del carrusel --- */}
        <img src="/images/formas/forma-home-1.svg" alt="" aria-hidden="true" width={1000} height={1000} className="absolute top-0 left-4/12 -translate-x-1/2 h-full pointer-events-none
                    max-sm:w-3/4 max-sm:-top-35 max-sm:left-40 max-sm:-translate-x-1/2" fetchPriority="high" />
      </section>

      {/* Bienvenida + Pilares comparten un mismo trazo punteado de fondo
          (FondoFormaSeccion), como Colegio y Académicos: una sola instancia
          que atraviesa ambas secciones en vez de una figura por sección. */}
      <div className="relative overflow-hidden">
        {/* =============== SECCIÓN 2: BIENVENIDA =============== */}
        <section
          className="relative w-full bg-[#dcebe0] py-24 lg:py-32 lg:min-h-[620px] flex items-center"
          id="bienvenida"
        >
          {/* Columna centrada en la pantalla, compartida con Pilares
              (mismo max-w y mismo padding), en vez de desplazada a un lado. */}
          <div className="relative z-10 max-w-2xl mx-auto px-4 w-full">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#294161]">
              {t('bienvenida.title')}
            </h1>
            <p className="mt-3 font-bold text-[#c19516]">
              {t('bienvenida.greeting')}
            </p>
            <div className="mt-4 space-y-3 text-[#294161] italic leading-relaxed text-[15px]">
              <p>{t('bienvenida.p1')}</p>
              <p>{t('bienvenida.p2')}</p>
              <p>{t('bienvenida.p3')}</p>
            </div>
          </div>
        </section>

        {/* =============== SECCIÓN 3 BIS: PILARES (FORMACIÓN INTEGRAL) =============== */}
        <section className="relative w-full bg-white py-12 lg:py-20" id="pilares">
          {/* Contenedor más ancho que el de Bienvenida (pero también centrado
              en la pantalla) para poder alojar la rueda a ~760px. */}
          <div className="relative z-10 max-w-[1200px] mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-10">
              {/* Texto: contra el filete, como en el resto del sitio (BloqueRotulo).
                  El filete estira su altura para igualar la de la rueda. */}
              <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:text-right lg:border-r lg:border-[#9bb5a5] lg:pr-8 order-2 lg:order-1">
                <p className="text-gray-700 italic leading-relaxed">
                  {t('pilares.intro')}
                </p>
              </div>

              {/* Rueda de pilares */}
              <div className="w-full lg:w-[760px] shrink-0 flex justify-center order-1 lg:order-2">
                <PilaresEducativos className="w-full max-w-[340px] lg:max-w-none h-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Mismo trazo punteado decorativo que Colegio y Académicos */}
        <FondoFormaSeccion />
      </div>

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
              <img src="/images/fondo-iconos.webp" alt="" aria-hidden="true" width={800} height={600} className="w-full h-auto rounded-md shadow-md" />
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
              <img src="/images/fondo-iconos.webp" alt="" aria-hidden="true" width={665} height={546} className="w-full h-auto rounded-md shadow-md" />
            </div>
          </div>
          <div className="absolute -top-5 2xl:-right-20 -right-0 xl:w-[650px] lg:w-[550px] md:w-[475px] w-[300px] z-0 md:z-10">
            <img src="/images/formas/forma-home-3.svg" alt="" width={650} height={100} loading="lazy" className="w-full h-full" />
          </div>
        </div>
      </section>
      {/* Carrusel global */}
      <SectionCarrusel medios={alianzasMedia} />

      {/* =========== SECCIÓN 4: DESCUBRÍ NUESTRA PROPUESTA + CONOCERNOS ===========
          Una única sección con fondo verde continuo: "propuesta" arriba y
          "conocernos" abajo, separadas sólo por un filete (como en el diseño). */}
      <section className="relative w-full bg-[#dcebe0] py-14 lg:py-20" id="propuesta">
        <div className="max-w-screen-xl mx-auto px-6 md:px-24">
          <div className="pb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#294161]">
              {t('propuesta.title')}
            </h2>
            <p className="mt-2 text-gray-700 italic">
              {t('propuesta.subtitle')}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-0">
            {/* Niveles educativos */}
            <div className="flex flex-col justify-between md:col-span-6 md:px-8 md:first:pl-0">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#294161]">
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
            <div className="flex flex-col justify-between border-t border-[#1e804b]/30 pt-8 md:col-span-3 md:border-l md:pt-0 md:px-8 md:border-[#1e804b]/30 md:border-t-0">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#294161]">
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
            <div className="flex flex-col justify-between border-t border-[#1e804b]/30 pt-8 md:col-span-3 md:border-l md:pt-0 md:px-8 md:border-[#1e804b]/30 md:border-t-0 md:last:pr-0">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#294161]">
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

        {/* Filete divisorio entre "propuesta" y "conocernos", con el mismo
            aire arriba y abajo para que no quede pegado a los enlaces */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-24 my-10 lg:my-14">
          <hr className="border-t border-[#1e804b]/30" />
        </div>

        {/* =========== LOS INVITAMOS A CONOCERNOS =========== */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-24" id="conocernos">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Texto */}
            <div className="lg:col-span-7 space-y-4">
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
                className="inline-flex items-center gap-2 text-[#294161] font-semibold hover:text-[#1e804b] transition-colors"
              >
                {t('conocernos.cta')}
                <span aria-hidden="true" className="text-[#c19516]">
                  →
                </span>
              </a>
              <p className="text-sm italic text-gray-600">
                {t('conocernos.disclaimer')}
              </p>
            </div>

            {/* Foto */}
            <div className="lg:col-span-5 relative h-[280px] sm:h-[340px] lg:h-[380px]">
              <RenderMedia
                medio={conocernosMedio}
                fallback="/images/fondo-bienvenida.webp"
                fill
                className="rounded-xl shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <Contact />
    </div>
  )
}

export default HomePage
