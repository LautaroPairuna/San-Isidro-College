"use client";

// app/vida-estudiantil-mas-info/page.tsx
import Carousel from '@/components/sectionCarrusel';
import Contact from '@/components/sectionContact';
import SmoothLink from '@/components/SmoothLink';
import AsideMenu from '@/components/AsideMenu';

export default function VidaEstudiantilMasInfoPage() {
  return (
    <><section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 overflow-x-hidden">
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
            Como Colegio Bilingüe, San Isidro College se propone, lograr los
            objetivos educativos en dos idiomas...
          </p>
          <p>
            Nuestro Proyecto Bilingüe se desarrolla y construye desde los
            primeros años de vida...
          </p>
          <p>
            Desde muy pequeños, nuestros niños toman contacto con su segunda
            lengua...
          </p>
          <p>
            Para esto el Plan de Estudios integrado en inglés y castellano,
            contempla las correspondientes Certificaciones Internacionales.
          </p>
          <p>
            Trabajamos para facilitar y asegurar la construcción de un vínculo
            sólido con la su segunda lengua...
          </p>
          <p className="font-bold">
            Sobre un programa de lectura intensiva y producción oral...
          </p>
          <p className="font-bold">
            El aprendizaje del inglés desde temprana edad...
          </p>
        </div>

        {/* Inglés, Indispensable */}
        <div className="space-y-4 mt-10">
          <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800">
            Inglés, Indispensable
          </h3>
          <p>
            En un mundo globalizado el aprender un segundo idioma, es una
            necesidad cada vez mayor.
          </p>
          <p>
            Según documentación de la UNESCO, en el marco de numerosas
            experiencias internacionales...
          </p>
          <p>
            En lo socio-cultural el beneficio radica en que el conocimiento de
            otras lenguas permite...
          </p>
          <p>
            En cuanto a la manera de acceder al conocimiento de otras lenguas...
          </p>
        </div>

        {/* Kindergarten */}
        <div className="space-y-4 mt-10 relative" id="kindergarten">
          <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-800">
            Kindergarten
          </h3>
          <p>
            Nuestro Proyecto Bilingüe inicia desde el jardín maternal, K2...
          </p>
          <p>
            Uno de nuestros objetivos en esta etapa, es afianzar el manejo de la
            lengua madre y trabajar...
          </p>
          <p>
            En cada jornada, trabajamos con canciones, dramatizaciones, títeres...
          </p>
          <p className="font-bold leading-relaxed text-gray-800">
            Pueden crear, imaginar, explorar...
          </p>
          <h4 className="text-xl md:text-2xl font-bold uppercase mb-4 text-gray-800">
            Valor del Juego en el nivel Inicial
          </h4>
          <p>El juego, en todas sus manifestaciones...</p>
          <p>
            Desde la sala de dos años, las actividades están basadas en el juego...
          </p>
          <p>Lo natural para ellos, es aprender jugando...</p>
          <p>
            Algunos de los beneficios del juego en los niños, son su
            contribución...
          </p>
          <p>
            Jugando, adquieren experiencias sobre sí mismos y el mundo que los
            rodea...
          </p>
          <p>
            Esto brinda seguridad en sus capacidades y deseos de aprender...
          </p>
          <img
            src="/images/cuadro-kindergarten.svg"
            alt=""
            className="hidden lg:block md:absolute -top-0 -left-85 w-[250px] z-20" />
          <img
            src="/images/cuadro-kindergarten-movil.svg"
            alt=""
            className="block lg:hidden lg:absolute -top-0 -left-85 w-full z-20 mx-auto" />
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
            Se llevan a cabo materias obligatorias para todas las Instituciones...
          </p>
          <p>
            En este Nivel es importante promover el desarrollo de una actitud
            de esfuerzo...
          </p>
          <p>
            Por medio del juego, de actividades variadas y acordes a las
            distintas edades...
          </p>
          <p>
            Con una Propuesta Bilingüe trabajamos a fin de posibilitar que los
            niños descubran...
          </p>
          <img
            src="/images/cuadro-primary.svg"
            alt=""
            width="600"
            height="600"
            className="mb-16 block" />
          <div className="relative left-0 md:left-1/2 w-full md:w-[100vw] md:-translate-x-1/2">
            <img
              src="/images/image-primary.svg"
              alt=""
              width="1300"
              height="400"
              className="mx-auto -mt-10 lg:max-w-none w-[650px] md:w-[1300px] h-auto" />
          </div>
        </div>

        {/* Secondary */}
        <div id="secondary" className="space-y-4 mt-10">
          <h3 className="text-2xl md:text-3xl font-bold uppercase my-6 text-gray-800">
            Secondary
          </h3>
          <h4 className="font-bold text-xl">Líderes del futuro</h4>
          <p>
            Priorizamos un enfoque centrado en el estudiante para desarrollar
            competencias claves del siglo XXI...
          </p>
          <p>
            Integramos estándares de <span className="font-bold">Cambridge</span>...
          </p>
          <div className="bg-white/80 p-4 rounded-xl text-[#1e804b] border-[#1e804b] border-2 w-full">
            <h4 className="font-bold text-xl text-start">Diploma Dual</h4>
            <p className="text-justify">
              Nuestros alumnos, de manera independiente, cursan la doble
              titulación...
            </p>
            <img
              src="/images/logo-academia-internatiional-studies.svg"
              alt=""
              width="128"
              height="128"
              className="mx-auto mt-5" />
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

    </section><Carousel /><Contact /></>
  );
}
