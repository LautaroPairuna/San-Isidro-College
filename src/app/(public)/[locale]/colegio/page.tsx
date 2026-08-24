// /app/[locale]/colegio/page.tsx
import SmoothLink from "@/components/SmoothLink"
import AsideMenu from "@/components/AsideMenu"
import RenderMedia from "@/components/RenderMedia"
import EstudianteCentro from "@/components/EstudianteCentro"
import EscudoSignificado from "@/components/EscudoSignificado"
import FondoFormaSeccion from "@/components/FondoFormaSeccion"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getPageContentForSlug, type PageContentSection } from "@/lib/pageContentCache"

/* --------------------------------------------------------------------
 *  SLUGS DE SECCIONES
 * ------------------------------------------------------------------*/
const SECTION_SLUGS = {
  INSTALACIONES: 'colegio-instalaciones',
  PERSONALIZADA_1: 'colegio-personalizada-1',
  PERSONALIZADA_2: 'colegio-personalizada-2',
};

// ISR: se renderiza una vez y se sirve desde caché (menos RAM/CPU por request).
// El admin regenera al instante con revalidatePath(); 1h es solo el respaldo.
export const revalidate = 3600

type PageProps = {
  params: Promise<{ locale: string }>
}

const ColegioPage = async ({ params }: PageProps) => {
  const { locale } = await params
  // Habilita el render estático (ISR) fijando el locale sin leer headers().
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "colegio" })

  // Carga dinámica
  const pageSections = await getPageContentForSlug("colegio");
  const getMedio = (slug: string) =>
    pageSections.find((s: PageContentSection) => s.slug === slug)?.medio ?? null;

  // Video de instalaciones
  const instalacionesMedio = getMedio(SECTION_SLUGS.INSTALACIONES);

  // Fotos de educación personalizada
  const personalizada1 = getMedio(SECTION_SLUGS.PERSONALIZADA_1);
  const personalizada2 = getMedio(SECTION_SLUGS.PERSONALIZADA_2);

  const introduccion = ['p1', 'p2', 'p3', 'p4'] as const
  const aprendizaje = ['p1', 'p2', 'p3', 'p4'] as const
  const instalaciones = ['p1', 'p2', 'p3', 'p4', 'p5'] as const

  return (
    <div className="relative overflow-hidden">
      {/* ============ PROYECTO EDUCATIVO ============ */}
      <section id="proyecto" className="relative w-full bg-white pt-40 pb-16 lg:pb-24 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">
            {t("proyectoTitle1")}
            <span className="block">{t("proyectoTitle2")}</span>
          </h1>
          <div className="mt-8 space-y-5 text-gray-700 leading-relaxed">
            {introduccion.map((p) => (
              <p key={p}>{t(`introduccion.${p}`)}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MISIÓN / VISIÓN / VALORES ============ */}
      <section className="relative w-full bg-[#dcebe0] py-16 lg:py-24 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-16 lg:space-y-24">
          {/* Misión: rótulo a la izquierda, filete y texto a la derecha */}
          <div
            id="mision"
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start scroll-mt-32"
          >
            <h2 className="md:col-span-4 md:text-right text-xl font-bold text-[#c19516]">
              {t("mision.label")}
            </h2>
            <div className="md:col-span-7 md:col-start-6 md:max-w-md md:border-l md:border-[#9bb5a5] md:pl-6 text-gray-700 leading-relaxed">
              <p className="italic">{t("mision.lead")}</p>
              <p className="mt-4 hyphens-auto">{t("mision.texto")}</p>
            </div>
          </div>

          {/* Visión: texto y filete a la izquierda, rótulo a la derecha */}
          <div
            id="vision"
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start scroll-mt-32"
          >
            <div className="md:col-span-7 md:col-start-2 md:order-1 md:ml-auto md:max-w-md md:border-r md:border-[#9bb5a5] md:pr-6 text-gray-700 leading-relaxed">
              <p className="italic md:text-right">{t("vision.lead")}</p>
              <p className="mt-4 hyphens-auto">{t("vision.texto")}</p>
            </div>
            <h2 className="md:col-span-3 md:col-start-10 md:order-2 text-xl font-bold text-[#c19516]">
              {t("vision.label")}
            </h2>
          </div>

          {/* Valores: rótulo arriba y rueda debajo */}
          <div id="valores" className="scroll-mt-32">
            <h2 className="text-xl font-bold text-[#c19516]">
              {t("valores.label")}
            </h2>
            <div className="mt-8 flex justify-center">
              <EstudianteCentro className="w-full max-w-[560px] h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ NUESTRO ESCUDO ============ */}
      <section id="escudo" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#c19516]">
            {t("escudo.title")}
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {t("escudo.intro")}
          </p>

          {/* En pantallas chicas el esquema se desplaza en horizontal:
              los textos van anclados al dibujo y a menos de 700px quedarían ilegibles. */}
          {/* pb-24: los bloques de texto se anclan al dibujo y, según el largo de
              la traducción, desbordan por debajo de la figura; como el contenedor
              scrollea en horizontal también recorta en vertical, hay que darles aire. */}
          <div className="mt-10 -mx-6 px-6 pb-24 overflow-x-auto">
            <EscudoSignificado className="w-full min-w-[700px]" />
          </div>
        </div>
      </section>

      {/* ============ APRENDIZAJE CON VALORES ============ */}
      <section id="aprendizaje-con-valores" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#c19516]">
            {t("aprendizajeValores.title")}
          </h2>
          <div className="mt-6 space-y-5 text-gray-700 leading-relaxed">
            {aprendizaje.map((p) => (
              <p key={p}>{t(`aprendizajeValores.${p}`)}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EDUCACIÓN PERSONALIZADA ============ */}
      <section
        id="educacion-personalizada"
        className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32"
      >
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#c19516]">
            {t("educacionPersonalizada.title")}
          </h2>

          {/* Foto a la izquierda, texto a la derecha */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <RenderMedia
                medio={personalizada1}
                fallback="/images/placeholder.webp"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="md:col-span-8 flex flex-col justify-center space-y-5 font-myriad text-[20px] text-gray-700 leading-relaxed md:border-l-2 md:border-black md:pl-6">
              <p>{t("educacionPersonalizada.p1")}</p>
              <p>{t("educacionPersonalizada.p2")}</p>
            </div>
          </div>

          {/* Texto a la izquierda, foto a la derecha */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 md:order-1 flex flex-col justify-center space-y-5 font-myriad text-[20px] text-gray-700 leading-relaxed md:border-r-2 md:border-black md:pr-6">
              <p>{t("educacionPersonalizada.p3")}</p>
              <p>{t("educacionPersonalizada.p4")}</p>
            </div>
            <div className="md:col-span-4 md:order-2 relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <RenderMedia
                medio={personalizada2}
                fallback="/images/placeholder.webp"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ INSTALACIONES ============ */}
      <section id="instalaciones" className="relative w-full bg-white pb-16 lg:pb-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#c19516]">
            {t("instalaciones.title")}
          </h2>

          <div className="mt-8 w-full aspect-video overflow-hidden rounded-lg shadow-lg bg-black/5">
            <RenderMedia
              medio={instalacionesMedio}
              fallback="/images/fondo-home.webp"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-8 space-y-5 text-gray-700 leading-relaxed">
            {instalaciones.map((p) => (
              <p key={p}>{t(`instalaciones.${p}`)}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ASIDE SUPERPUESTO EN EL COSTADO */}
      <AsideMenu>
        <hr className="border-t border-black mb-3" />
        <h3 className="text-lg italic text-gray-900 mb-4">
          {t("asideTitle")}
        </h3>
        <ul className="space-y-3">
          <li className="font-semibold text-sm">
            <SmoothLink href="#proyecto" aria-label={t("aside.aria.proyecto")}>
              {t("aside.proyecto")}
            </SmoothLink>
          </li>
          <li className="font-semibold text-sm">
            <SmoothLink href="#mision" aria-label={t("aside.aria.misionVisionValores")}>
              {t("aside.misionVisionValores")}
            </SmoothLink>
          </li>
          <li className="font-semibold text-sm">
            <SmoothLink href="#escudo" aria-label={t("aside.aria.escudo")}>
              {t("aside.escudo")}
            </SmoothLink>
          </li>
          <li className="font-semibold text-sm">
            <SmoothLink href="#aprendizaje-con-valores" aria-label={t("aside.aria.aprendizajeValores")}>
              {t("aside.aprendizajeValores")}
            </SmoothLink>
          </li>
          <li className="font-semibold text-sm">
            <SmoothLink href="#educacion-personalizada" aria-label={t("aside.aria.educacionPersonalizada")}>
              {t("aside.educacionPersonalizada")}
            </SmoothLink>
          </li>
          <li className="font-semibold text-sm">
            <SmoothLink href="#instalaciones" aria-label={t("aside.aria.instalaciones")}>
              {t("aside.instalaciones")}
            </SmoothLink>
          </li>
        </ul>
      </AsideMenu>

      <FondoFormaSeccion />
    </div>
  )
}

export default ColegioPage
