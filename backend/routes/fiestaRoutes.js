import express from 'express';
import { buscarFiesta, crearFiesta, unirseFiesta } from '../Controllers/fiestaController.js';

const router = express.Router();

router.post('/crear', crearFiesta);

router.post('/buscar', buscarFiesta);

router.post('/unirse', unirseFiesta);

export default router; 