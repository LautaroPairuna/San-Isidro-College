// Instrumentación de arranque (se ejecuta una vez por proceso del servidor).
// Configura `sharp` para minimizar el consumo de RAM: el optimizador de
// imágenes de Next y nuestro file.service comparten esta misma instancia.
export async function register() {
  // Solo en el runtime de Node (no en Edge, donde sharp no existe).
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  try {
    const sharpModule = await import('sharp');
    const sharp = ('default' in sharpModule ? sharpModule.default : sharpModule) as typeof import('sharp');
    // Desactiva el caché interno de buffers/operaciones: evita que sharp
    // retenga memoria entre peticiones (clave en un VPS con poca RAM).
    sharp.cache(false);
    // Procesa una imagen por vez: limita los picos de memoria al optimizar.
    sharp.concurrency(1);
  } catch {
    // Si sharp aún no está instalado/disponible, no bloqueamos el arranque.
  }
}
