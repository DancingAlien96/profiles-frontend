/**
 * Servicios: lo que ofrece el cliente, en una cuadricula bajo su tarjeta.
 *
 * Los iconos van como SVG en linea y salen de un catalogo cerrado, para que
 * nadie pueda meter marcado suelto en su propia pagina.
 */

const P = (d) =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;

export const ICONOS_SERVICIO = {
  check:       { nombre: 'Marca',       d: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z' },
  consulta:    { nombre: 'Consulta',    d: 'M19 3H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h4l3 3 3-3h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-6 9h-2v2h-2v-2H7v-2h2V8h2v2h2v2Z' },
  corazon:     { nombre: 'Corazón',     d: 'M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z' },
  diente:      { nombre: 'Diente',      d: 'M7 2c-2 0-4 1.5-4 4.5 0 2 .6 3.4 1.2 5.5.5 1.8.8 4 1 6.5.1 1.5.6 3.5 2.3 3.5 1.5 0 1.8-1.6 2.1-3.5.3-1.7.5-3.5 2.4-3.5s2.1 1.8 2.4 3.5c.3 1.9.6 3.5 2.1 3.5 1.7 0 2.2-2 2.3-3.5.2-2.5.5-4.7 1-6.5C20.4 9.9 21 8.5 21 6.5 21 3.5 19 2 17 2c-1.8 0-3.2 1-5 1S8.8 2 7 2Z' },
  ojo:         { nombre: 'Vista',       d: 'M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5m0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10m0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' },
  pastilla:    { nombre: 'Medicina',    d: 'M7 4h10v2H7V4m-1 4h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2m7 4h-2v2H9v2h2v2h2v-2h2v-2h-2v-2Z' },
  documento:   { nombre: 'Documento',   d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m4 18H6V4h7v5h5v11M8 13h8v2H8v-2m0 4h8v2H8v-2Z' },
  tijeras:     { nombre: 'Corte',       d: 'M9.6 6.6A3 3 0 1 0 6 9.4l2.6 2.6L6 14.6a3 3 0 1 0 3.6 2.8L12 15l6 6h3v-1L9.6 6.6M6 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2M18 3l-6 6 2 2 7-7V3h-3Z' },
  brocha:      { nombre: 'Belleza',     d: 'M20.7 3.3a1 1 0 0 0-1.4 0l-9 9 2.4 2.4 9-9a1 1 0 0 0 0-1.4l-1-1M9 14c-1.7 0-3 1.3-3 3 0 1.3-1.2 2-2 2 .9 1.2 2.4 2 4 2 2.2 0 4-1.8 4-4 0-1.7-1.3-3-3-3Z' },
  casa:        { nombre: 'Propiedad',   d: 'M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z' },
  llave:       { nombre: 'Llave',       d: 'M12.6 11a6 6 0 1 0-1.6 1.6l.4-.4H14v-2h1.5l1-1H19l2-2-2-2h-6.4M7 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z' },
  herramienta: { nombre: 'Reparación',  d: 'M22 19.5 14.6 12a5.5 5.5 0 0 0-7.2-7.2l3.3 3.3-2.6 2.6-3.3-3.3A5.5 5.5 0 0 0 12 14.6l7.5 7.4 2.5-2.5Z' },
  camara:      { nombre: 'Foto',        d: 'M12 15.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4M9 2 7.2 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.2L15 2H9Z' },
  carrito:     { nombre: 'Venta',       d: 'M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4m10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4M1 2v2h2l3.6 7.6-1.4 2.5c-.4.7.1 1.9 1.1 1.9h12v-2H7l1.1-2h7.5c.7 0 1.3-.4 1.6-1l3.6-6.5L19 4H6.2L5.3 2H1Z' },
  calculadora: { nombre: 'Contabilidad', d: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 3v3h10V5H7m0 5v2h2v-2H7m4 0v2h2v-2h-2m4 0v2h2v-2h-2m-8 4v2h2v-2H7m4 0v2h2v-2h-2m4 0v4h2v-4h-2m-8 4v2h2v-2H7m4 0v2h2v-2h-2Z' },
  balanza:     { nombre: 'Legal',       d: 'M12 2c-.6 0-1 .4-1 1v1H6a1 1 0 0 0 0 2h.6l-3.5 7c0 2 1.8 3 4 3s4-1 4-3l-3.5-7H11v13H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-4V6h3.4l-3.5 7c0 2 1.8 3 4 3s4-1 4-3l-3.5-7h.6a1 1 0 0 0 0-2h-5V3c0-.6-.4-1-1-1Z' },
  estrella:    { nombre: 'Destacado',   d: 'm12 17.3-6.2 3.7 1.6-7L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.8 1.6 7L12 17.3Z' },
  reloj:       { nombre: 'A domicilio', d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3Z' },
};

export const iconoServicio = (id) => P((ICONOS_SERVICIO[id] || ICONOS_SERVICIO.check).d);

export const LISTA_ICONOS = Object.entries(ICONOS_SERVICIO).map(([id, v]) => ({ id, nombre: v.nombre }));

export const MAX_SERVICIOS = 8;

/* --------------------------------------------------------------- editor */

const ESTILOS_EDITOR = `
.srv-fila {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  margin-bottom: 8px;
  border-radius: 11px;
  background: var(--srv-fondo, rgba(128,128,128,0.06));
  border: 1px solid var(--srv-borde, rgba(128,128,128,0.18));
}
.srv-icono {
  width: auto !important;
  min-width: 116px;
  padding: 7px 8px !important;
  font-size: 0.8rem !important;
}
.srv-texto { min-width: 0; }
.srv-quitar {
  background: none; border: none; padding: 2px 6px;
  color: var(--srv-peligro, #b3261e);
  font-size: 1.2rem; line-height: 1; cursor: pointer; border-radius: 6px;
}
.srv-quitar:hover { background: rgba(179, 38, 30, 0.09); }
@media (max-width: 480px) {
  .srv-fila { grid-template-columns: 1fr auto; }
  .srv-icono { grid-column: 1; min-width: 0; }
  .srv-quitar { grid-column: 2; }
  .srv-texto { grid-column: 1 / -1; }
}
`;

let estilosPuestos = false;

function ponerEstilos() {
  if (estilosPuestos) return;
  const hoja = document.createElement('style');
  hoja.textContent = ESTILOS_EDITOR;
  document.head.appendChild(hoja);
  estilosPuestos = true;
}

/**
 * Editor de servicios dentro de un contenedor.
 * Devuelve { leer, agregar, cargar }.
 */
export function montarEditorServicios(contenedor) {
  ponerEstilos();

  const fila = (datos = { label: '', icon: 'check' }) => {
    const f = document.createElement('div');
    f.className = 'srv-fila';

    const select = document.createElement('select');
    select.className = 'srv-icono';
    for (const { id, nombre } of LISTA_ICONOS) {
      const op = document.createElement('option');
      op.value = id;
      op.textContent = nombre;
      select.appendChild(op);
    }
    select.value = datos.icon || 'check';

    const texto = document.createElement('input');
    texto.type = 'text';
    texto.className = 'srv-texto';
    texto.maxLength = 40;
    texto.placeholder = 'Consulta general';
    texto.value = datos.label || '';

    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.className = 'srv-quitar';
    quitar.textContent = '×';
    quitar.setAttribute('aria-label', 'Quitar servicio');
    quitar.addEventListener('click', () => f.remove());

    f.append(select, texto, quitar);
    return f;
  };

  return {
    cargar(servicios) {
      contenedor.innerHTML = '';
      for (const s of servicios || []) contenedor.appendChild(fila(s));
    },
    agregar(datos) {
      if (contenedor.children.length >= MAX_SERVICIOS) return false;
      contenedor.appendChild(fila(datos));
      return true;
    },
    leer() {
      return [...contenedor.querySelectorAll('.srv-fila')]
        .map((f) => ({
          icon: f.querySelector('.srv-icono').value,
          label: f.querySelector('.srv-texto').value.trim(),
        }))
        .filter((s) => s.label);
    },
  };
}
