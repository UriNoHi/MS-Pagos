import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
await connectDB();
app.listen(PORT, () => console.log(`🚀 Servicio en http://localhost:${PORT}`));