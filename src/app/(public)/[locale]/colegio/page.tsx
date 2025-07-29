// /app/[locale]/colegio/page.tsx
'use client'

import dynamic from "next/dynamic"
import Image from "next/image"
import SmoothLink from "@/components/SmoothLink"
import AsideMenu from "@/components/AsideMenu"
import VideoEmbed from "@/components/VideoEmbed"
import { useTranslations } from "next-intl"
import type { NextPage } from "next"

// Carga dinámica para reducir el bundle inicial
const Carousel = dynamic(() => import("@/components/sectionCarrusel"), { ssr: false })
const Contact = dynamic(() => import("@/components/sectionContact"), { ssr: false })

const ColegioPage: NextPage = () => {
  const t = useTranslations("colegio")

  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-80 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-[1000px] mx-auto bg-white min-h-screen px-8 pb-8 pt-60">
          {/* TITULO PRINCIPAL */}
          <h2
            id="proyecto"
            className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-6"
          >
            {t("proyectoTitle")}
          </h2>

          {/* TEXTO INTRODUCTORIO */}
          <div className="space-y-4 leading-relaxed text-gray-800">
            <p>{t("introduccion.p1")}</p>
            <p>{t("introduccion.p2")}</p>
            <p>{t("introduccion.p3")}</p>
            <p>{t("introduccion.p4")}</p>
            <p>{t("introduccion.p5")}</p>
          </div>

          {/* INSTALACIONES */}
          <h3 className="text-2xl md:text-3xl font-bold uppercase mt-10 mb-4 text-gray-800">
            {t("instalacionesTitle")}
          </h3>
          <VideoEmbed
            videoId={t("video.id")}
            placeholderSrc={t("video.placeholderSrc")}
          />

          {/* MISIÓN */}
          <h3
            id="mision"
            className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800"
          >
            {t("misionTitle")}
          </h3>
          <p className="mb-8 leading-relaxed text-gray-800">
            {t("misionText")}
          </p>

          {/* VISIÓN */}
          <h3
            id="vision"
            className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800"
          >
            {t("visionTitle")}
          </h3>
          <p className="leading-relaxed text-gray-800 mb-4">
            {t("visionP1")}
          </p>
          <p className="leading-relaxed text-gray-800">
            {t("visionP2")}
          </p>

          {/* VALORES */}
          <h3
            id="valores"
            className="text-2xl md:text-3xl font-bold uppercase my-6 text-gray-800"
          >
            {t("valoresTitle")}
          </h3>
          <div className="my-8 flex justify-center">
            <Image
              src="/images/valores.svg"
              alt={t("valoresAlt")}
              width={400}
              height={400}
              className="max-w-xs md:max-w-md"
            />
          </div>

          {/* EDUCACIÓN PERSONALIZADA */}
          <h3
            id="educacion-personalizada"
            className="text-2xl md:text-3xl font-bold uppercase mb-2 text-gray-800"
          >
            {t("educacionPersonalizadaTitle")}
          </h3>
          <p className="text-gray-700 italic mb-6">
            {t("educacionPersonalizadaItalic")}
          </p>
          <p className="leading-relaxed text-gray-800 mt-4">
            {t("educacionPersonalizada.p1")}
          </p>
          <p className="leading-relaxed text-gray-800 mt-4">
            {t("educacionPersonalizada.p2")}
          </p>
          <p className="leading-relaxed text-gray-800 mt-4">
            {t("educacionPersonalizada.p3")}
          </p>
          <p className="leading-relaxed text-gray-800 mt-4">
            {t("educacionPersonalizada.p4")}
          </p>

          {/* ÚLTIMO PÁRRAFO (FONDO DORADO) */}
          <div className="bg-[#c9a241] text-black px-4 py-3 mt-8">
            <p className="leading-relaxed">{t("ultimoParrafo")}</p>
          </div>
        </div>

        {/* ASIDE SUPERPUESTO EN EL COSTADO */}
        <div className="w-1/4 relative">
          <AsideMenu scrollThreshold={2200}>
            <hr className="border-t border-black mb-3" />
            <h3 className="text-xl italic text-gray-900 mb-6">
              {t("asideTitle")}
            </h3>
            <ul className="space-y-5">
              <li className="font-bold">
                <SmoothLink
                  href="#proyecto"
                  aria-label={t("aside.aria.proyecto")}
                >
                  {t("aside.proyecto")}
                </SmoothLink>
              </li>
              <li className="space-y-1 font-bold">
                <SmoothLink
                  href="#mision"
                  aria-label={t("aside.aria.mision")}
                >
                  {t("aside.mision")}
                </SmoothLink>
                <br />
                <SmoothLink
                  href="#vision"
                  aria-label={t("aside.aria.vision")}
                >
                  {t("aside.vision")}
                </SmoothLink>
                <br />
                <SmoothLink
                  href="#valores"
                  aria-label={t("aside.aria.valores")}
                >
                  {t("aside.valores")}
                </SmoothLink>
              </li>
              <li className="space-y-1 font-bold">
                <SmoothLink
                  href="#educacion-personalizada"
                  aria-label={t("aside.aria.educacionPersonalizada")}
                >
                  {t("aside.educacionPersonalizada")}
                </SmoothLink>
                <br />
              </li>
            </ul>
          </AsideMenu>
        </div>
      </section>

      <Carousel />
      <Contact />
    </>
  )
}

export default ColegioPage
