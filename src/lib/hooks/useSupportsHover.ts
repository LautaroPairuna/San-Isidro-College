// src/lib/hooks/useSupportsHover.ts
import { useEffect, useState } from 'react';

/**
 * Si el dispositivo tiene un puntero que puede "hover" de verdad (mouse),
 * en vez de solo touch. En celular no hay hover real: el navegador simula un
 * mouseenter en el toque y muchas veces no dispara el mouseleave hasta que se
 * toca otro elemento, así que un `isFlipped || isHovered` se queda pegado en
 * "true" después del primer toque y el segundo toque no vuelve al frente.
 * Arranca en `false` (server/primer render) y se corrige en el cliente.
 */
export function useSupportsHover(): boolean {
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setSupportsHover(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return supportsHover;
}
