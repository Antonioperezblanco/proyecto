import express from 'express';
import { crearUsuario, inicioSesion, editarUsuario, anadirAmigo, aceptarSolicitud, rechazarSolicitud } from '../Controllers/usuarioController.js';
const router = express.Router();

router.post('/crear', crearUsuario);
    
router.post ('/inicioSesion', inicioSesion);

router.put ('/editarUsuario', editarUsuario);

router.post ('/anadir', anadirAmigo)

router.post ('/aceptar', aceptarSolicitud);

router.post ('/rechazar', rechazarSolicitud);
export default router;
 