import { Router } from 'express';
import { listar, obtener } from '../controllers/pagos.controller.js';

const router = Router();

router.get('/', listar);    // GET /items
router.get('/:id', obtener); // GET /items/:id

export default router;
