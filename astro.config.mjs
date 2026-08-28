import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Dominio propio. Se usa para las etiquetas Open Graph, asi que un valor
// equivocado rompe las vistas previas de WhatsApp sin que nada falle.
const site = process.env.SITE_URL || 'https://www.professionalprofiles.online';

export default defineConfig({
  // Modo servidor: las tarjetas se generan al pedirlas, leyendo la API.
  //
  // Antes se generaban todas en el build y cada edicion de un cliente obligaba
  // a reconstruir el sitio entero en Netlify. Cada uno de esos deploys cuesta
  // 15 creditos de los 300 mensuales del plan gratuito, asi que una docena de
  // clientes activos bastaba para agotarlos y que Netlify pausara el sitio.
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  site,
  // Formato 'directory' (el de serie): las paginas fijas responden en /admin
  // y /crear. Con 'file' se generaban como /admin.html y solo funcionaban
  // porque Netlify hacia la conversion; el servidor de Node no la hace.
  build: { format: 'directory' },

  // El servidor va detras de Nginx, que es quien habla con internet.
  server: {
    host: process.env.HOST || '127.0.0.1',
    port: Number(process.env.PORT) || 4321,
  },
});
