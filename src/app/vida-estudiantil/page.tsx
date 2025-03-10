// app/vida-estudiantil/page.tsx
import Contact from '@/components/sectionContact';
import Carousel from '@/components/sectionCarrusel';
import Image from 'next/image';
import Link from 'next/link';

export default function VidaEstudiantilPage() {
  return (
    <div id="container">
      {/* SECCIÓN 1: Fondo verde en toda la pantalla sin imagen de fondo */}
      <section className="relative w-full h-[640px] md:h-screen grid grid-cols-1 md:grid-cols-12 overflow-x-hidden">
        {/* Columna Izquierda: Texto y fondo verde */}
        <div className="relative col-span-1 md:col-span-4 bg-[#71af8d] flex items-end justify-end">
          {/* Versión Escritorio: Texto absolutamente posicionado */}
          <Image 
            src="/images/eslogan.svg" 
            alt="I am because we are" 
            width={250}
            height={250}
            className="hidden md:block absolute top-[60%] left-[77%] transform -translate-x-1/2 z-40
                      max-sm:relative max-sm:top-15 max-sm:-left-7 max-lg:top-60 max-lg:left-80 max-sm:translate-x-0
                      max-sm:w-[100px] max-sm:h-[100px] max-lg:w-[150px] max-lg:h-[150px] items-end justify-end"
          />
          {/* Versión Móvil: Texto en flujo normal + Botón juntos */}
          <div className="flex md:hidden p-6 z-20 justify-between items-end mt-28 relative">
            <Image 
              src="/images/eslogan.svg" 
              alt="I am because we are" 
              width={250}
              height={250}
              className="transform -translate-x-1/2 z-40
                        max-sm:w-[110px] max-sm:h-[120px] max-lg:w-[150px] max-lg:h-[150px]"
            />
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e804b] text-white rounded-full shadow-lg transition text-sm">
              <Image
                src="/images/ico-admisiones.svg"
                alt="Ver Admisiones"
                width={24}
                height={24}
              />
              <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform" target="_blank">
                ADMISIONES
              </Link>
            </button>
          </div>
        </div>
        {/* Columna Derecha: Fondo verde, recuadro y botón en escritorio */}
        <div className="relative col-span-1 md:col-span-8 bg-[#71af8d] w-full h-full flex flex-col items-center md:items-start">
          {/* Recuadro blanco en escritorio (absoluto) */}
          <div className="hidden md:block absolute top-[70%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 z-40 bg-white p-6 md:p-8 w-[400px] md:w-[550px] rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-left">
              Proyecto bilingüe de jornada Completa o extendida
            </h2>
            <p className="text-gray-700 mb-4">
              Con variados recursos gráficos y audiovisuales, dinámicas grupales y de expresión, exposiciones, juegos, dramatizaciones, canciones, cuentos, etc., la etapa expresiva y productiva, se fortalece, afianza y nutre permanentemente.
            </p>
            <div className="text-left mt-5">
              <Link href="/vida-estudiantil-mas-info">
                <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                  Leer más
                </span>
              </Link>
            </div>
          </div>
          {/* Recuadro blanco en móvil (flujo normal, parte inferior) */}
          <div className="block md:hidden mt-auto mb-6 bg-white p-6 w-[90%] rounded-3xl shadow-lg z-40">
            <h2 className="text-xl font-bold mb-2 text-left">
              Proyecto bilingüe de jornada Completa o extendida
            </h2>
            <p className="text-gray-700 mb-4 text-sm">
              Con variados recursos gráficos y audiovisuales, dinámicas grupales y de expresión, exposiciones, juegos, dramatizaciones, canciones, cuentos, etc., la etapa expresiva y productiva, se fortalece, afianza y nutre permanentemente.
            </p>
            <div className="text-left mt-5">
              <Link href="/vida-estudiantil-mas-info">
                <span className="text-[#1e804b] font-semibold hover:underline cursor-pointer">
                  Leer más
                </span>
              </Link>
            </div>
          </div>
          {/* Botón ADMISIONES en escritorio (absoluto, abajo a la derecha) */}
          <button className="hidden md:flex absolute bottom-6 right-6 items-center gap-3 px-6 py-3 bg-[#1e804b] text-white rounded-full shadow-lg transition z-40">
            <Image
              src="/images/ico-admisiones.svg"
              alt="Ver Admisiones"
              width={32}
              height={32}
            />
            <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform" target="_blank">
              ADMISIONES
            </Link>
          </button>
        </div>
        {/* Figura decorativa (SVG) ocupando todo el alto de la sección */}
        <div className="absolute top-0 left-[32%] transform -translate-x-1/2 h-full pointer-events-none">
          <Image
            src="/images/formas/forma-home-1.svg"
            alt="Forma decorativa"
            width={800}   // Asigna un valor mayor al necesario
            height={800}  // Mantén la relación de aspecto 
            className="h-full w-auto"
            priority      // Opcional: si deseas precargar la imagen
          />
        </div>
      </section>

      {/* SECCIÓN KINDERGARTEN */}
      <section className="relative w-full h-auto py-10 bg-white overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-screen-xl mx-auto">
          {/* Columna Izquierda: Texto y elementos decorativos */}
          <div className="col-span-1 md:col-span-4 relative flex flex-col justify-center order-1 md:order-none">
            {/* Versión Desktop */}
            <div className="hidden md:block">
              <div className="absolute top-[30%] left-[55%] w-[650px] z-20">
                <h2 className="text-5xl font-bold text-white text-center text-shadow-bold mb-5">
                  KINDER<br />GARTEN
                </h2>
                <div className="bg-white shadow-xl rounded-3xl p-8">
                  <p className="text-gray-700 leading-relaxed">
                    Nuestro Proyecto Bilingüe inicia desde el jardín maternal, K2, a fin de que los niños estén expuestos a ambas lenguas durante la jornada. El proceso continúa en K3, K4 y K5.
                  </p>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    Uno de nuestros objetivos en esta etapa es afianzar el manejo de la lengua madre y trabajar en la temprana adquisición del inglés como segundo idioma.
                  </p>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    Además, se favorece la articulación del aprendizaje con el nivel primario, facilitando una transición natural y segura.
                  </p>
                </div>
              </div>
              <Image
                src="/images/cuadro-kindergarten.svg"
                alt="Decorativo Kindergarten"
                width={250}
                height={250}
                className="absolute top-25 -left-15 z-20"
              />
              <div className="absolute -top-5 -left-40 w-[650px] z-10">
                <Image
                  src="/images/formas/forma-home-6.svg"
                  alt="Decoración"
                  width={650}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>
            {/* Versión Móvil */}
            <div className="block md:hidden w-full px-4 mt-32">
              <div className="relative z-10">
                <h2 className="text-5xl font-bold text-left mb-5 text-shadow-bold-movil">
                  KINDER<br />GARTEN
                </h2>
                <div className="bg-white shadow-xl rounded-3xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    Nuestro Proyecto Bilingüe inicia desde el jardín maternal, K2, a fin de que los niños estén expuestos a ambas lenguas durante la jornada. El proceso continúa en K3, K4 y K5.
                  </p>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    Uno de nuestros objetivos es fortalecer el manejo de la lengua materna y facilitar la adquisición temprana del inglés.
                  </p>
                </div>
              </div>
              <div className="absolute -top-5 -left-30 w-[550px] z-0">
                <Image
                  src="/images/formas/forma-home-6.svg"
                  alt="Decoración móvil"
                  width={550}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>
            <Image
              src="/images/cuadro-kindergarten-movil.svg"
              alt="Decorativo Kindergarten móvil"
              width={500}
              height={300}
              className="block md:hidden w-full px-5 mt-5 mb-3 z-10"
            />
          </div>
          {/* Columna Derecha: Imagen */}
          <div className="col-span-1 md:col-span-8 order-2 md:order-none px-5">
            <Image
              src="/images/image-kindergarten.webp"
              alt="Imagen del colegio"
              width={800}
              height={600}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN PRIMARY */}
      <section className="bg-white py-5 overflow-x-hidden">
        {/* Versión Escritorio */}
        <div className="hidden md:block relative w-full h-screen">
          <Image
            src="/images/formas/forma-home-3.svg"
            alt="Forma decorativa"
            width={750}
            height={500}
            className="absolute top-25 right-15 w-[750px] h-auto z-10"
          />
          <div className="grid grid-cols-12 gap-8 max-w-screen-xl mx-auto h-full px-4">
            {/* Columna Izquierda: Imagen principal */}
            <div className="col-span-8 flex items-center justify-center">
              <Image
                src="/images/fondo-iconos.webp"
                alt="Imagen principal"
                width={800}
                height={600}
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
            {/* Bloque con texto "PRIMARY" */}
            <div className="absolute top-50 left-[40%] w-[550px] z-20">
              <h2 className="text-5xl font-bold text-white text-end text-shadow-bold mb-5">
                PRIMARY
              </h2>
              <div className="bg-white shadow-xl rounded-3xl p-8">
                <p className="text-gray-700 leading-relaxed">
                  Con una Propuesta Bilingüe trabajamos a fin de posibilitar que los niños descubran sus talentos y capacidades. Como Colegio preparado y asesorado por experimentados profesionales, garantizamos una incorporación natural del idioma inglés como segunda lengua. Se logra así, en cada uno de los estudiantes, una amplia comprensión del idioma y la habilidad de expresión y comunicación.
                </p>
              </div>
            </div>
            {/* Columna Derecha: Iconos */}
            <div className="absolute col-span-4 flex items-center justify-center z-20 top-[60%] left-[50%]">
              <Image
                src="/images/cuadro-primary.svg"
                alt="Sección de iconos y estadísticas"
                width={450}
                height={450}
                className="w-[450px] h-auto"
              />
            </div>
          </div>
        </div>
        {/* Versión Móvil */}
        <div className="block md:hidden relative w-full">
          <div className="absolute top-15 -left-30 w-[650px] z-0">
            <Image
              src="/images/formas/forma-home-6.svg"
              alt="Decoración móvil"
              width={650}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 px-5">
            <h2 className="text-5xl font-bold text-left mb-5 mt-10 text-shadow-bold-movil">
              PRIMARY
            </h2>
            <div className="bg-white shadow-xl rounded-3xl p-6 mb-6">
              <p className="leading-relaxed text-gray-800">
                Con una Propuesta Bilingüe trabajamos a fin de posibilitar que los niños descubran sus talentos y capacidades. Como Colegio preparado y asesorado por experimentados profesionales, garantizamos una incorporación natural del idioma inglés como segunda lengua. Se logra así, en cada uno de los estudiantes, una amplia comprensión del idioma y la habilidad de expresión y comunicación.
              </p>
            </div>
            <Image
              src="/images/cuadro-primary.svg"
              alt="Sección de iconos y estadísticas"
              width={450}
              height={450}
              className="w-[450px] mx-auto h-auto mb-6"
            />
            <Image
              src="/images/fondo-iconos.webp"
              alt="Imagen principal"
              width={800}
              height={600}
              className="w-full h-auto rounded-md shadow-md mb-6"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN SECONDARY */}
      <section className="relative w-full h-auto py-10 bg-white overflow-x-hidden">
        {/* Versión Escritorio */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-8 max-w-screen-xl mx-auto">
            {/* Columna Izquierda: Texto */}
            <div className="col-span-4 relative flex flex-col justify-center">
              <div className="absolute top-[30%] left-[55%] w-[650px] z-20">
                <h2 className="text-5xl font-bold text-white text-center text-shadow-bold mb-5">
                  SECONDARY
                </h2>
                <div className="bg-white shadow-xl rounded-3xl p-8">
                  <h4 className="font-bold text-xl">
                    Líderes del futuro
                  </h4>
                  <p className="leading-relaxed text-gray-800">
                    Priorizamos un enfoque centrado en el estudiante para desarrollar competencias claves del siglo XXI como autonomía, pensamiento crítico y creatividad. Con una sólida base bilingüe, preparamos a nuestros alumnos para exámenes internacionales y el dominio avanzado del inglés técnico, adaptado a sus áreas de estudio. Brindamos un espacio donde el aprendizaje cobra vida.
                  </p>
                </div>
              </div>
              <div className="absolute top-50 -left-45 w-[355px] z-20 bg-white/80 p-4 rounded-xl text-[#1e804b]">
                <h4 className="font-bold text-xl text-center">
                  Diploma Dual
                </h4>
                <p className="text-justify">
                  Nuestros alumnos, de manera independiente, cursan la doble titulación del <span className="font-bold">Bachillerato de Estados Unidos</span>. Esta opción les brinda una <span className="font-bold">ventaja competitiva</span>, permitiéndoles obtener un <span className="font-bold">diploma secundario argentino y estadounidense</span> al mismo tiempo, ampliando sus oportunidades académicas y profesionales a nivel internacional.
                </p>
                <Image
                  src="/images/logo-academia-internatiional-studies.svg"
                  alt="Logo"
                  width={128}
                  height={128}
                  className="mx-auto mt-5"
                />
              </div>
              <div className="absolute -top-5 -left-40 w-[650px]">
                <Image
                  src="/images/formas/forma-home-6.svg"
                  alt="Decoración"
                  width={650}
                  height={100}
                  className="w-full h-full"
                />
              </div>
            </div>
            {/* Columna Derecha: Imagen */}
            <div className="col-span-8">
              <Image
                src="/images/image-kindergarten.webp"
                alt="Imagen del colegio"
                width={800}
                height={600}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
        {/* Versión Móvil */}
        <div className="block md:hidden relative w-full">
          <div className="absolute top-15 -left-30 w-[650px] z-0">
            <Image
              src="/images/formas/forma-home-6.svg"
              alt="Decoración móvil"
              width={650}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 px-5">
            <h2 className="text-5xl font-bold text-left text-shadow-bold-movil mb-5 mt-10">
              SECONDARY
            </h2>
            <div className="bg-white shadow-xl rounded-3xl p-6 mb-6">
              <h4 className="font-bold text-xl mb-2 text-left">
                Líderes del futuro
              </h4>
              <p className="leading-relaxed text-gray-800">
                Priorizamos un enfoque centrado en el estudiante para desarrollar competencias claves del siglo XXI como autonomía, pensamiento crítico y creatividad. Con una sólida base bilingüe, preparamos a nuestros alumnos para exámenes internacionales y el dominio avanzado del inglés técnico, adaptado a sus áreas de estudio. Brindamos un espacio donde el aprendizaje cobra vida.
              </p>
            </div>
            <Image
              src="/images/cuadro-primary.svg"
              alt="Sección de iconos y estadísticas"
              width={450}
              height={450}
              className="w-[450px] mx-auto h-auto mb-6"
            />
            <Image
              src="/images/image-kindergarten.webp"
              alt="Imagen principal"
              width={800}
              height={600}
              className="w-full h-auto rounded-md shadow-md mb-6"
            />
            <div className="bg-white/80 shadow-xl rounded-xl p-4 text-[#1e804b] mb-6">
              <h4 className="font-bold text-xl text-center">Diploma Dual</h4>
              <p className="text-justify mt-2">
                Nuestros alumnos, de manera independiente, cursan la doble titulación del <span className="font-bold">Bachillerato de Estados Unidos</span>. Esta opción les brinda una <span className="font-bold">ventaja competitiva</span>, permitiéndoles obtener un <span className="font-bold">diploma secundario argentino y estadounidense</span> al mismo tiempo, ampliando sus oportunidades académicas y profesionales a nivel internacional.
              </p>
              <Image
                src="/images/logo-academia-internatiional-studies.svg"
                alt=""
                width="96"
                height="96"
                className="mx-auto mt-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <Carousel />

      {/* Sección de Contacto */}
      <Contact />
    </div>
  );
}
