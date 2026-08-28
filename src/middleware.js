/**
 * Middleware del servidor.
 *
 * Asegura el charset en las respuestas HTML: el adaptador de Node envia
 * "text/html" a secas y, sin charset, el navegador adivina la codificacion y
 * parte todos los acentos ("Andrés" sale como "Andr?s"). En estatico no se
 * notaba porque el charset lo ponia Netlify.
 */
export async function onRequest(contexto, siguiente) {
  const respuesta = await siguiente();

  const tipo = respuesta.headers.get('content-type');
  if (tipo?.startsWith('text/html') && !tipo.includes('charset')) {
    respuesta.headers.set('content-type', 'text/html; charset=utf-8');
  }

  return respuesta;
}
