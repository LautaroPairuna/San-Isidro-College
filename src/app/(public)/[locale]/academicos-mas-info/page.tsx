// /app/[locale]/vida-estudiantil-mas-info/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import SmoothLink from '@/components/SmoothLink'
import AsideMenu from '@/components/AsideMenu'
import { useTranslations } from 'next-intl'

const Carousel = dynamic(() => import('@/components/sectionCarrusel'), { ssr: false })
const Contact = dynamic(() => import('@/components/sectionContact'), { ssr: false })

const FLIP_CARDS = [
  {
    title: 'El Centro de Nuestro Proyecto: La Persona',
    icon: '/images/icons/ico-centro-proyecto.svg',
    image: '/images/image-kindergarten.webp',
    color: '#c29618',
    backText:
      'Nuestra premisa es clara: lo primero es la persona. Priorizamos el bienestar del alumno y el desarrollo de una comunidad inclusiva, donde cada estudiante se sienta valorado. Buscamos el desarrollo integral, formando jóvenes con apertura mental y una profunda sensibilidad hacia la sustentabilidad y el impacto social.',
  },
  {
    title: 'Ciudadanos Globales con Excelencia Académica',
    icon: '/images/icons/ico-ciudadanos-globales.svg',
    image: '/images/medios/foto-estudiantil-20250603-005440.webp',
    color: '#2d8f57',
    backText:
      'A través de un sólido bilingüismo, preparamos a nuestros estudiantes para actuar en un mundo interconectado. Nuestra excelencia académica potencia el trabajo en equipo como competencia esencial del siglo XXI, la curiosidad por descubrir el mundo y el pensamiento crítico, y la creatividad para construir un proyecto de vida ético.',
  },
  {
    title: 'Innovación y Tecnología de Vanguardia',
    icon: '/images/icons/ico-innovacion-tecnologia.svg',
    image: '/images/medios/foto-dojo-2-20250603-005253.webp',
    color: '#294161',
    backText:
      'Nuestra premisa es clara: lo primero es la persona. Innovación real: los alumnos construyen sus propios prototipos desde cero (sin kits comerciales), integrando ingeniería y electrónica. Inteligencia artificial: proyectos avanzados para liderar en entornos digitales. Infraestructura: aulas con pantallas interactivas touch y un laboratorio de alta complejidad totalmente equipado.',
  },
  {
    title: 'Deportes',
    icon: '/images/icons/ico-deportes.svg',
    image: '/images/medios/foto-hockey-20250603-005057.webp',
    color: '#75ad76',
    backText:
      'Deportes y vida sana: disciplina y trabajo en equipo a través de Rugby, Hockey y Jiu-Jitsu. Con gimnasio propio y participación en torneos, promovemos valores como el respeto, el esfuerzo, la solidaridad y la diversión, desarrollando habilidades motrices. Durante el año, los alumnos participan en encuentros, giras y competencias con otros clubes, fortaleciendo la amistad, la disciplina y el sentido de pertenencia.',
  },
  {
    title: 'Artes',
    icon: '/images/icons/ico-artes.svg',
    image: '/images/medios/foto-isidro-play-20250603-005601.webp',
    color: '#3ba9cf',
    backText:
      'El poder transformador del arte es un pilar fundamental para la sensibilidad y la autoexpresión. A través de distintos lenguajes, los estudiantes desarrollan nuevas formas de comunicación, fortaleciendo su inteligencia emocional, creatividad y capacidad de abstracción. El arte se convierte en un espacio de libertad que impulsa la innovación y la confianza personal.',
  },
  {
    title: 'Sustentabilidad',
    icon: '/images/icons/ico-sustentabilidad.svg',
    image: '/images/medios/foto-balance-1-20260217-194502.webp',
    color: '#beb465',
    backText:
      'La sustentabilidad no es solo un concepto, sino una forma de habitar el mundo. Formamos jóvenes con una profunda conciencia ambiental y social, capaces de liderar proyectos que generen un impacto positivo en su entorno. A través de una mirada ética y responsable, integramos el respeto por la naturaleza y la equidad social, preparando ciudadanos globales comprometidos con el cuidado de nuestra casa común y el bienestar de las futuras generaciones.',
  },
  {
    title: 'Bienestar',
    icon: '/images/icons/ico-bienestar.svg',
    image: '/images/medios/foto-balance-2-20260217-194547.webp',
    color: '#c19516',
    backText:
      'Para aprender, primero hay que estar bien. Por eso, el bienestar integral de nuestros estudiantes es el eje de nuestro compromiso educativo: lo primero es la persona. Sostenemos una comunidad inclusiva donde cada joven se sienta escuchado, valorado y seguro.',
  },
]

export default function AcademicosMasInfoPage() {
  const t = useTranslations('academicosMasInfo')

  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-80 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-250 mx-auto bg-white min-h-screen px-8 pb-8 pt-60">
          {/* CONTENIDO PRINCIPAL */}
          <h2
            id="proyecto"
            className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-shadow-bold-movil"
          >
            {t('proyectoTitulo')}
          </h2>

          <div className="space-y-4 leading-relaxed text-gray-800 text-justify">
            <p>{t('introduccion.p1')}</p>
            <p>{t('introduccion.p2')}</p>
            <p>{t('introduccion.p3')}</p>
            <p>{t('introduccion.p4')}</p>
            <p>{t('introduccion.p5')}</p>
            <p className="font-bold">{t('introduccion.bold1')}</p>
            <p className="font-bold">{t('introduccion.bold2')}</p>
          </div>

          {/* Inglés, Indispensable */}
          <div className="space-y-4 mt-10 text-justify">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
              {t('inglesTitulo')}
            </h3>
            <p>{t('ingles.p1')}</p>
            <p>{t('ingles.p2')}</p>
            <p>{t('ingles.p3')}</p>
            <p>{t('ingles.p4')}</p>
          </div>

          {/* Kindergarten */}
          <div className="space-y-4 mt-32 relative text-justify">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
              {t('kindergarten.titulo')}
            </h3>
            <p>{t('kindergarten.p1')}</p>
            <p>{t('kindergarten.p2')}</p>
            <p id="kindergarten">{t('kindergarten.p3')}</p>
            <p className="font-bold leading-relaxed text-gray-800">
              {t('kindergarten.bold')}
            </p>

            <h4 className="text-xl md:text-xl font-bold mb-4 text-gray-800 pt-16">
              {t('kindergarten.subtituloJuego')}
            </h4>
            <p>{t('kindergarten.juego.p1')}</p>
            <p>{t('kindergarten.juego.p2')}</p>
            <p>{t('kindergarten.juego.p3')}</p>
            <p>{t('kindergarten.juego.p4')}</p>

            {/* Imágenes para Kindergarten */}
            <div className="relative">
              <div className="hidden lg:block md:absolute xl:-top-180 lg:-top-220 xl:-left-85 lg:-left-75 w-62.5 z-20">
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
          <div className="space-y-4 relative mt-32 text-justify">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-shadow-bold-movil" >
              {t('primary.titulo')}
            </h3>
            <p className="font-bold leading-relaxed text-gray-800 mb-4 text-xl">
              {t('primary.subtitulo')}
            </p>
            <p>{t('primary.p1')}</p>
            <p id="primary">{t('primary.p2')}</p>
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
          <div className="space-y-4 mt-32 text-justify" id="secondary">
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

          <div className="space-y-5 mt-32 text-justify">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 text-shadow-bold-movil">
              We are Community
            </h3>
            <h4 className="text-2xl md:text-3xl font-bold text-gray-800">
              Propuesta Académica: Excelencia y Doble Titulación Internacional
            </h4>
            <p>
              Durante los cinco años de Secundaria, ofrecemos una educación integral bilingüe de doble jornada,
              fusionando el diseño curricular oficial argentino con estándares de competitividad global a través de
              programas internacionales.
            </p>
            <p>Nuestra propuesta se diversifica en dos Orientaciones:</p>
            <p>
              <span className="font-bold">Ciencias Naturales:</span> fomentamos la investigación científica y el
              compromiso ambiental, utilizando nuestro laboratorio de alta complejidad para transformar la teoría en
              experimentación real.
            </p>
            <p>
              <span className="font-bold">Informática:</span> centrada en la creación tecnológica, donde los alumnos
              pasan de ser usuarios a desarrolladores de soluciones digitales, IA y prototipos originales.
            </p>
          </div>

          <div className="space-y-5 mt-16 text-justify">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-800">
              Proyección Internacional: Cambridge e High School Diploma
            </h4>
            <p>
              Entendemos que el mundo actual no tiene fronteras. Por ello, potenciamos el perfil de nuestros
              egresados con certificaciones de validez global.
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <span className="font-bold">Programa IGCSE (University of Cambridge):</span> nuestros alumnos se
                preparan bajo este prestigioso estándar internacional que garantiza una formación académica de élite
                y una mentalidad global.
              </li>
              <li>
                <span className="font-bold">Diploma Dual® de Academica:</span> a partir de 2do año ofrecemos la
                posibilidad de cursar este programa de convalidación internacional. Mediante una plataforma online
                con profesores nativos, los estudiantes obtienen simultáneamente el Bachillerato local y el American
                High School Diploma.
              </li>
            </ol>
            <p>
              Esta experiencia de inmersión lingüística y tecnológica los posiciona con una ventaja competitiva única
              para ingresar a las mejores universidades del mundo.
            </p>
          </div>

          <div className="space-y-5 mt-16 text-justify">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-800">Nuestra identidad: El Proyecto de Vida</h4>
            <p>
              En San Isidro College, entendemos que el Nivel Secundario es la etapa donde el potencial se transforma
              en identidad. Nuestro objetivo es que cada estudiante egrese con un Proyecto de Vida sólido, consciente
              y autónomo.
            </p>
            <p>
              Acompañamos a cada joven en el descubrimiento de su propósito con una propuesta que equilibra vanguardia
              tecnológica y calidez humana.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {FLIP_CARDS.map((card) => (
              <article
                key={card.title}
                className="group w-full max-w-[280px] [perspective:1200px]"
                aria-label={card.title}
              >
                <div className="relative h-[390px] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
                  <div
                    className="absolute inset-0 overflow-hidden rounded-2xl border border-white/40 shadow-lg [backface-visibility:hidden]"
                    style={{ backgroundColor: card.color }}
                  >
                    <div className="h-[40%] px-5 text-center text-white flex flex-col items-center justify-center">
                      <Image
                        src={card.icon}
                        alt={card.title}
                        width={46}
                        height={46}
                        className="mx-auto h-[46px] w-[46px] object-contain"
                      />
                      <h5 className="mt-3 text-lg font-bold leading-tight">{card.title}</h5>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-[60%]">
                      <Image src={card.image} alt={card.title} fill className="object-cover" />
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 rounded-2xl border border-white/40 p-6 text-white shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    style={{ backgroundColor: card.color }}
                  >
                    <div className="h-full flex items-center justify-center text-center text-xs md:text-sm leading-snug font-semibold">
                      {card.backText}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-5 mt-16 text-justify">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-800">
              Un Acompañamiento Profesional: Equipo de Orientación Escolar (EOE)
            </h4>
            <p>
              En San Isidro College, el bienestar es una práctica diaria sostenida por nuestro Equipo de Orientación
              Escolar. Contamos con profesionales especializados en Psicología y Psicopedagogía dedicados a acompañar
              las trayectorias de nuestros estudiantes.
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <span className="font-bold">Sostén Emocional:</span> espacio de escucha y contención ante los desafíos
                propios de la adolescencia.
              </li>
              <li>
                <span className="font-bold">Optimización del Aprendizaje:</span> intervención psicopedagógica para
                potenciar habilidades cognitivas y procesos de estudio.
              </li>
              <li>
                <span className="font-bold">Vinculación y Convivencia:</span> acompañamiento en la dinámica grupal para
                sostener un clima escolar sano, inclusivo y respetuoso.
              </li>
            </ul>
            <p>
              Este equipo trabaja de manera integrada con equipos externos, docentes y familias para garantizar el
              respaldo profesional necesario en el camino del Proyecto de Vida de cada joven.
            </p>
          </div>

          <div className="space-y-5 mt-16 text-justify">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-800">Club y Fundación</h4>
            <p>
              También abrimos un espacio institucional para integrar el trabajo del Club y la Fundación, fortaleciendo
              la formación integral, la participación comunitaria y el vínculo con acciones de impacto social.
            </p>
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
