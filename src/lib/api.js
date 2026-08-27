/**
 * Lectura de la API durante el build.
 *
 * Render duerme el servicio gratuito tras 15 minutos sin trafico y el primer
 * request puede tardar ~50 segundos. Por eso se despierta con reintentos antes
 * de pedir los datos: es el unico momento en que el sitio depende de la API.
 */
const API = (import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function despertarAPI() {
  const intentos = 10;
  for (let i = 1; i <= intentos; i++) {
    try {
      const res = await fetch(`${API}/api/health`, { signal: AbortSignal.timeout(15000) });
      if (res.ok) {
        if (i > 1) console.log(`[build] API despierta tras ${i} intentos`);
        return true;
      }
    } catch {
      /* servicio dormido, se reintenta */
    }
    console.log(`[build] esperando a que despierte la API (${i}/${intentos})...`);
    await esperar(10000);
  }
  return false;
}

export async function obtenerPerfiles() {
  if (!(await despertarAPI())) {
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
