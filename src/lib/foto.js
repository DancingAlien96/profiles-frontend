/**
 * Compresion de la foto en el navegador, antes de subirla.
 *
 * Recorta al centro, escala a 400x400 y convierte a WebP bajando la calidad
 * hasta entrar en el limite que acepta la API. Una foto de celular de 12 MP
 * termina en unos 15 KB, asi que la base se mantiene pequeña y la pagina
 * carga rapido.
 */
const LADO = 400;
export const MAX_BYTES = 200 * 1024;

export function comprimirFoto(archivo) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(archivo);

    img.onload = () => {
      const lienzo = document.createElement('canvas');
      lienzo.width = LADO;
      lienzo.height = LADO;
      const ctx = lienzo.getContext('2d');

      const recorte = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - recorte) / 2,
        (img.height - recorte) / 2,
        recorte, recorte,
        0, 0, LADO, LADO
      );

      let calidad = 0.85;
      let dataUrl = lienzo.toDataURL('image/webp', calidad);
      while (dataUrl.length * 0.75 > MAX_BYTES && calidad > 0.4) {
        calidad -= 0.1;
        dataUrl = lienzo.toDataURL('image/webp', calidad);
      }

      URL.revokeObjectURL(objectUrl);

      if (!dataUrl.startsWith('data:image/webp')) {
        reject(new Error('Tu navegador no puede convertir la imagen. Prueba con Chrome.'));
        return;
      }
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo leer la imagen.'));
    };

    img.src = objectUrl;
  });
}

/** Propone una direccion web a partir del nombre: "Juan Pérez" -> "juan-perez". */
export function slugDesdeNombre(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}
