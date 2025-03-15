import express from 'express';
import { crearUsuario } from '../Controllers/crearUsuarioController.js';
import { inicioSesion } from '../Controllers/inicioSesionController.js';
import { editarUsuario } from '../Controllers/busquedaController.js';
const router = express.Router();

router.post('/crear', crearUsuario);
    
router.post ('/inicioSesion', inicioSesion);

router.post ('/editarUsuario', editarUsuario);
    
export default router;
 