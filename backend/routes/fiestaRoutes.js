import express from 'express';
import { buscarFiesta, crearFiesta, unirseFiesta, cambiarCiudad, verFiestas, desapuntarse } from '../Controllers/fiestaController.js';
import { mostrarAmigos } from '../Controllers/usuarioController.js';

const router = express.Router();

router.post('/crear', crearFiesta);

router.post('/buscar', buscarFiesta);

router.post('/unirse', unirseFiesta);

router.post('/mostrar', mostrarAmigos);

router.post('/cambiarCiudad', cambiarCiudad);

router.post('/misFiestas', verFiestas);

router.post('/desapuntarse', desapuntarse);

export default router; 