/**
 * Imagen de vista previa (1200x630) para WhatsApp, LinkedIn y Facebook.
 *
 * Se genera en JPEG a proposito: los crawlers de esas plataformas manejan mal
 * el WebP y el link terminaria compartiendose sin imagen. Se compone con sharp,
 * que ya viene incluido con Astro.
 */
import sharp from 'sharp';
import { obtenerPerfil, obtenerFoto } from '../../lib/api.js';
import { cacheado } from '../../lib/cache.js';

const ANCHO = 1200;
const ALTO = 630;
const FOTO = 300;
const MARGEN_DER = 60;

// "sans-serif" a secas lo resuelve librsvg a una monoespaciada en varios
// sistemas. Se nombran familias concretas presentes en Linux (Netlify),
// macOS y Windows, en ese orden.
const FUENTE = 'DejaVu Sans, Liberation Sans, Helvetica Neue, Arial, sans-serif';

/** Paleta por tema, alineada con los CSS de src/themes/. */
const PALETA = {
  'oro-tech':   { fondo1: '#050b1a', fondo2: '#0d1b3a', acento: '#e6c25a', texto: '#eaf0ff', suave: '#9fb0d0' },
  'navy-pro':   { fondo1: '#f7f9fc', fondo2: '#e6ecf5', acento: '#1b4f9c', texto: '#16233a', suave: '#61708c' },
  'marfil-oro': { fondo1: '#faf6ee', fondo2: '#efe6d4', acento: '#a67c2e', texto: '#2b2419', suave: '#7a6c56' },
  'rosa-glam':  { fondo1: '#140309', fondo2: '#22060f', acento: '#ff5f8f', texto: '#fdeff4', suave: '#c49bab' },
};

const escapar = (texto = '') =>
  texto.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

/** Corta el texto para que no se desborde del lienzo. */
const recortar = (texto, max) => (texto.length > max ? `${texto.slice(0, max - 1).trimEnd()}…` : texto);

export async function GET({ params }) {
  const perfil = await obtenerPerfil(params.slug);
  if (!perfil?.hasPhoto) return new Response('Sin foto', { status: 404 });

  try {
    const imagen = await cacheado(
      // El texto tambien va en la imagen, asi que la clave incluye lo que
      // se dibuja: si el cliente cambia su cargo, se regenera.
      `og:${perfil.slug}:${perfil.photoUpdatedAt}:${perfil.name}:${perfil.role}:${perfil.tagline}:${perfil.theme}`,
      () => componer(perfil)
    );

    return new Response(imagen, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error(`[web] vista previa de ${params.slug}: ${err.message}`);
    return new Response('Sin foto', { status: 404 });
  }
}

/** Compone la imagen 1200x630 que ven WhatsApp y LinkedIn. */
async function componer(perfil) {
  const c = PALETA[perfil.theme] || PALETA['oro-tech'];

  const foto = await obtenerFoto(perfil.slug);
  if (!foto) throw new Error('la API no devolvio la foto');

  // Foto cuadrada recortada en circulo mediante una mascara.
  const cuadrada = await sharp(foto.buffer).resize(FOTO, FOTO, { fit: 'cover' }).png().toBuffer();
  const mascara = Buffer.from(
    `<svg width="${FOTO}" height="${FOTO}"><circle cx="${FOTO / 2}" cy="${FOTO / 2}" r="${FOTO / 2}" fill="#fff"/></svg>`
  );
  const circular = await sharp(cuadrada)
    .composite([{ input: mascara, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const izquierda = 130 + FOTO + 70;
  const disponible = ANCHO - izquierda - MARGEN_DER;

  // Limite de caracteres estimado por el ancho medio de glifo de cada tamaño,
  // para que ninguna linea se salga del lienzo.
  const cabe = (tamano, extra = 0) => Math.floor(disponible / (tamano * 0.55 + extra));

  const fondo = Buffer.from(`
    <svg width="${ANCHO}" height="${ALTO}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c.fondo1}"/>
          <stop offset="100%" stop-color="${c.fondo2}"/>
        </linearGradient>
      </defs>
      <rect width="${ANCHO}" height="${ALTO}" fill="url(#g)"/>
      <rect x="0" y="${ALTO - 10}" width="${ANCHO}" height="10" fill="${c.acento}"/>
      <text x="${izquierda}" y="288" font-family="${FUENTE}" font-size="58" font-weight="700" fill="${c.texto}">
        ${escapar(recortar(perfil.name, cabe(58)))}
      </text>
      <text x="${izquierda}" y="342" font-family="${FUENTE}" font-size="27" font-weight="600" fill="${c.acento}" letter-spacing="2">
        ${escapar(recortar((perfil.role || '').toUpperCase(), cabe(27, 2)))}
      </text>
      <text x="${izquierda}" y="400" font-family="${FUENTE}" font-size="24" fill="${c.suave}">
        ${escapar(recortar(perfil.tagline || '', cabe(24)))}
      </text>
    </svg>
  `);

  return sharp(fondo)
    .composite([{ input: circular, top: (ALTO - FOTO) / 2, left: 130 }])
    .jpeg({ quality: 88 })
    .toBuffer();
}
