/**
 * Plantillas por profesion.
 *
 * Cada una decide el tema visual y precarga los enlaces tipicos de ese oficio
 * con su texto ya escrito, para que el cliente solo pegue sus direcciones.
 * Los textos de ejemplo van como `ejemplo` y se muestran de marcador de
 * posicion: nunca se guardan si el cliente no escribe nada.
 */
export const PLANTILLAS = [
  {
    id: 'abogado',
    icono: 'M12 3 3 7v2h18V7l-9-4M5 11v7H3v2h18v-2h-2v-7h-2v7h-3v-7h-2v7H7v-7H5Z',
    nombre: 'Abogacía y notariado',
    descripcion: 'Abogados, notarios, bufetes',
    theme: 'marfil-oro',
    cargo: 'Abogado y Notario',
    ejemploTagline: 'Asesoría legal corporativa, contratos y trámites notariales.',
    pie: 'DERECHO · CONFIANZA · RESULTADOS',
    enlaces: [
      { type: 'whatsapp', label: 'WhatsApp', sublabel: 'Consultas' },
      { type: 'phone', label: 'Llamar al bufete' },
      { type: 'email', label: 'Correo' },
      { type: 'ubicacion', label: 'Ubicación', sublabel: 'Oficina' },
    ],
  },
  {
    id: 'salud',
    icono: 'M19 8h-2V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2M9 6h6v2H9V6m4 10h-2v2h-2v-2H7v-2h2v-2h2v2h2v2Z',
    nombre: 'Salud',
    descripcion: 'Médicos, odontólogos, psicólogos, nutricionistas',
    theme: 'navy-pro',
    cargo: 'Médico General',
    ejemploTagline: 'Consulta general y seguimiento. Atención con cita previa.',
    pie: 'SALUD · CONFIANZA',
    enlaces: [
      { type: 'whatsapp', label: 'Agendar cita' },
      { type: 'phone', label: 'Clínica' },
      { type: 'ubicacion', label: 'Cómo llegar' },
      { type: 'email', label: 'Correo' },
    ],
  },
  {
    id: 'ingenieria',
    icono: 'M12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7m7.4-2.5a7.6 7.6 0 0 0 0-2l2.1-1.6a.5.5 0 0 0 .1-.6l-2-3.4a.5.5 0 0 0-.6-.2l-2.5 1a7.3 7.3 0 0 0-1.7-1L14.5 2a.5.5 0 0 0-.5-.4h-4a.5.5 0 0 0-.5.4l-.4 2.6a7.3 7.3 0 0 0-1.7 1l-2.5-1a.5.5 0 0 0-.6.2l-2 3.4a.5.5 0 0 0 .1.6L4.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6a.5.5 0 0 0-.1.6l2 3.4c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .2.2.4.5.4h4c.3 0 .5-.2.5-.4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.4a.5.5 0 0 0-.1-.6L19.4 13Z',
    nombre: 'Ingeniería y tecnología',
    descripcion: 'Ingenieros, desarrolladores, arquitectos de sistemas',
    theme: 'oro-tech',
    cargo: 'Ingeniero en Sistemas',
    ejemploTagline: 'Desarrollo de software y soluciones a la medida.',
    pie: 'INGENIERÍA · INNOVACIÓN',
    enlaces: [
      { type: 'whatsapp', label: 'WhatsApp' },
      { type: 'linkedin', label: 'LinkedIn', sublabel: 'Perfil profesional' },
      { type: 'email', label: 'Correo' },
      { type: 'web', label: 'Portafolio' },
    ],
  },
  {
    id: 'belleza',
    icono: 'M9.6 6.6A3 3 0 1 0 6 9.4l2.6 2.6L6 14.6a3 3 0 1 0 3.6 2.8L12 15l6 6h3v-1L9.6 6.6M6 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2m6-7.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1M18 3l-6 6 2 2 7-7V3h-3Z',
    nombre: 'Belleza y estética',
    descripcion: 'Estilistas, barberías, spa, maquillaje, uñas',
    theme: 'rosa-glam',
    cargo: 'Estilista Profesional',
    ejemploTagline: 'Color, corte y tratamientos. Reserva tu espacio.',
    pie: 'BELLEZA · ESTILO',
    enlaces: [
      { type: 'whatsapp', label: 'Reservar cita' },
      { type: 'instagram', label: 'Instagram', sublabel: 'Mis trabajos' },
      { type: 'tiktok', label: 'TikTok' },
      { type: 'ubicacion', label: 'Ubicación' },
    ],
  },
  {
    id: 'comercio',
    icono: 'M7 4V2h10v2h3l1 5a3 3 0 0 1-3 3 3 3 0 0 1-2.5-1.3A3 3 0 0 1 13 12a3 3 0 0 1-1-.2V21h8v-8h2v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9h2v8h4v-9.2A3 3 0 0 1 7 12a3 3 0 0 1-2.5-1.3A3 3 0 0 1 2 12a3 3 0 0 1-3-3l1-5h7Z',
    nombre: 'Comercio y ventas',
    descripcion: 'Tiendas, distribuidores, representantes de venta',
    theme: 'oro-tech',
    cargo: 'Asesor de Ventas',
    ejemploTagline: 'Productos y precios al por mayor y menor. Envíos a todo el país.',
    pie: 'CALIDAD · SERVICIO',
    enlaces: [
      { type: 'whatsapp', label: 'Hacer pedido' },
      { type: 'catalogo', label: 'Ver catálogo' },
      { type: 'facebook', label: 'Facebook' },
      { type: 'ubicacion', label: 'Visítanos' },
    ],
  },
  {
    id: 'inmobiliaria',
    icono: 'M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z',
    nombre: 'Bienes raíces',
    descripcion: 'Agentes inmobiliarios, corredores de propiedades',
    theme: 'marfil-oro',
    cargo: 'Asesor Inmobiliario',
    ejemploTagline: 'Compra, venta y alquiler de propiedades. Asesoría completa.',
    pie: 'PROPIEDADES · ASESORÍA',
    enlaces: [
      { type: 'whatsapp', label: 'WhatsApp' },
      { type: 'catalogo', label: 'Propiedades disponibles' },
      { type: 'facebook', label: 'Facebook' },
      { type: 'email', label: 'Correo' },
    ],
  },
  {
    id: 'contable',
    icono: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 3v3h10V5H7m0 5v2h2v-2H7m4 0v2h2v-2h-2m4 0v2h2v-2h-2m-8 4v2h2v-2H7m4 0v2h2v-2h-2m4 0v4h2v-4h-2m-8 4v2h2v-2H7m4 0v2h2v-2h-2Z',
    nombre: 'Contabilidad y finanzas',
    descripcion: 'Contadores, auditores, asesores fiscales',
    theme: 'navy-pro',
    cargo: 'Contador Público y Auditor',
    ejemploTagline: 'Contabilidad, impuestos y asesoría fiscal para tu negocio.',
    pie: 'FINANZAS · CUMPLIMIENTO',
    enlaces: [
      { type: 'whatsapp', label: 'WhatsApp' },
      { type: 'email', label: 'Correo' },
      { type: 'phone', label: 'Oficina' },
      { type: 'linkedin', label: 'LinkedIn' },
    ],
  },
  {
    id: 'creativo',
    icono: 'M12 15.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4M9 2 7.2 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.2L15 2H9m3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z',
    nombre: 'Fotografía y creativos',
    descripcion: 'Fotógrafos, diseñadores, productores de contenido',
    theme: 'rosa-glam',
    cargo: 'Fotógrafo Profesional',
    ejemploTagline: 'Bodas, eventos y sesiones de estudio.',
    pie: 'IMAGEN · CREATIVIDAD',
    enlaces: [
      { type: 'whatsapp', label: 'Cotizar' },
      { type: 'instagram', label: 'Instagram', sublabel: 'Portafolio' },
      { type: 'web', label: 'Sitio web' },
      { type: 'email', label: 'Correo' },
    ],
  },
];

export const porId = (id) => PLANTILLAS.find((p) => p.id === id) || null;

/** Icono de la plantilla, listo para insertar. */
export const iconoPlantilla = (p) =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="${p.icono}"/></svg>`;
