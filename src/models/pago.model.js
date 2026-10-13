import mongoose from 'mongoose';

// Campos según el schema "Item" del pagos.yaml.
// El servicio es de solo lectura: el modelo se usa para consultar,
// los datos se cargan desde la semilla (pagos.json).
const pagoSchema = new mongoose.Schema(
  {
    id:      { type: String, required: true, unique: true }, // ej: PAG001
    ordenId: { type: String, required: true },               // ej: ORD001
    medio:   { type: String, required: true },
    monto:   { type: Number, required: true, min: 0 },
    estado:  { type: String, required: true },
    fecha:   { type: String, required: true },               // ISO 8601, ej: 2026-08-10T14:25:00Z
  },
  {
    collection: 'pagos', // nombre exacto de la colección en Atlas
    versionKey: false,
  }
);

export default mongoose.model('Pago', pagoSchema);
