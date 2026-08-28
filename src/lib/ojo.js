/**
 * Boton para mostrar u ocultar lo que se escribe en un campo de clave.
 *
 * Sirve para las tres pantallas que piden clave (panel de administracion, alta
 * de clientes y panel de edicion), asi que trae sus propios estilos y no
 * depende del CSS de cada pagina.
 */

const OJO_ABIERTO = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>`;

const OJO_TACHADO = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

const ESTILOS = `
.ojo-envoltura { position: relative; display: block; width: 100%; }
.ojo-envoltura > input { width: 100%; padding-right: 44px !important; }
.ojo-btn {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: currentColor;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.15s ease, background 0.15s ease;
}
/* Gris neutro: el panel de edicion es oscuro y el formulario de alta claro,
   y un blanco translucido seria invisible sobre fondo blanco. */
.ojo-btn:hover { opacity: 1; background: rgba(128, 128, 128, 0.18); }
.ojo-btn:focus-visible { opacity: 1; outline: 2px solid currentColor; outline-offset: -2px; }
`;

let estilosPuestos = false;

function ponerEstilos() {
  if (estilosPuestos) return;
  const hoja = document.createElement('style');
  hoja.textContent = ESTILOS;
  document.head.appendChild(hoja);
  estilosPuestos = true;
}

/**
 * Agrega el boton a un campo de clave.
 * Acepta el elemento o su id, y no hace nada si el campo no existe.
 */
export function activarOjo(campo) {
  const input = typeof campo === 'string' ? document.getElementById(campo) : campo;
  if (!input || input.dataset.conOjo) return;

  ponerEstilos();
  input.dataset.conOjo = '1';

  const envoltura = document.createElement('span');
  envoltura.className = 'ojo-envoltura';
  input.parentNode.insertBefore(envoltura, input);
  envoltura.appendChild(input);

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'ojo-btn';
  boton.innerHTML = OJO_ABIERTO;
  boton.setAttribute('aria-label', 'Mostrar la clave');
  boton.title = 'Mostrar la clave';
  boton.tabIndex = -1; // que el tabulador salte del campo al boton de enviar

  boton.addEventListener('click', () => {
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    boton.innerHTML = visible ? OJO_ABIERTO : OJO_TACHADO;
    const etiqueta = visible ? 'Mostrar la clave' : 'Ocultar la clave';
    boton.setAttribute('aria-label', etiqueta);
    boton.title = etiqueta;
    input.focus();
  });

  envoltura.appendChild(boton);
}

/** Aplica el boton a todos los campos de clave de la pagina. */
export function activarOjos(raiz = document) {
  for (const input of raiz.querySelectorAll('input[type="password"]')) activarOjo(input);
}
