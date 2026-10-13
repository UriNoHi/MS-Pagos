import Pago from '../models/pago.model.js';
import { validarQuery } from '../utils/validar.js';

// No devolvemos los campos internos de Mongo (_id)
const PROYECCION = '-_id';

// Ordena "PAG2" antes que "PAG10" (orden numérico dentro del texto)
const ORDEN_NUMERICO = { locale: 'en', numericOrdering: true };

// GET /items
export async function listar(req, res) {
  const v = validarQuery(req.query);
  if (v.error) {
    return res.status(400).json({ error: 'bad_request', message: v.error });
  }

  const { filtros, limit, offset } = v;

  const [items, total] = await Promise.all([
    Pago.find(filtros, PROYECCION)
      .collation(ORDEN_NUMERICO)
      .sort({ id: 1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    Pago.countDocuments(filtros),
  ]);

  res.json({ items, total, limit, offset });
}

// GET /items/:id
export async function obtener(req, res) {
  const { id } = req.params;
  const pago = await Pago.findOne({ id }, PROYECCION).lean();

  if (!pago) {
    return res.status(404).json({ error: 'not_found', message: `No existe ${id}.` });
  }
  res.json(pago);
}
