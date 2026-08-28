/**
 * Horario de atencion: presentacion y editor.
 *
 * Los datos vienen de la API con esta forma, la primera entrada es lunes:
 *   { tz: 'America/Guatemala', days: [{ closed: true } | { ranges: [['08:00','12:00'], ...] }] }
 */

export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const DIAS_CORTO = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const TZ_POR_DEFECTO = 'America/Guatemala';

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** 14:30 -> "2:30 pm". Aqui se usa el formato de 12 horas. */
export function formatearHora(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h < 12 ? 'am' : 'pm';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${sufijo}` : `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

/** "8 am - 12 pm y 2 pm - 6 pm", o "Cerrado". */
export function textoDelDia(dia) {
  if (!dia || dia.closed || !dia.ranges?.length) return 'Cerrado';
  return dia.ranges.map(([a, b]) => `${formatearHora(a)} - ${formatearHora(b)}`).join(' y ');
}

/**
 * Momento actual en la zona del negocio, no en la de quien mira la tarjeta:
 * si alguien la abre desde otro pais debe ver si esta abierto alli.
 * Devuelve { dia: 0-6 con lunes en 0, minutos: minutos desde medianoche }.
 */
export function ahoraEnZona(tz = TZ_POR_DEFECTO) {
  let partes;
  try {
    partes = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
  } catch {
    // Zona desconocida en este navegador: se usa la hora local.
    return ahoraEnZona(undefined);
  }

  const buscar = (tipo) => partes.find((p) => p.type === tipo)?.value;
  const semana = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

  let hora = Number(buscar('hour'));
  if (hora === 24) hora = 0; // en-US con hour12:false puede dar "24" a medianoche

  return {
    dia: semana[buscar('weekday')] ?? 0,
    minutos: hora * 60 + Number(buscar('minute')),
  };
}

/**
 * Estado actual del negocio.
 * Devuelve { abierto, texto } listo para pintar.
 */
export function estadoAhora(horario) {
  if (!horario?.days?.length) return null;

  const { dia, minutos } = ahoraEnZona(horario.tz);
  const hoy = horario.days[dia];

  if (hoy && !hoy.closed && hoy.ranges?.length) {
    for (const [abre, cierra] of hoy.ranges) {
      const inicio = aMinutos(abre);
      const fin = aMinutos(cierra);

      if (minutos >= inicio && minutos < fin) {
        const faltan = fin - minutos;
        return {
          abierto: true,
          texto: faltan <= 60 ? `Abierto · cierra a las ${formatearHora(cierra)}` : 'Abierto ahora',
        };
      }
      if (minutos < inicio) {
        return { abierto: false, texto: `Cerrado · abre a las ${formatearHora(abre)}` };
      }
    }
  }

  // Cerrado por hoy: buscar el proximo dia con atencion.
  for (let i = 1; i <= 7; i++) {
    const siguiente = horario.days[(dia + i) % 7];
    if (siguiente && !siguiente.closed && siguiente.ranges?.length) {
      const cuando = i === 1 ? 'mañana' : DIAS[(dia + i) % 7].toLowerCase();
      return { abierto: false, texto: `Cerrado · abre ${cuando} a las ${formatearHora(siguiente.ranges[0][0])}` };
    }
  }

  return { abierto: false, texto: 'Cerrado' };
}

/** Horario vacio para arrancar el editor: de lunes a viernes, 8 a 5. */
export function horarioPorDefecto() {
  return {
    tz: TZ_POR_DEFECTO,
    days: DIAS.map((_, i) =>
      i < 5 ? { ranges: [['08:00', '17:00']] } : { closed: true }
    ),
  };
}

/* --------------------------------------------------------------- editor */

const ESTILOS_EDITOR = `
.hor-dia {
  display: grid;
  grid-template-columns: 92px auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--hor-borde, rgba(128,128,128,0.18));
}
.hor-dia:last-child { border-bottom: none; }
.hor-nombre { font-size: 0.85rem; font-weight: 500; }
.hor-interruptor { display: inline-flex; align-items: center; gap: 6px; font-size: 0.78rem; cursor: pointer; opacity: 0.75; }
.hor-interruptor input { width: auto !important; margin: 0; }
.hor-turnos { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
.hor-turno { display: flex; align-items: center; gap: 5px; }
.hor-turno input[type="time"] { width: auto !important; min-width: 92px; padding: 6px 8px !important; font-size: 0.82rem !important; }
.hor-quitar-turno, .hor-mas-turno {
  background: none; border: none; padding: 2px 6px;
  font-size: 0.75rem; cursor: pointer; color: inherit; opacity: 0.6;
  text-decoration: underline;
}
.hor-quitar-turno:hover, .hor-mas-turno:hover { opacity: 1; }
.hor-cerrado { font-size: 0.82rem; opacity: 0.55; }
@media (max-width: 480px) {
  .hor-dia { grid-template-columns: 1fr auto; row-gap: 8px; }
  .hor-turnos { grid-column: 1 / -1; align-items: stretch; }
  .hor-turno { justify-content: space-between; }
  .hor-turno input[type="time"] { flex: 1; }
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
 * Dibuja el editor de horarios dentro de un contenedor.
 * Devuelve { leer() } para recoger lo que el usuario dejo puesto.
 */
export function montarEditorHorario(contenedor, horarioInicial) {
  ponerEstilos();
  contenedor.innerHTML = '';

  const horario = horarioInicial?.days?.length ? horarioInicial : horarioPorDefecto();
  const tz = horario.tz || TZ_POR_DEFECTO;

  DIAS.forEach((nombre, i) => {
    const dia = horario.days[i] || { closed: true };
    const abierto = !dia.closed && dia.ranges?.length;

    const fila = document.createElement('div');
    fila.className = 'hor-dia';
    fila.dataset.dia = String(i);

    const etiqueta = document.createElement('span');
    etiqueta.className = 'hor-nombre';
    etiqueta.textContent = nombre;

    const interruptor = document.createElement('label');
    interruptor.className = 'hor-interruptor';
    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.checked = Boolean(abierto);
    const textoInterruptor = document.createElement('span');
    textoInterruptor.textContent = abierto ? 'Abierto' : 'Cerrado';
    interruptor.append(casilla, textoInterruptor);

    const turnos = document.createElement('div');
    turnos.className = 'hor-turnos';

    const filaTurno = (desde = '08:00', hasta = '17:00') => {
      const t = document.createElement('div');
      t.className = 'hor-turno';
      const a = document.createElement('input');
      a.type = 'time';
      a.className = 'hor-abre';
      a.value = desde;
      const guion = document.createElement('span');
      guion.textContent = '–';
      const b = document.createElement('input');
      b.type = 'time';
      b.className = 'hor-cierra';
      b.value = hasta;
      t.append(a, guion, b);

      const quitar = document.createElement('button');
      quitar.type = 'button';
      quitar.className = 'hor-quitar-turno';
      quitar.textContent = 'quitar';
      quitar.addEventListener('click', () => {
        t.remove();
        pintar();
      });
      t.appendChild(quitar);
      return t;
    };

    const pintar = () => {
      const encendido = casilla.checked;
      textoInterruptor.textContent = encendido ? 'Abierto' : 'Cerrado';
      turnos.hidden = !encendido;

      // Solo se puede añadir un segundo turno, para cerrar a mediodia.
      turnos.querySelectorAll('.hor-mas-turno').forEach((b) => b.remove());
      const cuantos = turnos.querySelectorAll('.hor-turno').length;

      if (encendido && cuantos === 0) turnos.appendChild(filaTurno());
      if (encendido && cuantos < 2) {
        const mas = document.createElement('button');
        mas.type = 'button';
        mas.className = 'hor-mas-turno';
        mas.textContent = '+ segundo turno (cierre a mediodía)';
        mas.addEventListener('click', () => {
          turnos.appendChild(filaTurno('14:00', '18:00'));
          pintar();
        });
        turnos.appendChild(mas);
      }
      // Con un solo turno no tiene sentido ofrecer "quitar".
      const soloUno = turnos.querySelectorAll('.hor-turno').length === 1;
      turnos.querySelectorAll('.hor-quitar-turno').forEach((b) => { b.hidden = soloUno; });
    };

    if (abierto) for (const [a, b] of dia.ranges) turnos.appendChild(filaTurno(a, b));
    casilla.addEventListener('change', pintar);
    pintar();

    fila.append(etiqueta, interruptor, turnos);
    contenedor.appendChild(fila);
  });

  return {
    /** Devuelve el horario tal como quedo, o null si no hay ningun dia abierto. */
    leer() {
      const days = [];
      let alguno = false;

      for (let i = 0; i < 7; i++) {
        const fila = contenedor.querySelector(`.hor-dia[data-dia="${i}"]`);
        const encendido = fila?.querySelector('.hor-interruptor input')?.checked;

        if (!encendido) {
          days.push({ closed: true });
          continue;
        }

        const ranges = [...fila.querySelectorAll('.hor-turno')]
          .map((t) => [
            t.querySelector('.hor-abre').value,
            t.querySelector('.hor-cierra').value,
          ])
          .filter(([a, b]) => a && b);

        if (!ranges.length) {
          days.push({ closed: true });
          continue;
        }
        alguno = true;
        days.push({ ranges });
      }

      return alguno ? { tz, days } : null;
    },
  };
}
