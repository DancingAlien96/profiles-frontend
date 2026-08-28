import sharp from 'sharp';
import { obtenerPerfil, obtenerFoto } from '../../lib/api.js';
import { cacheado } from '../../lib/cache.js';

/**
 * Sirve la foto del perfil.
 *
 * Se reconvierte siempre a WebP: el archivo se sirve con extension .webp y un
 * JPEG subido por fuera del panel quedaria mal etiquetado. El resultado se
 * cachea por version de la foto, asi que sharp corre una vez, no en cada
 * visita.
 */
export async function GET({ params }) {
  const { slug } = params;

  const perfil = await obtenerPerfil(slug);
  if (!perfil?.hasPhoto) return new Response('Sin foto', { status: 404 });

  try {
    const imagen = await cacheado(`foto:${slug}:${perfil.photoUpdatedAt}`, async () => {
      const foto = await obtenerFoto(slug);
      if (!foto) throw new Error('la API no devolvio la foto');
      return sharp(foto.buffer).resize(400, 400, { fit: 'cover' }).webp({ quality: 82 }).toBuffer();
    });

    return new Response(imagen, {
      headers: {
        'Content-Type': 'image/webp',
        // La URL lleva ?v= con la fecha de la foto, asi que al cambiarla
        // cambia la direccion y este cache largo no sirve nada viejo.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error(`[web] foto de ${slug}: ${err.message}`);
    return new Response('Sin foto', { status: 404 });
  }
}
