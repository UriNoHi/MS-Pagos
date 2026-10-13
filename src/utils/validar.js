// Validación de los query params de GET /items según pagos.yaml.
// Devuelve { error } con un mensaje si algo es inválido,
// o { filtros, limit, offset } si está todo bien.

export const ESTADOS = ['pendiente', 'aprobado', 'rechazado', 'reembolsado'];
export const MEDIOS = ['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'billetera_virtual'];

const ENTERO = /^\d+$/;
const ORDEN_ID = /^ORD[0-9]+$/i;

// Escapa caracteres especiales para usar un texto dentro de una RegExp
const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Igualdad exacta sin distinguir mayúsculas (lo que pide el contrato)
const igualSinMayus = (valor) => new RegExp(`^${escapar(valor)}$`, 'i');

export function validarQuery(query) {
  const { ordenId, estado, medio, limit, offset } = query;

  // Un parámetro repetido (?estado=a&estado=b) llega como array: es inválido
  for (const [nombre, valor] of Object.entries({ ordenId, estado, medio, limit, offset })) {
    if (Array.isArray(valor)) return { error: `El parámetro ${nombre} no puede repetirse.` };
  }

  const filtros = {};

  if (ordenId !== undefined) {
    if (!ORDEN_ID.test(ordenId)) {
      return { error: 'El parámetro ordenId debe tener el formato ORD seguido de números (ej: ORD001).' };
    }
    filtros.ordenId = igualSinMayus(ordenId);
  }

  if (estado !== undefined) {
    if (!ESTADOS.includes(estado.toLowerCase())) {
      return { error: `El parámetro estado debe ser uno de: ${ESTADOS.join(', ')}.` };
    }
    filtros.estado = igualSinMayus(estado);
  }

  if (medio !== undefined) {
    if (!MEDIOS.includes(medio.toLowerCase())) {
      return { error: `El parámetro medio debe ser uno de: ${MEDIOS.join(', ')}.` };
    }
    filtros.medio = igualSinMayus(medio);
  }

  let lim = 20;
  if (limit !== undefined) {
    if (!ENTERO.test(limit) || Number(limit) < 1 || Number(limit) > 100) {
      return { error: 'El parámetro limit debe ser un entero entre 1 y 100.' };
    }
    lim = Number(limit);
  }

  let off = 0;
  if (offset !== undefined) {
    if (!ENTERO.test(offset)) {
      return { error: 'El parámetro offset debe ser un entero mayor o igual a 0.' };
    }
    off = Number(offset);
  }

  return { filtros, limit: lim, offset: off };
}
