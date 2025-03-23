"use client";

// app/vida-estudiantil-mas-info/page.tsx
import dynamic from "next/dynamic";
import Image from "next/image";
import SmoothLink from "@/components/SmoothLink";
import AsideMenu from "@/components/AsideMenu";

// Carga dinámica para componentes secundarios
const Carousel = dynamic(() => import("@/components/sectionCarrusel"), { ssr: false });
const Contact = dynamic(() => import("@/components/sectionContact"), { ssr: false });

export default function VidaEstudiantilMasInfoPage() {
  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-[1000px] mx-auto bg-white min-h-screen px-8 pb-8 pt-60">
          {/* CONTENIDO PRINCIPAL */}
          <h2
            id="proyecto"
            className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-6"
          >
            Proyecto bilingüe de jornada completa o extenida
          </h2>

          <div className="space-y-4 leading-relaxed text-gray-800">
            <p>
              Como Colegio Bilingüe, San Isidro College se propone, lograr los objetivos educativos en dos idiomas. Por este motivo es que el inglés se enseñará en forma intensiva a través de múltiples actividades y contenidos.
            </p>
            <p>
              Nuestro Proyecto Bilingüe se desarrolla y construye desde los primeros años de vida, con un gran acento en la correcta pronunciación.
            </p>
            <p>
              Desde muy pequeños, nuestros niños toman contacto con su segunda lengua, respondiendo a sus necesidades de comunicación e interacción. Así aprenden a estudiar, desarrollar actividades y “vivir” en inglés, egresando con un conocimiento y habitualidad en la lengua, que les permite integrarse cómodamente en diferentes ámbitos, tanto laborales como académicos de habla inglesa.
            </p>
            <p>
              Para esto el Plan de Estudios integrado en inglés y castellano, contempla las correspondientes Certificaciones Internacionales.
            </p>
            <p>
              Trabajamos para facilitar y asegurar la construcción de un vínculo sólido con la su segunda lengua, y generar una actitud de confianza en los estudiantes con respecto a sus posibilidades de aprender la misma.
            </p>
            <p className="font-bold">
              Sobre un programa de lectura intensiva y producción oral, los niños en la cotidianidad, incorporan naturalmente el ingles, de un modo similar al proceso de adquisición de la lengua materna, por medio de contenidos que responden a sus intereses y necesidades.
            </p>
            <p className="font-bold">
              El aprendizaje del inglés desde temprana edad, permite adquirir fácilmente sonidos, ritmos y entonación. Así habituamos el oído, adquiriendo una fonética adecuada, asegurando la comprensión e iniciando la expresión oral, de manera divertida y natural.
            </p>
          </div>

          {/* Inglés, Indispensable */}
          <div className="space-y-4 mt-10">
            <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800">
              Inglés, Indispensable
            </h3>
            <p>
              En un mundo globalizado el aprender un segundo idioma, es una necesidad cada vez mayor.
            </p>
            <p>
              Según documentación de la UNESCO, en el marco de numerosas experiencias internacionales, se demuestra que la enseñanza de dos lenguas o más, refuerza otros aprendizajes, especialmente el de la lengua materna (tanto en los aspectos formativos como instrumentales) y representa importantes beneficios lingüísticos, cognitivos y socio-culturales para los estudiantes.
            </p>
            <p>
              En lo socio-cultural el beneficio radica en que el conocimiento de otras lenguas permite a las personas no sólo ampliar su área de acción al comunicarse con miembros de otras culturas sino también, entender y valorar diferentes costumbres y visiones del mundo, y por lo tanto convivir con la diversidad.
            </p>
            <p>
              En cuanto a la manera de acceder al conocimiento de otras lenguas, las investigaciones demuestran que los aprendizajes de los alumnos son más significativos y por lo tanto duraderos, cuando la lengua es utilizada como vehículo para el aprendizaje de otros contenidos y no sólo como objeto de estudio en sí misma. De allí nuestra propuesta de Proyecto Educativo Bilingüe. De esta manera, se favorecen las articulaciones de contenidos entre la enseñanza del inglés y el resto de las áreas del currículo en general: se enseñan contenidos lingüísticos y simultáneamente, se produce un acercamiento a contenidos disciplinares.
            </p>
          </div>

          {/* Kindergarten */}
          <div className="space-y-4 mt-10 relative" id="kindergarten">
            <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800">
              Kindergarten
            </h3>
            <p>
              Nuestro Proyecto Bilingüe inicia desde el jardín maternal, K2, a fin de que los niños estén expuestos a ambas lenguas durante la jornada. El proceso continua en K3, K4 y K5.
            </p>
            <p>
              Uno de nuestros objetivos en esta etapa, es afianzar el manejo de la lengua madre y trabajar en la temprana adquisición del inglés como segundo idioma, favoreciendo la familiarización del mismo, a través de situaciones cotidianas dentro y fuera de la sala, coordinando la articulación con el nivel primario, para que la transición a la próxima etapa de su educación sea natural y segura.
            </p>
            <p>
              En cada jornada, trabajamos con canciones, dramatizaciones, títeres, cuentos, frases, consignas, rimas, las que se intensifican según el grupo, hasta arribar al bilingüismo en horario extendido, a partir de los 5 años, donde trabajaremos fuertemente con la lengua inglesa, con el fin de prepararlos en las habilidades lingüísticas necesarias.
            </p>
            <p className="font-bold leading-relaxed text-gray-800">
              Pueden crear, imaginar, explorar y desarrollar la fantasía, la observación del ambiente que los rodea, el desarrollo de su capacidad creativa, artística, y la adquisición de herramientas que favorezcan las prácticas del lenguaje oral y escrito, la resolución de situaciones problemáticas y la promoción de actitudes vinculadas a la empatía y el respeto a los demás.ite mantener el interés sin esfuerzo.
            </p>
            <h4 className="text-xl md:text-2xl font-bold uppercase mb-4 text-gray-800">
              Valor del Juego en el nivel Inicial
            </h4>
            <p>El juego, en todas sus manifestaciones, como contenido y estrategia de trabajo</p>
            <p>
              Desde la sala de dos años, las actividades están basadas en el juego, principal fuente de aprendizaje de los niños/as. El juego, actividad espontánea y natural en esta etapa, es el eje fundamental. Nos permite acercarnos a sus intereses, necesidades y procesos de pensamiento.
            </p>
            <p>Lo natural para ellos, es aprender jugando, por eso su valor como instrumento de aprendizaje es indiscutible.</p>
            <p>
              Algunos de los beneficios del juego en los niños, son su contribución al desarrollo Psicomotriz, Cognitivo, Social y Afectivo-Moral.
            </p>
            <p>
              Jugando, adquieren experiencias sobre sí mismos y el mundo que los rodea, ensayan roles y formas de actuación de la vida de los adultos, entrenan destrezas y habilidades, practican rutinas y secuencias de comportamiento que les serán útiles a lo largo de sus vidas. Ponen a prueba sus conocimientos, aprenden la relevancia de jugar en grupos, aprendiendo a tolerar la postura de los demás. Además, contribuye a estrechar los vínculos afectivos. La base y el motor de todo aprendizaje profundo es este vínculo, que permite crear y afianzar la confianza.
            </p>
            <p>
              Esto brinda seguridad en sus capacidades y deseos de aprender los contenidos propuestos por el currículum, en las dos lenguas, en el marco de nuestro Proyecto Bilingüe.
            </p>
            {/* Imagenes para Kindergarten */}
            <div className="relative">
              <div className="hidden lg:block md:absolute -top-0 -left-85 w-[250px] z-20">
                <Image
                  src="/images/cuadro-kindergarten.svg"
                  alt="Decoración Kindergarten"
                  width={250}
                  height={250}
                />
              </div>
              <div className="block lg:hidden relative mx-auto z-20">
                <Image
                  src="/images/cuadro-kindergarten-movil.svg"
                  alt="Decoración Kindergarten móvil"
                  width={300}
                  height={300}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Primary */}
          <div id="primary" className="space-y-4 relative mt-10">
            <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800">
              Primary
            </h3>
            <p className="font-bold leading-relaxed text-gray-800 mb-4 text-xl">
              Nuestra metodología se encuentra basada en la literatura.
            </p>
            <p>
              Se llevan a cabo materias obligatorias para todas las Instituciones educativas (Diseño Curricular Juridiccional) y en las Áreas en Inglés: Language (Comprehension, Oral Language, Reading, Written Language, Creative Writing, Spelling), Drama y Physical Education. Luego se agregan al Plan de Estudios: Literature, Social Studies y Science.
            </p>
            <p>
              En este Nivel es importante promover el desarrollo de una actitud de esfuerzo, trabajo y responsabilidad en el estudio y de curiosidad e interés por el aprendizaje, fortaleciendo la confianza en las propias posibilidades de aprender.
            </p>
            <p>
              Por medio del juego, de actividades variadas y acordes a las distintas edades, se cubren todos los aspectos relacionados con el desarrollo y la evolución infantil durante los primeros años. Se pone especial acento en el desarrollo psicomotriz, emocional e intelectual, estimulando la curiosidad, el pensamiento libre, el despertar de una conciencia moral y el goce estético. Buscamos que el aprendizaje sea significativo.
            </p>
            <p>
              Con una Propuesta Bilingüe trabajamos a fin de posibilitar que los niños descubran sus talentos y capacidades. Como Colegio preparado y asesorado por experimentados profesionales, garantizamos una incorporación natural del idioma inglés como segunda lengua. Se logra así, en cada uno de los estudiantes una amplia comprensión del idioma y la habilidad de expresión y comunicación.
            </p>
            <div className="mb-16">
              <Image
                src="/images/cuadro-primary.svg"
                alt="Decoración Primary"
                width={600}
                height={600}
                className="block"
              />
            </div>
            <div className="relative left-0 md:left-1/2 w-full md:w-[100vw] md:-translate-x-1/2">
              <Image
                src="/images/image-primary.svg"
                alt="Imagen Primary"
                width={1300}
                height={400}
                className="mx-auto -mt-10 lg:max-w-none w-[650px] md:w-[1300px] h-auto"
              />
            </div>
          </div>

          {/* Secondary */}
          <div id="secondary" className="space-y-4 mt-10">
            <h3 className="text-2xl md:text-3xl font-bold uppercase my-6 text-gray-800">
              Secondary
            </h3>
            <h4 className="font-bold text-xl">Líderes del futuro</h4>
            <p>
              Priorizamos un enfoque centrado en el estudiante para desarrollar competencias claves del siglo XXI como autonomía, pensamiento crítico y creatividad. Con una sólida base bilingüe, preparamos a nuestros alumnos para exámenes internacionales y el dominio avanzado del inglés técnico, adaptado a sus áreas de estudio. Brindamos un espacio donde el aprendizaje cobra vida 
            </p>
            <p>
              Integramos estándares de <span className="font-bold">Cambridge</span>, garantizando una educación de calidad internacional. Ofrecemos intercambios y viajes de estudio que enriquecen su formación y amplían su visión del mundo, preparándolos para los desafíos del futuro.
            </p>
            <div className="bg-white/80 p-4 rounded-xl text-[#1e804b] border-[#1e804b] border-2 w-full">
              <h4 className="font-bold text-xl text-start">Diploma Dual</h4>
              <p className="text-justify">
                Nuestros alumnos, de manera independiente, cursan la doble titulación del <span className="font-bold">Bachillerato de Estados Unidos</span>. Esta opción les brinda una <span className="font-bold">ventaja competitiva</span>, permitiéndoles obtener un <span className="font-bold">diploma secundario argentino y estadounidense</span> al mismo tiempo, ampliando sus oportunidades académicas y profesionales a nivel internacional.
              </p>
              <div className="mx-auto mt-5">
                <Image
                  src="/images/logo-academia-internatiional-studies.svg"
                  alt="Logo Academia International Studies"
                  width={128}
                  height={128}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ASIDE SUPERPUESTO EN EL COSTADO (ESPACIO VERDE) */}
        <div className="w-1/4 relative">
          <AsideMenu scrollThreshold={3000}>
            <hr className="border-t border-black mb-3" />
            <h3 className="text-xl italic text-gray-900 mb-6">ACADEMICO</h3>
            <ul className="space-y-5">
              <li className="font-bold">
                <SmoothLink href="#proyecto">Proyecto Bilingüe</SmoothLink>
              </li>
              <li className="space-y-1 font-bold">
                <SmoothLink href="#kindergarten">Kindergarten</SmoothLink>
                <br />
                <SmoothLink href="#primary">Primary</SmoothLink>
                <br />
                <SmoothLink href="#secondary">Secondary</SmoothLink>
              </li>
            </ul>
          </AsideMenu>
        </div>
      </section>
      <Carousel />
      <Contact />
    </>
  );
}
