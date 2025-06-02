import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { findByUsername, findByMail, findByUsernameOrMail, findById, saveUser, existeAmigo, deleteSolicitud, addAmigo, amigos } from '../database/usuariosDB.js';
import { createSolicitud, existeSolicitud, obtenerSolicitudesRecibidas } from '../database/solicitudDB.js';
import Discoteca from '../models/Discoteca.js';
import FiestaPrivada from '../models/FiestaPrivada.js';

export const crearUsuario = async (req, res) => {
    try {
        const { nombreUsuario, correo, pass, edad, ciudad, idFiestas, amigos } = req.body;

        const existeUsuario = await findByUsername(nombreUsuario)
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
        }

        const correoExiste = await findByMail(correo)
        if (correoExiste) {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
        }

        const salt = await bcrypt.genSalt(10);
        const passEncriptada = await bcrypt.hash(pass, salt);

        const nuevoUsuario = new Usuario({
            nombreUsuario,
            correo,
            pass: passEncriptada,
            edad,
            ciudad,
            idFiestas: idFiestas || [],
            amigos: amigos || []
        });

        await saveUser(nuevoUsuario);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ mensaje: 'Error creando usuario', error: error.message });
    }
}


export const inicioSesion = async (req, res) => {
    try {
        const { nombreUsuario, correo, pass } = req.body;

        if (!(nombreUsuario || correo)) {
            return res.status(400).json({ mensaje: 'Faltan campos necesarios' });
        }

        const usuario = await findByUsernameOrMail(nombreUsuario, correo);
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const coincidePass = await bcrypt.compare(pass, usuario.pass);
        if (!coincidePass) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        console.log("Autenticación exitosa, redirigiendo...");

        const usuarioData = {
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            correo: usuario.correo,
            edad: usuario.edad,
            ciudad: usuario.ciudad,
            pass: usuario.pass
        };
        const solicitudes = await obtenerSolicitudesRecibidas(usuario.nombreUsuario);
        const listaAmigos = await amigos(usuario.nombreUsuario)
        res.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso',
            usuario: usuarioData,
            solicitudesRecibidas: solicitudes,
            amigos: listaAmigos
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
};

export const editarUsuario = async (req, res) => {
    try {
        console.log(req.body)
        const { id, nombreUsuario, correo, edad, ciudad } = req.body;
        const usuario = await findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar si el nombre de usuario ya está en uso por otro usuario
        if (nombreUsuario && nombreUsuario !== usuario.nombreUsuario) {
            const usuarioExistente = await findByUsername(nombreUsuario)
            if (usuarioExistente && usuarioExistente.id !== id) {
                return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
            }
        }

        // Verificar si el correo ya está en uso por otro usuario
        if (correo && correo !== usuario.correo) {
            const correoExistente = await findByMail(correo);
            if (correoExistente && correoExistente.id !== id) {
                return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso' });
            }
        }

        // Actualizar los datos del usuario
        usuario.nombreUsuario = nombreUsuario;
        usuario.correo = correo;
        usuario.edad = edad;
        usuario.ciudad = ciudad;

        await saveUser(usuario)

        res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ mensaje: 'Error actualizando usuario', error: error.message });
    }
};

export const anadirAmigo = async (req, res) => {
    try {
        const { usuario, amigo } = req.body;

        if (usuario == amigo){
            return res.status(404).json({ mensaje: 'No puedes enviar una solicitud a ti mismo' });
        }

        const solicitud = await findByUsername(amigo);
        if (!solicitud) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        if (await existeSolicitud(usuario, amigo)) {
            return res.status(404).json({ mensaje: 'Ya tiene una solicitud pendiente' });
        }
        const datosUsuario = await findByUsername(usuario);
        const datosAmigo = findByUsername(amigo);
        const amistad = await existeAmigo(datosUsuario, datosAmigo.id)
        if (amistad){
            return res.status(404).json({ mensaje: 'Ya sois amigos' });
        }
        await createSolicitud(usuario, amigo);

        res.status(200).json({ mensaje: 'Solicitud enviada correctamente' });
    } catch (error) {
        console.error('Error al enviar la solicituud:', error);
        res.status(500).json({ mensaje: 'Error enviando la solicitud', error: error.message });
    }
};

export const aceptarSolicitud = async (req, res) => {
    try {
        const { usuario, receptor } = req.body;

        const emisor = await findByUsername(usuario);
        const destinatario = await findByUsername(receptor);

         if (!emisor || !destinatario) {
            return res.status(404).json({ mensaje: 'Usuarios no encontrados' });
        }

        await addAmigo(destinatario.id, emisor.id);
        await addAmigo(emisor.id, destinatario.id);

        await deleteSolicitud(usuario, receptor);

        res.status(200).json({ ok: true, mensaje: 'Solicitud aceptada' });
    } catch (error) {
        console.error('Error al aceptar solicitud:', error);
        res.status(500).json({ mensaje: 'Error interno', error: error.message });
    }
};

export const rechazarSolicitud = async (req, res) => {
    try {
        const { usuario, receptor } = req.body;

        const emisor = await findByUsername(usuario);
        const destinatario = await findByUsername(receptor);

         if (!emisor || !destinatario) {
            return res.status(404).json({ mensaje: 'Usuarios no encontrados' });
        }

        await deleteSolicitud(usuario, receptor);

        res.status(200).json({ ok: true, mensaje: 'Solicitud rechazada' });
    } catch (error) {
        console.error('Error al rechazar solicitud:', error);
        res.status(500).json({ mensaje: 'Error interno', error: error.message });
    }
};
export const eliminarAmigo = async (req, res) => {
    try {
        const { usuario, amigo } = req.body;

        const usuarioDB = await findByUsername(usuario.nombreUsuario);
        const amigoDB = await findByUsername(amigo); 

        if (!usuarioDB || !amigoDB) {
            return res.status(404).json({ mensaje: 'Usuario o amigo no encontrado' });
        }

        usuarioDB.amigos = usuarioDB.amigos || [];
        amigoDB.amigos = amigoDB.amigos || [];

        usuarioDB.amigos = usuarioDB.amigos.filter(id => id !== amigoDB.id);
        amigoDB.amigos = amigoDB.amigos.filter(id => id !== usuarioDB.id);

        await usuarioDB.save();
        await amigoDB.save();

        res.status(200).json({ mensaje: 'Amigo eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar amigo:', error);
        res.status(500).json({ mensaje: 'Error interno', error: error.message });
    }
};

export const mostrarAmigos = async (req, res) => {
    try {
        const { fecha, nombreUsuario } = req.body;

        const usuario = await findByUsername(nombreUsuario);

        if (!usuario){
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const fechaISO = `${fecha}T00:00:00.000Z`;
        const fechaInicio = new Date(fechaISO);
        const fechaFin = new Date(fechaISO);
        fechaFin.setUTCHours(23, 59, 59, 999);

        const amigosIds = usuario.amigos; 
        if (!amigosIds || amigosIds.length === 0){
            return res.status(200).json({ mensaje: "El usuario no tiene amigos registrados", amigosFiestas: [] });
        }

        console.log("Buscando fiestas para la fecha:", fecha);
        console.log("Usuario:", nombreUsuario);
        console.log("Amigos:", usuario.amigos);

        const amigos = await Usuario.find({ id: { $in: amigosIds } });

        const amigosFiestas = [];

        for (let amigo of amigos){
            const fiestaIds = amigo.idFiestas || [];

            if (fiestaIds.length === 0) continue;

            const discotecas = await Discoteca.find({
                id: { $in: fiestaIds },
                fecha: { $gte: fechaInicio, $lte: fechaFin }
            });

            const fiestasPrivadas = await FiestaPrivada.find({
                id: { $in: fiestaIds },
                fecha: { $gte: fechaInicio, $lte: fechaFin }
            });

            const fiestaAmigo = [...discotecas, ...fiestasPrivadas];

            console.log(`Fiestas del amigo ${amigo.nombreUsuario}:`, fiestaAmigo);

            if (fiestaAmigo.length > 0){
                amigosFiestas.push({
                    amigo: amigo.nombreUsuario,
                    fiestas: fiestaAmigo
                });
            }
        }

        return res.status(200).json({
            mensaje: "Fiestas de los amigos encontradas",
            amigosFiestas
        });

    } catch(error){
        console.log("Error al buscar fiestas de amigos: ", error);
        return res.status(500).json({ mensaje: "Error al buscar fiestas de amigos", error });
    }
}
