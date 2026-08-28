# profiles-frontend

Sitio de las tarjetas de presentación digitales. Astro renderizando en el
servidor, sobre Node, en el mismo VPS que la API.

En producción vive en **https://www.professionalprofiles.online**

API: [profiles-backend](https://github.com/DancingAlien96/profiles-backend)

## Cómo funciona

```
El cliente abre su tarjeta  ──►  Nginx ──► Astro (Node) ──► API ──► SQLite
                                   │
Pulsa el botón de editar    ──►  Nginx ──► /api ──────────► API ──► SQLite
                                   │
              Al guardar    ──►  el cambio se ve al instante, sin publicar nada
```

Las tarjetas se generan **al pedirlas**, no antes. Antes el sitio era estático
y cada edición obligaba a reconstruirlo entero en Netlify; cada uno de esos
deploys cuesta 15 de los 300 créditos mensuales del plan gratuito, así que una
docena de clientes activos bastaba para agotarlos y que Netlify pausara el
sitio entero.

Ahora un cambio tarda **un segundo** en verse, no tres minutos, y publicar no
cuesta nada.

Sigue habiendo HTML completo en la respuesta, que es lo que necesitan los
crawlers de WhatsApp y LinkedIn para mostrar nombre, cargo y foto al compartir
un enlace.

**Lo que se pierde:** el sitio ya no vive en un CDN. Si el VPS se cae, se caen
las tarjetas. Nginx cachea las respuestas para amortiguarlo, pero el punto
único de fallo existe.

## Qué sirve

| Ruta | Contenido |
|---|---|
| `/<slug>` | La tarjeta del cliente |
| `/crear?i=<token>` | Alta guiada, para el enlace de invitación |
| `/admin` | Panel del dueño: genera invitaciones y gestiona perfiles |
| `/fotos/<slug>.webp` | Su foto, servida desde la base y cacheada en disco |
| `/og/<slug>.jpg` | Imagen de vista previa 1200×630 para WhatsApp |

Las tres primeras se generan al pedirlas; `/admin`, `/crear`, la portada y el
404 se prerenderizan en el build porque no dependen de ningún perfil.

La imagen de vista previa se genera en JPEG a propósito: los crawlers de
WhatsApp y Facebook manejan mal el WebP y el enlace se compartiría sin imagen.

Una dirección que no existe devuelve 404 de verdad, no una página en blanco.

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run dev
```

Necesitas la API corriendo. `API_INTERNA` apunta a ella desde el servidor.

**Ojo con `PUBLIC_API_URL`:** se incrusta en el momento del build, no al
arrancar. En producción va vacía (Nginx sirve la API bajo el mismo dominio en
`/api`, así que el navegador usa rutas relativas y no hay CORS). En local, sin
Nginx delante, hay que construir con la dirección puesta:

```bash
PUBLIC_API_URL=http://127.0.0.1:5000 npm run build
```

## Despliegue en el VPS

En `deploy/` están la unidad de systemd y la configuración de Nginx.

```bash
git clone https://github.com/DancingAlien96/profiles-frontend.git /var/www/perfiles-web
cd /var/www/perfiles-web
npm ci
cp .env.example .env && nano .env
npm run build

sudo mkdir -p /var/lib/perfiles-web/cache
sudo chown deploy:deploy /var/lib/perfiles-web/cache

sudo cp deploy/perfiles-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now perfiles-web

sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/perfiles-web
sudo ln -s /etc/nginx/sites-available/perfiles-web /etc/nginx/sites-enabled/
sudo mkdir -p /var/cache/nginx/perfiles
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d professionalprofiles.online -d www.professionalprofiles.online
```

Para actualizar tras un cambio de código:

```bash
cd /var/www/perfiles-web && git pull && npm ci && npm run build && sudo systemctl restart perfiles-web
```

Los logs salen en `journalctl -u perfiles-web -f`.

### Rendimiento

Las imágenes generadas se cachean en disco por versión de la foto: la vista
previa de WhatsApp cuesta ~190 ms la primera vez y ~6 ms las siguientes. Nginx
cachea además las tarjetas 60 segundos, así que una racha de visitas al mismo
perfil no llega a tocar Node.

## Alta de clientes

`/crear` es el formulario que abre el cliente desde el enlace de invitación que
tú le mandas. Le pregunta a qué se dedica y, según la plantilla, elige el tema
visual y precarga los botones típicos de ese oficio con su texto ya escrito: él
solo pega sus direcciones. También elige su propia clave, así que no circulan
claves adivinables por WhatsApp.

Sin un token válido en `?i=`, la página no muestra el formulario.

**Direcciones.** La dirección de la página se propone desde el nombre y se
comprueba contra la API mientras el cliente escribe. Si dos clientes se llaman
igual, la segunda se corrige sola a `nombre-2`; si la escribió él a mano y
choca, se le ofrece la variante libre con un botón.

Cuando la invitación trae la dirección fijada (porque el QR o la tarjeta NFC ya
están impresos), el campo aparece bloqueado y el servidor ignora cualquier otra
que llegue en la petición.

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

## Horario de atención

Si el perfil tiene horario, la tarjeta muestra un desplegable con un punto
verde o rojo según esté abierto en ese momento, y resalta el día de hoy.

El estado se calcula **en el navegador** (`src/lib/horarios.js`), no en el
servidor: así sigue siendo correcto aunque Nginx sirva la página cacheada un
minuto después. Se usa la zona horaria del negocio, no la de quien mira.

El mismo módulo trae el editor de siete días que usan el formulario de alta y
el panel de edición, con opción de segundo turno para los que cierran a
mediodía.

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
├── middleware.js                 Asegura el charset en las respuestas HTML
└── pages/
    ├── [slug].astro              La tarjeta, generada al pedirla
    ├── fotos/[slug].webp.js      Foto del perfil, cacheada
    └── og/[slug].jpg.js          Vista previa de WhatsApp, cacheada
```

`src/lib/cache.js` guarda en disco las imágenes ya generadas, con la fecha de
la foto en la clave: al cambiarla se crea una entrada nueva y la anterior deja
de usarse sola.
