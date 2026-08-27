/**
 * Lectura de la API durante el build.
 *
 * Es el unico momento en que el sitio depende de la API: despues de generar
 * las paginas, las visitas se sirven como HTML estatico.
 *
 * Se reintenta unas cuantas veces porque un build puede coincidir con un
 * reinicio del servicio o del VPS, y no vale la pena cancelar un despliegue
 * por unos segundos de indisponibilidad.
 */
const API = (import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const INTENTOS = 6;
const ESPERA_MS = 5000;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function esperarAPI() {
  let ultimoError = 'sin respuesta';

  for (let i = 1; i <= INTENTOS; i++) {
    try {
      const res = await fetch(`${API}/api/health`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) {
        if (i > 1) console.log(`[build] la API respondio en el intento ${i}`);
        return true;
      }
      ultimoError = `HTTP ${res.status}`;
    } catch (err) {
      ultimoError = err.message;
    }

    if (i < INTENTOS) {
      console.log(`[build] la API no responde (${ultimoError}), reintento ${i}/${INTENTOS - 1}...`);
      await esperar(ESPERA_MS);
    }
  }

  console.error(`[build] ultimo error al contactar la API: ${ultimoError}`);
  return false;
}

export async function obtenerPerfiles() {
  if (!(await esperarAPI())) {
    // Abortar el build a proposito: Netlify conserva el deploy anterior.
    // Publicar un sitio vacio borraria todos los perfiles en produccion.
    throw new Error(
      `No se pudo contactar la API en ${API}. Se cancela el build para no publicar un sitio vacio.`
    );
  }

  const res = await fetch(`${API}/api/profiles`, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`La API respondio ${res.status} al pedir los perfiles`);

  const perfiles = await res.json();
  console.log(`[build] ${perfiles.length} perfil(es) recibidos`);
  return perfiles;
}

/** Descarga la foto de un perfil para publicarla como archivo estatico. */
export async function obtenerFoto(slug) {
  try {
    const res = await fetch(`${API}/api/profiles/${slug}/photo`, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) return null;
    return {
      buffer: Buffer.from(await res.arrayBuffer()),
      contentType: res.headers.get('content-type') || 'image/webp',
    };
  } catch (err) {
    console.warn(`[build] no se pudo bajar la foto de ${slug}: ${err.message}`);
    return null;
  }
}

export const API_URL = API;
