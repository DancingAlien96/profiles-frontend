# profiles-frontend

Sitio de las tarjetas de presentación digitales. Astro, 100% estático,
desplegado en Netlify.

API: [profiles-backend](https://github.com/DancingAlien96/profiles-backend)

## Cómo funciona

```
El cliente abre su página  ──►  este sitio, HTML estático   (instantáneo)
                                        │
Pulsa el botón de editar   ──►  la API en el VPS + SQLite   (solo el dueño)
                                        │
              Al guardar   ──►  build hook de Netlify
                                        │
                                Netlify regenera estas páginas leyendo la API
```

Las páginas se generan **en el build**, no en cada visita. La razón principal
son las vistas previas: los crawlers de WhatsApp y LinkedIn no ejecutan
JavaScript, así que si la tarjeta se armara en el navegador el enlace se
compartiría sin nombre ni foto. Como efecto secundario, el sitio carga al
instante y el VPS no recibe tráfico de visitantes, solo de ediciones.

**El precio a pagar:** los cambios tardan entre 2 y 3 minutos en publicarse,
que es lo que tarda el build. El panel se lo advierte al cliente al guardar.

## Qué genera

| Ruta | Contenido |
|---|---|
| `/<slug>` | La tarjeta del cliente |
| `/crear?i=<token>` | Alta guiada, para el enlace de invitación |
| `/admin` | Panel del dueño: genera invitaciones y gestiona perfiles |
| `/fotos/<slug>.webp` | Su foto, bajada de la API durante el build |
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

`netlify.toml` ya trae la configuración (publica `dist`). En el panel solo hace
falta definir `PUBLIC_API_URL` con la URL de la API:
`https://backtarjetas.ecodama.online`

`SITE_URL` es opcional: si no la defines se usa la variable `URL` que Netlify
inyecta sola, que es lo correcto mientras uses el dominio `.netlify.app`.
Defínela cuando conectes un dominio propio.

Después crea un **build hook** en *Site settings → Build & deploy → Build
hooks* y pega su URL en la variable `NETLIFY_BUILD_HOOK` del `.env` de la API
en el VPS.
Ese enlace es lo que hace que guardar en el panel republique el sitio.

Por último, agrega el dominio de Netlify a `CORS_ORIGINS` en el `.env` de la
API y reinicia el servicio. Si falta, el panel del cliente falla por CORS.

## Alta de clientes

`/crear` es el formulario que abre el cliente desde el enlace de invitación que
tú le mandas. Le pregunta a qué se dedica y, según la plantilla, elige el tema
visual y precarga los botones típicos de ese oficio con su texto ya escrito: él
solo pega sus direcciones. También elige su propia clave, así que no circulan
claves adivinables por WhatsApp.

Sin un token válido en `?i=`, la página no muestra el formulario.

Las plantillas están en `src/lib/plantillas.js`. Agregar una es añadir un
objeto con su tema, cargo sugerido, texto de ejemplo y lista de enlaces.

## Panel del dueño

`/admin` genera los enlaces de invitación y lista invitaciones y perfiles, con
botones para ocultar o publicar una tarjeta y restablecer la clave de un
cliente que la olvidó.

Es una página pública del sitio, pero sin la clave de administrador no hace
nada: cada petición la lleva en una cabecera y la API la exige. La clave se
guarda en `sessionStorage`, así que se olvida al cerrar la pestaña, y la página
lleva `noindex`.

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
