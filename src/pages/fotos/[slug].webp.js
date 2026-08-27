/**
 * Publica la foto de cada perfil como archivo estatico en Netlify.
 *
 * La foto vive en MongoDB, pero servirla desde la API en cada visita cargaria
 * el VPS sin motivo. Aqui se baja una sola vez durante el build y queda como
 * un .webp normal en el CDN de Netlify.
 */
import sharp from 'sharp';
import { obtenerPerfiles, obtenerFoto } from '../../lib/api.js';

export async function getStaticPaths() {
  const perfiles = await obtenerPerfiles();
  return perfiles
    .filter((perfil) => perfil.hasPhoto)
    .map((perfil) => ({ params: { slug: perfil.slug } }));
}

export async function GET({ params }) {
  const foto = await obtenerFoto(params.slug);
  if (!foto) return new Response('Sin foto', { status: 404 });

  // Se reconvierte siempre: el archivo se sirve como .webp y Netlify asigna el
  // Content-Type por extension, asi que un JPEG subido por fuera del panel
  // quedaria mal etiquetado.
  const webp = await sharp(foto.buffer).resize(400, 400, { fit: 'cover' }).webp({ quality: 82 }).toBuffer();

  return new Response(webp, {
    headers: { 'Content-Type': 'image/webp' },
  });
}
