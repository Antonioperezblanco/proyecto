import express from 'express';
import { buscarFiesta, crearFiesta } from '../Controllers/fiestaController.js';
const router = express.Router();

router.post('/crear', crearFiesta);
router.get('/buscar', buscarFiesta);

export default router; 