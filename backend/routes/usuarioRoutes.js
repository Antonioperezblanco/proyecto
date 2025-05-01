import express from 'express';
import { crearUsuario, inicioSesion, editarUsuario } from '../Controllers/usuarioController.js';
const router = express.Router();

router.post('/crear', crearUsuario);
    
router.post ('/inicioSesion', inicioSesion);

router.put ('/editarUsuario', editarUsuario);
    
export default router;
 