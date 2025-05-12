import express from 'express';
import { crearUsuario, inicioSesion, editarUsuario, anadirAmigo, aceptarSolicitud, rechazarSolicitud, eliminarAmigo } from '../Controllers/usuarioController.js';
const router = express.Router();

router.post('/crear', crearUsuario);
    
router.post ('/inicioSesion', inicioSesion);

router.put ('/editarUsuario', editarUsuario);

router.post ('/anadir', anadirAmigo)

router.post ('/aceptar', aceptarSolicitud);

router.post ('/rechazar', rechazarSolicitud);

router.post('/eliminar', eliminarAmigo);

export default router;