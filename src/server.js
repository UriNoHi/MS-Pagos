import 'dotenv/config';
import express from 'express';
import { connectDB, dbConectada } from './config/db.js';
import pagosRoutes from './routes/pagos.routes.js';

const app = express();
app.use(express.json());

// Permite que otros servicios / el front consulten desde el navegador
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// GET /health
app.get('/health', (req, res) => {
  if (!dbConectada()) {
    return res.status(503).json({ status: 'error', message: 'Sin conexión a la base de datos.' });
  }
  res.json({
    status: 'ok',
    service: process.env.SERVICE_NAME || 'ms-pagos',
    collection: 'pagos',
    version: '1.0.0',
  });
});

// GET /items y GET /items/:id
app.use('/items', pagosRoutes);

// Cualquier otra ruta: 404 con el formato de error del contrato
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: `No existe la ruta ${req.method} ${req.path}.` });
});

// Errores inesperados (Express 5 captura los errores de funciones async)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error', message: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 3000;
await connectDB();
app.listen(PORT, () => console.log(`🚀 MS Pagos en http://localhost:${PORT}`));
