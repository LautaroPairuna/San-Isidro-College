// /app/[locale]/vida-estudiantil-mas-info/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import SmoothLink from '@/components/SmoothLink'
import AsideMenu from '@/components/AsideMenu'
import { useTranslations } from 'next-intl'

const Carousel = dynamic(() => import('@/components/sectionCarrusel'), { ssr: false })
const Contact = dynamic(() => import('@/components/sectionContact'), { ssr: false })

export default function AcademicosMasInfoPage() {
  const t = useTranslations('academicosMasInfo')

  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-80 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-[1000px] mx-auto bg-white min-h-screen px-8 pb-8 pt-60">
          {/* CONTENIDO PRINCIPAL */}
          <h2
            id="proyecto"
            className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-shadow-bold-movil"
          >
            {t('proyectoTitulo')}
          </h2>

          <div className="space-y-4 leading-relaxed text-gray-800">
            <p>{t('introduccion.p1')}</p>
            <p>{t('introduccion.p2')}</p>
            <p>{t('introduccion.p3')}</p>
            <p>{t('introduccion.p4')}</p>
            <p>{t('introduccion.p5')}</p>
            <p className="font-bold">{t('introduccion.bold1')}</p>
            <p className="font-bold">{t('introduccion.bold2')}</p>
          </div>

          {/* Inglés, Indispensable */}
          <div className="space-y-4 mt-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
              {t('inglesTitulo')}
            </h3>
            <p>{t('ingles.p1')}</p>
            <p>{t('ingles.p2')}</p>
            <p>{t('ingles.p3')}</p>
            <p>{t('ingles.p4')}</p>
          </div>

          {/* Kindergarten */}
          <div className="space-y-4 mt-32 relative" id="kindergarten">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
              {t('kindergarten.titulo')}
            </h3>
            <p>{t('kindergarten.p1')}</p>
            <p>{t('kindergarten.p2')}</p>
            <p>{t('kindergarten.p3')}</p>
            <p className="font-bold leading-relaxed text-gray-800">
              {t('kindergarten.bold')}
            </p>

            <h4 className="text-xl md:text-xl font-bold mb-4 text-gray-800">
              {t('kindergarten.subtituloJuego')}
            </h4>
            <p>{t('kindergarten.juego.p1')}</p>
            <p>{t('kindergarten.juego.p2')}</p>
            <p>{t('kindergarten.juego.p3')}</p>
            <p>{t('kindergarten.juego.p4')}</p>

            {/* Imágenes para Kindergarten */}
            <div className="relative">
              <div className="hidden lg:block md:absolute -top-0 -left-85 w-[250px] z-20">
                <Image
                  src="/images/cuadro-kindergarten.svg"
                  alt={t('kindergarten.imagenAltDecoracion')}
                  width={250}
                  height={250}
                />
              </div>
              <div className="block lg:hidden relative mx-auto z-20">
                <Image
                  src="/images/cuadro-kindergarten-movil.svg"
                  alt={t('kindergarten.imagenAltDecoracionMovil')}
                  width={300}
                  height={300}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Primary */}
          <div id="primary" className="space-y-4 relative mt-32">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
              {t('primary.titulo')}
            </h3>
            <p className="font-bold leading-relaxed text-gray-800 mb-4 text-xl">
              {t('primary.subtitulo')}
            </p>
            <p>{t('primary.p1')}</p>
            <p>{t('primary.p2')}</p>
            <p>{t('primary.p3')}</p>
            <p>{t('primary.p4')}</p>

            <div className="mb-16">
              <Image
                src="/images/cuadro-primary.svg"
                alt={t('primary.imagenAltDecoracion')}
                width={600}
                height={600}
                className="block"
              />
            </div>
            <div className="relative left-0 md:left-1/2 w-full md:w-[100vw] md:-translate-x-1/2">
              <Image
                src="/images/image-primary.svg"
                alt={t('primary.imagenAltContenido')}
                width={1300}
                height={400}
                className="mx-auto -mt-10 lg:max-w-none w-[650px] md:w-[800px] xl:w-[1000px] 2xl:w-[1200px] h-auto"
              />
            </div>
          </div>

          {/* Secondary */}
          <div id="secondary" className="space-y-4 mt-32">
            <h3 className="text-4xl md:text-5xl font-bold my-6 text-gray-800 text-shadow-bold-movil">
              {t('secondary.titulo')}
            </h3>
            <h4 className="font-bold text-xl">{t('secondary.subtitulo')}</h4>
            <p>{t('secondary.p1')}</p>
            <p>
              {t('secondary.p2Part1')}
              <span className="font-bold">{t('secondary.enfatizado')}</span>
              {t('secondary.p2Part2')}
            </p>
            <div className="bg-white/80 p-4 rounded-xl text-[#1e804b] border-[#1e804b] border-2 w-full">
              <h4 className="font-bold text-xl text-center mb-4">
                {t('secondary.diplomaDualTitulo')}
              </h4>
              <p className="text-justify">{t('secondary.diplomaDualTexto')}</p>
              <div className="mx-auto mt-5 justify-center flex">
                <Image
                  src="/images/logo-academia-internatiional-studies.svg"
                  alt={t('secondary.diplomaDualLogoAlt')}
                  width={128}
                  height={128}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ASIDE SUPERPUESTO EN EL COSTADO */}
        <div className="w-1/4 relative">
          <AsideMenu scrollThreshold={3000}>
            <hr className="border-t border-black mb-3" />
            <h3 className="text-xl italic text-gray-900 mb-6">
              {t('aside.titulo')}
            </h3>
            <ul className="space-y-5">
              <li className="font-bold">
                <SmoothLink href="#proyecto">{t('aside.proyecto')}</SmoothLink>
              </li>
              <li className="space-y-1 font-bold">
                <SmoothLink href="#kindergarten">{t('aside.kindergarten')}</SmoothLink>
                <br />
                <SmoothLink href="#primary">{t('aside.primary')}</SmoothLink>
                <br />
                <SmoothLink href="#secondary">{t('aside.secondary')}</SmoothLink>
              </li>
            </ul>
          </AsideMenu>
        </div>
      </section>

      {/* Carrusel (sin medias, ya que son opcionales) */}
      <Carousel />

      {/* Contacto */}
      <Contact />
    </>
  )
}
