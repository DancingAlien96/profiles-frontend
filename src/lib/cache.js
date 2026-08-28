import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Cache en disco para las imagenes que se generan al vuelo.
 *
 * La de vista previa de WhatsApp cuesta ~100 ms de sharp. Sin cache, cada
 * visita y cada crawler la volverian a componer; con ella se hace una sola vez
 * por version de la foto.
 *
 * La clave incluye la fecha de la ultima foto, asi que al cambiarla se genera
 * una entrada nueva y la vieja deja de usarse sola.
 */
const DIR = process.env.CACHE_DIR || './.cache-imagenes';

const rutaDe = (clave) =>
  path.join(DIR, `${crypto.createHash('sha256').update(clave).digest('hex').slice(0, 32)}.bin`);

/**
 * Devuelve lo cacheado o lo genera y lo guarda.
 * Si el disco falla, se genera igual: la cache nunca debe tumbar la pagina.
 */
export async function cacheado(clave, generar) {
  const ruta = rutaDe(clave);

  try {
    return await fs.readFile(ruta);
  } catch {
    // No estaba: se genera.
  }

  const datos = await generar();

  try {
    await fs.mkdir(DIR, { recursive: true });
    // Se escribe aparte y se renombra: si dos visitas coinciden, ninguna lee
    // un archivo a medio escribir.
    const temporal = `${ruta}.${process.pid}.tmp`;
    await fs.writeFile(temporal, datos);
    await fs.rename(temporal, ruta);
  } catch (err) {
    console.warn(`[cache] no se pudo guardar ${clave}: ${err.message}`);
  }

  return datos;
}

/** Borra las entradas que no se han pedido en los ultimos dias. */
export async function limpiarViejas(dias = 30) {
  const limite = Date.now() - dias * 24 * 3600 * 1000;
  let borradas = 0;
  try {
    for (const nombre of await fs.readdir(DIR)) {
      const ruta = path.join(DIR, nombre);
      const info = await fs.stat(ruta);
      if (info.mtimeMs < limite) {
        await fs.unlink(ruta);
        borradas++;
      }
    }
  } catch {
    // El directorio puede no existir todavia.
  }
  return borradas;
}
