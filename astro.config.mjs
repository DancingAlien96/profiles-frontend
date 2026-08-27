import { defineConfig } from 'astro/config';

export default defineConfig({
  // Sitio 100% estatico: las paginas se generan en el build leyendo la API.
  // Asi la pagina publica nunca depende de Render (que duerme en el plan free).
  output: 'static',
  site: process.env.SITE_URL || 'https://tu-sitio.netlify.app',
  build: { format: 'file' },
});
