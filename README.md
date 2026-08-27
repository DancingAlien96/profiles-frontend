# profiles-frontend

Sitio de las tarjetas de presentación digitales. Astro, 100% estático,
desplegado en Netlify.

API: [profiles-backend](https://github.com/DancingAlien96/profiles-backend)

## Cómo funciona

```
El cliente abre su página  ──►  este sitio, HTML estático   (instantáneo)
                                        │
Pulsa el botón de editar   ──►  la API en Render + MongoDB  (solo el dueño)
                                        │
              Al guardar   ──►  build hook de Netlify
                                        │
                                Netlify regenera estas páginas leyendo la API
```

Las páginas se generan **en el build**, no en cada visita. El plan gratuito de
Render duerme la API tras 15 minutos sin tráfico, así que una tarjeta que
hiciera fetch al cargar dejaría el enlace de WhatsApp en blanco casi un minuto.
Además, al estar el contenido en el HTML, las etiquetas Open Graph funcionan y
WhatsApp y LinkedIn muestran nombre, cargo y foto al compartir el enlace.

**El precio a pagar:** los cambios tardan entre 2 y 3 minutos en publicarse,
que es lo que tarda el build. El panel se lo advierte al cliente al guardar.

## Qué genera

| Ruta | Contenido |
|---|---|
| `/<slug>` | La tarjeta del cliente |
| `/fotos/<slug>.webp` | Su foto, bajada de MongoDB durante el build |
| `/og/<slug>.jpg` | Imagen de vista previa 1200×630 para WhatsApp |

La imagen de vista previa se genera en JPEG a propósito: los crawlers de
WhatsApp y Facebook manejan mal el WebP y el enlace se compartiría sin imagen.

Si la API no responde durante el build, el build **falla a propósito** en vez
de publicar un sitio vacío, y Netlify conserva el despliegue anterior.

## Desarrollo local

```bash
npm install
cp .env.example .env   # PUBLIC_API_URL y SITE_URL
npm run dev
```

Sin `PUBLIC_API_URL`, apunta a `http://localhost:3000`. Necesitas la API
corriendo para que haya perfiles que generar.

## Netlify

`netlify.toml` ya trae la configuración (publica `dist`). Carga las variables
de `.env.example` en el panel.

Después crea un **build hook** en *Site settings → Build & deploy → Build
hooks* y pega su URL en la variable `NETLIFY_BUILD_HOOK` de la API en Render.
Ese enlace es lo que hace que guardar en el panel republique el sitio.

Por último, agrega el dominio de Netlify a `CORS_ORIGINS` en Render.

## Temas

| Tema | Para |
|---|---|
| `oro-tech` | Azul marino y oro · tecnología, ingeniería |
| `navy-pro` | Blanco y azul · salud, consultoría, corporativo |
| `marfil-oro` | Marfil y oro viejo · legal, notarial, formal |
| `rosa-glam` | Negro y rosa · belleza, moda, contenido |

El cliente elige entre ellos desde el panel, con vista previa en vivo, pero no
puede editar el CSS: así ningún perfil termina ilegible.

Cada tema define sus variables bajo `:root[data-tema="<id>"]`, de modo que los
cuatro conviven en la página y el selector puede cambiarlos sin recargar.

Para agregar uno:

1. Copia un archivo de `src/themes/` y ajusta las variables.
2. Impórtalo en `src/layouts/Perfil.astro`.
3. Regístralo en `src/lib/temas.js`.
4. Añade su paleta en `src/pages/og/[slug].jpg.js`, para la imagen de WhatsApp.

## Estructura

```
src/
├── layouts/Perfil.astro          La tarjeta
├── components/PanelEdicion.astro Botón de editar y panel del cliente
├── themes/                       base.css + un archivo por tema
├── lib/                          Cliente de la API, catálogo de temas e iconos
└── pages/
    ├── [slug].astro              Una página por perfil
    ├── fotos/[slug].webp.js      Fotos como archivos estáticos
    └── og/[slug].jpg.js          Imágenes de vista previa
```
