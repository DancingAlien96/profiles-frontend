/** Temas disponibles. El cliente elige uno; no puede editar el CSS. */
export const TEMAS = [
  { id: 'oro-tech',   nombre: 'Oro Tech',   descripcion: 'Azul marino y oro · tecnologia, ingenieria' },
  { id: 'navy-pro',   nombre: 'Navy Pro',   descripcion: 'Blanco y azul · salud, consultoria, corporativo' },
  { id: 'marfil-oro', nombre: 'Marfil Oro', descripcion: 'Marfil y oro viejo · legal, notarial, formal' },
  { id: 'rosa-glam',  nombre: 'Rosa Glam',  descripcion: 'Negro y rosa · belleza, moda, contenido' },
];

export const TEMAS_ID = TEMAS.map((t) => t.id);
export const temaValido = (id) => (TEMAS_ID.includes(id) ? id : 'oro-tech');
