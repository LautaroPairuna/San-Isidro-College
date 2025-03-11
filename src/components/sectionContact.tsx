import Image from 'next/image';

const ContactSection = () => {
  return (
    <section className="relative w-full h-auto py-10 bg-white overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-screen-xl mx-auto">
        
        {/* Columna Izquierda: Información de contacto */}
        <div className="relative flex flex-col justify-center lg:col-span-4">
          
          {/* Contenedor del Texto */}
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
          
          {/* Forma decorativa en mobile */}
          <div className="block lg:hidden absolute top-0 left-0 pointer-events-none">
            <Image
              src="/images/formas/forma-home-4.svg"
              alt="Decoración"
              width={620}
              height={300}
              className="w-[620px] max-w-none h-auto"
            />
          </div>
          
          {/* Forma decorativa en desktop */}
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
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.0870169140185!2d-65.48649632374536!3d-24.79247370797458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941be9dda29c6329%3A0x960b145b5c2957ed!2sSAN%20ISIDRO%20COLLEGE!5e0!3m2!1ses-419!2sar!4v1738620563995!5m2!1ses-419!2sar"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
