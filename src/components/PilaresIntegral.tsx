'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PilaresEducativos, type PilarKey } from './PilaresEducativos';
import { TITULO_SECCION } from '@/lib/tipografia';

/**
 * Texto + rueda de "Formación integral", con interacción: al pasar el mouse
 * por un gajo de la rueda, el título y el texto de la izquierda cambian para
 * mostrar el pilar correspondiente. Sin hover, muestran el título y la bajada
 * por defecto.
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

  const titulo = activeKey ? `${t(`${activeKey}.l1`)} ${t(`${activeKey}.l2`)}` : tituloDefault;
  const texto = activeKey ? t(`${activeKey}.texto`) : textoDefault;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-10">
      {/* Texto: contra el filete, como en el resto del sitio (BloqueRotulo).
          El filete estira su altura para igualar la de la rueda. */}
      <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:text-right lg:border-r lg:border-[#9bb5a5] lg:pr-8 order-2 lg:order-1">
        <h2 className={TITULO_SECCION}>{titulo}</h2>
        <p className="mt-3 text-gray-700 italic leading-relaxed">{texto}</p>
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
