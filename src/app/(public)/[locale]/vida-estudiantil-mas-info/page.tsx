// /app/[locale]/deportes-mas-info/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import SmoothLink from '@/components/SmoothLink'
import AsideMenu from '@/components/AsideMenu'

const SectionCarrusel = dynamic(() => import('@/components/sectionCarrusel'), { ssr: false })
const Contact = dynamic(() => import('@/components/sectionContact'), { ssr: false })

export default function DeportesMasInfoPage() {
  const t = useTranslations('vidaEstudiantilMasInfo')

  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-80 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-[1000px] mx-auto bg-white min-h-screen px-8 pb-8 pt-60">
          {/* CONTENIDO PRINCIPAL */}
          <h2
            id="proyecto"
            className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-6"
          >
            {t('proyectoTitle')}
          </h2>
          {/* TEXTO INTRODUCTORIO */}
          <div className="space-y-4 leading-relaxed text-gray-800">
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
            <p>{t('intro.p3')}</p>
          </div>

          {/* Bienestar estudiantil */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold uppercase mt-10 mb-4 text-gray-800">
              {t('bienestar.title')}
            </h3>
            <p>{t('bienestar.p1')}</p>
            <p>{t('bienestar.p2')}</p>
            <p>{t('bienestar.p3')}</p>
            <p>{t('bienestar.p4')}</p>
          </div>
        </div>

        {/* ASIDE SUPERPUESTO EN EL COSTADO (ESPACIO VERDE) */}
        <div className="w-1/4 relative">
          <AsideMenu scrollThreshold={450}>
            <hr className="border-t border-black mb-3" />
            <h3 className="text-xl italic text-gray-900 mb-6">
              {t('aside.title')}
            </h3>
            <ul className="space-y-5">
              <li className="font-bold">
                <SmoothLink href="#proyecto">{t('aside.deportes')}</SmoothLink>
              </li>
              <li className="font-bold">
                <SmoothLink href="#proyecto">{t('aside.vidaEstudiantil')}</SmoothLink>
              </li>
              <li className="font-bold">
                <SmoothLink href="#proyecto">{t('aside.play')}</SmoothLink>
              </li>
            </ul>
          </AsideMenu>
        </div>
      </section>

      <SectionCarrusel />
      <Contact />
    </>
  )
}
