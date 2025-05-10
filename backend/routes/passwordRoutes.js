import express from 'express';
import { solicitarRecuperacion, restablecerPass, mostrarFormulario  } from '../Controllers/passwordController.js';
const router = express.Router();

router.get('/restablecer/:token', mostrarFormulario);
router.get('/mostrarFormulario', mostrarFormulario)
router.post('/solicitar', solicitarRecuperacion);
router.post('/restablecer/:token', restablecerPass);

export default router;