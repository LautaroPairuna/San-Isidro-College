/**
 * Freno contra la fuerza bruta en el login del panel: 5 intentos fallidos desde
 * una misma IP en 15 minutos bloquean esa IP otros 15. Un login correcto limpia
 * el contador. En memoria: el sitio corre en un solo proceso.
 */
const VENTANA_MS = 15 * 60 * 1000;
const BLOQUEO_MS = 15 * 60 * 1000;
const MAX_FALLOS = 5;

type Estado = { fallos: number; desde: number; hasta?: number };
const porIp = new Map<string, Estado>();

function limpiar(ahora: number) {
  for (const [ip, estado] of porIp) {
    const vencido = ahora - estado.desde > VENTANA_MS && (!estado.hasta || estado.hasta < ahora);
    if (vencido) porIp.delete(ip);
  }
}

/**
 * IP del cliente detrás del proxy (Traefik en Dokploy). NextAuth le pasa a
 * `authorize` las cabeceras como objeto común, no como `Headers`.
 */
export function ipDelPedido(headers: Headers | Record<string, unknown> | undefined): string {
  const leer = (nombre: string) => {
    if (!headers) return undefined;
    if (headers instanceof Headers) return headers.get(nombre) ?? undefined;
    const valor = headers[nombre];
    return Array.isArray(valor) ? String(valor[0]) : typeof valor === "string" ? valor : undefined;
  };
  return (
    leer("x-forwarded-for")?.split(",")[0]?.trim() || leer("x-real-ip")?.trim() || "desconocida"
  );
}

/** Segundos que le faltan a esa IP para poder volver a intentar (0 si puede). */
export function segundosDeBloqueo(ip: string): number {
  const ahora = Date.now();
  limpiar(ahora);
  const hasta = porIp.get(ip)?.hasta;
  return hasta && hasta > ahora ? Math.ceil((hasta - ahora) / 1000) : 0;
}

export function registrarFallo(ip: string) {
  const ahora = Date.now();
  const actual = porIp.get(ip);
  const estado =
    !actual || ahora - actual.desde > VENTANA_MS
      ? { fallos: 1, desde: ahora }
      : { fallos: actual.fallos + 1, desde: actual.desde };
  porIp.set(ip, estado.fallos >= MAX_FALLOS ? { ...estado, hasta: ahora + BLOQUEO_MS } : estado);
}

export function limpiarFallos(ip: string) {
  porIp.delete(ip);
}
