import { defineConfig } from 'astro/config';

// Dominio del sitio. Se usa para las etiquetas Open Graph, asi que un valor
// equivocado rompe las vistas previas de WhatsApp sin que el build falle.
// Netlify inyecta URL (dominio principal) y DEPLOY_PRIME_URL (el de cada
// deploy), de modo que si SITE_URL falta el sitio sigue apuntandose bien solo.
const site =
  process.env.SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  'http://localhost:4321';

export default defineConfig({
  // Sitio 100% estatico: las paginas se generan en el build leyendo la API.
  // Asi la pagina publica nunca depende de Render (que duerme en el plan free).
  output: 'static',
  site,
  build: { format: 'file' },
});
