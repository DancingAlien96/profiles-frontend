/**
 * Version del dibujo de la vista previa de WhatsApp.
 *
 * Las imagenes se cachean en dos capas â€”en disco aqui y en Nginxâ€” y las dos se
 * indexan por los datos del perfil, no por el codigo que los dibuja. Sin un
 * numero como este, mejorar el generador no cambia nada para quien no vuelva a
 * editar su perfil: se le sigue sirviendo la imagen vieja para siempre.
 *
 * **Subela al tocar el generador.** Entra en la clave de disco y en la URL que
 * publica la pagina, asi que invalida las dos capas de golpe y los crawlers
 * vuelven a pedir la imagen.
 *
 * 1 -> version inicial
 * 2 -> inicial para perfiles sin foto; nombre en dos lineas y encogido
 */
export const VERSION_OG = 2;
