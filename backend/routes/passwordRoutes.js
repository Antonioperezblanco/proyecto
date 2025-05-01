import express from 'express';
import { solicitarRecuperacion, restablecerPass } from '../Controllers/passwordController.js';
const router = express.Router();

router.post('/solicitar', solicitarRecuperacion);
router.post('/restablecer/:token', restablecerPass);

export default router;