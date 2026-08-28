/**
 * Lectura de la API.
 *
 * El sitio corre en el mismo VPS que la API, asi que estas llamadas van por
 * localhost: cuestan menos de un milisegundo y no salen a internet.
 */
// Esto corre en el servidor, no en el navegador: va directo a la API por
// localhost. No usa PUBLIC_API_URL a proposito, porque esa es la direccion
// publica que necesita el navegador del cliente, no la interna.
const API = (process.env.API_INTERNA || 'http://127.0.0.1:5000').replace(/\/$/, '');

const TIEMPO_LIMITE = 8000;

/** Un perfil por su direccion. Devuelve null si no existe. */
export async function obtenerPerfil(slug) {
  if (!slug) return null;
  try {
    const res = await fetch(`${API}/api/profiles/${encodeURIComponent(slug)}`, {
      signal: AbortSignal.timeout(TIEMPO_LIMITE),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`[web] no se pudo leer el perfil ${slug}: ${err.message}`);
    return null;
  }
}

/** Foto de un perfil, tal como la guardo el cliente. */
export async function obtenerFoto(slug) {
  try {
    const res = await fetch(`${API}/api/profiles/${encodeURIComponent(slug)}/photo`, {
      signal: AbortSignal.timeout(TIEMPO_LIMITE),
    });
    if (!res.ok) return null;
    return {
      buffer: Buffer.from(await res.arrayBuffer()),
      contentType: res.headers.get('content-type') || 'image/webp',
    };
  } catch (err) {
    console.warn(`[web] no se pudo bajar la foto de ${slug}: ${err.message}`);
    return null;
  }
}

export const API_URL = API;
