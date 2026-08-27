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
