import Image from 'next/image';
import MapEmbed from '@/components/mapEmbed';

const ContactSection = () => {
  return (
    <section className="relative w-full h-auto py-10 bg-white overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-screen-xl mx-auto">
        {/* Columna Izquierda: Información de contacto */}
        <div className="relative flex flex-col justify-center lg:col-span-4">
          <div className="bg-white shadow-xl rounded-xl p-4 md:p-8 absolute top-15 lg:top-65 left-10 md:left-20 lg:left-55 w-[80%] lg:w-[90%] z-30">
            <div className="text-gray-800 leading-relaxed">
              <p>
                Avenida Finca Yerba Buena 1500<br />
                San Lorenzo Chico 4401<br />
                A4401 San Lorenzo, Salta
              </p>
              <p className="mt-2">
                <a
                  href="mailto:info@colegiosanisidrosalta.edu.ar"
                  className="hover:underline"
                >
                  info@colegiosanisidrosalta.edu.ar
                </a>
              </p>
            </div>
            <hr className="my-6 border-gray-300" />
            <div className="flex items-center justify-center gap-6">
              {[
                { href: 'https://instagram.com', src: '/images/ico-instagram.svg', alt: 'Instagram' },
                { href: 'https://facebook.com',  src: '/images/ico-facebook.svg',  alt: 'Facebook' },
                { href: 'https://youtube.com',   src: '/images/ico-youtube.svg',   alt: 'YouTube' },
                { href: 'https://linkedin.com',  src: '/images/ico-linkedin.svg',  alt: 'LinkedIn' },
              ].map(({ href, src, alt }) => (
                <a
                  key={alt}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 bg-black rounded-full"
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
          <div className="block lg:hidden absolute top-0 left-0 pointer-events-none">
            <Image
              src="/images/formas/forma-home-4.svg"
              alt="Decoración"
              width={620}
              height={300}
              className="w-[620px] max-w-none h-auto"
            />
          </div>
          <div className="hidden lg:block absolute -top-5 -left-[70%] pointer-events-none w-210">
            <Image
              src="/images/formas/forma-home-4.svg"
              alt="Decoración"
              width={210}
              height={210}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Columna Derecha: Mapa */}
        <div className="lg:col-span-8 z-20 px-5 mt-[250px] lg:mt-0">
          <div className="w-full h-[350px] lg:h-[740px]">
            <MapEmbed />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
