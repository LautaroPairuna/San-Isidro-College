"use client";

// app/colegio/page.tsx
import Carousel from '@/components/sectionCarrusel';
import Contact from '@/components/sectionContact';
import SmoothLink from '@/components/SmoothLink';
import AsideMenu from '@/components/AsideMenu';

export default function ColegioPage() {
  return (
    <><section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 overflow-x-hidden">
      {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
      <div className="relative max-w-[1200px] mx-auto bg-white min-h-screen px-8 pb-8 pt-60">
        {/* CONTENIDO PRINCIPAL */}
        <h2
          id="proyecto"
          className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-6"
        >
          UN PROYECTO EDUCATIVO SÓLIDO E INNOVADOR PARA LA FORMACIÓN INTEGRAL
          BILINGÜE
        </h2>

        {/* TEXTO INTRODUCTORIO */}
        <div className="space-y-4 leading-relaxed text-gray-800">
          <p>
            Con el fin de aportar a Salta un Proyecto Educativo sólido e
            innovador, en 2016 San Isidro College abrió sus puertas a la
            comunidad, a través del Diseño de un Proyecto Educativo exigente y
            ambicioso, de Formación Integral Bilingüe y de Orientación Católica,
            integrando contenidos nacionales exigidos, con programas
            internacionales de altos estándares académicos.
          </p>
          <p>
            San Isidro College se propone lograr los objetivos educativos en dos
            idiomas. Por este motivo es que el inglés se enseña en forma
            intensiva a través de múltiples actividades y contenidos.
            Garantizamos una incorporación natural de la segunda lengua.
          </p>
          <p>
            Desde pequeños se trabaja abriendo espacios, para que cada niño y
            niña logre amplia comprensión y habilidad de expresión y
            comunicación, junto a una correcta pronunciación.
          </p>
          <p>
            Debido a las características de la zona, el establecimiento aspira a
            transformarse en un núcleo de actividades escolares, recreativas,
            culturales y deportivas, para cumplir, así, con una función
            significativa y relevante, en el medio dentro del cual se halla
            inserto.
          </p>
          <p>
            San Isidro College fue pensado y desarrollado con los más
            calificados y experimentados profesionales, con el fin de ser el
            Proyectos Educativo más sólido de nuestro medio. Acompañados por
            Asesores de Salta, Bs. As. y el extranjero, quienes brindan su gran
            experiencia en los distintos niveles y en el área de Inglés, con
            Convenios para la validación de los Exámenes Internacionales y la
            oportunidad de intercambios estudiantiles con importantes Colegios
            del extranjero.
          </p>
        </div>

        {/* INSTALACIONES */}
        <h3 className="text-2xl md:text-3xl font-bold uppercase mt-10 mb-4 text-gray-800">
          INSTALACIONES
        </h3>
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            className="w-full h-full rounded shadow"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* MISIÓN */}
        <h3
          id="mision"
          className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800"
        >
          MISIÓN
        </h3>
        <p className="mb-8 leading-relaxed text-gray-800">
          San Isidro College es un Colegio Humanizador que ubica a la persona en
          primer lugar. Su misión es formar ciudadanos globales, promoviendo una
          educación integral que nutra el crecimiento personal, intelectual y
          emocional de nuestros estudiantes. Nos comprometemos a proporcionar un
          ambiente de aprendizaje y autonomía en el que se fomente la curiosidad,
          la creatividad y el pensamiento crítico. Nuestro objetivo es acompañar
          a nuestros estudiantes para que sean agentes de cambio en la sociedad,
          brindando herramientas que les permitan desarrollar habilidades,
          fomentando el bilingüismo y proporcionando un marco de principios
          basado en el ejemplo y en valores cristianos.
        </p>

        {/* VISIÓN */}
        <h3
          id="vision"
          className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800"
        >
          VISIÓN
        </h3>
        <p className="leading-relaxed text-gray-800 mb-4">
          Nuestra visión es formar líderes resilientes y creativos, capaces de
          aprovechar las oportunidades y contribuir al progreso de la sociedad
          en un entorno en constante cambio.
        </p>
        <p className="leading-relaxed text-gray-800">
          San Isidro College se posiciona como referente en educación en nuestra
          comunidad, estableciendo un estándar de excelencia y adaptándose de
          manera flexible a la constante transformación del mundo moderno.
          Creamos un entorno educativo dinámico y en constante evolución, que
          prepara a nuestros estudiantes para enfrentar los desafíos del siglo
          XXI. Nos comprometemos a proporcionar una educación de calidad,
          impulsada por la innovación, la tecnología y el desarrollo de
          habilidades relevantes.
        </p>

        {/* VALORES */}
        <h3
          id="valores"
          className="text-2xl md:text-3xl font-bold uppercase my-6 text-gray-800"
        >
          VALORES
        </h3>
        <div className="my-8 flex justify-center">
          <img
            src="/images/valores.svg"
            alt="Diagrama de valores"
            className="max-w-xs md:max-w-md" />
        </div>

        {/* EDUCACIÓN PERSONALIZADA */}
        <h3
          id="educacion"
          className="text-2xl md:text-3xl font-bold uppercase mb-2 text-gray-800"
        >
          EDUCACIÓN PERSONALIZADA
        </h3>
        <p className="text-gray-700 italic mb-6">
          Nos proponemos generar en los alumnos el placer de concurrir al
          colegio
        </p>
        <p className="leading-relaxed text-gray-800 mt-4">
          De manera sistemática y diseñada trabajamos aprendizajes con valores,
          convirtiendo esta premisa en un eje transversal que sustente todo
          vínculo humano.
        </p>
        <p className="leading-relaxed text-gray-800 mt-4">
          Sostenemos que un niño/adolescente seguro y con confianza en sí mismo
          puede desarrollar habilidades sociales que le permiten lograr mejores
          vínculos gracias a la empatía y el autodominio, que en otras palabras
          pueden entenderse como respeto, solidaridad y amor al prójimo, y como
          templanza.
        </p>
        <p className="leading-relaxed text-gray-800 mt-4">
          Podrá fortalecer sus vínculos afectivos, hacerse de amigos y trabajar
          en equipo, sin mengua de la exigencia de los contenidos del currículum
          en las dos lenguas.
        </p>
        <p className="leading-relaxed text-gray-800 mt-4">
          Un estudiante que se siente escuchado y contenido desde lo emocional,
          está más motivado para participar, crear, intervenir, intercambiar
          ideas, cuestionar, plantear problemas y arriesgarse a producir.
          Aprende a aprender. Porque creemos que el aprendizaje se construye, se
          expande y abre a la persona a otros aprendizajes.
        </p>

        {/* ÚLTIMO PÁRRAFO (FONDO DORADO) */}
        <div className="bg-[#c9a241] text-black px-4 py-3 mt-8">
          <p className="leading-relaxed">
            San Isidro College, propone trabajar fervientemente en equipo para
            que todo estudiante se encuentre comprometido con su proyecto de
            vida. Para ello el aporte de la familia es fundamental.
          </p>
        </div>
      </div>

      {/* ASIDE SUPERPUESTO EN EL COSTADO (ESPACIO VERDE) */}
      <div className="w-1/4 relative">
        <AsideMenu scrollThreshold={2200}>
          <hr className="border-t border-black mb-3" />
          <h3 className="text-xl italic text-gray-900 mb-6">EL COLEGIO</h3>
          <ul className="space-y-5">
            <li className="font-bold">
              <SmoothLink href="#proyecto">Proyecto Educativo</SmoothLink>
            </li>
            <li className="space-y-1 font-bold">
              <SmoothLink href="#mision">Misión</SmoothLink>
              <br />
              <SmoothLink href="#vision">Visión</SmoothLink>
              <br />
              <SmoothLink href="#valores">Valores</SmoothLink>
            </li>
            <li className="space-y-1 font-bold">
              <SmoothLink href="#educacion">Educación Personalizada</SmoothLink>
              <br />
            </li>
          </ul>
        </AsideMenu>
      </div>

    </section><Carousel /><Contact /></>
  );
}
