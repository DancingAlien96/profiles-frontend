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
// sistemas. Se nombran familias concretas presentes en el Linux del VPS,
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

/**
 * Ancho aproximado de un texto, por el ancho medio de glifo del tamaño.
 *
 * El factor depende del grosor: la negrita es bastante mas ancha que la
 * redonda, y usar un solo numero para las dos dejaba el nombre pegado al borde
 * derecho. Se prefiere pasarse por arriba: quedarse corto desborda el lienzo,
 * pasarse solo parte una linea antes.
 */
const anchoAprox = (texto, tamano, factor, extra = 0) => texto.length * (tamano * factor + extra);

const FACTOR_NEGRITA = 0.62;
const FACTOR_SEMI = 0.6;
const FACTOR_REDONDA = 0.55;

/** Tamaños que se prueban para el nombre, de mayor a menor. */
const TAMANOS_NOMBRE = [58, 52, 47, 42, 38];

/**
 * Reparte un texto en como mucho `maxLineas`, sin partir palabras.
 * Devuelve null si no hay forma de que quepa.
 */
function repartir(texto, maxLineas, cabeEn) {
  const palabras = texto.trim().split(/\s+/).filter(Boolean);
  const lineas = [];
  let actual = '';

  for (const palabra of palabras) {
    const intento = actual ? `${actual} ${palabra}` : palabra;
    if (!actual || cabeEn(intento)) {
      actual = intento;
      continue;
    }
    lineas.push(actual);
    if (lineas.length === maxLineas) return null;
    actual = palabra;
  }
  if (actual) lineas.push(actual);

  // Una sola palabra mas larga que la linea entra aqui sin haberse partido.
  return lineas.length <= maxLineas && lineas.every(cabeEn) ? lineas : null;
}

/**
 * El nombre repartido en una o dos lineas, con el mayor tamaño que quepa.
 *
 * Se acomoda en dos lineas igual que hace la tarjeta, y si aun asi no cabe se
 * encoge la letra. Recortar es el ultimo recurso: en una tarjeta de
 * presentacion, perder el apellido es peor que perder unos puntos de tamaño, y
 * dos nombres con dos apellidos —lo normal aqui— se pasan de una linea.
 */
function repartirNombre(nombre, disponible) {
  for (const tamano of TAMANOS_NOMBRE) {
    const lineas = repartir(nombre, 2, (t) => anchoAprox(t, tamano, FACTOR_NEGRITA) <= disponible);
    if (lineas) return { tamano, lineas };
  }

  const tamano = TAMANOS_NOMBRE[TAMANOS_NOMBRE.length - 1];
  const porLinea = Math.floor(disponible / (tamano * FACTOR_NEGRITA));
  return { tamano, lineas: [recortar(nombre, porLinea)] };
}

export async function GET({ params }) {
  const perfil = await obtenerPerfil(params.slug);
  if (!perfil) return new Response('Perfil no encontrado', { status: 404 });

  try {
    // `updatedAt` cambia con cualquier edicion, la foto incluida, asi que
    // basta el para invalidar: si el cliente cambia su cargo o su tema, se
    // regenera. Antes se enumeraban los campos uno a uno.
    const imagen = await cacheado(`og:${perfil.slug}:${perfil.updatedAt}`, () => componer(perfil));

    return new Response(imagen, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error(`[web] vista previa de ${params.slug}: ${err.message}`);
    return new Response('No se pudo generar la vista previa', { status: 500 });
  }
}

/** La foto del cliente, recortada en circulo mediante una mascara. */
async function fotoCircular(slug) {
  const foto = await obtenerFoto(slug);
  if (!foto) throw new Error('la API no devolvio la foto');

  const cuadrada = await sharp(foto.buffer).resize(FOTO, FOTO, { fit: 'cover' }).png().toBuffer();
  const mascara = Buffer.from(
    `<svg width="${FOTO}" height="${FOTO}"><circle cx="${FOTO / 2}" cy="${FOTO / 2}" r="${FOTO / 2}" fill="#fff"/></svg>`
  );
  return sharp(cuadrada)
    .composite([{ input: mascara, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

/**
 * Sustituto cuando el perfil todavia no tiene foto: la inicial dentro de un
 * circulo del color de acento. Es lo mismo que hace la tarjeta (.avatar
 * .inicial en base.css), para que el enlace compartido y la pagina se
 * parezcan. Antes esta ruta devolvia 404 y el enlace se compartia sin imagen.
 *
 * Va dentro del SVG de fondo y no como composicion aparte: no hay ningun
 * bitmap que enmascarar.
 */
function avatarInicial(perfil, c) {
  const r = FOTO / 2;
  const cx = 130 + r;
  const cy = ALTO / 2;
  const inicial = escapar(perfil.name.trim().charAt(0).toUpperCase() || '?');

  // librsvg no aplica dominant-baseline de forma fiable, asi que la linea de
  // base se coloca a mano: ~0.35 del tamaño por debajo del centro.
  return `
      <circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="${c.acento}" fill-opacity="0.14"
              stroke="${c.acento}" stroke-width="6"/>
      <text x="${cx}" y="${cy + 53}" font-family="${FUENTE}" font-size="150" font-weight="700"
            fill="${c.acento}" text-anchor="middle">${inicial}</text>`;
}

/** Compone la imagen 1200x630 que ven WhatsApp y LinkedIn. */
async function componer(perfil) {
  const c = PALETA[perfil.theme] || PALETA['oro-tech'];

  const circular = perfil.hasPhoto ? await fotoCircular(perfil.slug) : null;

  const izquierda = 130 + FOTO + 70;
  const disponible = ANCHO - izquierda - MARGEN_DER;

  // Limite de caracteres para las lineas que si se recortan (cargo y lema).
  const cabe = (tamano, factor, extra = 0) => Math.floor(disponible / (tamano * factor + extra));

  const { tamano: tamNombre, lineas: lineasNombre } = repartirNombre(perfil.name, disponible);
  const altoLinea = Math.round(tamNombre * 1.1);

  // Con el nombre en dos lineas el bloque crece: se sube media linea para que
  // siga equilibrado frente al circulo. Con una linea salen exactamente las
  // mismas posiciones de siempre.
  const desplazamiento = ((lineasNombre.length - 1) * altoLinea) / 2;
  const yNombre = 288 - desplazamiento;
  const yUltima = yNombre + (lineasNombre.length - 1) * altoLinea;

  const nombreSVG = lineasNombre
    .map(
      (linea, i) =>
        `<text x="${izquierda}" y="${yNombre + i * altoLinea}" font-family="${FUENTE}" font-size="${tamNombre}" font-weight="700" fill="${c.texto}">${escapar(linea)}</text>`
    )
    .join('\n      ');

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
      ${circular ? '' : avatarInicial(perfil, c)}
      ${nombreSVG}
      <text x="${izquierda}" y="${yUltima + 54}" font-family="${FUENTE}" font-size="27" font-weight="600" fill="${c.acento}" letter-spacing="2">
        ${escapar(recortar((perfil.role || '').toUpperCase(), cabe(27, FACTOR_SEMI, 2)))}
      </text>
      <text x="${izquierda}" y="${yUltima + 112}" font-family="${FUENTE}" font-size="24" fill="${c.suave}">
        ${escapar(recortar(perfil.tagline || '', cabe(24, FACTOR_REDONDA)))}
      </text>
    </svg>
  `);

  const lienzo = sharp(fondo);
  if (circular) {
    lienzo.composite([{ input: circular, top: (ALTO - FOTO) / 2, left: 130 }]);
  }
  return lienzo.jpeg({ quality: 88 }).toBuffer();
}
