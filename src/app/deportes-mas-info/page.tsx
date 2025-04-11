"use client";

// app/deportes-mas-info/page.tsx
import dynamic from "next/dynamic";
import SmoothLink from "@/components/SmoothLink";
import AsideMenu from "@/components/AsideMenu";

// Se importan dinámicamente los componentes no críticos para mejorar la carga inicial
const Carousel = dynamic(() => import("@/components/sectionCarrusel"), { ssr: false });
const Contact = dynamic(() => import("@/components/sectionContact"), { ssr: false });

export default function DeportesMasInfoPage() {
  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-80 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-[1000px] mx-auto bg-white min-h-screen px-8 pb-8 pt-60">
          {/* CONTENIDO PRINCIPAL */}
          <h2
            id="proyecto"
            className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-6"
          >
            Deportes
          </h2>
          {/* TEXTO INTRODUCTORIO */}
          <div className="space-y-4 leading-relaxed text-gray-800">
            <p>
              San Isidro College, ubicado en un marco natural privilegiado,
              desarrolla un variado programa en el área de Educación Física, como
              parte del Proyecto Pedagógico que propone contribuir a la
              elaboración de un proyecto de vida.
            </p>
            <p>
              La Educación Física representa en nuestro Colegio, mucho más que un
              área curricular. Se constituye como disciplina fundamental para la
              educación y formación integral del ser humano, especialmente si es
              implementada en edad temprana, por cuanto posibilita en el niño y
              adolescente, desarrollar destrezas motoras, cognitivas y afectivas,
              esenciales para su diario vivir y como proceso para su proyecto de
              vida, en el marco de una vida saludable y de interacción social. A
              través de ella, expresan su espontaneidad y aprenden a conocer,
              respetar y valorarse a sí mismos y a los demás.
            </p>
            <p>
              Por ello, es indispensable la variedad y vivencia de las diferentes
              actividades en el juego, la gimnasia y el deporte, con el fin de
              implementarlas continuamente, ya sea en clase o mediante proyectos
              lúdico-pedagógicos. Generar el hábito por la actividad física para
              que los alumnos, más allá del Colegio, puedan sentirse sanos y
              activos, incorporando estas prácticas como parte de su tiempo libre.
            </p>
          </div>

          {/* Bienestar estudiantil */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold uppercase mt-10 mb-4 text-gray-800">
              Bienestar Estudiantil
            </h3>
            <p>
              En San Isidro College, valoramos el bienestar de nuestros
              estudiantes, considerándolo esencial para su desarrollo integral.
              Nos esforzamos en crear un entorno donde se sientan seguros,
              satisfechos y felices, clave para que puedan sobresalir y alcanzar
              el éxito.
            </p>
            <p>
              Promovemos el bienestar estudiantil a través de un enfoque paciente,
              positivo y proactivo, dirigido por docentes capacitados y con
              experiencia, involucrando a toda la comunidad educativa. Nuestro
              sistema educativo, basado en la diversidad y el plan de estudios
              PSHE, está diseñado para centrarse en el bienestar integral de cada
              alumno.
            </p>
            <p>
              Los tutores juegan un papel crucial, conociendo a cada estudiante y
              desarrollando una relación de confianza, brindando apoyo tanto
              práctico como moral. Nuestro sistema de tutoría busca promover el
              crecimiento personal y social, inculcando un sentido de
              responsabilidad y conciencia sobre la salud. Supervisamos el
              progreso académico y fomentamos buenos hábitos de estudio.
            </p>
            <p>
              Alentamos a los padres a comunicarse con los tutores sobre cualquier
              inquietud, por mínima que sea, relacionada con la salud y bienestar
              de sus hijos. A través de un entorno enriquecedor, ayudamos a los
              estudiantes a prosperar tanto académica como emocionalmente.
            </p>
          </div>
        </div>

        {/* ASIDE SUPERPUESTO EN EL COSTADO (ESPACIO VERDE) */}
        <div className="w-1/4 relative">
          <AsideMenu scrollThreshold={450}>
            <hr className="border-t border-black mb-3" />
            <h3 className="text-xl italic text-gray-900 mb-6">ACADEMICO</h3>
            <ul className="space-y-5">
              <li className="font-bold">
                <SmoothLink href="#proyecto">Deportes</SmoothLink>
              </li>
              <li className="font-bold">
                <SmoothLink href="#proyecto">Vida Estudiantil</SmoothLink>
              </li>
              <li className="font-bold">
                <SmoothLink href="#proyecto">San Isidro Play</SmoothLink>
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
