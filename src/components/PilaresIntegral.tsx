'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PilaresEducativos, type PilarKey } from './PilaresEducativos';
import { TITULO_SECCION } from '@/lib/tipografia';

const FADE_MS = 150;

/**
 * Texto + rueda de "Formación integral", con interacción: al pasar el mouse
 * por un gajo de la rueda, el título y el texto de la izquierda cambian para
 * mostrar el pilar correspondiente. Sin hover, muestran el título y la bajada
 * por defecto.
 *
 * El resaltado de la rueda (activeKey) es inmediato, pero el texto usa un
 * estado propio (displayKey) que espera a que termine el fade-out para
 * cambiar el contenido, así el cambio de texto se ve como un crossfade en
 * vez de un salto.
 */
export default function PilaresIntegral({
  tituloDefault,
  textoDefault,
}: {
  tituloDefault: string;
  textoDefault: string;
}) {
  const t = useTranslations('pilares');
  const [activeKey, setActiveKey] = useState<PilarKey | null>(null);
  const [displayKey, setDisplayKey] = useState<PilarKey | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Si el hover vuelve al mismo pilar que ya está mostrado antes de que
    // termine el fade (típico con scroll, que dispara varios cambios de
    // hover en poco tiempo), hay que reponer fading=false acá: si solo
    // hiciéramos "return" el timeout pendiente ya fue cancelado por el
    // cleanup del efecto anterior y nada volvía a sacar el texto de
    // opacity 0, dejando el bloque en blanco para siempre.
    if (activeKey === displayKey) {
      setFading(false);
      return;
    }
    setFading(true);
    const timeout = setTimeout(() => {
      setDisplayKey(activeKey);
      setFading(false);
    }, FADE_MS);
    return () => clearTimeout(timeout);
  }, [activeKey, displayKey]);

  const titulo = displayKey ? `${t(`${displayKey}.l1`)} ${t(`${displayKey}.l2`)}` : tituloDefault;
  const texto = displayKey ? t(`${displayKey}.texto`) : textoDefault;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-10">
      {/* Texto: contra el filete, como en el resto del sitio (BloqueRotulo).
          El filete estira su altura para igualar la de la rueda. */}
      <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:text-right lg:border-r lg:border-[#9bb5a5] lg:pr-8 order-2 lg:order-1">
        <div
          className="transition-opacity ease-in-out"
          style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
        >
          <h2 className={TITULO_SECCION}>{titulo}</h2>
          <p className="mt-3 text-gray-700 italic leading-relaxed">{texto}</p>
        </div>
      </div>

      {/* Rueda de pilares */}
      <div className="w-full lg:w-[560px] shrink-0 flex justify-center order-1 lg:order-2">
        <PilaresEducativos
          className="w-full max-w-[340px] lg:max-w-none h-auto"
          activeKey={activeKey}
          onPilarChange={setActiveKey}
        />
      </div>
    </div>
  );
}
